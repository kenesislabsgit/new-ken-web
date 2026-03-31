'use client';

import dynamic from 'next/dynamic';
import { Button } from '@heroui/react';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';

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

      {/* ── Hero: big statement, no fluff ── */}
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
              We make them understand it. YOLOv8 detection and Qwen2.5-VL reasoning, running on a box under your desk. No cloud. No data leaving.
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

      {/* ── Dashboard preview ── */}
      <section className="relative z-[1] py-24 px-6 md:px-12">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <div className="relative mx-auto max-w-[72rem] rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
            <BorderBeam size={200} duration={12} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1} />

            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-4 font-mono-accent text-[0.75rem] text-white/25 tracking-wider uppercase">Kenesis Dashboard — Live</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono-accent text-[0.7rem] text-green-400/60">Connected</span>
              </span>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[480px]">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-1 p-4 border-r border-white/[0.06] bg-white/[0.01]">
                {[
                  { icon: '┌◉┐', label: 'Overview', active: true },
                  { icon: '│◎│', label: 'Camera Feeds', active: false },
                  { icon: '│⚠│', label: 'Alerts', active: false },
                  { icon: '├─┤', label: 'Zone Map', active: false },
                  { icon: '│▓│', label: 'Analytics', active: false },
                  { icon: '└◉┘', label: 'Settings', active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.85rem] transition-colors ${
                      item.active
                        ? 'bg-amber-400/10 text-amber-400/80 border border-amber-400/10'
                        : 'text-white/25 hover:text-white/40 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-[1rem] opacity-60">{item.icon}</span>
                    <span className="font-mono-accent tracking-wide">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="p-5 space-y-5">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Active Cameras', value: '28/30', color: 'text-green-400/70' },
                    { label: 'Alerts Today', value: '12', color: 'text-amber-400/70' },
                    { label: 'PPE Compliance', value: '94%', color: 'text-emerald-400/70' },
                    { label: 'Avg Latency', value: '0.3s', color: 'text-blue-400/70' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                      <p className="font-mono-accent text-[0.7rem] uppercase tracking-[0.1em] text-white/20 mb-2">{stat.label}</p>
                      <p className={`font-display text-[1.6rem] font-semibold leading-none ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Camera grid + alerts */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
                  {/* Camera feeds grid */}
                  <div className="space-y-3">
                    <p className="font-mono-accent text-[0.75rem] uppercase tracking-[0.1em] text-white/20">Live Feeds</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { id: 'CAM-01', zone: 'Welding Bay A', status: 'ok' },
                        { id: 'CAM-02', zone: 'Assembly Line 1', status: 'alert' },
                        { id: 'CAM-03', zone: 'Loading Dock', status: 'ok' },
                        { id: 'CAM-04', zone: 'Chemical Store', status: 'ok' },
                        { id: 'CAM-05', zone: 'Main Entrance', status: 'ok' },
                        { id: 'CAM-06', zone: 'Furnace Room', status: 'alert' },
                      ].map((cam) => (
                        <div key={cam.id} className="relative rounded-lg bg-black/40 border border-white/[0.06] overflow-hidden aspect-video group cursor-pointer">
                          {/* Simulated feed noise */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-between p-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono-accent text-[0.6rem] text-white/30 bg-black/50 px-1.5 py-0.5 rounded">{cam.id}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'alert' ? 'bg-red-400 animate-pulse' : 'bg-green-400/60'}`} />
                            </div>
                            <span className="font-mono-accent text-[0.6rem] text-white/20">{cam.zone}</span>
                          </div>
                          {cam.status === 'alert' && (
                            <div className="absolute inset-0 border-2 border-red-400/30 rounded-lg" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent alerts */}
                  <div className="space-y-3">
                    <p className="font-mono-accent text-[0.75rem] uppercase tracking-[0.1em] text-white/20">Recent Alerts</p>
                    <div className="space-y-2">
                      {[
                        { time: '2m ago', msg: 'No face shield — Welding Bay A', severity: 'high' },
                        { time: '8m ago', msg: 'Unauthorized zone entry — Furnace', severity: 'high' },
                        { time: '15m ago', msg: 'Missing hard hat — Assembly Line 1', severity: 'medium' },
                        { time: '23m ago', msg: 'Slip hazard detected — Loading Dock', severity: 'low' },
                        { time: '41m ago', msg: 'PPE compliance drop below 90%', severity: 'medium' },
                      ].map((alert, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 cursor-pointer hover:bg-white/[0.04] transition-colors">
                          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            alert.severity === 'high' ? 'bg-red-400' :
                            alert.severity === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                          }`} />
                          <div className="min-w-0">
                            <p className="text-[0.8rem] text-white/50 leading-snug truncate">{alert.msg}</p>
                            <p className="font-mono-accent text-[0.65rem] text-white/15 mt-0.5">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* ── Numbers strip: full-bleed, breaks the content width ── */}
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
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12">
        <AsciiDivider className="mb-12" accent="▸" />
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-4">From camera to alert in one hop</h2>
          <p className="text-[1.1rem] text-white/30 mb-4 max-w-2xl">No staging servers, no cloud queues, no round trips. Your RTSP feeds go in one end, contextual alerts come out the other.</p>
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
              ['Detection', 'YOLOv8 — real-time, multi-class'],
              ['Reasoning', 'Qwen2.5-VL 7B — contextual scene understanding'],
              ['Hardware', 'Custom on-premise server (ARM-based, fanless)'],
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
            Cloud means your footage travels. To a data center you don&apos;t control, processed by models you can&apos;t inspect, stored on servers governed by someone else&apos;s privacy policy. For Indian manufacturers under DPDP Act compliance, that&apos;s not a feature — it&apos;s a liability.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60"
          >
            Cloud means latency. A safety violation detected 3 seconds late is a safety violation missed. Our on-premise stack processes frames locally — the alert reaches your safety officer before the cloud version would have finished uploading the frame.
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

      {/* ── CTA ── */}
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
