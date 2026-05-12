'use client';

import React, { useEffect, useRef } from 'react';
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(n + 1) * 120}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Heading deblur
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, y: 20, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: headingDur, ease: 'power3.out' },
          0
        );
      }

      // Each paragraph
      paragraphs.forEach((_, i) => {
        const el = paraRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll<HTMLSpanElement>('.sh-word');
        const wordCount = words.length;
        if (wordCount === 0) return;

        const segStart = headingDur + i * segmentDur;
        const revealDur = 2.2;

        // Counter
        if (counterRef.current) {
          tl.to(counterRef.current, {
            textContent: `${i + 1}`, duration: 0.01, snap: { textContent: 1 },
          }, segStart);
        }

        // Container fade in
        tl.fromTo(el,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          segStart
        );

        // Words: blur deblur sweep left to right
        tl.fromTo(words,
          { opacity: 0.08, filter: 'blur(6px)', color: 'rgba(255,255,255,0.08)' },
          {
            opacity: 1, filter: 'blur(0px)', color: 'rgba(255,255,255,0.9)',
            duration: revealDur / wordCount,
            stagger: revealDur / wordCount,
            ease: 'power2.out',
          },
          segStart + 0.3
        );

        // Progress bar
        const progressBar = progressRefs.current[i];
        if (progressBar) {
          tl.fromTo(progressBar,
            { width: '0%' },
            { width: '100%', duration: revealDur + 0.5, ease: 'none' },
            segStart + 0.3
          );
        }

        // Fade out (skip last)
        if (i < n - 1) {
          tl.to(words, {
            opacity: 0.05, filter: 'blur(4px)', color: 'rgba(255,255,255,0.05)',
            duration: 0.5, stagger: 0.01, ease: 'power2.in',
          }, segStart + 3.2);
          tl.to(el,
            { y: -15, opacity: 0, duration: 0.4, ease: 'power2.in' },
            segStart + 3.4
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [paragraphs]);

  if (prefersReducedMotion()) {
    return (
      <section className="relative z-[1] mx-auto max-w-[1152px] px-4 sm:px-6 py-16 md:py-32 md:px-12 border-t border-white/[0.06]">
        <h2 className="font-display text-[clamp(24px,4vw,36px)] font-semibold text-white/90 mb-16">{heading}</h2>
        <div className="max-w-3xl space-y-8">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[clamp(16px,2.5vw,22px)] leading-[1.6] text-white/60">{p}</p>
          ))}
        </div>
      </section>
    );
  }

  const n = paragraphs.length;

  return (
    <div ref={sectionRef} className="relative z-[1] min-h-screen flex items-center border-t border-white/[0.06] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 65%)' }} />

      <div className="relative z-[1] mx-auto max-w-[1024px] px-4 sm:px-6 md:px-12 w-full">
        {/* Heading */}
        <h2 ref={headingRef} className="font-display text-[clamp(22px,5vw,48px)] font-semibold text-white/95 mb-10 md:mb-16 text-center" style={{ opacity: 0 }}>
          {heading}
        </h2>

        {/* Paragraph stack */}
        <div className="relative min-h-[300px] sm:min-h-[260px] md:min-h-[220px]">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              ref={el => { paraRefs.current[i] = el; }}
              className="absolute inset-0 text-[clamp(16px,2.2vw,20px)] leading-[1.7] text-center max-w-[832px] mx-auto px-4 sm:px-2"
              style={{ opacity: 0 }}
            >
              {text.split(' ').map((word, j, arr) => (
                <React.Fragment key={j}>
                  <span
                    className="sh-word inline-block"
                    style={{ opacity: 0.08, filter: 'blur(6px)', color: 'rgba(255,255,255,0.08)' }}
                  >
                    {word}
                  </span>
                  {j < arr.length - 1 ? ' ' : null}
                </React.Fragment>
              ))}
            </p>
          ))}
        </div>

        {/* Step counter */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <span className="font-mono-accent text-[12px] text-white/20">
            <span ref={counterRef} className="text-amber-400/60">1</span>
            <span className="text-white/10"> / {n}</span>
          </span>
        </div>

        {/* Progress bars */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {paragraphs.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full bg-white/[0.04] overflow-hidden" style={{ width: '48px' }}>
              <div ref={el => { progressRefs.current[i] = el; }} className="h-full rounded-full" style={{ width: '0%', background: 'linear-gradient(90deg, rgba(245,158,11,0.3), rgba(245,158,11,0.6))' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
