'use client';

import { useRef, useState, ReactNode, useCallback } from 'react';

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  glowColors?: [string, string, string];
  borderRadius?: number;
}

export default function BorderGlow({
  children,
  className = '',
  glowColors = ['#fbbf24', '#f59e0b', '#d97706'],
  borderRadius = 16,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPos(p => ({ ...p, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial glow that follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-[2]"
        style={{
          borderRadius,
          opacity: pos.opacity,
          background: `radial-gradient(circle 180px at ${pos.x}% ${pos.y}%, ${glowColors[0]}55 0%, ${glowColors[1]}22 40%, transparent 70%)`,
        }}
      />

      {/* Animated gradient border */}
      <div
        className="absolute pointer-events-none z-[3]"
        style={{
          inset: -1,
          borderRadius: borderRadius + 1,
          padding: '1.5px',
          background: `radial-gradient(circle 120px at ${pos.x}% ${pos.y}%, ${glowColors[0]} 0%, ${glowColors[1]}88 40%, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          opacity: pos.opacity,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Always-on subtle border */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          borderRadius,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />

      {/* Content */}
      <div style={{ borderRadius, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
