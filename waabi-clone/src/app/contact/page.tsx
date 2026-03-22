'use client';

import dynamic from 'next/dynamic';
import { Button, Card, Input } from '@heroui/react';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const ShaderGradient = dynamic(
  () => import('@/components/magicui/shader-gradient').then(m => ({ default: m.ShaderGradient })),
  { ssr: false }
);

const formFields = [
  { type: 'text', placeholder: 'Name', ariaLabel: 'Name' },
  { type: 'email', placeholder: 'Email', ariaLabel: 'Email' },
  { type: 'text', placeholder: 'Company & facility type', ariaLabel: 'Company' },
] as const;

export default function ContactPage() {
  return (
    <PageShell>
      {/* Shader gradient background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-25 blur-[2px]" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 70%, transparent 100%)' }}>
        <ShaderGradient colorA="#f59e0b" colorB="#d97706" speed={0.04} intensity={1.0} barCount={70} />
      </div>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={16}>
          <p className="font-mono-accent text-[1.1rem] uppercase tracking-[0.14em] text-amber-400/60 mb-8">Contact</p>
        </BlurFade>
        <BlurFade delay={0.2} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90 mb-8">
            Get in touch
          </h1>
        </BlurFade>
        <BlurFade delay={0.5} duration={0.6} blur="6px" offset={12}>
          <p className="max-w-2xl font-mono-accent text-[1.3rem] leading-[1.7] text-white/40 tracking-[0.02em]">
            Ready to deploy edge AI on your factory floor? Let&apos;s talk.
          </p>
        </BlurFade>
      </section>

      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info card — glassmorphism HeroUI Card */}
          <ScrollReveal variant="fade-left" duration={0.8}>
            <Card className="glass-card p-8">
              <Card.Header>
                <Card.Title className="font-display text-[2rem] font-semibold text-white/90">
                  Headquarters
                </Card.Title>
              </Card.Header>
              <Card.Content className="mt-4 space-y-4">
                <p className="font-mono-accent text-[1.2rem] leading-[1.8] text-white/40 tracking-[0.02em]">
                  Kenesis Labs Private Limited<br />
                  Chennai, Tamil Nadu, India
                </p>
                <p className="font-mono-accent text-[1.2rem] text-white/50">
                  <a href="mailto:[email]" className="hover:text-amber-400 transition-colors underline cursor-pointer">hello@kenesis.in</a>
                </p>
                <p className="font-mono-accent text-[1.1rem] text-white/25 tracking-[0.04em]">
                  CIN: U62099TN2025PTC178068
                </p>
              </Card.Content>
            </Card>
          </ScrollReveal>

          {/* Contact form with HeroUI Input + Button */}
          <div>
            <TextReveal
              variant="word-blur"
              as="h2"
              className="font-display text-[2rem] font-semibold tracking-[-0.01em] text-white/90 mb-8"
            >
              Send a message
            </TextReveal>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {formFields.map((field, i) => (
                <ScrollReveal key={field.ariaLabel} variant="fade-right" delay={0.1 + i * 0.08}>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    aria-label={field.ariaLabel}
                    fullWidth
                  />
                </ScrollReveal>
              ))}
              <ScrollReveal variant="fade-right" delay={0.1 + 3 * 0.08}>
                <textarea
                  placeholder="Tell us about your requirements"
                  rows={4}
                  aria-label="Message"
                  className="input w-full resize-none"
                />
              </ScrollReveal>
              <ScrollReveal variant="fade-right" delay={0.1 + 4 * 0.08}>
                <Button
                  variant="primary"
                  size="lg"
                  className="font-mono-accent uppercase tracking-[0.1em] text-[1.2rem] px-[3.2rem] py-[1.4rem] rounded-[1.2rem] cursor-pointer"
                >
                  Request a demo
                </Button>
              </ScrollReveal>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
