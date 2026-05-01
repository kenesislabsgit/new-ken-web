'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  glowColors?: [string, string, string]; // 3 hex colors for gradient border
  backgroundColor?: string;
  borderRadius?: number;
  edgeSensitivity?: number;
  glowIntensity?: number;
  animated?: boolean;
}

export default function BorderGlow({
  children,
  className = '',
  glowColors = ['#fbbf24', '#f59e0b', '#d97706'],
  backgroundColor = 'transparent',
  borderRadius = 16,
  edgeSensitivity = 40,
  glowIntensity = 1.2,
  animated = false,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowStyle, setGlowStyle] = useState({
    opacity: 0,
    maskImage: 'none',
  });

  // Intro sweep animation
  useEffect(() => {
    if (!animated || !glowRef.current) return;
    const el = glowRef.current;
    let start: number | null = null;
    const duration = 1200;

    const sweep = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const angle = progress * 360;
      el.style.setProperty('--sweep-angle', `${angle}deg`);
      el.style.opacity = String(Math.sin(progress * Math.PI) * glowIntensity * 0.8);
      if (progress < 1) requestAnimationFrame(sweep);
      else el.style.opacity = '0';
    };

    const raf = requestAnimationFrame(sweep);
    return () => cancelAnimationFrame(raf);
  }, [animated, glowIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Distance from each edge
    const distLeft = x;
    const distRight = w - x;
    const distTop = y;
    const distBottom = h - y;
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);
    const threshold = (edgeSensitivity / 100) * Math.min(w, h);

    if (minDist > threshold) {
      setGlowStyle({ opacity: 0, maskImage: 'none' });
      return;
    }

    // Determine which edge is closest and create directional cone mask
    const opacity = Math.max(0, (1 - minDist / threshold)) * glowIntensity;

    // Angle from center to cursor
    const cx = w / 2;
    const cy = h / 2;
    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;

    const maskImage = `conic-gradient(from ${angle - 25}deg at ${(x / w) * 100}% ${(y / h) * 100}%, transparent 0%, white 15%, white 85%, transparent 100%)`;

    setGlowStyle({ opacity, maskImage });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setGlowStyle({ opacity: 0, maskImage: 'none' });
    setIsHovered(false);
  };

  const gradientBorder = `linear-gradient(135deg, ${glowColors[0]} 0%, ${glowColors[1]} 50%, ${glowColors[2]} 100%)`;

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Static subtle border — always visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius,
          padding: '1px',
          background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Glow border — appears near edges */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-150"
        style={{
          borderRadius,
          padding: '1.5px',
          background: gradientBorder,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: glowStyle.opacity,
          // Directional cone mask on the glow layer itself
          WebkitMaskImage: glowStyle.maskImage !== 'none' ? undefined : undefined,
        }}
      />

      {/* Outer glow spread */}
      <div
        className="absolute pointer-events-none transition-opacity duration-200"
        style={{
          inset: -8,
          borderRadius: borderRadius + 8,
          background: `radial-gradient(ellipse at 50% 50%, ${glowColors[1]}33 0%, transparent 70%)`,
          opacity: glowStyle.opacity * 0.6,
          filter: 'blur(8px)',
        }}
      />

      {/* Content */}
      <div style={{ borderRadius, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
