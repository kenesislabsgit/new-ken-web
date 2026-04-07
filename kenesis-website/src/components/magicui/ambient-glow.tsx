"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  className?: string;
  style?: React.CSSProperties;
  blur?: number;
  opacity?: number;
  interval?: number;
}

/**
 * YouTube-style ambient glow. Draws the referenced video onto a tiny
 * offscreen canvas, then displays it scaled up with CSS blur.
 * The canvas updates every `interval` ms for a smooth, dynamic glow
 * that follows the video's colors.
 */
export function AmbientGlow({
  videoRef,
  className,
  style: styleProp,
  blur = 60,
  opacity = 0.35,
  interval = 200,
}: AmbientGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastDrawRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    // Use a very small canvas — we're blurring it anyway
    canvas.width = 32;
    canvas.height = 18;

    const draw = () => {
      const now = performance.now();
      if (now - lastDrawRef.current >= interval) {
        lastDrawRef.current = now;
        if (video.readyState >= 2 && !video.paused) {
          ctx.drawImage(video, 0, 0, 32, 18);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoRef, interval]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{
        filter: `blur(${blur}px) saturate(0.8)`,
        opacity,
        imageRendering: "auto",
        ...styleProp,
      }}
      aria-hidden="true"
    />
  );
}
