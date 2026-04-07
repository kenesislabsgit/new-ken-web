"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface AsciiRendererProps {
  /** Image source URL */
  src: string;
  className?: string;
  /** Number of columns (characters wide) */
  columns?: number;
  /** Character set from dark to light */
  charset?: string;
  /** Use colored output vs monochrome */
  colored?: boolean;
  /** Monochrome color (when colored=false) */
  color?: string;
  /** Font size */
  fontSize?: number;
  /** Line height multiplier */
  lineHeight?: number;
  /** Animate — slowly reveal the ASCII art */
  animate?: boolean;
  /** Background color */
  bgColor?: string;
}

/**
 * Renders an image as ASCII art using canvas pixel sampling.
 * Inspired by video2ascii — maps pixel brightness to characters.
 */
export function AsciiRenderer({
  src,
  className,
  columns = 80,
  charset = " .,:;i1tfLCG08@",
  colored = false,
  color = "#f59e0b",
  fontSize = 8,
  lineHeight = 1.0,
  animate = true,
  bgColor = "transparent",
}: AsciiRendererProps) {
  const [asciiLines, setAsciiLines] = useState<{ char: string; color: string }[][]>([]);
  const [revealedRows, setRevealedRows] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [inView, setInView] = useState(false);

  // Convert image to ASCII
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Calculate dimensions maintaining aspect ratio
      // Characters are roughly 2x taller than wide
      const aspectRatio = img.height / img.width;
      const rows = Math.round(columns * aspectRatio * 0.5);

      canvas.width = columns;
      canvas.height = rows;
      ctx.drawImage(img, 0, 0, columns, rows);

      const imageData = ctx.getImageData(0, 0, columns, rows);
      const pixels = imageData.data;
      const lines: { char: string; color: string }[][] = [];

      for (let y = 0; y < rows; y++) {
        const line: { char: string; color: string }[] = [];
        for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 30) {
            line.push({ char: " ", color: "transparent" });
            continue;
          }

          // Brightness (perceived luminance)
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIdx = Math.floor(brightness * (charset.length - 1));
          const char = charset[charIdx] || " ";

          const pixelColor = colored
            ? `rgb(${r},${g},${b})`
            : color;

          line.push({ char, color: pixelColor });
        }
        lines.push(line);
      }

      setAsciiLines(lines);
      if (!animate) setRevealedRows(lines.length);
    };
    img.src = src;
  }, [src, columns, charset, colored, color, animate]);

  // Intersection observer for triggering animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    observerRef.current.observe(el);

    return () => { observerRef.current?.disconnect(); };
  }, []);

  // Animate row reveal
  useEffect(() => {
    if (!inView || !animate || asciiLines.length === 0) return;
    if (prefersReducedMotion()) {
      setRevealedRows(asciiLines.length);
      return;
    }

    let row = 0;
    const interval = setInterval(() => {
      row += 2; // reveal 2 rows per frame for speed
      setRevealedRows(Math.min(row, asciiLines.length));
      if (row >= asciiLines.length) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [inView, animate, asciiLines.length]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)} style={{ backgroundColor: bgColor }}>
      <canvas ref={canvasRef} className="hidden" />
      <pre
        className="font-mono leading-none select-none"
        style={{ fontSize, lineHeight }}
        aria-hidden="true"
      >
        {asciiLines.slice(0, revealedRows).map((line, y) => (
          <div key={y} className="whitespace-pre">
            {line.map((cell, x) => (
              <span key={x} style={{ color: cell.color }}>{cell.char}</span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
