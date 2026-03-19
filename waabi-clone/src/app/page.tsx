"use client";

import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PinnedFeatureTabs from "@/components/PinnedFeatureTabs";
import WavePerformanceSection from "@/components/WavePerformanceSection";
import TechCardsSection from "@/components/TechCardsSection";
import PartnerLogosSection from "@/components/PartnerLogosSection";
import InsightsGrid from "@/components/InsightsGrid";
import CareersCTASection from "@/components/CareersCTASection";
import FooterCTASection from "@/components/FooterCTASection";

export default function Home() {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full bg-[#0a0a0b]">
        <Navbar />
        <HeroSection />
        <PinnedFeatureTabs />
        <ErrorBoundary>
          <WavePerformanceSection />
        </ErrorBoundary>
        <TechCardsSection />
        <PartnerLogosSection />
        <InsightsGrid />
        <CareersCTASection />
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
