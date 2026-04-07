"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        "[border:calc(var(--border-width))_solid_transparent]",
        "[background:padding-box_transparent,border-box_conic-gradient(from_calc(var(--beam-position,0)*1turn),transparent_0%,var(--color-from)_10%,var(--color-to)_20%,transparent_30%)]",
        "[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
        "[mask-composite:exclude]",
        "animate-border-beam",
        className
      )}
    />
  );
}
