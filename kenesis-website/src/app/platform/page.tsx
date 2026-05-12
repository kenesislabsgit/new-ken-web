'use client';

import { Button } from '@heroui/react';
import { Shield, Zap, Camera, WifiOff, FileCheck, Rocket } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import DashboardPreview from '@/components/DashboardPreview';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { AsciiDivider } from '@/components/AsciiArt';
import { TypewriterText } from '@/components/magicui/typewriter-text';
import { DitheredWaves } from '@/components/magicui/dithered-waves';
import SequentialHighlight from '@/components/SequentialHighlight';
import BorderGlow from '@/components/BorderGlow';

export default function PlatformPage() {
  return (
    <PageShell>
      {/* DitheredWaves background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <DitheredWaves color="#f59e0b" cellSize={16} speed={1.2} layers={2} amplitude={35} frequency={0.012} charset=" .:=+#" enableMouse={true} mouseRadius={250} className="h-full w-full" />
      </div>

      {/* Hero */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-4 sm:px-6 pb-8 sm:pb-12 md:px-12">
        <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
          <p className="font-mono-accent text-[14px] uppercase tracking-[0.14em] text-amber-400/50 mb-6 md:mb-10">Platform</p>
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
      <section className="relative z-[1] py-6 sm:py-8 px-4 sm:px-6 md:px-[48px]">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <DashboardPreview />
        </BlurFade>
      </section>

      {/* Pipeline */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-4 sm:px-6 py-16 md:py-32 md:px-12">
        <AsciiDivider className="mb-12" accent="&#9656;" />
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(24px,4vw,36px)] font-semibold tracking-[-0.035em] text-white/95 mb-3">From camera feed to safety alert</h2>
          <p className="text-[15px] sm:text-[16px] text-white/40 mb-10 max-w-2xl">A streamlined pipeline with no cloud intermediaries. Camera feeds enter, contextual safety alerts emerge, all processed locally.</p>
        </BlurFade>

        {/* Pipeline - premium stepped flow */}
        <div className="relative">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:grid md:grid-cols-4 gap-0 items-start">
            {[
              { num: '01', label: 'Ingest', sub: 'Camera Feeds', desc: 'Connect existing IP cameras. No new hardware.', accent: false },
              { num: '02', label: 'Detect', sub: 'Object Detection', desc: 'PPE, zones, personnel: identified in every frame.', accent: true },
              { num: '03', label: 'Reason', sub: 'Context Analysis', desc: 'AI understands what it sees and why it matters.', accent: true },
              { num: '04', label: 'Alert', sub: 'Dashboard + SMS', desc: 'Actionable alerts reach your team in seconds.', accent: false },
            ].map((node, i, arr) => (
              <ScrollReveal key={node.label} variant="scale-up" delay={i * 0.12} duration={0.5}>
                <div className="relative flex flex-col items-center text-center px-3">
                  {/* Step number - glass circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 relative"
                    style={{
                      background: node.accent
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                      border: node.accent ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: node.accent
                        ? '0 4px 16px rgba(245,158,11,0.1), 0 1px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.3) inset'
                        : '0 4px 12px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.3) inset',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <span className={`font-mono-accent text-[12px] font-bold ${node.accent ? 'text-amber-400/90' : 'text-white/35'}`}>{node.num}</span>
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
              { num: '02', label: 'Detect', sub: 'Object Detection', desc: 'PPE, zones, personnel: identified in every frame.', accent: true },
              { num: '03', label: 'Reason', sub: 'Context Analysis', desc: 'AI understands what it sees and why it matters.', accent: true },
              { num: '04', label: 'Alert', sub: 'Dashboard + SMS', desc: 'Actionable alerts reach your team in seconds.', accent: false },
            ].map((node, i, arr) => (
              <ScrollReveal key={node.label} variant="fade-up" delay={i * 0.1} duration={0.4}>
                <div className="flex items-start gap-4 py-5">
                  {/* Left: number + line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{
                        background: node.accent
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                        border: node.accent ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: node.accent
                          ? '0 3px 12px rgba(245,158,11,0.1), 0 1px 0 rgba(255,255,255,0.06) inset'
                          : '0 3px 10px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.04) inset',
                      }}
                    >
                      <span className={`font-mono-accent text-[10px] font-bold ${node.accent ? 'text-amber-400/90' : 'text-white/35'}`}>{node.num}</span>
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

      {/* Built for the factory floor */}
      <section className="relative z-[2] py-[80px] sm:py-[120px] md:py-[160px] px-[16px] sm:px-[24px] md:px-[48px] bg-[#0a0a0b]">
        <div className="mx-auto max-w-[1100px]">
          <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
            <h2 className="font-display text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.035em] text-white/95 mb-6">
              Built for the factory floor
            </h2>
            <p className="text-[15px] sm:text-[16px] text-white/35 mb-12 sm:mb-16 max-w-xl">
              Designed around the realities of modern manufacturing: unreliable internet, strict data laws, and zero tolerance for downtime.
            </p>
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { Icon: Shield, title: 'Fully on-premise', desc: 'Every frame processed and stored locally. No cloud uploads, no third-party access.' },
              { Icon: Zap, title: 'Real-time alerts', desc: 'Safety violations flagged in seconds, not minutes. Your team acts before incidents escalate.' },
              { Icon: Camera, title: 'Works with any camera', desc: 'Connects to your existing IP cameras. No proprietary hardware, no rip-and-replace.' },
              { Icon: WifiOff, title: 'No internet required', desc: 'Runs completely offline. Network outages don\'t affect your safety monitoring.' },
              { Icon: FileCheck, title: 'DPDP Act compliant', desc: 'Data never leaves your premises. Built for India\'s data protection requirements from day one.' },
              { Icon: Rocket, title: 'Live in 48 hours', desc: 'From setup to monitoring. Minimal configuration, no lengthy integration projects.' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} variant="scale-up" delay={i * 0.06} duration={0.4}>
                <BorderGlow
                  glowColor="45 70 60"
                  backgroundColor="#0f0e0d"
                  borderRadius={20}
                  colors={['#fbbf24', '#f59e0b', '#d97706']}
                  fillOpacity={0}
                  glowIntensity={1.2}
                  animated
                  className="h-full"
                >
                  <div
                    className="group relative rounded-[20px] p-6 sm:p-8 h-full w-full cursor-default overflow-hidden transition-all duration-300"
                    style={{
                      background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.1) 100%)',
                      backdropFilter: 'blur(20px) saturate(1.4)',
                      WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                      boxShadow: `
                        /* outer lift */
                        0 8px 24px rgba(0,0,0,0.5),
                        0 2px 6px rgba(0,0,0,0.35),
                        /* top bright rim */
                        inset 0 1px 0 rgba(255,255,255,0.12),
                        /* bottom dark rim */
                        inset 0 -1px 0 rgba(0,0,0,0.4),
                        /* inner depth */
                        inset 0 2px 12px rgba(0,0,0,0.25)
                      `,
                    }}
                  >
                    {/* Top gloss strip */}
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />

                    {/* Icon - skeuomorphic raised square */}
                    <div
                      className="w-11 h-11 rounded-[12px] flex items-center justify-center mb-5"
                      style={{
                        background: 'linear-gradient(160deg, rgba(245,158,11,0.18) 0%, rgba(245,158,11,0.06) 100%)',
                        boxShadow: `
                          0 4px 10px rgba(0,0,0,0.35),
                          inset 0 1px 0 rgba(255,255,255,0.12),
                          inset 0 -1px 0 rgba(0,0,0,0.3),
                          0 0 0 1px rgba(245,158,11,0.2)
                        `,
                      }}
                    >
                      <item.Icon size={20} className="text-amber-400/90" strokeWidth={1.5} />
                    </div>

                    <p className="font-display text-[17px] font-semibold text-white/90 mb-2 tracking-[-0.02em] group-hover:text-white transition-colors">{item.title}</p>
                    <p className="text-[14px] leading-[1.6] text-white/35 group-hover:text-white/50 transition-colors">{item.desc}</p>
                  </div>
                </BorderGlow>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why on-premise - sequential pinned reveal */}
      <SequentialHighlight
        heading="Why on-premise matters"
        paragraphs={[
          "Cloud processing means your factory footage travels to data centers you don't control, processed by models you can't audit. Under India's DPDP Act, that creates significant compliance liability.",
          "Cloud means latency. A safety violation detected three seconds late is a safety violation missed. Our on-premise processing delivers alerts to your safety team before a cloud solution would finish uploading the frame.",
          "Cloud means dependency. When your internet connection drops, a common reality in industrial facilities, your entire safety system goes offline. Kenesis continues operating because it was never dependent on connectivity.",
        ]}
      />

      {/* CTA */}
      <section className="relative z-[1] mx-auto max-w-[1152px] px-4 sm:px-6 py-16 md:py-24 md:px-12 border-t border-white/[0.06]">
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

