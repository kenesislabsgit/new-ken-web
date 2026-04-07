'use client';

import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { BlurFade } from '@/components/magicui/blur-fade';
import ColorfulWave from './ColorfulWave';

const FUNNEL = [
  { val: '10,000', unit: 'frames' },
  { val: '100', unit: 'detections' },
  { val: '5', unit: 'anomalies' },
  { val: '1', unit: 'alert' },
];

export default function WavePerformanceSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0a0b]"
      style={{ height: '100vh', minHeight: '50rem' }}
    >
      {/* Wave — boosted */}
      <div className="absolute inset-0" style={{ filter: 'brightness(1.5) saturate(1.3)' }}>
        <ColorfulWave className="absolute inset-0 h-full w-full" bgColor="#000000" />
      </div>

      {/* Gradient overlay — darkens left side for text readability */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(105deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 70%)' }} />

      {/* Content — left aligned, vertically centered */}
      <div className="relative z-[2] flex h-full items-center">
        <div className="w-full max-w-[72rem] mx-auto px-6 sm:px-10 md:px-16">
          <div className="max-w-[540px]">
            {/* Label */}
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-60px">
              <div className="flex items-center gap-3 mb-8">
                <span className="h-[1px] w-8 bg-amber-400/40" />
                <span className="font-mono-accent text-[11px] uppercase tracking-[0.22em] text-amber-400/50">How it works</span>
              </div>
            </BlurFade>

            {/* Heading */}
            <TextReveal variant="word-slide" as="h2" start="top 90%" duration={0.9} stagger={0.08} className="font-display text-[clamp(2.8rem,5.5vw,5rem)] font-semibold tracking-[-0.035em] text-white leading-[1.05] mb-6">
              The Intelligence Funnel
            </TextReveal>

            {/* Description */}
            <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
              <p className="text-[1rem] sm:text-[1.15rem] leading-[1.75] text-white/35 mb-10 max-w-[440px]">
                Every frame passes through three stages of refinement. Noise collapses into signal. When your phone rings, it means something.
              </p>
            </BlurFade>

            {/* Funnel — horizontal strip */}
            <BlurFade delay={0} duration={0.5} blur="4px" offset={8} inView inViewMargin="-60px">
              <div className="flex items-center gap-3 sm:gap-5 mb-10 overflow-x-auto scrollbar-hide">
                {FUNNEL.map((item, i, arr) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-5 shrink-0">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold text-white/85 tabular-nums">{item.val}</span>
                      <span className="font-mono-accent text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-white/20 mt-1">{item.unit}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-amber-400/30 shrink-0">
                        <path d="M0 6h16m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </BlurFade>

            {/* CTA */}
            <ScrollReveal variant="scale-up" delay={0.3}>
              <a
                href="/platform"
                className="group inline-flex items-center gap-3 font-mono-accent text-[0.95rem] sm:text-[1.05rem] font-medium tracking-[0.06em] uppercase text-white/50 transition-all duration-300 hover:text-white cursor-pointer"
              >
                <span>Explore the platform</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
