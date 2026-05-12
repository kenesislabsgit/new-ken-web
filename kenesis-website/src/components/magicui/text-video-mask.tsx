"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface TextVideoMaskProps {
  text: string;
  videoSrc?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: string;
  fontWeight?: number;
  fontFamily?: string;
  mode?: "cutout" | "clip";
}

export function TextVideoMask({
  text,
  videoSrc,
  children,
  className,
  style,
  fontSize = "clamp(5rem, 12vw, 14rem)",
  fontWeight = 900,
  fontFamily,
  mode = "cutout",
}: TextVideoMaskProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maskUrl, setMaskUrl] = useState<string>("");
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    video.play().catch(() => {});
  }, [reduced]);

  const fontFam = fontFamily || "var(--font-outfit), Outfit, system-ui, sans-serif";

  // Generate mask from canvas with the correct font
  const generateMask = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w === 0 || h === 0) return;

    // Load font explicitly via FontFace API for canvas use
    const fontName = "MBFNeoWaveCanvas";
    try {
      const face = new FontFace(fontName, "url(/fonts/MBFNeoWave-Regular.otf)");
      await face.load();
      document.fonts.add(face);
    } catch (e) {
      console.warn("Font load failed, using fallback", e);
    }

    // Wait for all fonts to be ready
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    const dpr = 2;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Measure font size from CSS
    const span = document.createElement("span");
    span.style.fontSize = fontSize;
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    container.appendChild(span);
    const computedSize = parseFloat(getComputedStyle(span).fontSize);
    container.removeChild(span);

    if (mode === "clip") {
      ctx.fillStyle = "#ffffff";
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#000000";
    }

    ctx.font = `${fontWeight} ${computedSize}px ${fontName}, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2);

    setMaskUrl(canvas.toDataURL());
  }, [text, fontSize, fontWeight, mode]);

  // Generate mask after fonts load and on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const doGenerate = () => {
      // Small delay to ensure layout is stable
      requestAnimationFrame(generateMask);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(doGenerate);
    } else {
      doGenerate();
    }

    const ro = new ResizeObserver(doGenerate);
    ro.observe(container);
    return () => ro.disconnect();
  }, [generateMask]);

  const bgContent = videoSrc ? (
    <video ref={videoRef} src={videoSrc} autoPlay loop muted playsInline
      className="h-full w-full object-cover"
      style={{ filter: 'saturate(0.8) contrast(1.1) brightness(1.2)' }} />
  ) : children ? (
    <div className="h-full w-full">{children}</div>
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600" />
  );

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)} style={style} aria-label={text}>
      <div
        className="absolute inset-0 z-0"
        style={maskUrl ? {
          WebkitMaskImage: `url(${maskUrl})`,
          maskImage: `url(${maskUrl})`,
          WebkitMaskSize: 'cover',
          maskSize: 'cover',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        } : { opacity: 0 }}
      >
        {bgContent}
      </div>
    </div>
  );
}
