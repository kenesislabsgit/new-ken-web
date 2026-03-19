'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';

const partnerTabs = ['Manufacturing', 'Pharma', 'Logistics', 'Infrastructure'];

interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  partnerLogo: string;
}

const testimonials: Record<string, Testimonial> = {
  Manufacturing: {
    quote: 'Kenesis transformed our factory floor safety monitoring overnight. The on-premise deployment meant zero concerns about our production data leaving the facility — and the alerts are actually actionable.',
    authorName: 'Rajesh Kumar',
    authorTitle: 'Plant Head, Manufacturing Unit',
    partnerLogo: 'M',
  },
  Pharma: {
    quote: 'In pharmaceutical manufacturing, compliance is everything. Kenesis gives us real-time PPE monitoring without any cloud dependency — exactly what our data policies require.',
    authorName: '',
    authorTitle: 'Pharmaceutical Plant',
    partnerLogo: 'P',
  },
  Logistics: {
    quote: 'Our warehouse operations run 24/7. Kenesis catches safety violations across 30+ cameras simultaneously on a single edge device — the ROI was immediate.',
    authorName: '',
    authorTitle: 'Logistics Warehouse',
    partnerLogo: 'L',
  },
  Infrastructure: {
    quote: 'For construction sites with poor connectivity, cloud-based solutions were never an option. Kenesis works offline, on-premise, and delivers alerts that our safety officers actually trust.',
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
    <section id="partners" className="bg-[#0a0a0b] py-32">
      <div className="mx-auto max-w-[1234px] px-6 md:px-12">
        <TextReveal
          variant="word-blur"
          as="h2"
          className="mb-16 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90"
        >
          Trusted by Indian industry
        </TextReveal>

        {/* Partner tabs */}
        <ScrollReveal variant="fade-up" delay={0.15}>
          <div className="mb-12 flex gap-8 border-b border-white/10">
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
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/5 text-xs font-medium text-white/40">
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