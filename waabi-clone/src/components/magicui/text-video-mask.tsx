"use client";

import { useRef, useEffect, useId } from "react";
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
}

/**
 * Large text that acts as a window revealing a video or animated background.
 * Everything outside the text shape shows the page background color.
 * Uses an absolutely-positioned SVG overlay with a text-shaped cutout.
 */
export function TextVideoMask({
  text,
  videoSrc,
  children,
  className,
  fontSize = "clamp(5rem, 12vw, 14rem)",
  fontWeight = 900,
  fontFamily,
}: TextVideoMaskProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = prefersReducedMotion();
  const maskId = useId().replace(/:/g, "_");

  useEffect(() => {
    if (videoRef.current && !reduced) {
      videoRef.current.play().catch(() => {});
    }
  }, [reduced]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      aria-label={text}
    >
      {/* Background layer: video or children or default gradient */}
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : children ? (
          <div className="h-full w-full">{children}</div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600" />
        )}
      </div>

      {/* SVG overlay: page-bg rect with text cutout — covers 100% of container */}
      <svg
        className="absolute inset-0 z-[1] w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id={maskId}>
            {/* White = visible (show the dark overlay) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black text = transparent (punch through to show bg behind) */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="black"
              style={{
                fontSize,
                fontWeight,
                fontFamily: fontFamily || "var(--font-outfit), Outfit, system-ui, sans-serif",
              }}
            >
              {text}
            </text>
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="#0a0a0b"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
