'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { Chip } from '@heroui/react';
import { SpectraNoise } from '@/components/magicui/spectra-noise';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { AsciiDivider } from '@/components/AsciiArt';

const DitheredWaves = dynamic(
  () => import('@/components/magicui/dithered-waves').then(m => ({ default: m.DitheredWaves })),
  { ssr: false }
);
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

interface ArticleCard {
  title: string;
  date: string;
  tags: string[];
}

const articles: ArticleCard[] = [
  {
    title: 'Kenesis Labs launches on-premise AI platform for Indian manufacturing safety',
    date: 'January 15, 2026',
    tags: ['Company news'],
  },
  {
    title: 'How contextual AI delivers safety alerts on-premise',
    date: 'December 10, 2025',
    tags: ['Technology'],
  },
  {
    title: 'Why cloud-based CCTV analytics fail Indian factories — and what works instead',
    date: 'November 20, 2025',
    tags: ['Industry', 'Technology'],
  },
  {
    title: 'PPE compliance monitoring: From bounding boxes to actionable intelligence',
    date: 'October 15, 2025',
    tags: ['Technology'],
  },
  {
    title: 'Running 30 cameras on a single server: Our inference benchmark',
    date: 'September 28, 2025',
    tags: ['Technology', 'Benchmark'],
  },
  {
    title: 'Data sovereignty in Indian manufacturing: Why on-premise AI matters',
    date: 'August 18, 2025',
    tags: ['Industry'],
  },
  {
    title: 'Kenesis Labs incorporated in Chennai, Tamil Nadu',
    date: 'July 2025',
    tags: ['Company news'],
  },
];

export function getCardDelay(index: number): number {
  return index * 100;
}

export default function InsightsGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Subtle parallax: horizontal translate on scroll */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-[#0a0a0b] py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-25">
        <SpectraNoise
          hueShift={-30}
          noiseIntensity={0.03}
          scanlineIntensity={0.08}
          scanlineFrequency={0.005}
          warpAmount={1.0}
          speed={0.25}
          resolutionScale={0.5}
          primaryColor={[0.04, 0.04, 0.02]}
          secondaryColor={[0.45, 0.38, 0.0]}
          accentColor={[0.98, 0.80, 0.08]}
          colorIntensity={0.9}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-[1] mx-auto max-w-[1920px] px-6 md:px-12 lg:px-[343px]">
        <AsciiDivider className="mb-8" accent="◆" />
        {/* Header */}
        <div className="mb-12 flex items-baseline justify-between">
          <TextReveal
            variant="word-slide"
            as="h2"
            className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-white/90"
          >
            Insights.
          </TextReveal>
          <a href="#" className="text-[15px] font-medium text-white/40 hover:text-white transition-colors">
            View all
          </a>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="relative z-[1] flex gap-6 overflow-x-auto px-6 pb-4 md:px-12 lg:px-[343px] scrollbar-hide"
      >
        {articles.map((article, i) => (
          <ScrollReveal key={i} variant="fade-up" delay={i * 0.08}>
            <article
              className="group w-[450px] flex-shrink-0 cursor-pointer"
            >
              {/* Thumbnail placeholder */}
              <div className="mb-4 h-[280px] w-full overflow-hidden rounded-xl bg-white/5">
                <div className="h-full w-full bg-gradient-to-br from-white/[0.03] to-white/[0.08] transition-transform duration-300 group-hover:scale-105" />
              </div>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Chip key={tag} variant="secondary" size="sm">
                    {tag}
                  </Chip>
                ))}
              </div>

              {/* Title */}
              <h3 className="mb-2 font-display text-[17px] font-semibold leading-snug text-white/90 group-hover:text-amber-400 transition-colors">
                {article.title}
              </h3>

              {/* Date */}
              <p className="font-mono-accent text-[11px] text-white/25 uppercase tracking-[0.06em]">{article.date}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}