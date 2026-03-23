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
  const reduced = prefersReducedMotion();

  useEffect(() => {
    import("@paper-design/shaders-react").then((mod) => {
      if (mod.LiquidMetal) {
        setLiquidMetal(() => mod.LiquidMetal);
      }
    });
  }, []);

  if (!LiquidMetal || reduced) {
    // Render an invisible placeholder — same size, no flash
    return (
      <div
        ref={containerRef}
        className={cn("relative", className)}
        style={{ width, height, visibility: reduced ? 'visible' : 'hidden' }}
      >
        {reduced && (
          <img
            src={src}
            alt="Kenesis logo"
            width={width}
            height={height}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
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
  );
}
