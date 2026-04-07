'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * ASCII Image renderer inspired by ascii-magic.com and alexharri.com/blog/ascii-rendering
 * Uses 6D shape vectors for character matching — samples 6 regions per cell
 * (top-left, top-right, mid-left, mid-right, bot-left, bot-right)
 * and picks the character whose shape best matches the sampled brightness pattern.
 * Also applies contrast enhancement for sharper edges.
 */

// Characters sorted roughly by density
const FULL_CHARSET = ' .`\'^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

interface CharShapeEntry {
  char: string;
  vector: number[]; // 6D normalized shape vector
}

interface AsciiImageProps {
  src: string;
  alt?: string;
  cellWidth?: number;
  cellHeight?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  contrastExponent?: number;
  colorMode?: 'mono' | 'tinted' | 'full';
  bgBlur?: number;
  bgOpacity?: number;
}

// Precompute character shape vectors by rendering each char to an offscreen canvas
// and sampling 6 regions (2 cols × 3 rows, staggered)
function buildCharShapeTable(
  font: string,
  cellW: number,
  cellH: number,
  charset: string
): CharShapeEntry[] {
  const canvas = document.createElement('canvas');
  canvas.width = cellW;
  canvas.height = cellH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Define 6 sampling circles (staggered 2×3 grid)
  // Each circle: [cx, cy, radius]
  const rX = cellW * 0.28;
  const rY = cellH * 0.18;
  const r = Math.min(rX, rY) * 1.1;
  const circles = [
    [cellW * 0.3, cellH * 0.18, r],  // top-left
    [cellW * 0.7, cellH * 0.22, r],  // top-right (staggered down)
    [cellW * 0.3, cellH * 0.48, r],  // mid-left (staggered up)
    [cellW * 0.7, cellH * 0.52, r],  // mid-right (staggered down)
    [cellW * 0.3, cellH * 0.78, r],  // bot-left (staggered up)
    [cellW * 0.7, cellH * 0.82, r],  // bot-right (staggered down)
  ];

  const entries: CharShapeEntry[] = [];
  const maxComponents = new Float64Array(6);

  // First pass: compute raw vectors
  const rawVectors: number[][] = [];
  for (const char of charset) {
    ctx.clearRect(0, 0, cellW, cellH);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cellW, cellH);
    ctx.fillStyle = '#fff';
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(char, cellW / 2, cellH / 2);

    const imgData = ctx.getImageData(0, 0, cellW, cellH).data;
    const vector: number[] = [];

    for (const [cx, cy, cr] of circles) {
      let sum = 0;
      let count = 0;
      const r2 = cr * cr;
      const minX = Math.max(0, Math.floor(cx - cr));
      const maxX = Math.min(cellW - 1, Math.ceil(cx + cr));
      const minY = Math.max(0, Math.floor(cy - cr));
      const maxY = Math.min(cellH - 1, Math.ceil(cy + cr));

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy <= r2) {
            const idx = (y * cellW + x) * 4;
            sum += imgData[idx] / 255;
            count++;
          }
        }
      }
      vector.push(count > 0 ? sum / count : 0);
    }
    rawVectors.push(vector);
  }

  // Find max per component for normalization
  for (const vec of rawVectors) {
    for (let i = 0; i < 6; i++) {
      if (vec[i] > maxComponents[i]) maxComponents[i] = vec[i];
    }
  }

  // Normalize
  for (let ci = 0; ci < charset.length; ci++) {
    const normalized = rawVectors[ci].map((v, i) =>
      maxComponents[i] > 0 ? v / maxComponents[i] : 0
    );
    entries.push({ char: charset[ci], vector: normalized });
  }

  return entries;
}

// Find nearest character by Euclidean distance in 6D space
function findBestChar(
  samplingVector: number[],
  table: CharShapeEntry[],
  contrastExp: number
): string {
  // Apply global contrast enhancement (normalize to 0-1 range, apply exponent, denormalize)
  const maxVal = Math.max(...samplingVector, 0.001);
  const enhanced = samplingVector.map(v => {
    const norm = v / maxVal;
    return Math.pow(norm, contrastExp) * maxVal;
  });

  let bestChar = ' ';
  let bestDist = Infinity;
  for (const entry of table) {
    let dist = 0;
    for (let i = 0; i < 6; i++) {
      const d = enhanced[i] - entry.vector[i];
      dist += d * d;
    }
    if (dist < bestDist) {
      bestDist = dist;
      bestChar = entry.char;
    }
  }
  return bestChar;
}

export function AsciiImage({
  src,
  alt = '',
  cellWidth = 6,
  cellHeight = 10,
  color = '#f59e0b',
  bgColor = '#0a0a0b',
  className = '',
  contrastExponent = 1.8,
  colorMode = 'tinted',
  bgBlur = 0,
  bgOpacity = 0,
}: AsciiImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const tableRef = useRef<CharShapeEntry[] | null>(null);
  const rafRef = useRef<number>(0);
  const loadedRef = useRef(false);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !loadedRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Build shape table if not cached
    if (!tableRef.current) {
      const fontSize = Math.max(cellHeight - 1, 6);
      tableRef.current = buildCharShapeTable(
        `${fontSize}px "JetBrains Mono", "Courier New", monospace`,
        cellWidth,
        cellHeight,
        FULL_CHARSET
      );
    }
    const table = tableRef.current;

    // Draw source image to offscreen canvas (cover-fit)
    const offscreen = document.createElement('canvas');
    offscreen.width = w;
    offscreen.height = h;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true })!;

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;
    if (imgAspect > canvasAspect) {
      drawH = h; drawW = h * imgAspect;
      drawX = (w - drawW) / 2; drawY = 0;
    } else {
      drawW = w; drawH = w / imgAspect;
      drawX = 0; drawY = (h - drawH) / 2;
    }
    offCtx.drawImage(img, drawX, drawY, drawW, drawH);
    const pixels = offCtx.getImageData(0, 0, w, h).data;

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Optional: draw blurred background image behind ASCII
    if (bgBlur > 0 && bgOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = bgOpacity;
      ctx.filter = `blur(${bgBlur}px)`;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    // Sampling circles relative positions (same as shape table)
    const rX = cellWidth * 0.28;
    const rY = cellHeight * 0.18;
    const r = Math.min(rX, rY) * 1.1;
    const circleOffsets = [
      [cellWidth * 0.3, cellHeight * 0.18, r],
      [cellWidth * 0.7, cellHeight * 0.22, r],
      [cellWidth * 0.3, cellHeight * 0.48, r],
      [cellWidth * 0.7, cellHeight * 0.52, r],
      [cellWidth * 0.3, cellHeight * 0.78, r],
      [cellWidth * 0.7, cellHeight * 0.82, r],
    ];

    const cols = Math.ceil(w / cellWidth);
    const rows = Math.ceil(h / cellHeight);
    const fontSize = Math.max(cellHeight - 1, 6);
    ctx.font = `${fontSize}px "JetBrains Mono", "Courier New", monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = col * cellWidth;
        const cellY = row * cellHeight;

        // Sample 6 regions
        const samplingVector: number[] = [];
        let totalBrightness = 0;
        let avgR = 0, avgG = 0, avgB = 0, colorSamples = 0;

        for (const [offX, offY, cr] of circleOffsets) {
          const cx = cellX + offX;
          const cy = cellY + offY;
          let sum = 0;
          let count = 0;
          const r2 = cr * cr;

          // Sample a few points in each circle (5-point cross pattern for perf)
          const samplePoints = [
            [cx, cy],
            [cx - cr * 0.5, cy],
            [cx + cr * 0.5, cy],
            [cx, cy - cr * 0.5],
            [cx, cy + cr * 0.5],
          ];

          for (const [sx, sy] of samplePoints) {
            const px = Math.min(Math.max(Math.floor(sx), 0), w - 1);
            const py = Math.min(Math.max(Math.floor(sy), 0), h - 1);
            const idx = (py * w + px) * 4;
            const lum = (0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2]) / 255;
            sum += lum;
            count++;
            avgR += pixels[idx];
            avgG += pixels[idx + 1];
            avgB += pixels[idx + 2];
            colorSamples++;
          }
          const avg = count > 0 ? sum / count : 0;
          samplingVector.push(avg);
          totalBrightness += avg;
        }

        totalBrightness /= 6;

        // Skip very dark cells
        if (totalBrightness < 0.02) continue;

        const char = findBestChar(samplingVector, table, contrastExponent);
        if (char === ' ') continue;

        // Color the character
        if (colorMode === 'full') {
          avgR = Math.round(avgR / colorSamples);
          avgG = Math.round(avgG / colorSamples);
          avgB = Math.round(avgB / colorSamples);
          ctx.fillStyle = `rgb(${avgR},${avgG},${avgB})`;
        } else if (colorMode === 'tinted') {
          ctx.fillStyle = color;
        } else {
          ctx.fillStyle = color;
        }

        ctx.globalAlpha = Math.min(1, 0.2 + totalBrightness * 0.8);
        ctx.fillText(char, cellX + cellWidth / 2, cellY + cellHeight / 2);
      }
    }
    ctx.globalAlpha = 1;
  }, [cellWidth, cellHeight, color, bgColor, contrastExponent, colorMode, bgBlur, bgOpacity]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      loadedRef.current = true;
      render();
    };

    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [src, render]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
      role="img"
      aria-label={alt}
    />
  );
}
