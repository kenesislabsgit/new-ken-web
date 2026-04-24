'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { TextVideoMask } from '@/components/magicui/text-video-mask';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { BlurFade } from '@/components/magicui/blur-fade';
import { DitheredWaves } from '@/components/magicui/dithered-waves';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
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
      {/* Cinematic video background — seamless loop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.webm" type="video/webm" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Bottom gradient fade to surface color */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/90 to-transparent" />
        {/* Subtle amber tint overlay */}
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay" />
      </div>

      {/* Intro screen */}
      <div ref={introRef} className="relative z-[2] h-screen w-full will-change-[opacity,transform]">
        {/* KENESIS logo centered in viewport */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full overflow-hidden" style={{ maxWidth: '100%', padding: '0 12px' }}>
            {/* Glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[200%] rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)' }} />
            </div>
            <div className="relative z-[1] pointer-events-auto">
              <TextVideoMask
                text="KENESIS"
                fontSize="clamp(44px, 14vw, 240px)"
                fontWeight={400}
                fontFamily="'MBF Neo Wave', var(--font-neowave), sans-serif"
                mode="clip"
                className="w-full overflow-hidden"
                style={{ height: 'clamp(65px, 22vw, 320px)' }}
              >
                {mounted ? (
                  <DitheredWaves
                    color="#f59e0b"
                    cellSize={isMobile ? 7 : 8}
                    speed={0.8}
                    layers={isMobile ? 2 : 3}
                    amplitude={50}
                    frequency={0.025}
                    enableMouse={true}
                    mouseRadius={isMobile ? 120 : 250}
                    charset=" .:=+*#%@█"
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
          <h1 className="font-display text-[clamp(32px,7vw,80px)] font-bold leading-[1.02] tracking-[-0.04em] text-white max-w-[90vw]">
            <BlurFade delay={0.3} duration={0.7} blur="12px" offset={20}>
              <span className="block">Industrial AI.</span>
            </BlurFade>
            <BlurFade delay={0.6} duration={0.7} blur="12px" offset={20}>
              <span className="block">On your terms.</span>
            </BlurFade>
          </h1>
          <BlurFade delay={1.5} duration={0.7} blur="8px" offset={16}>
            <p className="mt-[12px] sm:mt-[16px] md:mt-[24px] max-w-[44rem] text-[16px] sm:text-[17px] md:text-[20px] leading-[1.65] text-white/50 font-normal lg:text-[22px]">
              AI-powered safety monitoring that runs entirely on your premises. No cloud dependency, no data leaving your facility, no compromises.
            </p>
          </BlurFade>
          <BlurFade delay={1.8} duration={0.5} blur="6px" offset={10}>
            <a href="/contact" className="btn-kenesis mt-5 sm:mt-8 inline-flex font-mono-accent text-[11px] sm:text-[13px] uppercase tracking-[0.1em] !py-[10px] !px-[20px] sm:!py-[14px] sm:!px-[32px]">
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
