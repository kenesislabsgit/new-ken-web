'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { Particles } from '@/components/magicui/particles';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { BlurFade } from '@/components/magicui/blur-fade';

gsap.registerPlugin(ScrollTrigger);

const SECTION_HEIGHT = 1500;

/* ── Char-by-char blur-fade reveal ── */
function BlurRevealText({ text, className, baseDelay = 0, stagger = 0.035 }: {
  text: string; className?: string; baseDelay?: number; stagger?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <BlurFade
          key={i}
          delay={baseDelay + i * stagger}
          duration={0.5}
          offset={12}
          direction="up"
          blur="10px"
          className="inline-block"
        >
          <span>{char === ' ' ? '\u00A0' : char}</span>
        </BlurFade>
      ))}
    </span>
  );
}

/* ── Parallax image data ── */
const parallaxImages = [
  { src: 'https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop', alt: 'Industrial AI monitoring', start: -200, end: 200, className: 'w-1/3' },
  { src: 'https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop', alt: 'Visual intelligence system', start: 200, end: -250, className: 'mx-auto w-2/3' },
  { src: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop', alt: 'Safety monitoring', start: -200, end: 200, className: 'ml-auto w-1/3' },
  { src: 'https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop', alt: 'AI detection', start: 0, end: -500, className: 'ml-[6rem] w-5/12' },
];

/* ── ParallaxImg sub-component ── */
function ParallaxImg({ src, alt, start, end, className }: {
  src: string; alt: string; start: number; end: number; className: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.set(el, { y: start });
    const tween = gsap.to(el, {
      y: end, ease: 'none',
      scrollTrigger: { trigger: el, start: `${start}px bottom`, end: `bottom ${-end}px`, scrub: true },
    });
    const fadeTween = gsap.to(el, {
      opacity: 0, scale: 0.85, ease: 'none',
      scrollTrigger: { trigger: el, start: '75% bottom', end: 'bottom top', scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill(); tween.kill();
      fadeTween.scrollTrigger?.kill(); fadeTween.kill();
    };
  }, [start, end]);

  return <img ref={imgRef} src={src} alt={alt} className={`rounded-xl ${className}`} loading="eager" />;
}

/* ── CenterImage sub-component ── */
function CenterImage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) { el.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'; el.style.backgroundSize = '100%'; }
      return;
    }
    const clipTrigger = ScrollTrigger.create({
      start: 'top top', end: `${SECTION_HEIGHT}px top`, scrub: true,
      onUpdate(self) {
        const p = self.progress;
        const c1 = 25 - 25 * p; const c2 = 75 + 25 * p;
        el.style.clipPath = `polygon(${c1}% ${c1}%, ${c2}% ${c1}%, ${c2}% ${c2}%, ${c1}% ${c2}%)`;
      },
    });
    const sizeTrigger = ScrollTrigger.create({
      start: 'top top', end: `${SECTION_HEIGHT + 500}px top`, scrub: true,
      onUpdate(self) { el.style.backgroundSize = `${170 - 70 * self.progress}%`; },
    });
    const opacityTrigger = ScrollTrigger.create({
      start: `${SECTION_HEIGHT}px top`, end: `${SECTION_HEIGHT + 500}px top`, scrub: true,
      onUpdate(self) { el.style.opacity = `${1 - self.progress}`; },
    });
    return () => { clipTrigger.kill(); sizeTrigger.kill(); opacityTrigger.kill(); };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
        backgroundSize: '170%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2831&auto=format&fit=crop)',
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

/* ── Main Hero Section ── */
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const headingOverlayRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  /* Fade out heading overlay as user scrolls */
  useEffect(() => {
    const el = headingOverlayRef.current;
    const section = sectionRef.current;
    if (!el || !section || prefersReducedMotion()) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `${SECTION_HEIGHT * 0.4}px top`,
      scrub: true,
      onUpdate(self) {
        el.style.opacity = `${1 - self.progress}`;
        el.style.transform = `translateY(${-self.progress * 60}px)`;
        if (particlesRef.current) {
          particlesRef.current.style.opacity = `${1 - self.progress}`;
        }
      },
    });
    return () => { trigger.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-dark">
      {/* Hero scroll area — CenterImage + parallax images */}
      <div
        style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
        className="relative w-full"
      >
        <CenterImage />

        {/* Particles floating over the hero */}
        {mounted && (
          <div ref={particlesRef}>
            <Particles
              className="fixed top-0 left-0 w-full h-screen z-[2] pointer-events-none"
              quantity={50}
              color="#f59e0b"
              size={0.3}
              staticity={40}
              ease={60}
            />
          </div>
        )}

        {/* Heading overlay — bottom-left, fades out on scroll */}
        <div
          ref={headingOverlayRef}
          className="fixed top-0 left-0 w-full h-screen z-[3] flex flex-col justify-end pointer-events-none pb-[8rem] px-6 md:px-12 lg:px-[5rem]"
        >
          <h1 className="font-display text-[clamp(4rem,10vw,10rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white max-w-[90vw]">
            <BlurRevealText text="Built to detect." baseDelay={0.3} />
            <br />
            <BlurRevealText text="Born to protect." baseDelay={0.85} />
          </h1>

          <BlurFade delay={1.5} duration={0.7} blur="8px" offset={16}>
            <p className="mt-[2rem] max-w-[48rem] text-[1.5rem] leading-[1.6] text-white/50 md:text-[1.7rem]">
              Kenesis deploys on-premise AI video analytics for Indian factories.
              Real-time safety intelligence — no cloud, no data leaving your network.
            </p>
          </BlurFade>

          <BlurFade delay={1.9} duration={0.6} blur="6px" offset={12}>
            <div className="mt-[3rem] flex items-center gap-4">
              <span className="inline-block h-[0.5rem] w-[0.5rem] rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono-accent text-[1.1rem] uppercase tracking-[0.12em] text-white/35">
                Edge AI · 30 cameras · 35 watts
              </span>
            </div>
          </BlurFade>
        </div>

        {/* Parallax floating images */}
        <div className="mx-auto max-w-[80rem] px-[1.6rem] pt-[20rem]">
          {parallaxImages.map((img, i) => (
            <ParallaxImg key={i} {...img} />
          ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[38.4rem] bg-gradient-to-b from-dark/0 to-dark z-[5]" />
      </div>

      {/* Progressive blur transition at the very bottom of hero */}
      <ProgressiveBlur
        position="top"
        height="12rem"
        blurLevels={[0, 0.5, 1, 2, 4, 8]}
      />
    </section>
  );
}
