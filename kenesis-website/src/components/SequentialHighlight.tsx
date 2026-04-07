'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  heading: string;
  paragraphs: string[];
}

export default function SequentialHighlight({ heading, paragraphs }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const n = paragraphs.length;
      const segmentDur = 4;
      const headingDur = 1.5;
      const totalDur = headingDur + n * segmentDur;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(n + 1) * 120}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // ── Heading: scale up from nothing ──
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, scale: 0.85, y: 40, filter: 'blur(16px)' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: headingDur, ease: 'power3.out' },
          0
        );
      }

      // ── Each paragraph: cinematic one-at-a-time reveal ──
      paragraphs.forEach((_, i) => {
        const el = paraRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll('.sh-word');
        const wordCount = words.length;
        if (wordCount === 0) return;

        const segStart = headingDur + i * segmentDur;

        // Counter update
        if (counterRef.current) {
          tl.to(counterRef.current, {
            textContent: `${i + 1}`,
            duration: 0.01,
            snap: { textContent: 1 },
          }, segStart);
        }

        // Paragraph container slides up into view
        tl.fromTo(el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          segStart
        );

        // Words highlight progressively — sweeping left to right
        const revealDur = 2.0;
        tl.fromTo(words,
          { opacity: 0.12, color: 'rgba(255,255,255,0.12)' },
          {
            opacity: 1,
            color: 'rgba(255,255,255,0.92)',
            duration: revealDur / wordCount,
            stagger: revealDur / wordCount,
            ease: 'none',
          },
          segStart + 0.3
        );

        // Progress bar fills during reveal
        const progressBar = progressRefs.current[i];
        if (progressBar) {
          tl.fromTo(progressBar,
            { width: '0%' },
            { width: '100%', duration: 2.6, ease: 'none' },
            segStart + 0.3
          );
        }

        // Fade out: slide up and dissolve (skip for last)
        if (i < n - 1) {
          tl.to(el,
            { y: -30, opacity: 0, duration: 0.6, ease: 'power2.in' },
            segStart + 3.2
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [paragraphs]);

  if (prefersReducedMotion()) {
    return (
      <section className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-16">{heading}</h2>
        <div className="max-w-3xl space-y-8">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6] text-white/60">{p}</p>
          ))}
        </div>
      </section>
    );
  }

  const n = paragraphs.length;

  return (
    <div ref={sectionRef} className="relative z-[1] min-h-screen flex items-center border-t border-white/[0.06] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)' }} />

      <div className="relative z-[1] mx-auto max-w-[64rem] px-6 md:px-12 w-full">
        {/* Heading */}
        <h2 ref={headingRef} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold tracking-[-0.03em] text-white/95 mb-20 text-center" style={{ opacity: 0 }}>
          {heading}
        </h2>

        {/* Paragraph stack — absolutely positioned so they overlap in the same space */}
        <div className="relative min-h-[280px] md:min-h-[240px]">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              ref={el => { paraRefs.current[i] = el; }}
              className="absolute inset-0 text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.75] text-center max-w-[52rem] mx-auto"
              style={{ opacity: 0 }}
            >
              {text.split(' ').map((word, j) => (
                <span key={j} className="sh-word inline-block mr-[0.3em]" style={{ opacity: 0.12, color: 'rgba(255,255,255,0.12)' }}>
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Step counter */}
        <div className="flex items-center justify-center gap-3 mt-16">
          <span className="font-mono-accent text-[13px] tracking-[0.2em] text-amber-400/50">
            <span ref={counterRef}>1</span>
            <span className="text-white/15"> / {n}</span>
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {paragraphs.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden" style={{ width: '48px' }}>
              <div ref={el => { progressRefs.current[i] = el; }} className="h-full bg-amber-400/50 rounded-full" style={{ width: '0%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
