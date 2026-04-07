"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface GradientStripsProps {
  className?: string;
  /** Colors for the gradient bars */
  colors?: string[];
  /** Background color */
  bgColor?: string;
  /** Number of bars */
  barCount?: number;
  /** Bar shape: "hill" | "valley" | "wave" | "flat" */
  shape?: "hill" | "valley" | "wave" | "flat";
  /** Animation speed */
  speed?: number;
  /** Direction: "vertical" | "horizontal" */
  direction?: "vertical" | "horizontal";
}

export function GradientStrips({
  className,
  colors = ["#f59e0b", "#d97706", "#92400e", "#451a03"],
  bgColor = "#0a0a0b",
  barCount = 12,
  shape = "hill",
  speed = 1,
  direction = "vertical",
}: GradientStripsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bars, setBars] = useState<{ height: number; color: string; delay: number }[]>([]);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const generated = Array.from({ length: barCount }, (_, i) => {
      const t = i / (barCount - 1); // 0..1
      let heightPct: number;
      switch (shape) {
        case "hill":
          heightPct = 30 + 70 * Math.sin(t * Math.PI);
          break;
        case "valley":
          heightPct = 100 - 70 * Math.sin(t * Math.PI);
          break;
        case "wave":
          heightPct = 50 + 40 * Math.sin(t * Math.PI * 2);
          break;
        case "flat":
        default:
          heightPct = 80;
          break;
      }
      const colorIdx = Math.floor(t * (colors.length - 1));
      const colorNext = Math.min(colorIdx + 1, colors.length - 1);
      const mix = (t * (colors.length - 1)) - colorIdx;
      return {
        height: heightPct,
        color: lerpColor(colors[colorIdx], colors[colorNext], mix),
        delay: i * 0.08,
      };
    });
    setBars(generated);
  }, [barCount, shape, colors]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      <div className={cn(
        "flex items-end h-full w-full",
        direction === "horizontal" ? "flex-col items-stretch" : "flex-row items-end"
      )}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              [direction === "vertical" ? "height" : "width"]: `${bar.height}%`,
              background: `linear-gradient(${direction === "vertical" ? "to top" : "to right"}, ${bgColor}, ${bar.color}40, ${bar.color}15, transparent)`,
              animation: reduced ? "none" : `strip-pulse ${2 + i * 0.3}s ease-in-out ${bar.delay}s infinite alternate`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes strip-pulse {
          0% { opacity: 0.3; transform: scaleY(0.92); }
          100% { opacity: 0.7; transform: scaleY(1.05); }
        }
      `}</style>
    </div>
  );
}

/** Lerp between two hex colors */
function lerpColor(a: string, b: string, t: number): string {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const r = Math.round(parseInt(ah.slice(0, 2), 16) * (1 - t) + parseInt(bh.slice(0, 2), 16) * t);
  const g = Math.round(parseInt(ah.slice(2, 4), 16) * (1 - t) + parseInt(bh.slice(2, 4), 16) * t);
  const bl = Math.round(parseInt(ah.slice(4, 6), 16) * (1 - t) + parseInt(bh.slice(4, 6), 16) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}
