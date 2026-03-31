'use client';

import dynamic from 'next/dynamic';
import { Button } from '@heroui/react';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';

import DashboardPreview from '@/components/DashboardPreview';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { UnblurTextReveal } from '@/components/magicui/unblur-text-reveal';
import { AsciiDivider } from '@/components/AsciiArt';

const DitheredWaves = dynamic(
  () => import('@/components/magicui/dithered-waves').then(m => ({ default: m.DitheredWaves })),
  { ssr: false }
);

export default function PlatformPage() {
  return (
    <PageShell>
      {/* DitheredWaves full page background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <DitheredWaves
          color="#f59e0b"
          cellSize={16}
          speed={1.2}
          layers={2}
          amplitude={35}
          frequency={0.012}
          charset=" .:=+#"
          enableMouse={true}
          mouseRadius={250}
          className="h-full w-full"
        />
      </div>

      {/* â”€â”€ Hero: big statement, no fluff â”€â”€ */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 pb-40 md:px-12">
        <div className="relative z-[1]">
          <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
            <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/50 mb-10">Platform</p>
          </BlurFade>
          <BlurFade delay={0.25} duration={0.8} blur="10px" offset={20}>
            <h1 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white mb-6">
              Your cameras already see everything.
            </h1>
          </BlurFade>
          <BlurFade delay={0.55} duration={0.6} blur="6px" offset={10}>
            <p className="max-w-xl text-[1.25rem] leading-[1.7] text-white/40 mb-10">
              We make them understand it. Real-time detection and contextual reasoning, running on a server under your desk. No cloud. No data leaving.
            </p>
          </BlurFade>
          <BlurFade delay={0.75} duration={0.4} blur="4px" offset={6}>
            <a href="/contact">
              <Button variant="primary" size="lg" className="font-mono-accent uppercase tracking-[0.1em] text-[1.05rem] rounded-[1.2rem] cursor-pointer">
                Book a walkthrough
              </Button>
            </a>
          </BlurFade>
        </div>
      </section>

      {/* â”€â”€ Dashboard preview â”€â”€ */}
      <section className="relative z-[1] py-[96px] px-[24px] md:px-[48px]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <DashboardPreview />
        </BlurFade>
      </section>

      {/* â”€â”€ Numbers strip: full-bleed, breaks the content width â”€â”€ */}
      <section className="relative z-[1] border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-[80rem] px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-y-10">
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
                  <span className="text-white/25 line-through">âˆž{s.suffix}</span>
                )}
              </p>
              {s.sub ? (
                <p className="font-mono-accent text-[0.85rem] text-amber-400/50 mb-1">{s.sub}</p>
              ) : null}
              <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ Pipeline: horizontal flow, not numbered cards â”€â”€ */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12">
        <AsciiDivider className="mb-12" accent="â–¸" />
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-4">From camera to alert in one hop</h2>
          <p className="text-[1.1rem] text-white/30 mb-4 max-w-2xl">No staging servers, no cloud queues, no round trips. Your camera feeds go in one end, contextual alerts come out the other.</p>
        </BlurFade>

        <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-0">
          {[
            { label: 'Camera Feeds', sub: 'Existing cameras', accent: false },
            { label: 'Detection', sub: 'Object detection', accent: true },
            { label: 'Reasoning', sub: 'Context analysis', accent: true },
            { label: 'Alerts', sub: 'Dashboard + SMS', accent: false },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center flex-1">
              <ScrollReveal variant="scale-up" delay={i * 0.12} duration={0.5}>
                <div className={`relative flex-1 rounded-xl p-6 text-center ${node.accent ? 'bg-amber-400/[0.06] border border-amber-400/15' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
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

      {/* â”€â”€ Specs: dense table, not cards â”€â”€ */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <TextReveal
              variant="word-blur"
              as="h2"
              start="top 85%"
              duration={0.7}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-4 sticky top-32"
            >
              Under the hood
            </TextReveal>
          </div>
          <div>
            {[
              ['Detection', 'Real-time â€” real-time, multi-class'],
              ['Reasoning', 'Contextual AI â€” contextual scene understanding'],
              ['Hardware', 'Custom on-premise server (fanless, silent)'],
              ['Cameras', '30 simultaneous camera feeds'],
              ['Power', '35W total system draw'],
              ['Latency', 'Sub-second from frame to alert'],
              ['Internet', 'Not required. Ever.'],
              ['Data', 'On-premise only. Full sovereignty.'],
              ['Training', 'Client-specific model fine-tuning available'],
            ].map(([k, v], i) => (
              <ScrollReveal key={k} variant="fade-up" delay={i * 0.06} duration={0.5}>
                <div className="flex justify-between items-baseline py-4 border-b border-white/[0.04]">
                  <span className="font-mono-accent text-[0.9rem] uppercase tracking-[0.1em] text-white/25 w-[120px] flex-shrink-0">{k}</span>
                  <span className="text-[1.1rem] text-white/60 text-right">{v}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Why this matters: editorial paragraphs, not feature cards â”€â”€ */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <UnblurTextReveal
          as="h2"
          blurAmount={22}
          scaleFrom={0.87}
          scrub={1}
          start="top 85%"
          end="top 40%"
          splitBy="word"
          stagger={0.06}
          className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-16"
        >
          Why on-premise, not cloud
        </UnblurTextReveal>
        <div className="max-w-3xl space-y-12">
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means your footage travels. To a data center you don&apos;t control, processed by models you can&apos;t inspect, stored on servers governed by someone else&apos;s privacy policy. For Indian manufacturers under DPDP Act compliance, that&apos;s not a feature â€” it&apos;s a liability.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means latency. A safety violation detected 3 seconds late is a safety violation missed. Our on-premise stack processes frames locally â€” the alert reaches your safety officer before the cloud version would have finished uploading the frame.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means dependency. When your internet goes down â€” and in Indian industrial zones, it will â€” your entire safety system goes dark. Kenesis keeps running because it never needed the internet in the first place.
          </TextReveal>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€ */}
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/[0.06]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
          <p className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-6">
            See it running on your cameras.
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
