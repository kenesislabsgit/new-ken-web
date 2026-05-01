'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

const ASCII_CHARS = ['@', '#', '▓', '▒', '░', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];

interface AsciiCardProps {
  children: ReactNode;
  className?: string;
  color?: string;
  gap?: number;
  speed?: number;
}

export default function AsciiCard({
  children,
  className = '',
  color = '#f59e0b',
  gap = 16,
  speed = 800,
}: AsciiCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Run animation when hovered
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.w === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size.w;
    canvas.height = size.h;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!hovered) {
      ctx.clearRect(0, 0, size.w, size.h);
      return;
    }

    const cols = Math.floor(size.w / gap);
    const rows = Math.floor(size.h / gap);
    const total = cols * rows;

    // Shuffle cell order for random reveal
    const order = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);

    startRef.current = null;
    ctx.font = `bold ${gap - 2}px "Geist Mono", "Courier New", monospace`;
    ctx.textBaseline = 'top';

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / speed, 1);

      ctx.clearRect(0, 0, size.w, size.h);

      const visible = Math.floor(progress * total);

      for (let k = 0; k < visible; k++) {
        const idx = order[k];
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        // Deterministic char per cell
        const seed = Math.abs(Math.sin(col * 127.1 + row * 311.7) * 43758.5453) % 1;
        const char = ASCII_CHARS[Math.floor(seed * ASCII_CHARS.length)];

        // Per-cell fade-in
        const cellAge = progress * total - k;
        const alpha = Math.min(cellAge / 6, 1);

        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = color;
        ctx.fillText(char, col * gap + 1, row * gap + 1);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [hovered, size, color, gap, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ASCII canvas — sits on top, pointer-events none */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[10] transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          borderRadius: 'inherit',
          mixBlendMode: 'overlay',
        }}
      />
      {children}
    </div>
  );
}
