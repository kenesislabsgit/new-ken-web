'use client';

import dynamic from 'next/dynamic';
import LenisProvider from '@/components/LenisProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';

// FooterCTASection pulls in Three.js, two DitheredWaves instances and TextVideoMask.
// Deferring it keeps every inner page's initial bundle clean.
const FooterCTASection = dynamic(() => import('@/components/FooterCTASection'), { ssr: false });

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <ProgressiveBlur position="top" height="150px" className="fixed top-0 left-0 right-0 z-[100]" />
        <div className="pt-[6rem] sm:pt-[8rem] md:pt-[12rem]">{children}</div>
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
