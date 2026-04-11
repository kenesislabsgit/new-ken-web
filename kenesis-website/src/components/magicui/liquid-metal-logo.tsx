"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface LiquidMetalLogoProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  speed?: number;
  distortion?: number;
  shiftRed?: number;
  shiftBlue?: number;
  colorBack?: string;
  colorTint?: string;
  softness?: number;
  contour?: number;
  angle?: number;
  scale?: number;
}

export function LiquidMetalLogo({
  src,
  width = 400,
  height = 400,
  className,
  speed = 1,
  distortion = 0.05,
  shiftRed = 0.25,
  shiftBlue = 0.25,
  colorBack = "#0a0a0b",
  colorTint = "#ffffff",
  softness = 0.15,
  contour = 0.35,
  angle = 60,
  scale = 0.7,
}: LiquidMetalLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [LiquidMetal, setLiquidMetal] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [shaderRendered, setShaderRendered] = useState(false);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Timeout fallback — show container even if shader fails
    const timeout = setTimeout(() => setShaderRendered(true), 3000);
    import("@paper-design/shaders-react").then((mod) => {
      if (mod.LiquidMetal) {
        setLiquidMetal(() => mod.LiquidMetal);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setShaderRendered(true);
            clearTimeout(timeout);
          });
        });
      } else {
        setShaderRendered(true);
        clearTimeout(timeout);
      }
    }).catch(() => {
      setShaderRendered(true);
      clearTimeout(timeout);
    });
    return () => clearTimeout(timeout);
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden transition-opacity duration-500", className)}
      style={{ width, height, opacity: shaderRendered ? 1 : 0 }}
    >
      {/* Only render when shader is ready — static fallback if shader fails */}
      {!LiquidMetal && shaderRendered && (
        <img src={src} alt="" className="w-full h-full object-contain opacity-30" />
      )}
      {LiquidMetal && !reduced && (
        <div>
          <LiquidMetal
            width={width}
            height={height}
            image={src}
            colorBack={colorBack}
            colorTint={colorTint}
            softness={softness}
            shiftRed={shiftRed}
            shiftBlue={shiftBlue}
            distortion={distortion}
            contour={contour}
            angle={angle}
            speed={speed}
            scale={scale}
            fit="contain"
          />
        </div>
      )}
    </div>
  );
}
