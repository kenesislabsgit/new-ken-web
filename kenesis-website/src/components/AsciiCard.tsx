'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

// ASCII character ramp from dense to sparse
const ASCII_RAMP = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];
const ASCII_RAMP_LIGHT = ['█', '▓', '▒', '░', '·', ' '];

interface AsciiCardProps {
  children: ReactNode;
  className?: string;
  /** Color of ASCII characters */
  color?: string;
  /** Speed of the dissolve animation (ms) */
  speed?: number;
  /** Gap between ASCII cells in px */
  gap?: number;
}

export default function AsciiCard({
  children,
  className = '',
  color = 'rgba(245,158,11,0.55)',
  speed = 1200,
  gap = 14,
}: AsciiCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [dims, setDims] = useState({ cols: 0, rows: 0, w: 0, h: 0 });

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { offsetWidth: w, offsetHeight: h } = el;
      setDims({
        cols: Math.floor(w / gap),
        rows: Math.floor(h / gap),
        w,
        h,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [gap]);

  // Draw ASCII overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dims.cols === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dims.w;
    canvas.height = dims.h;

    if (!hovered) {
      // Animate out: fade canvas opacity via CSS, clear after
      return;
    }

    // Randomise which cells appear and in what order
    const totalCells = dims.cols * dims.rows;
    const order = Array.from({ length: totalCells }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    const fontSize = gap - 2;
    ctx.font = `${fontSize}px "Geist Mono", monospace`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    startRef.current = null;

    const draw = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / speed, 1);

      ctx.clearRect(0, 0, dims.w, dims.h);

      // How many cells to show
      const visible = Math.floor(progress * totalCells);

      for (let k = 0; k < visible; k++) {
        const idx = order[k];
        const col = idx % dims.cols;
        const row = Math.floor(idx / dims.cols);
        const x = col * gap;
        const y = row * gap;

        // Pick char based on position noise
        const noise = (Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1;
        const charIdx = Math.floor(Math.abs(noise) * ASCII_RAMP.length);
        const char = ASCII_RAMP[charIdx];

        // Fade in each cell
        const cellProgress = Math.min((progress * totalCells - k) / 8, 1);
        ctx.globalAlpha = cellProgress * 0.85;
        ctx.fillText(char, x, y);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [hovered, dims, color, speed, gap]);

  // Fade out canvas when not hovered
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hovered) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ASCII canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[5] pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
      {children}
    </div>
  );
}
