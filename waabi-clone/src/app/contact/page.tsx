'use client';

import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const formFields = [
  { type: 'text', placeholder: 'Name', ariaLabel: 'Name' },
  { type: 'email', placeholder: 'Email', ariaLabel: 'Email' },
  { type: 'text', placeholder: 'Company & facility type', ariaLabel: 'Company' },
] as const;

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-[72rem] px-6 pb-24 md:px-12">
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

      <section className="mx-auto max-w-[72rem] px-6 py-24 md:px-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ScrollReveal variant="fade-left" duration={0.8}>
            <h3 className="font-display text-[2rem] font-semibold text-white/90 mb-4">Headquarters</h3>
            <p className="font-mono-accent text-[1.2rem] leading-[1.8] text-white/40 tracking-[0.02em]">
              Kenesis Labs Private Limited<br />
              Chennai, Tamil Nadu, India
            </p>
            <p className="mt-4 font-mono-accent text-[1.2rem] text-white/50">
              <a href="mailto:[email]" className="hover:text-amber-400 transition-colors underline">hello@kenesis.in</a>
            </p>
            <p className="mt-8 font-mono-accent text-[1.1rem] text-white/25 tracking-[0.04em]">
              CIN: U62099TN2025PTC178068
            </p>
          </ScrollReveal>
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
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    aria-label={field.ariaLabel}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-[1.4rem] text-white/80 placeholder:text-white/25 font-mono-accent tracking-[0.02em] focus:outline-none focus:border-amber-400/40 transition-colors"
                  />
                </ScrollReveal>
              ))}
              <ScrollReveal variant="fade-right" delay={0.1 + 3 * 0.08}>
                <textarea
                  placeholder="Tell us about your requirements"
                  rows={4}
                  aria-label="Message"
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-[1.4rem] text-white/80 placeholder:text-white/25 font-mono-accent tracking-[0.02em] resize-none focus:outline-none focus:border-amber-400/40 transition-colors"
                />
              </ScrollReveal>
              <ScrollReveal variant="fade-right" delay={0.1 + 4 * 0.08}>
                <button type="submit" className="btn-kenesis font-mono-accent uppercase tracking-[0.1em] text-[1.2rem]">Request a demo</button>
              </ScrollReveal>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
