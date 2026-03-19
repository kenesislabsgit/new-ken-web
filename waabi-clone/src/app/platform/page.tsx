'use client';

import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Particles } from '@/components/magicui/particles';
import { CircularGallery } from '@/components/magicui/circular-gallery';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

export default function PlatformPage() {
  return (
    <PageShell>
      {/* ── Hero: big statement, no fluff ── */}
      <section className="relative mx-auto max-w-[72rem] px-6 pb-40 md:px-12">
        <Particles className="absolute inset-0 z-0 pointer-events-none" quantity={30} color="#f59e0b" size={0.3} staticity={80} ease={80} />
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
              We make them understand it. YOLOv8 detection and Qwen2.5-VL reasoning, running on a box under your desk. No cloud. No data leaving.
            </p>
          </BlurFade>
          <BlurFade delay={0.75} duration={0.4} blur="4px" offset={6}>
            <a href="/contact" className="btn-kenesis font-mono-accent uppercase tracking-[0.1em] text-[1.05rem]">Book a walkthrough</a>
          </BlurFade>
        </div>
      </section>

      {/* ── Visual: circular gallery showing the product in action ── */}
      <section className="py-24 overflow-hidden">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <CircularGallery
            className="h-[380px] mx-auto"
            radius={300}
            rotationSpeed={28}
            images={[
              { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80', alt: 'Safety detection' },
              { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', alt: 'Real-time dashboard' },
              { src: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80', alt: 'Factory deployment' },
              { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', alt: 'Edge inference' },
              { src: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80', alt: 'Camera feeds' },
              { src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80', alt: 'On-premise hardware' },
            ]}
          />
        </BlurFade>
      </section>

      {/* ── Numbers strip: full-bleed, breaks the content width ── */}
      <section className="border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-[80rem] px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-y-10">
          {[
            { val: 30, suffix: '', label: 'Camera feeds per device' },
            { val: 35, suffix: 'W', label: 'Total power draw' },
            { val: 0, suffix: 'ms', label: 'Cloud latency', sub: '<1s on-prem' },
            { val: 1500, suffix: '₹', label: 'Per camera / month' },
          ].map((s, i) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold text-white/90 leading-none mb-2">
                {s.val > 0 ? (
                  <><NumberTicker value={s.val} delay={0.2 + i * 0.15} />{s.suffix}</>
                ) : (
                  <span className="text-white/25 line-through">∞{s.suffix}</span>
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

      {/* ── Pipeline: horizontal flow, not numbered cards ── */}
      <section className="mx-auto max-w-[72rem] px-6 py-32 md:px-12">
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-4">From camera to alert in one hop</h2>
          <p className="text-[1.1rem] text-white/30 mb-16 max-w-2xl">No staging servers, no cloud queues, no round trips. Your RTSP feeds go in one end, contextual alerts come out the other.</p>
        </BlurFade>

        <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-0">
          {[
            { label: 'RTSP Feeds', sub: 'Existing cameras', accent: false },
            { label: 'YOLOv8', sub: 'Object detection', accent: true },
            { label: 'Qwen2.5-VL', sub: 'Context reasoning', accent: true },
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

      {/* ── Specs: dense table, not cards ── */}
      <section className="mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
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
              ['Detection', 'YOLOv8 — real-time, multi-class'],
              ['Reasoning', 'Qwen2.5-VL 7B — contextual scene understanding'],
              ['Hardware', 'Mac Mini M4 Pro (or equivalent ARM)'],
              ['Cameras', '30 simultaneous RTSP feeds'],
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

      {/* ── Why this matters: editorial paragraphs, not feature cards ── */}
      <section className="mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <TextReveal
          variant="word-slide"
          as="h2"
          start="top 85%"
          duration={0.7}
          className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-16"
        >
          Why edge, not cloud
        </TextReveal>
        <div className="max-w-3xl space-y-12">
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means your footage travels. To a data center you don&apos;t control, processed by models you can&apos;t inspect, stored on servers governed by someone else&apos;s privacy policy. For Indian manufacturers under DPDP Act compliance, that&apos;s not a feature — it&apos;s a liability.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means latency. A safety violation detected 3 seconds late is a safety violation missed. Our edge stack processes frames locally — the alert reaches your safety officer before the cloud version would have finished uploading the frame.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means dependency. When your internet goes down — and in Indian industrial zones, it will — your entire safety system goes dark. Kenesis keeps running because it never needed the internet in the first place.
          </TextReveal>
        </div>
      </section>

      {/* ── Pricing: simple, asymmetric ── */}
      <section className="mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16 items-start">
          <div>
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
              <p className="font-mono-accent text-[0.9rem] uppercase tracking-[0.14em] text-amber-400/40 mb-6">Pricing</p>
              <p className="font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-[1] tracking-[-0.03em] text-white/90 mb-3">
                ₹1,500
              </p>
              <p className="text-[1.2rem] text-white/40 mb-8">per camera, per month. Hardware included.</p>
              <p className="text-[1.1rem] text-white/30 max-w-md leading-[1.7]">
                Full data ownership. On-premise deployment. No cloud bills, no per-API-call charges, no surprise egress fees. One number, everything included.
              </p>
            </BlurFade>
          </div>
          <div className="relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-6">
            <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/20 mb-3">Cloud equivalent</p>
            <p className="font-display text-[2rem] font-semibold text-white/20 line-through mb-2">₹839/cam</p>
            <ul className="space-y-2 text-[0.95rem] text-white/20">
              <li>+ Data leaves premises</li>
              <li>+ Internet dependent</li>
              <li>+ Generic alerts</li>
              <li>+ Vendor lock-in</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/[0.06]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
          <p className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-6">
            See it running on your cameras.
          </p>
          <a href="/contact" className="btn-kenesis font-mono-accent uppercase tracking-[0.1em] text-[1.05rem]">Request a demo</a>
        </BlurFade>
      </section>
    </PageShell>
  );
}
