'use client';

import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const detections = ['Helmets', 'Safety vests', 'Gloves', 'Safety footwear', 'Face shields', 'Ear protection'];

export default function PPECompliancePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={16}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-amber-400/60 mb-8">Solutions / PPE Compliance</p>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.02em] text-white/90 mb-8">
            PPE Compliance<br />Monitoring
          </h1>
        </BlurFade>
        <BlurFade delay={0.5} duration={0.6} blur="6px" offset={12}>
          <p className="max-w-2xl font-mono-accent text-[1.3rem] leading-[1.7] text-white/40 tracking-[0.02em]">
            Real-time detection of PPE violations across your factory floor. Not just bounding boxes — contextual alerts that tell your safety officers exactly what&apos;s wrong and where.
          </p>
        </BlurFade>
      </section>

      <section className="mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <BlurFade delay={0} duration={0.6} blur="6px" offset={12} inView inViewMargin="-100px">
          <h2 className="font-display font-semibold text-[clamp(2rem,4vw,3rem)] tracking-[-0.02em] text-white/90 mb-8">What we detect</h2>
        </BlurFade>
        <ScrollReveal variant="scale-up" staggerChildren={true} stagger={0.06}>
          {detections.map((d) => (
            <span key={d} className="detect-tag inline-block font-mono-accent rounded-full bg-white/[0.06] border border-white/[0.08] px-5 py-2 text-[1.2rem] text-white/50 uppercase tracking-[0.06em] mr-4 mb-4">
              {d}
            </span>
          ))}
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <TextReveal variant="word-blur" as="h2" className="font-display font-semibold text-[clamp(2rem,4vw,3rem)] tracking-[-0.02em] text-white/90 mb-8">
          How it&apos;s different
        </TextReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal variant="rotate-in" delay={0}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-8">
              <h3 className="font-display font-semibold text-[1.8rem] text-white/90 mb-3">Contextual, not generic</h3>
              <p className="font-mono-accent text-[1.2rem] leading-[1.6] text-white/40 tracking-[0.02em]">
                &ldquo;Worker in welding zone without face shield during active operation&rdquo; — not just &ldquo;person without helmet.&rdquo;
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="rotate-in" delay={0.1}>
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-8">
              <h3 className="font-display font-semibold text-[1.8rem] text-white/90 mb-3">Works offline</h3>
              <p className="font-mono-accent text-[1.2rem] leading-[1.6] text-white/40 tracking-[0.02em]">
                No internet required. Detection runs on-premise even during network outages. Your safety system never goes down.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-6 py-16 md:px-12">
        <ScrollReveal variant="fade-right" staggerChildren={true} stagger={0.08}>
          <a href="/solutions/zone-detection" className="btn-kenesis-outline inline-block mr-6">Zone Detection →</a>
          <a href="/solutions/analytics" className="btn-kenesis-outline inline-block">Analytics →</a>
        </ScrollReveal>
      </section>
    </PageShell>
  );
}
