"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/animations";

interface CircularGalleryProps {
  images: { src: string; alt: string }[];
  className?: string;
  radius?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function CircularGallery({
  images,
  className,
  radius = 320,
  autoRotate = true,
  rotationSpeed = 30,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  const autoTween = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = images.length;
  const step = 360 / count;

  const updateCards = useCallback(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardAngle = angleRef.current + i * step;
      const rad = (cardAngle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius;
      const scale = (z + radius) / (2 * radius);
      const mappedScale = 0.55 + scale * 0.45;
      const opacity = 0.25 + scale * 0.75;
      const blurAmount = (1 - scale) * 6;
      gsap.set(card, {
        x,
        z,
        scale: mappedScale,
        opacity,
        zIndex: Math.round(scale * 100),
        filter: `blur(${blurAmount.toFixed(1)}px)`,
      });
    }
    // Determine which card is closest to front (z = radius)
    let bestIdx = 0;
    let bestZ = -Infinity;
    for (let i = 0; i < count; i++) {
      const cardAngle = angleRef.current + i * step;
      const rad = (cardAngle * Math.PI) / 180;
      const z = Math.cos(rad) * radius;
      if (z > bestZ) { bestZ = z; bestIdx = i; }
    }
    setActiveIndex(bestIdx);
  }, [count, step, radius]);

  // Auto-rotation
  useEffect(() => {
    if (prefersReducedMotion() || !autoRotate) {
      updateCards();
      return;
    }
    const obj = { angle: angleRef.current };
    autoTween.current = gsap.to(obj, {
      angle: `+=${360}`,
      duration: rotationSpeed,
      ease: "none",
      repeat: -1,
      onUpdate() {
        angleRef.current = obj.angle % 360;
        updateCards();
      },
    });
    return () => { autoTween.current?.kill(); };
  }, [autoRotate, rotationSpeed, updateCards]);

  // Drag interaction
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startAngle.current = angleRef.current;
    autoTween.current?.pause();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    angleRef.current = startAngle.current + dx * 0.3;
    updateCards();
  }, [updateCards]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    if (autoRotate && autoTween.current) {
      autoTween.current.resume();
    }
  }, [autoRotate]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center select-none", className)}
      style={{ perspective: "1000px" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={trackRef}
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          width: `${radius * 2}px`,
          height: "280px",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 -ml-[120px] w-[240px] h-[280px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover pointer-events-none"
              loading="lazy"
              draggable={false}
            />
            <div className={cn(
              "absolute inset-0 rounded-2xl border transition-colors duration-300",
              i === activeIndex ? "border-amber-400/30" : "border-white/[0.08]"
            )} />
          </div>
        ))}
      </div>
      {/* Caption for active image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <p className="font-mono-accent text-[0.85rem] text-white/30 tracking-[0.06em] transition-opacity duration-300">
          {images[activeIndex]?.alt}
        </p>
      </div>
    </div>
  );
}
