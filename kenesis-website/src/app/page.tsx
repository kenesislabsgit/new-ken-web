// Server Component — no "use client" needed.
// All child components that need client APIs have their own "use client" boundaries.
// This means Next.js will pre-render this page's HTML on the server and send it immediately.
import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";
import HeroSection from "@/components/HeroSection";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ScrollReveal } from "@/components/magicui/scroll-reveal";
import { TextReveal } from "@/components/magicui/text-reveal";
import { BorderBeam } from "@/components/magicui/border-beam";
import BorderGlow from "@/components/BorderGlow";
import {
  LazyScrollFrameSection as ScrollFrameSection,
  LazyPinnedFeatureTabs as PinnedFeatureTabs,
  LazyWavePerformanceSection as WavePerformanceSection,
  LazyPartnerLogosSection as PartnerLogosSection,
  LazyCareersCTASection as CareersCTASection,
  LazyFooterCTASection as FooterCTASection,
} from "@/components/LazyPageSections";

/* -- Solutions data (scroll frame sections) -- */

const HW_FRAMES = [
  { path: '/videos/section-0', count: 52 },
  { path: '/videos/section-1', count: 52 },
  { path: '/videos/section-2', count: 52 },
  { path: '/videos/section-3', count: 52 },
];

const HW_PANELS = [
  { step: 1, label: 'Visual Intelligence', headline: 'See what cameras miss.', body: 'Our AI watches every frame from every camera simultaneously. It doesn\'t just detect objects. It understands context, behavior, and safety violations in real time.' },
  { step: 2, label: 'Always Learning', headline: 'Smarter every shift.', body: 'The system continuously adapts to your facility\'s patterns. Fewer false positives over time, more accurate alerts, zero manual tuning required.' },
  { step: 3, label: 'Camera Integration', headline: 'Works with what you have.', body: 'Connects to your existing IP cameras, no new hardware needed. Supports up to 64 simultaneous feeds with sub-second analysis.' },
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
  { step: 7, label: 'The Brain', headline: 'Context-aware reasoning.', body: "The system reasons about what it sees: what they're doing, where, and whether it violates protocol." },
  { step: 8, label: 'The Result', headline: 'From noise to signal.', body: "The funnel collapses noise into signal. When your shift manager's phone rings, it means something." },
];

const FEATURES = [
  { num: '01', title: 'Safety Compliance', desc: 'Automated PPE monitoring across all zones: helmets, vests, gloves, and safety gear verified continuously.' },
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

        {/* -- Scroll frame section - continuous -- */}
        <ScrollFrameSection
          frameSets={[...HW_FRAMES, ...FUNNEL_FRAMES]}
          panels={[...HW_PANELS, ...FUNNEL_PANELS]}
          sectionLabel="Kenesis Vision"
          sectionTitle="Software + Intelligence"
        />

        <PinnedFeatureTabs />

        {/* -- Flowing light performance section -- */}
        <ErrorBoundary>
          <WavePerformanceSection />
        </ErrorBoundary>

        {/* -- Features / Capabilities -- */}
        <section className="section-amber-glow relative z-[2] py-[80px] sm:py-[120px] md:py-[160px] px-[16px] sm:px-[24px] md:px-[48px] border-t border-amber-400/[0.08]" style={{ background: '#0d0c0a' }}>
          <div className="mx-auto max-w-[1100px]">
            <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-amber-400/60 mb-[12px]">Capabilities</p>
            </BlurFade>
            <TextReveal variant="word-slide" as="h2" start="top 85%" duration={0.8} stagger={0.06} className="font-display text-[clamp(24px,5vw,56px)] font-semibold tracking-[-0.035em] text-white mb-[32px] sm:mb-[48px] md:mb-[64px]">
              Core capabilities
            </TextReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} variant="scale-up" delay={i * 0.08} duration={0.5}>
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
                      className="relative rounded-[20px] p-[24px] sm:p-[40px] md:p-[48px] h-full group cursor-pointer w-full overflow-hidden transition-all duration-300"
                      style={{
                        background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.01) 50%, rgba(0,0,0,0.1) 100%)',
                        backdropFilter: 'blur(20px) saturate(1.4)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                        boxShadow: `
                          0 8px 24px rgba(0,0,0,0.5),
                          0 2px 6px rgba(0,0,0,0.35),
                          inset 0 1px 0 rgba(255,255,255,0.12),
                          inset 0 -1px 0 rgba(0,0,0,0.4),
                          inset 0 2px 12px rgba(0,0,0,0.25)
                        `,
                      }}
                    >
                      {/* Top gloss strip */}
                      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent pointer-events-none" />

                      <div className="flex items-start justify-between mb-[20px] sm:mb-[32px]">
                        {/* Number - skeuomorphic embossed */}
                        <p className="feature-num font-mono-accent text-[36px] sm:text-[48px] font-bold leading-none"
                          style={{
                            color: 'transparent',
                            textShadow: '0 1px 0 rgba(255,255,255,0.04), 0 -1px 0 rgba(0,0,0,0.3)',
                          }}
                        >{f.num}</p>

                        {/* Arrow - skeuomorphic raised circle */}
                        <div
                          className="w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                            boxShadow: `
                              0 3px 8px rgba(0,0,0,0.35),
                              inset 0 1px 0 rgba(255,255,255,0.12),
                              inset 0 -1px 0 rgba(0,0,0,0.3),
                              0 0 0 1px rgba(255,255,255,0.06)
                            `,
                          }}
                        >
                          <span className="text-white/20 group-hover:text-amber-400/60 transition-colors text-[16px]">&rarr;</span>
                        </div>
                      </div>

                      <h3 className="font-display text-[18px] sm:text-[22px] font-semibold text-white/90 mb-[12px] sm:mb-[16px] group-hover:text-white transition-colors tracking-[-0.02em]">{f.title}</h3>
                      <p className="text-[15px] sm:text-[16px] leading-[1.7] text-white/55 group-hover:text-white/70 transition-colors duration-400">{f.desc}</p>
                    </div>
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
