'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AsciiTextDisplayProps {
  text: string;
  fontSize?: number;
  cellW?: number;
  cellH?: number;
  charset?: string;
  color?: string;
  mouseRadius?: number;
  mouseForce?: number;
  glitchRate?: number;
  className?: string;
}

const DEFAULT_CHARSET = ' .,:;i1tfLCG08@#';
const GLITCH_CHARS = '!?#%&*+-=~^<>[]{}|\\/@$';

export function AsciiTextDisplay({
  text,
  fontSize = 140,
  cellW = 9,
  cellH = 15,
  charset = DEFAULT_CHARSET,
  color = '#f59e0b',
  mouseRadius = 120,
  mouseForce = 18,
  glitchRate = 0.003,
  className,
}: AsciiTextDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── 1. Sample text shape into brightness grid ──────────────────────────
    const offscreen = document.createElement('canvas');
    const octx = offscreen.getContext('2d');
    if (!octx) return;

    const font = `bold ${fontSize}px "Geist", system-ui, sans-serif`;
    octx.font = font;
    const measured = octx.measureText(text);
    const textW = Math.ceil(measured.width) + fontSize;
    const textH = Math.ceil(fontSize * 1.5);

    offscreen.width = textW;
    offscreen.height = textH;
    octx.font = font;
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, textW, textH);
    octx.fillStyle = '#fff';
    octx.textBaseline = 'top';
    octx.fillText(text, fontSize * 0.25, fontSize * 0.08);

    const cols = Math.floor(textW / cellW);
    const rows = Math.floor(textH / cellH);

    // brightness[row][col] in [0,1]
    const brightness: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        const px = octx.getImageData(c * cellW, r * cellH, cellW, cellH).data;
        let sum = 0;
        for (let i = 0; i < px.length; i += 4) sum += px[i];
        row.push(sum / (px.length / 4) / 255);
      }
      brightness.push(row);
    }

    // ── 2. Resize canvas to fit ────────────────────────────────────────────
    const dpr = window.devicePixelRatio || 1;
    const displayW = cols * cellW;
    const displayH = rows * cellH;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;
    ctx.scale(dpr, dpr);

    // ── 3. Mouse tracking ─────────────────────────────────────────────────
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // ── 4. Per-cell ripple state ──────────────────────────────────────────
    type Cell = { vx: number; vy: number; ox: number; oy: number };
    const cells: Cell[][] = brightness.map(row =>
      row.map(() => ({ vx: 0, vy: 0, ox: 0, oy: 0 }))
    );

    let raf: number;

    // ── 5. Render loop ────────────────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, displayW, displayH);
      ctx.font = `${cellH * 0.82}px "Geist Mono", monospace`;
      ctx.textBaseline = 'top';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const b = brightness[r][c];
          if (b < 0.04) continue; // skip empty space

          const cell = cells[r][c];
          const baseX = c * cellW;
          const baseY = r * cellH;

          // Mouse repulsion
          const cx = baseX + cellW / 2 + cell.ox;
          const cy = baseY + cellH / 2 + cell.oy;
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * mouseForce;
            cell.vx += (dx / dist) * force;
            cell.vy += (dy / dist) * force;
          }

          // Spring back + damping
          cell.vx += -cell.ox * 0.18;
          cell.vy += -cell.oy * 0.18;
          cell.vx *= 0.72;
          cell.vy *= 0.72;
          cell.ox += cell.vx;
          cell.oy += cell.vy;

          // Clamp displacement
          const maxDisp = cellW * 3;
          cell.ox = Math.max(-maxDisp, Math.min(maxDisp, cell.ox));
          cell.oy = Math.max(-maxDisp, Math.min(maxDisp, cell.oy));

          const drawX = baseX + cell.ox;
          const drawY = baseY + cell.oy;

          // Glitch: displaced cells get a random char
          const displaced = Math.abs(cell.ox) + Math.abs(cell.oy) > 2;
          const isGlitch = displaced || Math.random() < glitchRate;

          let char: string;
          if (isGlitch && displaced) {
            char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          } else {
            const idx = Math.floor(b * (charset.length - 1));
            char = charset[idx];
          }

          // Color: brighter when displaced
          const disp = Math.min(1, (Math.abs(cell.ox) + Math.abs(cell.oy)) / (mouseForce * 2));
          const alpha = 0.55 + b * 0.45 + disp * 0.3;
          ctx.globalAlpha = Math.min(1, alpha);

          if (disp > 0.1) {
            ctx.fillStyle = `rgb(${Math.round(251 + disp * 4)}, ${Math.round(191 - disp * 60)}, ${Math.round(36 - disp * 36)})`;
          } else {
            ctx.fillStyle = color;
          }

          ctx.fillText(char, drawX, drawY);
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [text, fontSize, cellW, cellH, charset, color, mouseRadius, mouseForce, glitchRate]);

  return (
    <div ref={containerRef} className={cn('flex items-center justify-center overflow-hidden', className)}>
      <canvas ref={canvasRef} aria-label={text} />
    </div>
  );
}
