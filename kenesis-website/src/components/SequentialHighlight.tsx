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

// Characters used for the terminal scramble effect
const GLITCH_CHARS = '█▓▒░╔╗╚╝═║┌┐└┘─│▄▀■□●○◆◇';

export default function SequentialHighlight({ heading, paragraphs }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const n = paragraphs.length;
      const segmentDur = 5;
      const headingDur = 1.8;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(n + 1) * 140}%`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // ── Heading: deblur + scale ──
      if (headingRef.current) {
        tl.fromTo(headingRef.current,
          { opacity: 0, scale: 0.88, y: 30, filter: 'blur(20px)' },
          { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: headingDur, ease: 'power3.out' },
          0
        );
      }

      // Cursor blink starts with heading
      if (cursorRef.current) {
        tl.fromTo(cursorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.01 },
          0.5
        );
      }

      // ── Each paragraph ──
      paragraphs.forEach((text, i) => {
        const el = paraRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll<HTMLSpanElement>('.sh-word');
        const wordCount = words.length;
        if (wordCount === 0) return;

        const segStart = headingDur + i * segmentDur;
        const revealDur = 2.8;
        const wordDelay = revealDur / wordCount;

        // Counter update
        if (counterRef.current) {
          tl.to(counterRef.current, {
            textContent: `${i + 1}`,
            duration: 0.01,
            snap: { textContent: 1 },
          }, segStart);
        }

        // Container fades in
        tl.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
          segStart
        );

        // Each word: blur → scramble → deblur → settle
        words.forEach((word, j) => {
          const originalText = word.getAttribute('data-text') || word.textContent || '';
          const wordStart = segStart + 0.3 + j * wordDelay;

          // Phase 1: Deblur — word goes from blurred/dim to sharp/bright
          tl.fromTo(word,
            { filter: 'blur(8px)', opacity: 0.05, color: 'rgba(255,255,255,0.05)' },
            { filter: 'blur(0px)', opacity: 1, color: 'rgba(255,255,255,0.92)', duration: wordDelay * 1.5, ease: 'power2.out' },
            wordStart
          );

          // Phase 2: Terminal scramble — briefly show random chars then settle
          // We use onUpdate to swap text content during the tween
          const scrambleObj = { progress: 0 };
          tl.to(scrambleObj, {
            progress: 1,
            duration: wordDelay * 1.2,
            ease: 'power2.in',
            onUpdate: () => {
              const p = scrambleObj.progress;
              if (p < 0.7) {
                // Scramble phase: replace chars with glitch characters
                const chars = originalText.split('');
                const scrambled = chars.map((ch, ci) => {
                  // Characters resolve left to right
                  const charProgress = (p / 0.7) - (ci / chars.length) * 0.5;
                  if (charProgress > 0.6) return ch; // resolved
                  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                }).join('');
                word.textContent = scrambled;
              } else {
                // Settled
                word.textContent = originalText;
              }
            },
            onComplete: () => { word.textContent = originalText; },
          }, wordStart);
        });

        // Progress bar
        const progressBar = progressRefs.current[i];
        if (progressBar) {
          tl.fromTo(progressBar,
            { width: '0%' },
            { width: '100%', duration: revealDur + 0.5, ease: 'none' },
            segStart + 0.3
          );
        }

        // Fade out (skip for last)
        if (i < n - 1) {
          // Words blur back out
          tl.to(words, {
            filter: 'blur(6px)',
            opacity: 0.04,
            color: 'rgba(255,255,255,0.04)',
            duration: 0.6,
            stagger: 0.01,
            ease: 'power2.in',
          }, segStart + 4.0);

          // Container slides away
          tl.to(el,
            { y: -20, opacity: 0, duration: 0.5, ease: 'power2.in' },
            segStart + 4.2
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.035) 0%, transparent 65%)' }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)', backgroundSize: '100% 4px' }} />

      <div className="relative z-[1] mx-auto max-w-[64rem] px-6 md:px-12 w-full">
        {/* Heading */}
        <h2 ref={headingRef} className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold tracking-[-0.03em] text-white/95 mb-20 text-center" style={{ opacity: 0 }}>
          {heading}
        </h2>

        {/* Paragraph stack */}
        <div className="relative min-h-[280px] md:min-h-[240px]">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              ref={el => { paraRefs.current[i] = el; }}
              className="absolute inset-0 text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.75] text-center max-w-[52rem] mx-auto font-light"
              style={{ opacity: 0 }}
            >
              {text.split(' ').map((word, j) => (
                <span
                  key={j}
                  className="sh-word inline-block mr-[0.3em]"
                  data-text={word}
                  style={{ opacity: 0.05, color: 'rgba(255,255,255,0.05)', filter: 'blur(8px)' }}
                >
                  {word}
                </span>
              ))}
            </p>
          ))}

          {/* Terminal cursor */}
          <span
            ref={cursorRef}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono-accent text-amber-400/60 text-[1.4rem] animate-pulse"
            style={{ opacity: 0 }}
          >
            ▌
          </span>
        </div>

        {/* Step counter — terminal style */}
        <div className="flex items-center justify-center gap-3 mt-16">
          <span className="font-mono-accent text-[12px] tracking-[0.25em] text-amber-400/40">
            [<span ref={counterRef} className="text-amber-400/70">1</span>
            <span className="text-white/15">/{n}</span>]
          </span>
        </div>

        {/* Progress bars */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {paragraphs.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden" style={{ width: '48px' }}>
              <div ref={el => { progressRefs.current[i] = el; }} className="h-full rounded-full" style={{ width: '0%', background: 'linear-gradient(90deg, rgba(245,158,11,0.3), rgba(245,158,11,0.7))' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
