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
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const n = paragraphs.length;

      // Total scroll distance: heading + n paragraphs with breathing room
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(n + 1) * 100}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // ── Phase 0: Heading reveals ──
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          0
        );
      }

      // ── Phase 1–N: Each paragraph gets an equal segment ──
      // Each segment: [reveal words] → [hold] → [fade out]
      // Segment size = 3 units each, starting after heading (1 unit)
      const headingDur = 1;
      const segmentDur = 3;

      paragraphs.forEach((_, i) => {
        const el = paraRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll('.sh-word');
        const wordCount = words.length;
        if (wordCount === 0) return;

        const segStart = headingDur + i * segmentDur;

        // Reveal: all words go from dim to bright, staggered
        // Total stagger span = 1.5 units, each word's own tween = short
        tl.fromTo(words,
          { opacity: 0.1, color: 'rgba(255,255,255,0.1)' },
          {
            opacity: 1,
            color: 'rgba(255,255,255,0.9)',
            duration: 1.5 / wordCount, // each word's individual duration
            stagger: 1.5 / wordCount,  // total spread = 1.5 units
            ease: 'none',
          },
          segStart
        );

        // Hold fully visible for 0.5 units (implicit — gap between reveal end and fade start)

        // Fade out (skip for last paragraph — it stays visible)
        if (i < n - 1) {
          tl.to(words,
            { opacity: 0.06, color: 'rgba(255,255,255,0.06)', duration: 0.8, ease: 'power1.in' },
            segStart + 2.2
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

  return (
    <div ref={sectionRef} className="relative z-[1] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06] min-h-screen flex flex-col justify-center">
      <h2 ref={headingRef} className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 mb-16" style={{ opacity: 0 }}>
        {heading}
      </h2>
      <div className="max-w-3xl space-y-10">
        {paragraphs.map((text, i) => (
          <p
            key={i}
            ref={el => { paraRefs.current[i] = el; }}
            className="text-[clamp(1.3rem,2.5vw,1.7rem)] leading-[1.6]"
          >
            {text.split(' ').map((word, j) => (
              <span key={j} className="sh-word inline-block mr-[0.25em]" style={{ opacity: 0.1, color: 'rgba(255,255,255,0.1)' }}>
                {word}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
