'use client';

import { useEffect, useRef } from 'react';
import { bindParallax, cleanupScrollTrigger } from '@/lib/animations';
import { Card } from '@heroui/react';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { AsciiDivider, AsciiCorners, AsciiBlock, ASCII_ARTS } from '@/components/AsciiArt';
import { AsciiRenderer } from '@/components/magicui/ascii-renderer';

const techCards = [
  { title: 'PPE Compliance', subtitle: 'Helmets, vests, gloves, footwear — detected in real time across every camera feed.', ascii: ASCII_ARTS.shield, image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=60' },
  { title: 'Zone Detection', subtitle: 'Restricted area breaches and perimeter intrusions flagged instantly with contextual alerts.', ascii: ASCII_ARTS.eye, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=60' },
  { title: 'Shift Analytics', subtitle: 'Headcount tracking, attendance, and shift-level safety reporting dashboard.', ascii: ASCII_ARTS.network, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60' },
];

export default function TechCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = bindParallax(bgRef.current, { factor: 0.2 });
    return () => { cleanupScrollTrigger(st, bgRef.current); };
  }, []);

  return (
    <section ref={sectionRef} id="technology" className="w-full bg-[#0a0a0b]">
      {/* Hero banner — "Built to think. Born to haul." */}
      <div className="relative overflow-hidden bg-cod-gray py-32 md:py-48">
        <div ref={bgRef} className="absolute inset-0 -top-[15%] h-[130%] w-full opacity-30">
          <div className="h-full w-full bg-gradient-to-br from-cod-gray via-cod-gray/80 to-cod-gray/60" />
        </div>
        {/* Flickering grid overlay */}
        <FlickeringGrid
          className="absolute inset-0 z-[1] opacity-20"
          squareSize={3}
          gridGap={6}
          color="rgb(245, 158, 11)"
          maxOpacity={0.15}
          flickerChance={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cod-gray via-transparent to-transparent z-[2]" />
        <div className="relative z-10 mx-auto max-w-[1234px] px-6 md:px-12">
          <ScrollReveal variant="clip-up" duration={1}>
            <h2
              className="font-display text-[clamp(3rem,8vw,9rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-white"
            >
              Built to detect.<br />Born to protect.
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2}>
            <a
              href="#"
              className="btn-kenesis mt-10 inline-flex font-mono-accent text-[1.3rem] uppercase tracking-[0.1em]"
            >
              Explore solutions
            </a>
          </ScrollReveal>
        </div>
      </div>

      {/* ASCII divider */}
      <div className="mx-auto max-w-[1234px] px-6 md:px-12 py-2">
        <AsciiDivider accent="◈" />
      </div>

      {/* 3 tech insight cards */}
      <div className="mx-auto max-w-[1234px] px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {techCards.map((card, i) => (
            <ScrollReveal key={card.title} variant="rotate-in" delay={0.1 + i * 0.15}>
              <AsciiCorners>
                <Card
                  className="group relative overflow-hidden rounded-2xl aspect-[608/841] cursor-pointer glass-card border-0"
                >
                  {/* ASCII-rendered image background */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                    <AsciiRenderer
                      src={card.image}
                      columns={60}
                      fontSize={6}
                      lineHeight={0.9}
                      color="#f59e0b"
                      animate={true}
                      className="w-full h-full overflow-hidden"
                    />
                  </div>
                  {/* ASCII art watermark */}
                  <div className="absolute top-6 right-6 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <AsciiBlock art={card.ascii} className="text-[0.5rem]" color="text-amber-400/20" />
                  </div>
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40" />
                  {/* Content at bottom */}
                  <Card.Content className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <Card.Title className="mb-2 text-2xl font-display font-semibold text-white">{card.title}</Card.Title>
                    <Card.Description className="font-mono-accent text-[12px] leading-relaxed text-white/50 uppercase tracking-[0.06em]">{card.subtitle}</Card.Description>
                  </Card.Content>
                </Card>
              </AsciiCorners>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
