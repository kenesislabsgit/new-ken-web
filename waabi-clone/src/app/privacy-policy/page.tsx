'use client';

import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const GradientStrips = dynamic(
  () => import('@/components/magicui/gradient-strips').then(m => ({ default: m.GradientStrips })),
  { ssr: false }
);

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      {/* Gradient strips background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)' }}>
        <GradientStrips colors={["#f59e0b", "#78350f", "#451a03", "#1c1917"]} shape="valley" barCount={10} />
      </div>

      <section className="relative z-[1] mx-auto max-w-[56rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.05} duration={0.4} blur="4px" offset={8}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-white/30 mb-8">Legal</p>
        </BlurFade>
        <BlurFade delay={0.15} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(3rem,7vw,5rem)] leading-[1.05] tracking-[-0.02em] text-white/90 mb-12">
            Privacy Policy
          </h1>
        </BlurFade>
        <div className="space-y-8 text-[1.4rem] leading-[1.8] text-white/50">
          <TextReveal variant="word-fade" scrub={0.5} className="text-[1.4rem] leading-[1.8] text-white/50">
            Kenesis is committed to protecting your privacy. This policy describes how we collect, use, and share information when you use our website and services.
          </TextReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Information We Collect</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>We collect information you provide directly, such as when you fill out a contact form or subscribe to our newsletter. We also collect usage data automatically through cookies and similar technologies.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">How We Use Information</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>We use collected information to provide and improve our services, communicate with you, and comply with legal obligations.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Data Security</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
          </ScrollReveal>

          <ScrollReveal variant="fade-left" delay={0}>
            <h2 className="font-display font-semibold text-[2rem] text-white/80 pt-4">Contact</h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.05}>
            <p>For privacy-related inquiries, contact us at <a href="mailto:[email]" className="text-white/70 hover:text-amber-400 underline transition-colors">privacy@kenesis.ai</a></p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={0.1}>
            <p className="font-mono-accent text-[1.2rem] text-white/30 pt-8">Last updated: January 2026</p>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  );
}
