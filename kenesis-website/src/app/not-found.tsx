'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GlitchBackground = dynamic(
  () => import('@/components/magicui/glitch-background').then(m => ({ default: m.GlitchBackground })),
  { ssr: false }
);

// Scan-line + chromatic aberration overlay — pure CSS, no JS
function ScanLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
      }}
    />
  );
}

// Glitch text — layers shifted slightly for the chromatic look from the reference
function GlitchNumber() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2000 + Math.random() * 3000;
      timeout = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => {
          setGlitch(false);
          schedule();
        }, 180);
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative select-none" style={{ lineHeight: 0.85 }}>
      {/* Red channel — offset left */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{
          fontSize: 'clamp(140px, 28vw, 320px)',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(239,68,68,0.7)',
          transform: glitch ? 'translate(-6px, 2px)' : 'translate(-3px, 1px)',
          transition: glitch ? 'none' : 'transform 0.4s ease',
          opacity: 0.6,
        }}
      >
        404
      </span>
      {/* Blue channel — offset right */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{
          fontSize: 'clamp(140px, 28vw, 320px)',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(59,130,246,0.7)',
          transform: glitch ? 'translate(6px, -2px)' : 'translate(3px, -1px)',
          transition: glitch ? 'none' : 'transform 0.4s ease',
          opacity: 0.6,
        }}
      >
        404
      </span>
      {/* Main white layer */}
      <span
        className="relative font-display font-bold"
        style={{
          fontSize: 'clamp(140px, 28vw, 320px)',
          color: glitch ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.88)',
          transition: glitch ? 'none' : 'color 0.3s',
          display: 'block',
          textAlign: 'center',
        }}
      >
        404
      </span>
    </div>
  );
}

export default function NotFound() {
  const mountedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    const cb = () => setReady(true);
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(cb, { timeout: 1000 });
    } else {
      setTimeout(cb, 200);
    }
  }, []);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0b' }}
    >
      {/* Glitch character rain — same component used on contact page */}
      {ready && (
        <GlitchBackground
          glitchColors={['rgba(245,158,11,0.25)', 'rgba(251,191,36,0.15)', 'rgba(217,119,6,0.2)']}
          glitchSpeed={80}
          density={0.04}
          outerVignette
          smooth
          className="absolute inset-0 z-0"
        />
      )}

      <ScanLines />

      {/* Amber radial glow behind the 404 */}
      <div
        className="pointer-events-none absolute z-[1]"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-center text-center px-6">

        {/* Eyebrow */}
        <p
          className="font-mono-accent text-[11px] uppercase text-amber-400/50 mb-6"
          style={{ letterSpacing: '0.22em' }}
        >
          Info missing&nbsp;&nbsp;//&nbsp;&nbsp;Page not found
        </p>

        {/* Massive glitch 404 */}
        <GlitchNumber />

        {/* Separator */}
        <div className="mt-8 mb-8 w-[1px] h-[48px] bg-gradient-to-b from-amber-400/40 to-transparent" />

        {/* Message */}
        <p className="font-display text-[clamp(15px,2vw,20px)] text-white/40 max-w-[440px] leading-[1.6] mb-10">
          The resource may have been moved or doesn&apos;t exist. Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <Link href="/" className="btn-primary btn-primary-lg">
          Take me back home
        </Link>

        {/* Bottom eyebrow */}
        <p
          className="mt-10 font-mono-accent text-[10px] uppercase text-white/15"
          style={{ letterSpacing: '0.18em' }}
        >
          kenesis.ai
        </p>
      </div>
    </div>
  );
}
