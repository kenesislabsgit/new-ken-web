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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${paragraphs.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Heading fades in first
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, y: 30, filter: 'blur(12px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' },
          0
        );
      }

      // Each paragraph: fade in words sequentially, hold, then fade out
      const n = paragraphs.length;
      paragraphs.forEach((_, i) => {
        const el = paraRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll('.sh-word');
        const segmentStart = 0.3 + i * (1 / n);

        // Fade in all words with stagger
        tl.fromTo(words,
          { opacity: 0.15, color: 'rgba(255,255,255,0.15)' },
          { opacity: 1, color: 'rgba(255,255,255,0.85)', stagger: 0.02, duration: 0.25, ease: 'none' },
          segmentStart
        );

        // Fade out (except last paragraph)
        if (i < n - 1) {
          tl.to(words,
            { opacity: 0.08, color: 'rgba(255,255,255,0.08)', duration: 0.1, ease: 'power1.in' },
            segmentStart + 0.3
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
              <span key={j} className="sh-word inline-block mr-[0.25em]" style={{ opacity: 0.15, color: 'rgba(255,255,255,0.15)' }}>
                {word}
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}
