'use client';

import { useEffect, useRef, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/animations';
import { SpectraNoise } from '@/components/magicui/spectra-noise';
import { AsciiBlock, ASCII_ARTS } from '@/components/AsciiArt';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MosaicAnimationConfig {
  x?: number;
  y?: number;
  delay: number;
}

export function getMosaicAnimation(position: string): MosaicAnimationConfig {
  switch (position) {
    case 'top-left': return { x: -40, delay: 0 };
    case 'top-right': return { x: 40, delay: 0 };
    case 'bottom-left': return { y: 40, delay: 0 };
    case 'bottom-right': return { y: 40, delay: 0.1 };
    default: return { delay: 0 };
  }
}

interface MosaicImage {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-right';
  className: string;
  image: string;
  alt: string;
}

const mosaicImages: MosaicImage[] = [
  {
    position: 'top-left',
    className: 'col-span-1 row-span-1 aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    alt: 'Team collaboration',
  },
  {
    position: 'top-center',
    className: 'col-span-1 row-span-2 aspect-auto',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    alt: 'Engineering workspace',
  },
  {
    position: 'top-right',
    className: 'col-span-1 row-span-1 aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    alt: 'AI development',
  },
  {
    position: 'bottom-left',
    className: 'col-span-1 row-span-1 aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    alt: 'Team meeting',
  },
  {
    position: 'bottom-right',
    className: 'col-span-1 row-span-1 aspect-[4/3]',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    alt: 'Office culture',
  },
];

/* ── 3D Tilt Mosaic Card ── */
function MosaicCard({ image, children }: { image: MosaicImage; children?: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 10;
    const rotateY = (x - 0.5) * 10;
    gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
    if (glow) {
      gsap.to(glow, {
        opacity: 0.25,
        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(245,158,11,0.2), transparent 60%)`,
        duration: 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`mosaic-card relative overflow-hidden rounded-2xl cursor-pointer ${image.className}`}
      style={{ transformStyle: 'preserve-3d', opacity: 0, transform: 'translateY(60px) scale(0.95)' }}
    >
      {/* Image */}
      <div className="mosaic-img absolute inset-0" style={{ clipPath: 'inset(0 0 100% 0)' }}>
        <img src={image.image} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/10" />
      </div>
      {/* Fallback bg */}
      <div className="absolute inset-0 bg-white/[0.04]" />
      {/* Glow */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 z-10" />
      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06] z-10 pointer-events-none" />
      {children}
    </div>
  );
}

export default function CareersCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    if (prefersReducedMotion()) {
      heading.querySelectorAll('.cta-word').forEach(w => gsap.set(w, { opacity: 1, y: 0, filter: 'blur(0px)' }));
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      grid.querySelectorAll('.mosaic-card').forEach(c => gsap.set(c, { opacity: 1, y: 0, scale: 1 }));
      grid.querySelectorAll('.mosaic-img').forEach(i => gsap.set(i, { clipPath: 'inset(0 0 0% 0)' }));
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: '+=250vh',
        },
      });

      // Phase 1: Heading words stagger in with blur-fade (0 → 0.3)
      const words = heading.querySelectorAll('.cta-word');
      tl.fromTo(words,
        { y: 60, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.2, ease: 'power3.out' },
        0
      );

      // Phase 1b: CTA button fades up (0.15 → 0.3)
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' },
          0.15
        );
      }

      // Phase 2: Mosaic cards stagger in (0.3 → 0.85)
      const cards = grid.querySelectorAll('.mosaic-card');
      const imgs = grid.querySelectorAll('.mosaic-img');

      cards.forEach((card, i) => {
        const start = 0.3 + i * 0.11;
        // Card: slide up + unblur + scale
        tl.fromTo(card,
          { y: 60 + i * 10, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.15, ease: 'power3.out' },
          start
        );
        // Image: clip-path wipe from top to bottom
        if (imgs[i]) {
          tl.fromTo(imgs[i],
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration: 0.12, ease: 'power2.out' },
            start + 0.05
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const headingText = 'Build edge AI with us.';

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0b] overflow-hidden" data-testid="careers-cta">
      {/* SpectraNoise background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <SpectraNoise
          hueShift={-30}
          noiseIntensity={0.04}
          scanlineIntensity={0.1}
          scanlineFrequency={0.006}
          warpAmount={1.2}
          speed={0.3}
          resolutionScale={0.5}
          primaryColor={[0.04, 0.04, 0.02]}
          secondaryColor={[0.45, 0.38, 0.0]}
          accentColor={[0.98, 0.80, 0.08]}
          colorIntensity={0.9}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-[1] flex h-screen w-full flex-col items-center justify-center px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="mb-8 text-center">
          <h2 className="font-display text-[clamp(3rem,7vw,8rem)] font-semibold leading-[1] tracking-[-0.03em]">
            {headingText.split(' ').map((word, i) => (
              <span key={i} className="cta-word inline-block mr-[0.35em] text-white/90" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
          </h2>
        </div>

        <a
          ref={ctaRef}
          href="/contact"
          className="btn-kenesis mb-16 inline-flex font-mono-accent text-[1.3rem] uppercase tracking-[0.1em]"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          Join the team
        </a>

        {/* Mosaic photo grid */}
        <div ref={gridRef} className="mx-auto grid w-full max-w-[900px] grid-cols-3 gap-4">
          {mosaicImages.map((img) => (
            <MosaicCard key={img.position} image={img} />
          ))}
        </div>
      </div>
    </section>
  );
}
