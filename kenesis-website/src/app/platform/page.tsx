'use client';

import { Button } from '@heroui/react';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import DashboardPreview from '@/components/DashboardPreview';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { UnblurTextReveal } from '@/components/magicui/unblur-text-reveal';
import { AsciiDivider } from '@/components/AsciiArt';
import { TypewriterText } from '@/components/magicui/typewriter-text';
import { DitheredWaves } from '@/components/magicui/dithered-waves';
import SequentialHighlight from '@/components/SequentialHighlight';

const SPECS: Record<string, { label: string; value: string; unit?: string; highlight: boolean }[]> = {
  performance: [
    { label: 'Response Time', value: '<100ms', highlight: true },
    { label: 'Camera Streams', value: '64', unit: 'concurrent', highlight: false },
    { label: 'Alert Latency', value: '<3s', highlight: false },
    { label: 'Deployment', value: '48hrs', highlight: false },
  ],
  architecture: [
    { label: 'Processing', value: 'On-premise', highlight: true },
    { label: 'Cloud Dependency', value: 'None', highlight: true },
    { label: 'Internet Required', value: 'No', highlight: false },
    { label: 'Uptime', value: '99.9%', highlight: false },
  ],
  compatibility: [
    { label: 'Cameras', value: 'Any IP camera', highlight: false },
    { label: 'Storage', value: 'Local + AES-256', highlight: false },
    { label: 'Compliance', value: 'DPDP Act', highlight: true },
    { label: 'False Positive Rate', value: '<2%', highlight: false },
  ],
};

export default function PlatformPage() {
  return (
    <PageShell>
      {/* DitheredWaves background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <DitheredWaves color="#f59e0b" cellSize={16} speed={1.2} layers={2} amplitude={35} frequency={0.012} charset=" .:=+#" enableMouse={true} mouseRadius={250} className="h-full w-full" />
      </div>

      {/* Hero */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-4 sm:px-6 pb-24 sm:pb-40 md:px-12">
        <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
          <p className="font-mono-accent text-[14px] uppercase tracking-[0.14em] text-amber-400/50 mb-10">Platform</p>
        </BlurFade>
        <BlurFade delay={0.25} duration={0.8} blur="10px" offset={20}>
          <h1 className="font-display text-[clamp(32px,7.5vw,64px)] font-semibold leading-[0.95] tracking-[-0.03em] text-white mb-6">
            The platform behind intelligent safety.
          </h1>
        </BlurFade>
        <BlurFade delay={0.55} duration={0.6} blur="6px" offset={10}>
          <p className="max-w-xl text-[16px] leading-[1.7] text-white/40 mb-10">
            On-premise AI that{' '}
            <TypewriterText
              texts={['detects PPE violations', 'monitors restricted zones', 'verifies SOPs in real-time', 'reasons about what it sees']}
              className="text-amber-400/60"
              cursorChar="|"
              cursorClassName="text-amber-400/30"
              typingSpeed={55}
              pauseDuration={2200}
            />
          </p>
        </BlurFade>
        <BlurFade delay={0.75} duration={0.4} blur="4px" offset={6}>
          <a href="/contact">
            <Button variant="primary" size="lg" className="font-mono-accent uppercase tracking-[0.1em] text-[15px] rounded-[1.2rem] cursor-pointer">
              Book a walkthrough
            </Button>
          </a>
        </BlurFade>
      </section>

      {/* Dashboard preview */}
      <section className="relative z-[1] py-[96px] px-[24px] md:px-[48px]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <DashboardPreview />
        </BlurFade>
      </section>

      {/* Numbers strip */}
      <section className="relative z-[1] border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-6">
          {[
            { val: 64, suffix: '', label: 'Camera feeds analyzed' },
            { val: 100, suffix: 'ms', label: 'Detection speed' },
            { val: 48, suffix: 'hrs', label: 'Deployment time' },
          ].map((s, i) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-[clamp(28px,5vw,48px)] font-semibold text-white/90 leading-none mb-2">
                <NumberTicker value={s.val} delay={0.2 + i * 0.15} />{s.suffix}
              </p>
              <p className="font-mono-accent text-[13px] uppercase tracking-[0.1em] text-white/25">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-6 py-32 md:px-12">
        <AsciiDivider className="mb-12" accent="&#9656;" />
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.035em] text-white/95 mb-3">From camera feed to safety alert</h2>
          <p className="text-[15px] sm:text-[16px] text-white/40 mb-10 max-w-2xl">A streamlined pipeline with no cloud intermediaries. Camera feeds enter, contextual safety alerts emerge — all processed locally.</p>
        </BlurFade>

        {/* Pipeline — premium stepped flow */}
        <div className="relative">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:grid md:grid-cols-4 gap-0 items-start">
            {[
              { num: '01', label: 'Ingest', sub: 'Camera Feeds', desc: 'Connect existing IP cameras. No new hardware.', accent: false },
              { num: '02', label: 'Detect', sub: 'Object Detection', desc: 'PPE, zones, personnel — identified in every frame.', accent: true },
              { num: '03', label: 'Reason', sub: 'Context Analysis', desc: 'AI understands what it sees and why it matters.', accent: true },
              { num: '04', label: 'Alert', sub: 'Dashboard + SMS', desc: 'Actionable alerts reach your team in seconds.', accent: false },
            ].map((node, i, arr) => (
              <ScrollReveal key={node.label} variant="scale-up" delay={i * 0.12} duration={0.5}>
                <div className="relative flex flex-col items-center text-center px-3">
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${node.accent ? 'bg-amber-400/10 border border-amber-400/25' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
                    <span className={`font-mono-accent text-[11px] font-bold ${node.accent ? 'text-amber-400/80' : 'text-white/30'}`}>{node.num}</span>
                  </div>
                  {/* Connector line */}
                  {i < arr.length - 1 && (
                    <div className="absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[1px]" style={{ background: node.accent ? 'linear-gradient(90deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))' : 'rgba(255,255,255,0.06)' }} />
                  )}
                  {/* Content */}
                  <p className={`font-display text-[17px] font-semibold mb-1 tracking-[-0.02em] ${node.accent ? 'text-white/95' : 'text-white/60'}`}>{node.label}</p>
                  <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-amber-400/40 mb-3">{node.sub}</p>
                  <p className="text-[13px] leading-[1.5] text-white/30">{node.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile: vertical flow */}
          <div className="md:hidden flex flex-col gap-0">
            {[
              { num: '01', label: 'Ingest', sub: 'Camera Feeds', desc: 'Connect existing IP cameras. No new hardware.', accent: false },
              { num: '02', label: 'Detect', sub: 'Object Detection', desc: 'PPE, zones, personnel — identified in every frame.', accent: true },
              { num: '03', label: 'Reason', sub: 'Context Analysis', desc: 'AI understands what it sees and why it matters.', accent: true },
              { num: '04', label: 'Alert', sub: 'Dashboard + SMS', desc: 'Actionable alerts reach your team in seconds.', accent: false },
            ].map((node, i, arr) => (
              <ScrollReveal key={node.label} variant="fade-up" delay={i * 0.1} duration={0.4}>
                <div className="flex items-start gap-4 py-5">
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${node.accent ? 'bg-amber-400/10 border border-amber-400/25' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
                      <span className={`font-mono-accent text-[10px] font-bold ${node.accent ? 'text-amber-400/80' : 'text-white/30'}`}>{node.num}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-[1px] h-8 mt-2" style={{ background: node.accent ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)' }} />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className="pt-1">
                    <p className={`font-display text-[16px] font-semibold tracking-[-0.02em] ${node.accent ? 'text-white/95' : 'text-white/60'}`}>{node.label}</p>
                    <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-amber-400/40 mb-1">{node.sub}</p>
                    <p className="text-[14px] leading-[1.55] text-white/35">{node.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="relative z-[2] py-[80px] sm:py-[120px] md:py-[160px] px-[16px] sm:px-[24px] md:px-[48px] bg-[#0a0a0b]">
        <div className="mx-auto max-w-[1100px]">
          <UnblurTextReveal as="h2" blurAmount={16} scaleFrom={0.93} scrub={1} start="top 85%" end="top 55%" splitBy="word" stagger={0.05} className="font-display text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.035em] text-white/95 mb-6">
            Technical specifications
          </UnblurTextReveal>
          <BlurFade delay={0} duration={0.5} blur="6px" offset={8} inView inViewMargin="-60px">
            <p className="text-[15px] sm:text-[16px] text-white/35 mb-12 sm:mb-16 max-w-xl">Numbers that matter to your engineering and procurement teams.</p>
          </BlurFade>

          <div className="space-y-10 sm:space-y-14">
            {Object.entries(SPECS).map(([category, items], ci) => (
              <div key={category}>
                <ScrollReveal variant="fade-up" delay={ci * 0.1} duration={0.4}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="h-[1px] w-5 bg-amber-400/30" />
                    <span className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-amber-400/50">{category}</span>
                  </div>
                </ScrollReveal>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {items.map((spec, i) => (
                    <ScrollReveal key={spec.label} variant="scale-up" delay={ci * 0.08 + i * 0.04} duration={0.4}>
                      <div className={`group rounded-[14px] p-5 sm:p-6 transition-all duration-300 cursor-default ${spec.highlight ? 'bg-amber-400/[0.04] border border-amber-400/10 hover:border-amber-400/25' : 'bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12]'}`}>
                        <p className="font-mono-accent text-[10px] uppercase tracking-[0.16em] text-white/25 mb-3">{spec.label}</p>
                        <div className="flex items-baseline gap-1">
                          <p className={`font-display text-[20px] sm:text-[22px] font-bold tracking-[-0.02em] ${spec.highlight ? 'text-amber-400/90' : 'text-white/80'}`}>{spec.value}</p>
                          {spec.unit && <span className="font-mono-accent text-[10px] text-white/20">{spec.unit}</span>}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why on-premise — sequential pinned reveal */}
      <SequentialHighlight
        heading="Why on-premise matters"
        paragraphs={[
          "Cloud processing means your factory footage travels to data centers you don't control, processed by models you can't audit. Under India's DPDP Act, that creates significant compliance liability.",
          "Cloud means latency. A safety violation detected three seconds late is a safety violation missed. Our on-premise processing delivers alerts to your safety team before a cloud solution would finish uploading the frame.",
          "Cloud means dependency. When your internet connection drops — a common reality in Indian industrial zones — your entire safety system goes offline. Kenesis continues operating because it was never dependent on connectivity.",
        ]}
      />

      {/* CTA */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-6 py-24 md:px-12 border-t border-white/[0.06]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
          <p className="font-display text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.02em] text-white/90 mb-6">
            See it in action on your factory floor.
          </p>
          <a href="/contact">
            <Button variant="primary" size="lg" className="font-mono-accent uppercase tracking-[0.1em] text-[15px] rounded-[1.2rem] cursor-pointer">
              Book a walkthrough
            </Button>
          </a>
        </BlurFade>
      </section>
    </PageShell>
  );
}

