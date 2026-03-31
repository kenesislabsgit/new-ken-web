'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { SpectraNoise } from '@/components/magicui/spectra-noise';
import { TextVideoMask } from '@/components/magicui/text-video-mask';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { BlurFade } from '@/components/magicui/blur-fade';
import { AsciiBlock, ASCII_ARTS } from '@/components/AsciiArt';
import { AsciiImage } from '@/components/magicui/ascii-image';
import { AmbientGlow } from '@/components/magicui/ambient-glow';

gsap.registerPlugin(ScrollTrigger);

const SECTION_HEIGHT = 1500;

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

const parallaxImages = [
  { src: '/hero/factory-control.png', alt: 'Factory control room', start: -200, end: 200, className: 'w-1/3' },
  { src: '/hero/cctv-closeup.png', alt: 'Industrial CCTV camera', start: 200, end: -250, className: 'mx-auto w-2/3' },
  { src: '/hero/warehouse-wide.png', alt: 'Industrial warehouse', start: -200, end: 200, className: 'ml-auto w-1/3' },
  { src: '/hero/pcb-assembly.png', alt: 'PCB assembly line', start: 0, end: -500, className: 'ml-[6rem] w-5/12' },
];

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
  return (
    <div ref={imgRef} className={`rounded-xl overflow-hidden ${className}`}>
      <AsciiImage
        src={src}
        alt={alt}
        cellWidth={4}
        cellHeight={6}
        contrastExponent={1.6}
        colorMode="tinted"
        color="#c9a04e"
        bgColor="#0a0a0b"
        bgBlur={0}
        bgOpacity={0}
        className="w-full h-full"
      />
    </div>
  );
}
function CenterImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) { el.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'; }
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
    const opacityTrigger = ScrollTrigger.create({
      start: `${SECTION_HEIGHT}px top`, end: `${SECTION_HEIGHT + 500}px top`, scrub: true,
      onUpdate(self) { el.style.opacity = `${1 - self.progress}`; },
    });
    return () => { clipTrigger.kill(); opacityTrigger.kill(); };
  }, []);
  return (
    <div ref={containerRef} className="sticky top-0 h-screen w-full"
      style={{ clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)' }}>
      <AsciiImage src="/images/hero/1.png" alt="Kenesis industrial AI"
        cellWidth={6} cellHeight={10} contrastExponent={1.6}
        colorMode="tinted" color="#f59e0b" bgColor="#0a0a0b"
        bgBlur={8} bgOpacity={0.3} className="w-full h-full" />
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const headingOverlayRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return;
    const trigger = ScrollTrigger.create({
      trigger: intro, start: 'top top', end: 'bottom top', scrub: true,
      onUpdate(self) {
        intro.style.opacity = `${1 - self.progress}`;
        intro.style.transform = `translateY(${-self.progress * 80}px)`;
      },
    });
    return () => { trigger.kill(); };
  }, []);

  useEffect(() => {
    const el = headingOverlayRef.current;
    const section = sectionRef.current;
    if (!el || !section || prefersReducedMotion()) return;
    const trigger = ScrollTrigger.create({
      trigger: section, start: 'top top', end: `${SECTION_HEIGHT * 0.4}px top`, scrub: true,
      onUpdate(self) {
        el.style.opacity = `${1 - self.progress}`;
        el.style.transform = `translateY(${-self.progress * 60}px)`;
      },
    });
    return () => { trigger.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full">
      {/* SpectraNoise fixed background */}
      {mounted && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SpectraNoise hueShift={-30} noiseIntensity={0.05} scanlineIntensity={0.12}
            scanlineFrequency={0.006} warpAmount={1.5} speed={0.4} resolutionScale={0.75}
            primaryColor={[0.04, 0.04, 0.02]} secondaryColor={[0.45, 0.38, 0.0]}
            accentColor={[0.98, 0.80, 0.08]} colorIntensity={0.9}
            mouseRadius={0} mouseStrength={0}
            className="w-full h-full opacity-40" />
        </div>
      )}

      {/* Intro screen */}
      <div ref={introRef} className="relative z-[2] h-screen w-full">
        {/* KENESIS logo centered in viewport with ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full" style={{ maxWidth: '1200px', padding: '0 24px' }}>
            {/* Hidden video source for ambient glow sampling */}
            <video
              ref={ambientVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute opacity-0 w-0 h-0"
              src="/videos/kenesis-text-fill.mp4"
            />
            {/* Canvas-based ambient glow (YouTube-style) */}
            <AmbientGlow
              videoRef={ambientVideoRef}
              blur={60}
              opacity={0.25}
              interval={300}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
              style={{ width: '110%', height: '200%' }}
            />
            {/* Text mask with video */}
            <div className="relative z-[1]">
              <TextVideoMask
                text="KENESIS"
                fontSize="clamp(60px, 11vw, 150px)"
                fontWeight={400}
                fontFamily="var(--font-neowave), sans-serif"
                mode="clip"
                videoSrc="/videos/kenesis-text-fill.mp4"
                className="w-full"
                style={{ height: 'clamp(100px, 20vw, 220px)' }}
              />
            </div>
          </div>
        </div>
        {/* Heading text — bottom left */}
        <div className="absolute bottom-[6rem] left-0 px-6 md:px-12 lg:px-[5rem] w-full">
          <h1 className="font-display text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-amber-200/90 max-w-[90vw]">
            <BlurRevealText text="Built to detect." baseDelay={0.3} />
            <br />
            <BlurRevealText text="Born to protect." baseDelay={0.85} />
          </h1>
          <BlurFade delay={1.5} duration={0.7} blur="8px" offset={16}>
            <p className="mt-[2rem] max-w-[48rem] text-[1.5rem] leading-[1.6] text-amber-100/40 md:text-[1.7rem]">
              Kenesis deploys on-premise AI video analytics for Indian factories.
              Real-time safety intelligence &mdash; no cloud, no data leaving your network.
            </p>
          </BlurFade>

        </div>
      </div>

      {/* Hero scroll area */}
      <div ref={scrollSectionRef} style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
        className="relative z-[1] w-full">
        <CenterImage />
        <div ref={headingOverlayRef}
          className="fixed top-0 left-0 w-full h-screen z-[3] flex flex-col justify-end pointer-events-none pb-[8rem] px-6 md:px-12 lg:px-[5rem]">
        </div>
        <div className="mx-auto max-w-[80rem] px-[1.6rem] pt-[20rem]">
          {parallaxImages.map((img, i) => (
            <ParallaxImg key={i} {...img} />
          ))}
        </div>
        <div className="absolute top-[30%] right-[8%] z-[1] hidden lg:block">
          <AsciiBlock art={ASCII_ARTS.camera} className="text-[0.55rem]" color="text-amber-400/10" />
        </div>
        <div className="absolute top-[55%] left-[5%] z-[1] hidden lg:block">
          <AsciiBlock art={ASCII_ARTS.shield} className="text-[0.55rem]" color="text-amber-400/8" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[38.4rem] bg-gradient-to-b from-dark/0 to-dark z-[5]" />
      </div>

      <ProgressiveBlur position="top" height="80px" />
    </section>
  );
}