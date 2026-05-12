'use client';

import { useEffect, useRef } from 'react';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';

// No GSAP import — scroll-out parallax runs via a passive scroll listener.
// No BlurFade delays on h1 — the LCP element must be immediately visible.
// Video is position:absolute (not fixed) so it only composites on the homepage,
// not on every other page the browser renders in the background.

export default function HeroSection() {
  const introRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Scroll-out parallax: fade + translateY as user scrolls, no GSAP dependency
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      intro.style.opacity = `${1 - progress}`;
      intro.style.transform = `translateY(${-progress * 80}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Video autoplay — defer on mobile, play eagerly on desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.innerWidth < 768;

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;

    if (isMobile) {
      video.preload = 'none';
      const loadAndPlay = () => {
        video.preload = 'auto';
        video.load();
        video.play().catch(() => {});
        window.removeEventListener('touchstart', loadAndPlay);
        window.removeEventListener('scroll', loadAndPlay);
      };
      window.addEventListener('touchstart', loadAndPlay, { once: true, passive: true });
      window.addEventListener('scroll', loadAndPlay, { once: true, passive: true });
      return () => {
        window.removeEventListener('touchstart', loadAndPlay);
        window.removeEventListener('scroll', loadAndPlay);
      };
    }

    const attempt = () => { video.play().catch(() => {}); };
    if (video.readyState >= 2) { attempt(); }
    else { video.addEventListener('loadeddata', attempt, { once: true }); }
    return () => { video.removeEventListener('loadeddata', attempt); };
  }, []);

  return (
    <section className="relative w-full">
      {/* Video background — absolute so it only creates a stacking context on this page */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover"
          style={{ WebkitTransform: 'translateZ(0)' }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55 md:bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay" />
      </div>

      {/* Intro screen */}
      <div ref={introRef} className="relative z-[2] h-[100svh] w-full will-change-[opacity,transform]">

        {/* Progressive blur beneath navbar */}
        <ProgressiveBlur position="top" height="80px" className="absolute top-0 left-0 right-0 z-10 pointer-events-none" />

        {/* ── MOBILE layout ── */}
        <div className="md:hidden absolute inset-0 flex flex-col justify-center px-6 pt-[80px]">
          {/* Eyebrow — small, low-priority, can animate in */}
          <p
            className="text-[10px] uppercase tracking-[0.18em] text-amber-400/60 mb-4"
            style={{ animation: 'hero-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}
          >
            On-Premise AI · Industrial Safety
          </p>

          {/* h1 — LCP element: NO delay, visible immediately in first paint */}
          <h1 className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-5">
            <span className="block" style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0s both' }}>
              Your cameras see everything.
            </span>
            <span className="block text-white/60" style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both' }}>
              Now they <em>understand</em> it.
            </span>
          </h1>

          <p
            className="text-[14px] leading-[1.7] text-white/55 font-normal max-w-[340px] mb-7"
            style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both' }}
          >
            Kenesis turns your CCTV into a real-time safety system - PPE violations,
            zone breaches and hazard detection, all on your hardware.
          </p>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 self-start
                       min-h-[44px] px-5
                       border border-white/15 rounded-full
                       text-[11px] uppercase tracking-[0.14em] font-medium
                       text-white/60 hover:text-white hover:border-amber-400/40
                       transition-all duration-300 group"
            style={{ animation: 'hero-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.4s both' }}
          >
            <span>Book a walkthrough</span>
            <span className="text-white/30 group-hover:text-amber-400/70 group-hover:translate-x-0.5 transition-all duration-200">&rarr;</span>
          </a>
        </div>

        {/* ── DESKTOP layout ── */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 flex-col items-center text-center px-8 pt-[180px]">
          <p
            className="text-[11px] uppercase tracking-[0.18em] text-amber-400/60 mb-5"
            style={{ animation: 'hero-fade-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}
          >
            On-Premise AI · Industrial Safety
          </p>

          {/* h1 — LCP element: minimal delay so it renders in first frame */}
          <h1 className="font-display font-bold leading-[1.05] tracking-[-0.04em] text-white
                         text-[clamp(32px,5.5vw,80px)] max-w-[80vw] lg:max-w-[70vw]">
            <span className="block" style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0s both' }}>
              Your cameras see everything.
            </span>
            <span className="block text-white/60" style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both' }}>
              Now they <em>understand</em> it.
            </span>
          </h1>
        </div>

        {/* Subtext + CTA — bottom center (desktop) */}
        <div className="hidden md:flex absolute bottom-14 left-0 right-0 flex-col items-center text-center px-8">
          <p
            className="max-w-[min(520px,80vw)] text-[15px] md:text-[17px] leading-[1.7] text-white/45 font-normal"
            style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both' }}
          >
            Kenesis turns your CCTV into a real-time safety system - PPE violations,
            zone breaches and hazard detection, all on your hardware.
          </p>

          <a
            href="/contact"
            className="mt-6 inline-flex items-center gap-2
                       min-h-[44px] px-6
                       border border-white/15 rounded-full
                       text-[12px] uppercase tracking-[0.14em] font-medium
                       text-white/60 hover:text-white hover:border-amber-400/40
                       transition-all duration-300 group"
            style={{ animation: 'hero-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) 0.45s both' }}
          >
            <span>Book a walkthrough</span>
            <span className="text-white/30 group-hover:text-amber-400/70 group-hover:translate-x-0.5 transition-all duration-200">&rarr;</span>
          </a>
        </div>

      </div>

      {/* CSS keyframe — defined once, no JS required */}
      <style>{`
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }
      `}</style>
    </section>
  );
}
