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

const SPECS = [
  ['Response Time', '<100ms'],
  ['Camera Streams', 'Up to 64'],
  ['Processing', 'On-premise'],
  ['Power', '35W'],
  ['Storage', 'Local + encrypted'],
  ['Deployment', '48 hours'],
  ['Alert Latency', '<3 seconds'],
  ['Cameras', 'Any IP camera'],
  ['Compliance', 'Indian sovereignty'],
  ['Cost Savings', '97% fewer API calls'],
  ['False Positives', 'Near-zero'],
  ['Uptime', 'Always-on'],
];

export default function PlatformPage() {
  return (
    <PageShell>
      {/* DitheredWaves background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <DitheredWaves color="#f59e0b" cellSize={16} speed={1.2} layers={2} amplitude={35} frequency={0.012} charset=" .:=+#" enableMouse={true} mouseRadius={250} className="h-full w-full" />
      </div>

      {/* Hero */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-4 sm:px-6 pb-24 sm:pb-40 md:px-12">
        <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
          <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/50 mb-10">Platform</p>
        </BlurFade>
        <BlurFade delay={0.25} duration={0.8} blur="10px" offset={20}>
          <h1 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white mb-6">
            The platform behind intelligent safety.
          </h1>
        </BlurFade>
        <BlurFade delay={0.55} duration={0.6} blur="6px" offset={10}>
          <p className="max-w-xl text-[1.25rem] leading-[1.7] text-white/40 mb-10">
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
            <Button variant="primary" size="lg" className="font-mono-accent uppercase tracking-[0.1em] text-[1.05rem] rounded-[1.2rem] cursor-pointer">
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
        <div className="mx-auto max-w-[80rem] px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-6">
          {[
            { val: 30, suffix: '', label: 'Camera feeds per device' },
            { val: 35, suffix: 'W', label: 'Total power draw' },
            { val: 0, suffix: 'ms', label: 'Cloud latency', sub: '<1s on-prem' },
          ].map((s, i) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold text-white/90 leading-none mb-2">
                {s.val > 0 ? (
                  <><NumberTicker value={s.val} delay={0.2 + i * 0.15} />{s.suffix}</>
                ) : (
                  <span className="text-white/25 line-through">&infin;{s.suffix}</span>
                )}
              </p>
              {s.sub && <p className="font-mono-accent text-[0.85rem] text-amber-400/50 mb-1">{s.sub}</p>}
              <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12">
        <AsciiDivider className="mb-12" accent="&#9656;" />
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-4">From camera feed to safety alert</h2>
          <p className="text-[1.1rem] text-white/30 mb-4 max-w-2xl">A streamlined pipeline with no cloud intermediaries. Camera feeds enter, contextual safety alerts emerge — all processed locally.</p>
        </BlurFade>
        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
          {[
            { label: 'Camera Feeds', sub: 'Existing cameras', accent: false },
            { label: 'Detection', sub: 'Object detection', accent: true },
            { label: 'Reasoning', sub: 'Context analysis', accent: true },
            { label: 'Alerts', sub: 'Dashboard + SMS', accent: false },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center flex-1">
              <ScrollReveal variant="scale-up" delay={i * 0.12} duration={0.5}>
                <div className={`relative flex-1 rounded-xl p-4 sm:p-6 text-center ${node.accent ? 'bg-amber-400/[0.06] border border-amber-400/15' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                  {node.accent && <BorderBeam size={120} duration={8} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1} />}
                  <p className={`font-display text-[1.3rem] font-semibold mb-1 ${node.accent ? 'text-white/90' : 'text-white/60'}`}>{node.label}</p>
                  <p className="font-mono-accent text-[0.85rem] text-white/30">{node.sub}</p>
                </div>
              </ScrollReveal>
              {i < arr.length - 1 && (
                <ScrollReveal variant="clip-left" delay={0.15 + i * 0.12} duration={0.4}>
                  <div className="hidden md:block w-8 h-[1px] bg-white/10 flex-shrink-0" />
                </ScrollReveal>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="relative z-[2] py-[80px] sm:py-[120px] md:py-[160px] px-[16px] sm:px-[24px] md:px-[48px] bg-[#0a0a0b]">
        <div className="mx-auto max-w-[1100px]">
          <UnblurTextReveal as="h2" blurAmount={16} scaleFrom={0.93} scrub={1} start="top 85%" end="top 55%" splitBy="word" stagger={0.05} className="font-display text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.025em] text-white/90 mb-[64px]">
            Technical specifications
          </UnblurTextReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
            {SPECS.map(([label, value], i) => (
              <ScrollReveal key={label} variant="scale-up" delay={i * 0.03} duration={0.4}>
                <div className="group rounded-[12px] border border-white/[0.04] bg-white/[0.015] p-[24px] hover:border-amber-400/15 hover:bg-white/[0.035] transition-all duration-300 cursor-pointer">
                  <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-white/20 group-hover:text-amber-400/40 transition-colors mb-[12px]">{label}</p>
                  <p className="font-display text-[18px] font-semibold text-white/75 group-hover:text-white transition-colors">{value}</p>
                </div>
              </ScrollReveal>
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
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/[0.06]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
          <p className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-6">
            See it in action on your factory floor.
          </p>
          <a href="/contact">
            <Button variant="primary" size="lg" className="font-mono-accent uppercase tracking-[0.1em] text-[1.05rem] rounded-[1.2rem] cursor-pointer">
              Request a demo
            </Button>
          </a>
        </BlurFade>
      </section>
    </PageShell>
  );
}
