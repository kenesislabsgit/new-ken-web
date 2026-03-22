"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

// ── Simplex noise (compact implementation) ──
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const grad3 = [
  [1,1],[-1,1],[1,-1],[-1,-1],
  [1,0],[-1,0],[0,1],[0,-1],
];

function buildPerm(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807 + 0) % 2147483647;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  const permMod8 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod8[i] = perm[i] % 8;
  }
  return { perm, permMod8 };
}

function simplex2D(x: number, y: number, perm: Uint8Array, permMod8: Uint8Array): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t, Y0 = j - t;
  const x0 = x - X0, y0 = y - Y0;
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  const ii = i & 255, jj = j & 255;

  let n0 = 0, n1 = 0, n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) { t0 *= t0; const g = grad3[permMod8[ii + perm[jj]]]; n0 = t0 * t0 * (g[0] * x0 + g[1] * y0); }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) { t1 *= t1; const g = grad3[permMod8[ii + i1 + perm[jj + j1]]]; n1 = t1 * t1 * (g[0] * x1 + g[1] * y1); }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) { t2 *= t2; const g = grad3[permMod8[ii + 1 + perm[jj + 1]]]; n2 = t2 * t2 * (g[0] * x2 + g[1] * y2); }

  return 70 * (n0 + n1 + n2);
}

interface DitheredWavesProps {
  className?: string;
  charset?: string;
  color?: string;
  bgColor?: string;
  cellSize?: number;
  speed?: number;
  layers?: number;
  amplitude?: number;
  frequency?: number;
  enableMouse?: boolean;
  mouseRadius?: number;
}

export function DitheredWaves({
  className,
  charset = " .:-=+*#%@",
  color = "#f59e0b",
  bgColor = "transparent",
  cellSize = 10,
  speed = 1,
  layers = 4,
  amplitude = 40,
  frequency = 0.02,
  enableMouse = true,
  mouseRadius = 200,
}: DitheredWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const noiseRef = useRef<{ perm: Uint8Array; permMod8: Uint8Array } | null>(null);

  // Initialize noise with random seed on mount
  if (!noiseRef.current) {
    noiseRef.current = buildPerm(Math.floor(Math.random() * 2147483647));
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const noise = noiseRef.current;
    if (!canvas || !noise) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Smooth mouse interpolation for liquid feel
    const sm = smoothMouseRef.current;
    const rm = mouseRef.current;
    sm.x += (rm.x - sm.x) * 0.08;
    sm.y += (rm.y - sm.y) * 0.08;

    const cols = Math.ceil(w / cellSize);
    const rows = Math.ceil(h / cellSize);
    const t = timeRef.current;
    const mx = sm.x;
    const my = sm.y;
    const { perm, permMod8 } = noise;

    ctx.font = `${cellSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;

        const nx = x * frequency * 0.8;
        const ny = y * frequency * 0.8;

        // Use noise to warp the sample coordinates (domain warping) for liquid flow
        const warpX = simplex2D(nx * 0.7 + t * speed * 0.4, ny * 0.7 + t * speed * 0.3, perm, permMod8) * 1.5;
        const warpY = simplex2D(nx * 0.7 + 100 + t * speed * 0.35, ny * 0.7 + 100 - t * speed * 0.25, perm, permMod8) * 1.5;

        // Layer multiple octaves of simplex noise with domain warping
        let val = 0;
        let amp = 1;
        let freq = 1;
        let maxAmp = 0;
        for (let l = 0; l < layers; l++) {
          val += amp * simplex2D(
            (nx + warpX) * freq + t * speed * 0.6 * (1 + l * 0.4),
            (ny + warpY) * freq + t * speed * 0.5 * (1 + l * 0.3) + l * 3.7,
            perm, permMod8
          );
          maxAmp += amp;
          amp *= 0.5;
          freq *= 2.0;
        }
        val = (val / maxAmp + 1) * 0.5; // normalize to 0-1

        // Second warp pass for extra liquid turbulence
        const swirl = simplex2D(
          nx * 0.4 + warpY * 0.5 + t * speed * 0.7,
          ny * 0.4 + warpX * 0.5 - t * speed * 0.5,
          perm, permMod8
        ) * 0.35;
        val = Math.min(1, Math.max(0, val + swirl));

        // Mouse interaction — create a liquid ripple/distortion
        if (enableMouse && mx > -999) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseRadius) {
            const influence = 1 - dist / mouseRadius;
            const curve = influence * influence * influence; // cubic falloff
            // Distort the noise value near cursor
            const ripple = simplex2D(
              nx * 3 + t * speed * 0.5,
              ny * 3 - t * speed * 0.4,
              perm, permMod8
            );
            val = val + curve * 0.6 * (0.5 + ripple * 0.5);
            val = Math.min(1, Math.max(0, val));
          }
        }

        const charIdx = Math.floor(val * (charset.length - 1));
        const char = charset[charIdx];

        if (char && char !== " ") {
          ctx.globalAlpha = 0.2 + val * 0.8;
          ctx.fillText(char, x, y);
        }
      }
    }

    ctx.globalAlpha = 1;
    timeRef.current += 0.016;
    rafRef.current = requestAnimationFrame(draw);
  }, [charset, color, bgColor, cellSize, speed, layers, amplitude, frequency, enableMouse, mouseRadius]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    rafRef.current = requestAnimationFrame(draw);

    const handleMouse = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    if (enableMouse) {
      window.addEventListener("mousemove", handleMouse);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [draw, enableMouse]);

  if (prefersReducedMotion()) {
    return <div className={cn("w-full h-full", className)} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
    />
  );
}
