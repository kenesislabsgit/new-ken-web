'use client';

import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';

const ShaderLines = dynamic(() => import('@/components/magicui/shader-lines').then(m => m.ShaderLines), { ssr: false });

const features = [
  { title: 'Restricted Areas', desc: 'Mark zones on any camera feed. AI monitors 24/7 and flags unauthorized entry instantly.' },
  { title: 'Perimeter Breach', desc: 'Fence-line and boundary monitoring with real-time intrusion detection. Works day and night.' },
  { title: 'Contextual Alerts', desc: 'Not just "motion detected" — but "unauthorized person near chemical storage at 2:47 AM."' },
];

export default function ZoneDetectionPage() {
  return (
    <PageShell>
      {/* Shader background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)' }}>
        <ShaderLines color="#f59e0b" speed={0.4} density={10} intensity={0.6} />
      </div>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={16}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-amber-400/60 mb-8">Solutions / Zone Detection</p>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.02em] text-white/90 mb-8">
            Restricted Zone &amp;<br />Perimeter Detection
          </h1>
        </BlurFade>
        <BlurFade delay={0.5} duration={0.6} blur="6px" offset={12}>
          <p className="max-w-2xl font-mono-accent text-[1.3rem] leading-[1.7] text-white/40 tracking-[0.02em]">
            Define restricted areas, hazardous zones, and perimeter boundaries. Get instant alerts when unauthorized personnel enter — with full context on who, where, and when.
          </p>
        </BlurFade>
      </section>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} variant="clip-up" delay={i * 0.1}>
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
          <a href="/solutions/ppe-compliance" className="btn-kenesis-outline inline-block mr-6">← PPE Compliance</a>
          <a href="/solutions/analytics" className="btn-kenesis-outline inline-block">Analytics →</a>
        </ScrollReveal>
      </section>
    </PageShell>
  );
}
