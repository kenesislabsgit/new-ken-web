'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { SpectraNoise } from '@/components/magicui/spectra-noise';
import { TextVideoMask } from '@/components/magicui/text-video-mask';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { BlurFade } from '@/components/magicui/blur-fade';
import { DitheredWaves } from '@/components/magicui/dithered-waves';

gsap.registerPlugin(ScrollTrigger);

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

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [shaderReady, setShaderReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const t = setTimeout(() => setShaderReady(true), 800);
    return () => clearTimeout(t);
  }, []);

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

  return (
    <section ref={sectionRef} className="relative w-full">
      {/* SpectraNoise fixed background — delayed to avoid competing with initial animations */}
      {shaderReady && (
        <div className="fixed inset-0 z-0 pointer-events-none will-change-transform">
          <SpectraNoise hueShift={-30} noiseIntensity={0.05} scanlineIntensity={0.12}
            scanlineFrequency={0.006} warpAmount={1.5} speed={0.4} resolutionScale={0.35}
            primaryColor={[0.04, 0.04, 0.02]} secondaryColor={[0.45, 0.38, 0.0]}
            accentColor={[0.98, 0.80, 0.08]} colorIntensity={0.9}
            mouseRadius={0} mouseStrength={0}
            className="w-full h-full opacity-40" />
        </div>
      )}

      {/* Intro screen */}
      <div ref={introRef} className="relative z-[2] h-screen w-full will-change-[opacity,transform]">
        {/* KENESIS logo centered in viewport */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full overflow-hidden" style={{ maxWidth: '100%', padding: '0 12px' }}>
            {/* Text mask with dithered waves */}
            <div className="relative z-[1] pointer-events-auto">
              <TextVideoMask
                text="KENESIS"
                fontSize="clamp(36px, 12vw, 240px)"
                fontWeight={400}
                fontFamily="'MBF Neo Wave', var(--font-neowave), sans-serif"
                mode="clip"
                className="w-full overflow-hidden"
                style={{ height: 'clamp(55px, 18vw, 320px)' }}
              >
                {mounted ? (
                  <DitheredWaves
                    color="#f59e0b"
                    cellSize={isMobile ? 5 : 8}
                    speed={0.8}
                    layers={isMobile ? 2 : 3}
                    amplitude={50}
                    frequency={0.025}
                    enableMouse={true}
                    mouseRadius={isMobile ? 120 : 250}
                    charset=" .:-=+*#%@█"
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-[#0a0a0b]" />
                )}
              </TextVideoMask>
            </div>
          </div>
        </div>
        {/* Heading text - bottom left */}
        <div className="absolute bottom-[3rem] sm:bottom-[4rem] md:bottom-[6rem] left-0 px-4 sm:px-6 md:px-12 lg:px-[5rem] w-full">
          <h1 className="font-display text-[clamp(28px,6vw,72px)] font-medium leading-[1.02] tracking-[-0.04em] text-white/95 max-w-[90vw]">
            <BlurFade delay={0.3} duration={0.7} blur="12px" offset={20}>
              <span className="block">Industrial AI.</span>
            </BlurFade>
            <BlurFade delay={0.6} duration={0.7} blur="12px" offset={20}>
              <span className="block">On your terms.</span>
            </BlurFade>
          </h1>
          <BlurFade delay={1.5} duration={0.7} blur="8px" offset={16}>
            <p className="mt-[12px] sm:mt-[16px] md:mt-[24px] max-w-[44rem] text-[16px] sm:text-[17px] md:text-[20px] leading-[1.65] text-white/40 font-normal lg:text-[22px]">
              AI-powered safety monitoring that runs entirely on your premises. No cloud dependency, no data leaving your facility, no compromises.
            </p>
          </BlurFade>
          <BlurFade delay={1.8} duration={0.5} blur="6px" offset={10}>
            <a href="/contact" className="btn-kenesis mt-6 sm:mt-8 inline-flex font-mono-accent text-[13px] sm:text-[14px] uppercase tracking-[0.1em]">
              Book a walkthrough
            </a>
          </BlurFade>
        </div>

        {/* Scroll indicator */}
        <BlurFade delay={2.2} duration={0.6} blur="4px" offset={8}>
          <div className="absolute bottom-[2rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[0.6rem] animate-pulse">
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-white/20">
              <path d="M8 4V20M8 20L2 14M8 20L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </BlurFade>
      </div>

      <ProgressiveBlur position="top" height="80px" />
    </section>
  );
}
