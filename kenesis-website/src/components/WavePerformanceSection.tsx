'use client';

import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { BlurFade } from '@/components/magicui/blur-fade';
import ColorfulWave from './ColorfulWave';

const FUNNEL = [
  { val: '10,000', unit: 'frames' },
  { val: '100', unit: 'detections' },
  { val: '5', unit: 'anomalies' },
  { val: '1', unit: 'call' },
];

export default function WavePerformanceSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0a0b]"
      style={{ height: '100vh', minHeight: '50rem' }}
    >
      {/* Curved amber wave — boosted brightness */}
      <div className="absolute inset-0" style={{ filter: 'brightness(1.4) saturate(1.2)' }}>
        <ColorfulWave
          className="absolute inset-0 h-full w-full"
          bgColor="#000000"
        />
      </div>

      {/* Content — top right where it's dark */}
      <div className="relative z-10 flex h-full items-start justify-end pointer-events-none">
        <div className="mt-[10vh] sm:mt-[12vh] mr-[4vw] sm:mr-[6vw] md:mr-[8vw] max-w-[600px] text-right pointer-events-auto px-6">
          {/* Label */}
          <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-60px">
            <p className="font-mono-accent text-[12px] uppercase tracking-[0.22em] text-amber-400/50 mb-[24px] md:mb-[32px]">How it works</p>
          </BlurFade>

          {/* Heading */}
          <TextReveal variant="word-slide" as="h2" start="top 90%" duration={0.9} stagger={0.08} className="font-display text-[clamp(32px,6vw,72px)] font-semibold tracking-[-0.04em] text-white mb-[20px] md:mb-[32px] leading-[1.05]">
            The Processing Pipeline
          </TextReveal>

          {/* Description */}
          <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
            <p className="text-[14px] sm:text-[18px] leading-[1.7] text-white/35 mb-[32px] md:mb-[40px]">
              A three-stage pipeline that transforms raw camera feeds into actionable safety intelligence.
            </p>
          </BlurFade>

          {/* Funnel numbers */}
          <BlurFade delay={0} duration={0.5} blur="4px" offset={8} inView inViewMargin="-60px">
            <div className="flex flex-wrap items-start justify-end gap-[14px] sm:gap-[20px] md:gap-[32px]">
              {FUNNEL.map((item, i, arr) => (
                <div key={i} className="flex items-center gap-[14px] sm:gap-[20px] md:gap-[32px]">
                  <div className="flex flex-col items-center gap-[6px]">
                    <span className="font-display text-[clamp(22px,3.5vw,42px)] font-bold text-white/80">{item.val}</span>
                    <span className="font-mono-accent text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-white/25">{item.unit}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-amber-400/30 text-[16px] sm:text-[20px]">&rarr;</span>}
                </div>
              ))}
            </div>
          </BlurFade>

          {/* Learn more button */}
          <ScrollReveal variant="scale-up" delay={0.3}>
            <a
              href="/platform"
              className="mt-[32px] md:mt-[40px] inline-flex items-center justify-center rounded-[0.8rem] px-[2.4rem] py-[1rem] font-mono-accent text-[1rem] sm:text-[1.15rem] font-medium tracking-[0.06em] uppercase text-white/60 transition-all duration-300 hover:text-white hover:bg-white/[0.14] cursor-pointer"
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
