'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { TextReveal } from '@/components/magicui/text-reveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

const LiquidMetalLogo = dynamic(
  () => import('@/components/magicui/liquid-metal-logo').then(m => ({ default: m.LiquidMetalLogo })),
  { ssr: false }
);

export default function TextInterludeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Scroll-driven decorative line animation
  useEffect(() => {
    const line = lineRef.current;
    const section = sectionRef.current;
    if (!line || !section) return;

    if (prefersReducedMotion()) {
      gsap.set(line, { width: '100%' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { width: '0%' },
        {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex max-w-5xl flex-col items-center bg-[#0a0a0b] px-6 py-32 text-center md:px-12 overflow-hidden"
    >
      {/* Subtle flickering grid */}
      <FlickeringGrid
        className="absolute inset-0 z-0 opacity-15"
        squareSize={2}
        gridGap={10}
        color="rgb(255, 255, 255)"
        maxOpacity={0.06}
        flickerChance={0.1}
      />

      {/* Liquid metal logo — centered background accent */}
      <div className="absolute inset-0 z-[0] flex items-center justify-center pointer-events-none opacity-[0.07]">
        <LiquidMetalLogo
          src="/kenesis-icon.png"
          width={500}
          height={500}
          colorBack="#0a0a0b"
          colorTint="#f59e0b"
          speed={0.3}
          distortion={0.03}
          shiftRed={0.1}
          shiftBlue={0.1}
          softness={0.25}
          contour={0.25}
          angle={45}
          scale={0.8}
        />
      </div>

      <div className="relative z-[1] flex flex-col items-center">
      {/* Decorative line */}
      <div
        ref={lineRef}
        className="mb-10 h-px bg-white/15"
        style={{ width: '0%' }}
      />

      {/* Heading — words sharpen as user scrolls */}
      <TextReveal
        variant="word-blur"
        as="h2"
        scrub={1}
        className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white/90 md:text-5xl"
      >
        Redefining factory safety with edge AI.
      </TextReveal>

      {/* Paragraph — words fade in on scroll */}
      <TextReveal
        variant="word-fade"
        as="p"
        scrub={1}
        className="mt-6 max-w-2xl font-mono-accent text-[14px] leading-relaxed text-white/35 tracking-[0.02em]"
      >
        India&apos;s manufacturing sector is scaling fast under PLI schemes and China+1 tailwinds. Safety compliance requirements are tightening. Cloud-based solutions hit a wall when factories have poor internet, strict data policies, or sensitive footage. Kenesis is built for exactly this gap.
      </TextReveal>
      </div>
    </section>
  );
}
