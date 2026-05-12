"use client";

import * as React from "react";

export interface LogoItem {
  src: string;
  alt: string;
  /** Rendered width in px. */
  w: number;
  /** Rendered height in px. */
  h: number;
}

export interface PerspectiveMarqueeProps {
  items?: LogoItem[];
  itemGap?: number;
  /** Pixels to advance per animation frame (~60fps). Default 1.8 = ~108px/s. */
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  fadeColor?: string;
  background?: string;
  /** Natural height of logos at full scale (the max h value in items). Defaults to 80. */
  logoNaturalHeight?: number;
  className?: string;
}

const DEFAULT_ITEMS: LogoItem[] = [
  { src: "/partners/meity.png",  alt: "MeitY",  w: 200, h: 80 },
  { src: "/partners/AWS.png",    alt: "AWS",    w: 140, h: 80 },
  { src: "/partners/Nvidia.png", alt: "Nvidia", w: 220, h: 80 },
  { src: "/partners/TiE.png",    alt: "TiE",    w: 140, h: 80 },
  { src: "/partners/Zoho.png",   alt: "Zoho",   w: 190, h: 80 },
  { src: "/partners/forge.png",  alt: "Forge",  w: 220, h: 64 },
  { src: "/partners/iTNT.PNG",   alt: "iTNT",   w: 170, h: 80 },
];

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  itemGap = 80,
  pixelsPerFrame = 1.8,
  rotateY = -22,
  rotateX = 6,
  perspective = 1200,
  fadeColor = "#0a0a0b",
  background = "#0a0a0b",
  logoNaturalHeight = 80,
  className,
}: PerspectiveMarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number>(0);
  const [scale, setScale] = React.useState(1);

  // Observe container height and compute a scale factor so logos never overflow
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const availableH = el.clientHeight;
      // Leave 20% vertical padding room
      const targetLogoH = availableH * 0.6;
      setScale(Math.min(1, targetLogoH / logoNaturalHeight));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [logoNaturalHeight]);

  // Total width of one complete set of logos (at current scale)
  const setWidth = React.useMemo(
    () => items.reduce((acc, item) => acc + item.w * scale + itemGap * scale, 0),
    [items, itemGap, scale],
  );

  React.useEffect(() => {
    let offset = 0;

    const loop = () => {
      offset = (offset + pixelsPerFrame) % setWidth;
      if (trackRef.current) {
        // Direct DOM write — zero React overhead, buttery smooth on every browser
        trackRef.current.style.transform = `translateX(${-offset}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pixelsPerFrame, setWidth]);

  // Five copies — enough to fill the widest desktop without a gap
  const rendered = [...items, ...items, ...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background,
        overflow: "hidden",
        perspective: `${perspective}px`,
      }}
    >
      {/* 3D perspective rotation wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Scrolling track — only this element is mutated by rAF */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {rendered.map((item, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: item.w * scale,
                height: item.h * scale,
                marginRight: itemGap * scale,
                flexShrink: 0,
                opacity: 0.88,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${fadeColor} 0%, transparent 18%, transparent 82%, ${fadeColor} 100%)`,
        }}
      />
      {/* Vertical edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${fadeColor} 0%, transparent 30%, transparent 70%, ${fadeColor} 100%)`,
        }}
      />
    </div>
  );
}
