"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface TextFlowProps {
  text: string;
  className?: string;
  fontSize?: number;
  color?: string;
  particleSize?: number;
  particleDensity?: number;
  mouseRadius?: number;
  mouseForce?: number;
  returnSpeed?: number;
  fontFamily?: string;
}

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export function TextFlow({
  text,
  className,
  fontSize = 80,
  color = "#f59e0b",
  particleSize = 1.5,
  particleDensity = 2,
  mouseRadius = 80,
  mouseForce = 8,
  returnSpeed = 0.06,
  fontFamily = "Outfit, system-ui, sans-serif",
}: TextFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Draw text to offscreen canvas to sample pixels
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    const imageData = ctx.getImageData(0, 0, w * dpr, h * dpr);
    const pixels = imageData.data;
    const particles: Particle[] = [];
    const step = Math.max(1, Math.round(4 / particleDensity));

    for (let y = 0; y < h * dpr; y += step) {
      for (let x = 0; x < w * dpr; x += step) {
        const i = (y * w * dpr + x) * 4;
        if (pixels[i + 3] > 128) {
          const px = x / dpr;
          const py = y / dpr;
          particles.push({
            originX: px, originY: py,
            x: px, y: py,
            vx: 0, vy: 0,
            color,
          });
        }
      }
    }

    particlesRef.current = particles;
    ctx.clearRect(0, 0, w, h);
  }, [text, fontSize, color, particleDensity, fontFamily]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    initParticles();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const animate = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w * dpr, h * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * mouseForce;
          p.vy -= Math.sin(angle) * force * mouseForce;
        }

        p.vx += (p.originX - p.x) * returnSpeed;
        p.vy += (p.originY - p.y) * returnSpeed;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, particleSize, particleSize);
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const handleResize = () => { initParticles(); };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [initParticles, mouseRadius, mouseForce, returnSpeed, particleSize]);

  if (prefersReducedMotion()) {
    return (
      <div className={cn("relative", className)} aria-label={text}>
        <span style={{ fontSize, fontFamily, fontWeight: 700, color }}>{text}</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full cursor-default", className)}
      style={{ height: fontSize * 1.6 }}
      aria-label={text}
    />
  );
}
