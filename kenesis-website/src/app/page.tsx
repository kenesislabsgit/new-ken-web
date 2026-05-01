"use client";

import dynamic from "next/dynamic";
import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";
import HeroSection from "@/components/HeroSection";
import PinnedFeatureTabs from "@/components/PinnedFeatureTabs";
import WavePerformanceSection from "@/components/WavePerformanceSection";
import PartnerLogosSection from "@/components/PartnerLogosSection";
import CareersCTASection from "@/components/CareersCTASection";
import FooterCTASection from "@/components/FooterCTASection";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ScrollReveal } from "@/components/magicui/scroll-reveal";
import { TextReveal } from "@/components/magicui/text-reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import BorderGlow from "@/components/BorderGlow";
import AsciiCard from "@/components/AsciiCard";
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
  { step: 1, label: 'Visual Intelligence', headline: 'See what cameras miss.', body: 'Our AI watches every frame from every camera simultaneously. It doesn\'t just detect objects — it understands context, behavior, and safety violations in real time.' },
  { step: 2, label: 'Always Learning', headline: 'Smarter every shift.', body: 'The system continuously adapts to your facility\'s patterns. Fewer false positives over time, more accurate alerts, zero manual tuning required.' },
  { step: 3, label: 'Camera Integration', headline: 'Works with what you have.', body: 'Connects to your existing IP cameras — no new hardware needed. Supports up to 64 simultaneous feeds with sub-second analysis.' },
  { step: 4, label: 'Data Sovereignty', headline: 'Your data stays yours.', body: 'Every frame is processed and stored on your premises. No cloud uploads, no third-party access, fully compliant with India\'s DPDP Act.' },
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

        {/* ── Scroll frame section — continuous ── */}
        <ScrollFrameSection
          frameSets={[...HW_FRAMES, ...FUNNEL_FRAMES]}
          panels={[...HW_PANELS, ...FUNNEL_PANELS]}
          sectionLabel="Kenesis Vision"
          sectionTitle="Software + Intelligence"
        />

        <PinnedFeatureTabs />

        {/* ── Flowing light performance section ── */}
        <ErrorBoundary>
          <WavePerformanceSection />
        </ErrorBoundary>

        {/* ── Features / Capabilities ── */}
        <section className="relative z-[2] py-[80px] sm:py-[120px] md:py-[160px] px-[16px] sm:px-[24px] md:px-[48px] border-t border-white/[0.04] bg-[#0a0a0b]">
          <div className="mx-auto max-w-[1100px]">
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-amber-400/40 mb-[12px]">Capabilities</p>
            </BlurFade>
            <TextReveal variant="word-slide" as="h2" start="top 85%" duration={0.8} stagger={0.06} className="font-display text-[clamp(24px,5vw,56px)] font-semibold tracking-[-0.035em] text-white/95 mb-[32px] sm:mb-[48px] md:mb-[64px]">
              Core capabilities
            </TextReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} variant="scale-up" delay={i * 0.08} duration={0.5}>
                  <BorderGlow
                    glowColor="38 80 70"
                    backgroundColor="rgba(10,10,11,0)"
                    borderRadius={16}
                    colors={['#fbbf24', '#f59e0b', '#d97706']}
                    glowIntensity={1.2}
                    animated
                    className="h-full"
                  >
                    <AsciiCard variant="amber" gap={14} speed={25} className="h-full">
                      <div className="relative glass-card rounded-[16px] p-[24px] sm:p-[40px] md:p-[48px] h-full group cursor-pointer transition-all duration-400 w-full">
                        <BorderBeam size={180} duration={14} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1} />
                        <div className="flex items-start justify-between mb-[20px] sm:mb-[32px]">
                          <p className="font-mono-accent text-[36px] sm:text-[48px] font-bold text-amber-400/[0.06] group-hover:text-amber-400/15 transition-colors duration-400 leading-none">{f.num}</p>
                          <div className="w-[40px] h-[40px] rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-amber-400/25 group-hover:bg-amber-400/[0.04] transition-all duration-400">
                            <span className="text-white/15 group-hover:text-amber-400/50 transition-colors text-[16px]">&rarr;</span>
                          </div>
                        </div>
                        <h3 className="font-display text-[18px] sm:text-[22px] font-semibold text-white/90 mb-[12px] sm:mb-[16px] group-hover:text-white transition-colors tracking-[-0.02em]">{f.title}</h3>
                        <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/40 group-hover:text-white/55 transition-colors duration-400">{f.desc}</p>
                      </div>
                    </AsciiCard>
                  </BorderGlow>
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
