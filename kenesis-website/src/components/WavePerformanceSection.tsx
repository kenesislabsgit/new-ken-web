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
      {/* Curved amber wave */}
      <ColorfulWave
        className="absolute inset-0 h-full w-full"
        bgColor="#000000"
      />

      {/* Content — centered */}
      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        {/* Dark scrim behind text for contrast */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
        <div className="relative text-center max-w-[900px] px-6 md:px-12 pointer-events-auto">
          {/* Label */}
          <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-60px">
            <p className="font-mono-accent text-[12px] uppercase tracking-[0.22em] text-amber-400/50 mb-[40px]">How it works</p>
          </BlurFade>

          {/* Heading */}
          <TextReveal variant="word-slide" as="h2" start="top 90%" duration={0.9} stagger={0.08} className="font-display text-[clamp(36px,9vw,100px)] font-semibold tracking-[-0.04em] text-white mb-[32px] md:mb-[48px] leading-[1.05]">
            The Processing Pipeline
          </TextReveal>

          {/* Description */}
          <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
            <p className="text-[16px] sm:text-[20px] leading-[1.7] text-white/30 max-w-[560px] mx-auto mb-[40px] md:mb-[56px]">
              A three-stage pipeline that transforms raw camera feeds into actionable safety intelligence.
            </p>
          </BlurFade>

          {/* Funnel numbers */}
          <BlurFade delay={0} duration={0.5} blur="4px" offset={8} inView inViewMargin="-60px">
            <div className="flex flex-wrap items-start justify-center gap-[16px] sm:gap-[24px] md:gap-[40px]">
              {FUNNEL.map((item, i, arr) => (
                <div key={i} className="flex items-center gap-[16px] sm:gap-[24px] md:gap-[40px]">
                  <div className="flex flex-col items-center gap-[8px]">
                    <span className="font-display text-[clamp(24px,4vw,48px)] font-bold text-white/75">{item.val}</span>
                    <span className="font-mono-accent text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-white/20">{item.unit}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-amber-400/25 text-[18px] sm:text-[24px]">&rarr;</span>}
                </div>
              ))}
            </div>
          </BlurFade>

          {/* Learn more button */}
          <ScrollReveal variant="scale-up" delay={0.3}>
            <a
              href="/platform"
              className="mt-[40px] md:mt-[56px] inline-flex items-center justify-center rounded-[0.8rem] px-[2.4rem] py-[1rem] font-mono-accent text-[1.05rem] sm:text-[1.15rem] font-medium tracking-[0.06em] uppercase text-white/60 transition-all duration-300 hover:text-white hover:bg-white/[0.14] cursor-pointer"
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
