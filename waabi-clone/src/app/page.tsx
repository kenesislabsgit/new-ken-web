"use client";

import dynamic from "next/dynamic";
import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import { ProgressiveBlur } from "@/components/magicui/progressive-blur";
import HeroSection from "@/components/HeroSection";
import PinnedFeatureTabs from "@/components/PinnedFeatureTabs";
import WavePerformanceSection from "@/components/WavePerformanceSection";
import TechCardsSection from "@/components/TechCardsSection";
import PartnerLogosSection from "@/components/PartnerLogosSection";
import CareersCTASection from "@/components/CareersCTASection";
import FooterCTASection from "@/components/FooterCTASection";
import { TextVideoMask } from "@/components/magicui/text-video-mask";
import { UnblurTextReveal } from "@/components/magicui/unblur-text-reveal";

const DitheredWaves = dynamic(
  () => import("@/components/magicui/dithered-waves").then(m => ({ default: m.DitheredWaves })),
  { ssr: false }
);

export default function Home() {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <ProgressiveBlur position="top" height="150px" className="fixed top-0 left-0 right-0 z-[100]" />
        <HeroSection />
        <PinnedFeatureTabs />
        <ErrorBoundary>
          <WavePerformanceSection />
        </ErrorBoundary>
        <TechCardsSection />

        {/* ── Dramatic text mask break with dithered waves ── */}
        <section className="relative z-[1] h-[300px]">
          <TextVideoMask
            text="KENESIS"
            fontSize="clamp(6rem, 14vw, 16rem)"
            fontWeight={400}
            fontFamily="var(--font-neowave), sans-serif"
            mode="clip"
            className="h-full w-full"
          >
            <DitheredWaves
              color="#f59e0b"
              cellSize={8}
              speed={0.8}
              layers={5}
              amplitude={50}
              frequency={0.025}
              charset=" .:-=+*#%@█"
              className="h-full w-full"
            />
          </TextVideoMask>
        </section>

        {/* ── Dithered waves ambient section ── */}
        <section className="relative z-[1] h-[200px] overflow-hidden opacity-40 pointer-events-none bg-[#0a0a0b]">
          <DitheredWaves
            color="#f59e0b"
            cellSize={12}
            speed={0.4}
            layers={3}
            amplitude={30}
            frequency={0.015}
            charset=" .:+*#"
            enableMouse={false}
            className="h-full w-full"
          />
        </section>

        <PartnerLogosSection />

        {/* ── Transition fade ── */}
        <div className="relative z-[1] h-[120px] bg-gradient-to-b from-transparent to-[#0a0a0b] pointer-events-none" />

        {/* ── Unblur reveal before CTA ── */}
        <section className="relative z-[1] py-[120px] px-6 text-center bg-[#0a0a0b]">
          <div className="relative z-[1] mx-auto max-w-5xl">
            <UnblurTextReveal
              as="h2"
              blurAmount={18}
              scaleFrom={0.88}
              scrub={1}
              start="top 85%"
              end="top 35%"
              splitBy="word"
              stagger={0.05}
              className="font-display text-[clamp(32px,5vw,56px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white/90"
            >
              Built for your premises. Designed for India.
            </UnblurTextReveal>
          </div>
        </section>

        {/* ── Transition fade into careers ── */}
        <div className="relative z-[1] h-[80px] bg-gradient-to-b from-[#0a0a0b] to-transparent pointer-events-none" />

        <CareersCTASection />
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
