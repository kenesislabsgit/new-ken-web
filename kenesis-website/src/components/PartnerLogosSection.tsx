'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { AsciiDivider, AsciiBlock, ASCII_ARTS } from '@/components/AsciiArt';

const partnerTabs = ['Manufacturing', 'Pharma', 'Logistics', 'Infrastructure'];

interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  partnerLogo: string;
}

const testimonials: Record<string, Testimonial> = {
  Manufacturing: {
    quote: 'Kenesis transformed our safety monitoring within days of deployment. The on-premise approach eliminated our data privacy concerns entirely, and the alerts are precise enough to act on immediately.',
    authorName: 'Rajesh Kumar',
    authorTitle: 'Plant Head, Manufacturing Unit',
    partnerLogo: 'M',
  },
  Pharma: {
    quote: 'In pharma manufacturing, regulatory compliance is non-negotiable. Kenesis delivers real-time PPE monitoring without any cloud dependency — exactly what our data governance policies demand.',
    authorName: '',
    authorTitle: 'Pharmaceutical Plant',
    partnerLogo: 'P',
  },
  Logistics: {
    quote: 'Our warehouse runs around the clock. Kenesis monitors 30+ cameras on a single device — we saw measurable safety improvements within the first week.',
    authorName: '',
    authorTitle: 'Logistics Warehouse',
    partnerLogo: 'L',
  },
  Infrastructure: {
    quote: 'At remote construction sites with unreliable internet, cloud solutions simply don\'t work. Kenesis runs fully offline and delivers alerts our safety team can rely on.',
    authorName: '',
    authorTitle: 'Infrastructure Project',
    partnerLogo: 'I',
  },
};

export function getTestimonialDelay(logoCount: number): number {
  return (logoCount - 1) * 100 + 200;
}

export default function PartnerLogosSection() {
  const [activePartner, setActivePartner] = useState('Manufacturing');

  const currentTestimonial = testimonials[activePartner];

  return (
    <section id="partners" className="bg-[#0a0a0b] py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1234px] px-4 sm:px-6 md:px-12">
        <AsciiDivider className="mb-12" accent="◇" />

        <div className="flex items-start justify-between gap-8">
          <TextReveal
            variant="word-blur"
            as="h2"
            className="mb-16 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90"
          >
            Trusted across Indian industry
          </TextReveal>

          {/* Decorative ASCII factory */}
          <div className="hidden lg:block flex-shrink-0">
            <AsciiBlock art={ASCII_ARTS.factory} className="text-[0.5rem]" color="text-amber-400/10" />
          </div>
        </div>

        {/* Partner tabs */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="mb-12 flex gap-4 md:gap-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
            {partnerTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActivePartner(tab)}
                className="relative pb-3 text-[15px] font-medium transition-colors cursor-pointer"
                style={{ color: activePartner === tab ? '#ffffff' : 'rgba(255,255,255,0.35)' }}
              >
                {tab}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-amber-400 transition-transform duration-300"
                  style={{ transform: activePartner === tab ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonial */}
        <ScrollReveal variant="blur-in" delay={0.3}>
          <div className="max-w-3xl">
            <blockquote className="mb-8 font-display text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium leading-relaxed text-white/70">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              {/* Partner logo placeholder */}
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/5 font-mono-accent text-xs font-medium text-white/40">
                {currentTestimonial.partnerLogo.charAt(0)}
              </div>
              <div>
                {currentTestimonial.authorName && (
                  <p className="text-[15px] font-medium text-white/90">{currentTestimonial.authorName}</p>
                )}
                <p className="font-mono-accent text-[12px] text-white/30 uppercase tracking-[0.08em]">{currentTestimonial.authorTitle}</p>
              </div>
            </div>

            <ScrollReveal variant="scale-up" delay={0.5}>
              <a href="#" className="btn-kenesis-outline mt-8 inline-flex">
                See the details
              </a>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}