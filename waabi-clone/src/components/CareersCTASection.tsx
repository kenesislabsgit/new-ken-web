'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DitheredWaves = dynamic(
  () => import('@/components/magicui/dithered-waves').then(m => ({ default: m.DitheredWaves })),
  { ssr: false }
);

const images = [
  { src: '/images/careers/4.png', alt: 'Team collaboration', cls: 'col-span-1 row-span-1 aspect-[4/3]' },
  { src: '/images/careers/3.png', alt: 'Engineering workspace', cls: 'col-span-1 row-span-2' },
  { src: '/images/careers/1.png', alt: 'AI development', cls: 'col-span-1 row-span-1 aspect-[4/3]' },
  { src: '/images/careers/5.png', alt: 'Team meeting', cls: 'col-span-1 row-span-1 aspect-[4/3]' },
  { src: '/images/careers/2.png', alt: 'Office culture', cls: 'col-span-1 row-span-1 aspect-[4/3]' },
];

export default function CareersCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.6,
          start: 'top top',
          end: '+=200vh',
        },
      });

      // Phase 1: Heading words blur-fade in (0 → 0.25)
      const words = heading.querySelectorAll('.cta-word');
      tl.fromTo(words,
        { y: 40, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.2, ease: 'power3.out' },
        0
      );

      // Phase 1b: CTA button (0.15 → 0.25)
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' },
          0.15
        );
      }

      // Phase 2: Mosaic images stagger in (0.25 → 0.8)
      const cards = grid.querySelectorAll('.mosaic-card');
      cards.forEach((card, i) => {
        const start = 0.25 + i * 0.1;
        tl.fromTo(card,
          { y: 50 + i * 8, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.12, ease: 'power3.out' },
          start
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0b] overflow-hidden" data-testid="careers-cta">
      {/* DitheredWaves background */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
        <DitheredWaves color="#f59e0b" cellSize={14} speed={0.6} layers={2} amplitude={25} frequency={0.01} charset=" .:-=+*#" enableMouse mouseRadius={250} className="h-full w-full" />
      </div>

      <div className="relative z-[1] flex h-screen w-full flex-col items-center justify-center px-[24px] md:px-[48px]">
        {/* Heading */}
        <div ref={headingRef} className="mb-[32px] text-center">
          <h2 className="font-display text-[clamp(40px,7vw,80px)] font-semibold leading-[1] tracking-[-0.03em]">
            {'Build on-premise AI with us.'.split(' ').map((word, i) => (
              <span key={i} className="cta-word inline-block mr-[0.3em] text-white/90" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
          </h2>
        </div>

        <a
          ref={ctaRef}
          href="/contact"
          className="btn-kenesis mb-[48px] inline-flex font-mono-accent text-[14px] uppercase tracking-[0.1em]"
          style={{ opacity: 0 }}
        >
          Join the team
        </a>

        {/* Mosaic grid */}
        <div ref={gridRef} className="mx-auto grid w-full max-w-[900px] grid-cols-3 gap-[16px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`mosaic-card overflow-hidden rounded-[16px] ${img.cls}`}
              style={{ opacity: 0 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
