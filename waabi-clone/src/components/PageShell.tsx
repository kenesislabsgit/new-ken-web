'use client';

import LenisProvider from '@/components/LenisProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import FooterCTASection from '@/components/FooterCTASection';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full">
        <Navbar />
        <ProgressiveBlur position="top" height="150px" className="fixed top-0 left-0 right-0 z-[100]" />
        <div className="pt-[12rem]">{children}</div>
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
