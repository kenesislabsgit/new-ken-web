'use client';

import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';

const GradientStrips = dynamic(() => import('@/components/magicui/gradient-strips').then(m => m.GradientStrips), { ssr: false });

const features = [
  { title: 'Headcount Tracking', desc: 'Real-time worker count across zones. Know exactly who is where at any moment.' },
  { title: 'Attendance Monitoring', desc: 'Automated attendance tracking via camera feeds. No biometric hardware needed.' },
  { title: 'Shift-Level Reports', desc: 'Safety violation trends, compliance rates, and incident logs broken down by shift.' },
  { title: 'Custom Dashboards', desc: 'Role-based dashboards for safety officers, plant managers, and compliance teams.' },
];

export default function AnalyticsPage() {
  return (
    <PageShell>
      {/* Gradient strips background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-15" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)' }}>
        <GradientStrips colors={['#f59e0b', '#d97706', '#92400e', '#78350f']} shape="hill" barCount={6} speed={0.3} direction="vertical" />
      </div>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={16}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-amber-400/60 mb-8">Solutions / Analytics</p>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.02em] text-white/90 mb-8">
            Shift Analytics &amp;<br />Reporting Dashboard
          </h1>
        </BlurFade>
        <BlurFade delay={0.5} duration={0.6} blur="6px" offset={12}>
          <p className="max-w-2xl font-mono-accent text-[1.3rem] leading-[1.7] text-white/40 tracking-[0.02em]">
            Turn camera feeds into operational intelligence. Headcount, attendance, safety compliance — all in one dashboard, updated in real time.
          </p>
        </BlurFade>
      </section>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} variant="fade-up" delay={i * 0.1} distance={50}>
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-8">
                <h3 className="font-display font-semibold text-[1.8rem] text-white/90 mb-3">{f.title}</h3>
                <p className="font-mono-accent text-[1.2rem] leading-[1.6] text-white/40 tracking-[0.02em]">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-16 md:px-12">
        <ScrollReveal variant="fade-right" staggerChildren={true} stagger={0.08}>
          <a href="/solutions/zone-detection" className="btn-kenesis-outline inline-block mr-6">← Zone Detection</a>
          <a href="/solutions/ppe-compliance" className="btn-kenesis-outline inline-block">PPE Compliance →</a>
        </ScrollReveal>
      </section>
    </PageShell>
  );
}
