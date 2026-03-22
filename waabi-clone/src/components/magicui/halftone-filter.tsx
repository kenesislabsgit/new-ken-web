"use client";

import { cn } from "@/lib/utils";

interface HalftoneFilterProps {
  children: React.ReactNode;
  className?: string;
  /** Dot size in px */
  dotSize?: number;
  /** Dot color */
  color?: string;
  /** Background color between dots */
  bgColor?: string;
  /** Angle of the dot grid in degrees */
  angle?: number;
  /** Opacity of the halftone overlay (0-1) */
  opacity?: number;
}

/**
 * Applies a halftone dot pattern overlay on top of children content.
 * Uses CSS radial-gradient for a lightweight, no-canvas approach.
 * Inspired by Framer "Halftone Filter" component.
 */
export function HalftoneFilter({
  children,
  className,
  dotSize = 3,
  color = "#f59e0b",
  bgColor = "transparent",
  angle = 45,
  opacity = 0.15,
}: HalftoneFilterProps) {
  const spacing = dotSize * 3;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      {/* Halftone dot overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 mix-blend-multiply"
        style={{
          opacity,
          transform: `rotate(${angle}deg) scale(1.5)`,
          backgroundImage: `radial-gradient(circle ${dotSize}px at center, ${color} 0%, ${color} 60%, ${bgColor} 61%, ${bgColor} 100%)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * SVG-based halftone for higher quality / print-like effect.
 * Wraps children and applies an SVG filter.
 */
export function HalftoneSVG({
  children,
  className,
  dotScale = 4,
  contrast = 1.5,
}: {
  children: React.ReactNode;
  className?: string;
  dotScale?: number;
  contrast?: number;
}) {
  const filterId = "halftone-svg-filter";

  return (
    <div className={cn("relative", className)}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.5 1" />
              <feFuncG type="discrete" tableValues="0 0.5 1" />
              <feFuncB type="discrete" tableValues="0 0.5 1" />
            </feComponentTransfer>
            <feConvolveMatrix
              order="3"
              kernelMatrix={`0 -1 0 -1 ${dotScale} -1 0 -1 0`}
              divisor="1"
              bias="0"
            />
            <feComponentTransfer>
              <feFuncR type="linear" slope={contrast} intercept={-(contrast - 1) / 2} />
              <feFuncG type="linear" slope={contrast} intercept={-(contrast - 1) / 2} />
              <feFuncB type="linear" slope={contrast} intercept={-(contrast - 1) / 2} />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div style={{ filter: `url(#${filterId})` }}>{children}</div>
    </div>
  );
}
