'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const title = slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? 'Article';
  const imageInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = imageInnerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: -30, scale: 1.08 },
        {
          y: 30, scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      <article className="mx-auto max-w-[56rem] px-6 pb-24 md:px-12">
        <BlurFade delay={0.05} duration={0.4} blur="4px" offset={8}>
          <a href="/news" className="font-mono-accent text-[1.1rem] uppercase tracking-[0.1em] text-white/30 hover:text-amber-400/60 transition-colors mb-8 inline-block">
            ← Back to News
          </a>
        </BlurFade>
        <BlurFade delay={0.15} duration={0.7} blur="10px" offset={20}>
          <h1 className="font-display font-semibold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] text-white/90 mb-6">
            {title}
          </h1>
        </BlurFade>
        <BlurFade delay={0.35} duration={0.5} blur="6px" offset={10}>
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono-accent text-[1.1rem] text-white/30 tracking-[0.04em]">January 2026</span>
            <span className="font-mono-accent rounded-full bg-white/[0.08] px-3 py-1 text-[1rem] text-white/45 uppercase tracking-[0.08em]">Company News</span>
          </div>
        </BlurFade>

        <ScrollReveal variant="clip-up" duration={1}>
          <div className="aspect-[16/9] rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-12 overflow-hidden">
            <div ref={imageInnerRef} className="h-full w-full bg-gradient-to-br from-white/[0.02] to-white/[0.06]" />
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.1}>
          <div className="space-y-6 text-[1.5rem] leading-[1.8] text-white/55">
            <p>This is a placeholder for the full article content. In production, this would be fetched from a CMS or markdown files.</p>
            <p>The article would contain detailed information about the announcement, including quotes from leadership, technical details, and implications for the industry.</p>
          </div>
        </ScrollReveal>
      </article>
    </PageShell>
  );
}
