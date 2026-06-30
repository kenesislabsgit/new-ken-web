'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GlitchBackground = dynamic(
  () => import('@/components/magicui/glitch-background').then(m => ({ default: m.GlitchBackground })),
  { ssr: false }
);

// Pure CSS scan-line overlay — zero JS
function ScanLines() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
      }}
    />
  );
}

// CSS-only chromatic aberration — no useState, no re-renders, no flicker
function GlitchNumber() {
  const fontSize = 'clamp(130px, 26vw, 300px)';

  return (
    <div className="relative" style={{ lineHeight: 0.85, height: 'clamp(110px, 22vw, 260px)' }}>
      {/* Red channel */}
      <span
        aria-hidden="true"
        className="glitch-red pointer-events-none absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{
          fontSize,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(239,68,68,0.65)',
        }}
      >
        404
      </span>
      {/* Blue channel */}
      <span
        aria-hidden="true"
        className="glitch-blue pointer-events-none absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{
          fontSize,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(59,130,246,0.65)',
        }}
      >
        404
      </span>
      {/* Main white */}
      <span
        className="glitch-flicker absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{
          fontSize,
          color: 'rgba(255,255,255,0.90)',
        }}
      >
        404
      </span>
    </div>
  );
}

export default function NotFound() {
  const [bgReady, setBgReady] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const cb = () => setBgReady(true);
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(cb, { timeout: 800 });
    } else {
      setTimeout(cb, 300);
    }
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0a0a0b',
      }}
    >
      {/* Glitch character rain — wrapped in explicit absolute div so canvas never affects flow */}
      {bgReady && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <GlitchBackground
            glitchColors={['rgba(245,158,11,0.22)', 'rgba(251,191,36,0.13)', 'rgba(217,119,6,0.18)']}
            glitchSpeed={80}
            density={0.04}
            outerVignette
            smooth
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <ScanLines />

      {/* Amber radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* All content rendered immediately — no state gate */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>

        <p
          className="font-mono-accent text-[11px] uppercase text-amber-400/50 mb-8"
          style={{ letterSpacing: '0.22em' }}
        >
          Info missing&nbsp;&nbsp;//&nbsp;&nbsp;Page not found
        </p>

        <GlitchNumber />

        <div className="mt-10 mb-8 w-[1px] h-[44px] bg-gradient-to-b from-amber-400/40 to-transparent" />

        <p className="font-display text-[clamp(15px,1.8vw,19px)] text-white/40 max-w-[420px] leading-[1.7] mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link href="/" className="btn-primary btn-primary-lg">
          Take me back home
        </Link>

        <p
          className="mt-10 font-mono-accent text-[10px] uppercase text-white/12"
          style={{ letterSpacing: '0.18em' }}
        >
          kenesis.ai
        </p>
      </div>
    </div>
  );
}
