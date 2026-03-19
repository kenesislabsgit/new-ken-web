'use client';

import LenisProvider from '@/components/LenisProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from '@/components/Navbar';
import FooterCTASection from '@/components/FooterCTASection';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <main className="relative min-h-screen w-full">
        <Navbar />
        <div className="pt-[12rem]">{children}</div>
        <ErrorBoundary>
          <FooterCTASection />
        </ErrorBoundary>
      </main>
    </LenisProvider>
  );
}
