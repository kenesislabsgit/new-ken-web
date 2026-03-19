'use client';

import dynamic from 'next/dynamic';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const ColorfulWave = dynamic(() => import('./ColorfulWave'), { ssr: false });

export default function WavePerformanceSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0a0b]"
      style={{ height: '100vh', minHeight: '60rem' }}
    >
      {/* Curved amber wave */}
      <ColorfulWave
        className="absolute inset-0 h-full w-full"
        bgColor="#000000"
      />

      {/* Content — right-aligned, vertically centered */}
      <div className="relative z-10 flex h-full items-center pointer-events-none">
        <div className="ml-auto w-[52%] max-w-[60rem] pr-[5rem] lg:pr-[7rem] xl:pr-[9rem] pointer-events-auto">
          {/* Label */}
          <ScrollReveal variant="fade-right" delay={0}>
            <span
              className="mb-[2rem] inline-flex items-center gap-[0.6rem] font-mono-accent text-[1.05rem] tracking-[0.14em] uppercase text-white/30"
            >
              <span className="inline-block h-[0.35rem] w-[0.35rem] rounded-full bg-amber-400/80" />
              Our Performance
            </span>
          </ScrollReveal>

          {/* Continuous text block — heading flows into description */}
          <div className="mb-[3.2rem]">
            {/* Heading — words slide up */}
            <TextReveal
              variant="word-slide"
              as="p"
              className="font-display text-[3.6rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white/90 lg:text-[4.4rem] xl:text-[4.8rem]"
            >
              30 Cameras. 35 Watts.
            </TextReveal>

            {/* Description — words fade on scroll */}
            <TextReveal
              variant="word-fade"
              as="p"
              scrub={0.5}
              className="mt-[1.2rem] font-mono-accent text-[1.4rem] font-normal leading-[1.7] tracking-[0.02em] text-white/35 lg:text-[1.5rem]"
            >
              A Mac Mini M4 Pro handles 30 camera feeds simultaneously. No GPU farm. No cloud bill. No vendor lock-in.
            </TextReveal>
          </div>

          {/* Frosted glass button */}
          <ScrollReveal variant="scale-up" delay={0.3}>
            <a
              href="#technology"
              className="inline-flex items-center justify-center rounded-[0.8rem] px-[2.4rem] py-[1rem] font-mono-accent text-[1.15rem] font-medium tracking-[0.06em] uppercase text-white/60 transition-all duration-300 hover:text-white hover:bg-white/[0.14]"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              Learn more
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
