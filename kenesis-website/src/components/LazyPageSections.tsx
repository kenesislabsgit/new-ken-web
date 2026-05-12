'use client';

// This is a client boundary wrapper. It lives in a Client Component so it can
// use ssr: false in dynamic() calls, keeping heavy 3D/WebGL/GSAP chunks out of
// the initial HTML render and deferring them until the browser is idle.

import dynamic from 'next/dynamic';

export const LazyScrollFrameSection = dynamic(
  () => import('@/components/ScrollFrameSection'),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative bg-[#0a0a0b] flex items-center justify-center"
        style={{ height: '100vh' }}
      >
        <div className="w-[32px] h-[32px] border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

export const LazyPinnedFeatureTabs = dynamic(
  () => import('@/components/PinnedFeatureTabs'),
  { ssr: false }
);

export const LazyWavePerformanceSection = dynamic(
  () => import('@/components/WavePerformanceSection'),
  { ssr: false }
);

export const LazyPartnerLogosSection = dynamic(
  () => import('@/components/PartnerLogosSection'),
  { ssr: false }
);

export const LazyCareersCTASection = dynamic(
  () => import('@/components/CareersCTASection'),
  { ssr: false }
);

export const LazyFooterCTASection = dynamic(
  () => import('@/components/FooterCTASection'),
  { ssr: false }
);
