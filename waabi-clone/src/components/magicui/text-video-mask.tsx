"use client";

import { useRef, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface TextVideoMaskProps {
  text: string;
  videoSrc?: string;
  children?: React.ReactNode;
  className?: string;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  /** "cutout" (default): dark overlay with text holes. "clip": only text visible, rest transparent. */
  mode?: "cutout" | "clip";
}

export function TextVideoMask({
  text,
  videoSrc,
  children,
  className,
  fontSize = "clamp(5rem, 12vw, 14rem)",
  fontWeight = 900,
  fontFamily,
  mode = "cutout",
}: TextVideoMaskProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();
  const maskId = useId().replace(/:/g, "_");
  const clipId = `clip_${maskId}`;
  const [size, setSize] = useState({ w: 1, h: 1 });

  useEffect(() => {
    if (videoRef.current && !reduced) {
      videoRef.current.play().catch(() => {});
    }
  }, [reduced]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.max(r.width, 1), h: Math.max(r.height, 1) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fontFam = fontFamily || "var(--font-outfit), Outfit, system-ui, sans-serif";

  const bgContent = videoSrc ? (
    <video ref={videoRef} src={videoSrc} autoPlay loop muted playsInline
      className="h-full w-full object-cover" />
  ) : children ? (
    <div className="h-full w-full">{children}</div>
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600" />
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)} aria-label={text}>
      {/* Background layer */}
      <div
        className="absolute inset-0 z-0"
        style={mode === "clip" ? { clipPath: `url(#${clipId})` } : undefined}
      >
        {bgContent}
      </div>

      {/* SVG definitions + overlay */}
      <svg
        className="absolute inset-0 z-[1] w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size.w} ${size.h}`}
        preserveAspectRatio="none"
      >
        <defs>
          {mode === "clip" ? (
            <clipPath id={clipId}>
              <text
                x={size.w / 2}
                y={size.h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize, fontWeight, fontFamily: fontFam }}
              >
                {text}
              </text>
            </clipPath>
          ) : (
            <mask id={maskId}>
              <rect width={size.w} height={size.h} fill="white" />
              <text
                x={size.w / 2}
                y={size.h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                style={{ fontSize, fontWeight, fontFamily: fontFam }}
              >
                {text}
              </text>
            </mask>
          )}
        </defs>
        {mode === "cutout" && (
          <rect
            width={size.w}
            height={size.h}
            fill="#0a0a0b"
            mask={`url(#${maskId})`}
          />
        )}
      </svg>
    </div>
  );
}
