"use client";

import dynamic from "next/dynamic";
import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";
import HeroSection from "@/components/HeroSection";
import PinnedFeatureTabs from "@/components/PinnedFeatureTabs";
import TechCardsSection from "@/components/TechCardsSection";
import PartnerLogosSection from "@/components/PartnerLogosSection";
import CareersCTASection from "@/components/CareersCTASection";
import FooterCTASection from "@/components/FooterCTASection";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ScrollReveal } from "@/components/magicui/scroll-reveal";
import { TextReveal } from "@/components/magicui/text-reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DitheredWaves } from "@/components/magicui/dithered-waves";
const ScrollFrameSection = dynamic(
  () => import(/* webpackPrefetch: true */ "@/components/ScrollFrameSection"),
  {
    ssr: false,
    loading: () => (
      <div className="relative bg-[#0a0a0b] flex items-center justify-center" style={{ height: '100vh' }}>
        <div className="w-[32px] h-[32px] border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

/* ── Solutions data (scroll frame sections) ── */

const HW_FRAMES = [
  { path: '/videos/section-0', count: 52 },
  { path: '/videos/section-1', count: 52 },
  { path: '/videos/section-2', count: 52 },
  { path: '/videos/section-3', count: 52 },
];

const HW_PANELS = [
  { step: 1, label: 'The Hardware', headline: 'Engineered to be invisible.', body: 'A compact, fanless device that sits quietly in your server room. No moving parts, no cloud connection, no maintenance overhead.' },
  { step: 2, label: 'Thermal Design', headline: 'Runs cool. Runs forever.', body: 'Precision-engineered passive cooling handles continuous AI inference without fans. Built for years of uninterrupted operation.' },
  { step: 3, label: 'Camera Integration', headline: 'Works with what you have.', body: 'Connects to your existing IP cameras — no hardware replacement needed. Supports up to 64 simultaneous feeds per device.' },
  { step: 4, label: 'Data Sovereignty', headline: 'Your data stays yours.', body: 'Every frame is processed and stored on hardware you own. No external API calls, no cloud uploads, no third-party data access.' },
];

const FUNNEL_FRAMES = [
  { path: '/videos/section-5', count: 52 },
  { path: '/videos/section-6', count: 52 },
  { path: '/videos/section-7', count: 52 },
  { path: '/videos/section-8', count: 52 },
];

const FUNNEL_PANELS = [
  { step: 5, label: 'Detection Layer', headline: 'Continuous monitoring at scale.', body: 'Our detection engine processes every frame from every camera in real time. Millions of frames analyzed, only genuine anomalies flagged.' },
  { step: 6, label: 'Risk Scoring', headline: 'Signal over noise.', body: 'Each detection receives a contextual risk score. Low-confidence alerts are suppressed automatically. High-priority events escalate instantly.' },
  { step: 7, label: 'The Brain', headline: 'Context-aware reasoning.', body: "The system reasons about what it sees \u2014 what they're doing, where, and whether it violates protocol." },
  { step: 8, label: 'The Result', headline: 'From noise to signal.', body: "The funnel collapses noise into signal. When your shift manager's phone rings, it means something." },
];

const FEATURES = [
  { num: '01', title: 'Safety Compliance', desc: 'Automated PPE monitoring across all zones — helmets, vests, gloves, and safety gear verified continuously.' },
  { num: '02', title: 'Zone Intelligence', desc: 'Define restricted areas visually. Track access patterns, detect unauthorized entries, and enforce zone-specific safety rules.' },
  { num: '03', title: 'Process Verification', desc: 'Verify that standard operating procedures are followed correctly during critical operations, step by step.' },
  { num: '04', title: 'Natural Language Query', desc: '\u201CShow me every incident in Bay 3 this week.\u201D Answered in seconds from your local archive.' },
];

export default function Home() {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full">
        <Navbar />
        <ProgressiveBlur position="top" height="150px" className="fixed top-0 left-0 right-0 z-[100]" />
        <HeroSection />

        <PinnedFeatureTabs />

        {/* ── Scroll frame section — continuous ── */}
        <ScrollFrameSection
          frameSets={[...HW_FRAMES, ...FUNNEL_FRAMES]}
          panels={[...HW_PANELS, ...FUNNEL_PANELS]}
          sectionLabel="Kenesis Vision"
          sectionTitle="Hardware + Intelligence"
        />

        <TechCardsSection />

        {/* ── Intelligence Funnel interlude ── */}
        <section className="relative z-[10] min-h-screen flex items-center justify-center px-[24px] md:px-[48px] overflow-hidden bg-[#0a0a0b]">
          <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
            <DitheredWaves color="#f59e0b" cellSize={20} speed={0.8} layers={2} amplitude={30} frequency={0.01} charset=" .:-=#" enableMouse={false} className="h-full w-full" />
          </div>
          <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-amber-500/[0.025] blur-[140px] pointer-events-none" />

          <div className="relative z-[1] text-center max-w-[900px]">
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-60px">
              <p className="font-mono-accent text-[12px] uppercase tracking-[0.22em] text-amber-400/50 mb-[40px]">How it works</p>
            </BlurFade>

            <TextReveal variant="word-slide" as="h2" start="top 90%" duration={0.9} stagger={0.08} className="font-display text-[clamp(48px,9vw,100px)] font-semibold tracking-[-0.04em] text-white mb-[48px] leading-[1.05]">
              The Processing Pipeline
            </TextReveal>

            <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
              <p className="text-[20px] leading-[1.7] text-white/30 max-w-[560px] mx-auto mb-[56px]">
                A three-stage pipeline that transforms raw camera feeds into actionable safety intelligence.
              </p>
            </BlurFade>

            <BlurFade delay={0} duration={0.5} blur="4px" offset={8} inView inViewMargin="-60px">
              <div className="flex flex-wrap items-start justify-center gap-[24px] md:gap-[40px]">
                {[
                  { val: '10,000', unit: 'frames' },
                  { val: '100', unit: 'detections' },
                  { val: '5', unit: 'anomalies' },
                  { val: '1', unit: 'call' },
                ].map((item, i, arr) => (
                  <div key={i} className="flex items-center gap-[24px] md:gap-[40px]">
                    <div className="flex flex-col items-center gap-[8px]">
                      <span className="font-display text-[clamp(32px,4vw,48px)] font-bold text-white/75">{item.val}</span>
                      <span className="font-mono-accent text-[10px] uppercase tracking-[0.16em] text-white/20">{item.unit}</span>
                    </div>
                    {i < arr.length - 1 && <span className="text-amber-400/25 text-[24px]">&rarr;</span>}
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ── Features / Capabilities ── */}
        <section className="relative z-[2] py-[160px] px-[24px] md:px-[48px] border-t border-white/[0.04] bg-[#0a0a0b]">
          <div className="mx-auto max-w-[1100px]">
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-amber-400/40 mb-[12px]">Capabilities</p>
            </BlurFade>
            <TextReveal variant="word-slide" as="h2" start="top 85%" duration={0.8} stagger={0.06} className="font-display text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.025em] text-white/90 mb-[64px]">
              Core capabilities
            </TextReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} variant="scale-up" delay={i * 0.08} duration={0.5}>
                  <div className="relative glass-card rounded-[16px] p-[40px] md:p-[48px] h-full group cursor-pointer hover:border-amber-400/20 hover:bg-white/[0.06] transition-all duration-400">
                    <BorderBeam size={180} duration={14} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1} />
                    <div className="flex items-start justify-between mb-[32px]">
                      <p className="font-mono-accent text-[48px] font-bold text-amber-400/[0.06] group-hover:text-amber-400/15 transition-colors duration-400 leading-none">{f.num}</p>
                      <div className="w-[40px] h-[40px] rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-amber-400/25 group-hover:bg-amber-400/[0.04] transition-all duration-400">
                        <span className="text-white/15 group-hover:text-amber-400/50 transition-colors text-[16px]">&rarr;</span>
                      </div>
                    </div>
                    <h3 className="font-display text-[22px] font-semibold text-white/85 mb-[16px] group-hover:text-white transition-colors">{f.title}</h3>
                    <p className="text-[16px] leading-[1.75] text-white/30 group-hover:text-white/45 transition-colors duration-400">{f.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <PartnerLogosSection />

        <CareersCTASection />
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
