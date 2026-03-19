'use client';

import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

export default function TermsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[56rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.05} duration={0.4} blur="4px" offset={8}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-white/30 mb-8">Legal</p>
        </BlurFade>
        <BlurFade delay={0.15} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(3rem,7vw,5rem)] leading-[1.05] tracking-[-0.02em] text-white/90 mb-12">
            Terms of Use
          </h1>
        </BlurFade>
        <div className="space-y-8 text-[1.4rem] leading-[1.8] text-white/50">
          <TextReveal variant="word-fade" scrub={0.5} className="text-[1.4rem] leading-[1.8] text-white/50">
            These Terms of Use govern your access to and use of the Kenesis website and services. By accessing our website, you agree to be bound by these terms.
          </TextReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Use of Services</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>You may use our services only as permitted by law and these terms. We may suspend or stop providing services if you do not comply with our terms or policies.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Intellectual Property</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>All content, trademarks, and intellectual property on this website are owned by Kenesis or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Limitation of Liability</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>Kenesis shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.1}>
            <p className="font-mono-accent text-[1.2rem] text-white/30 pt-8">Last updated: January 2026</p>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
