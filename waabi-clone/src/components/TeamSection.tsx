'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BlurFade } from '@/components/magicui/blur-fade';
import { AsciiImage } from '@/components/magicui/ascii-image';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TEAM: TeamMember[] = [
  { name: 'Amrish Poornachandran', role: 'CEO', bio: 'The pitch, the vision, the deal. Drives business strategy and investor relations.', image: '/team/amr.webp' },
  { name: 'Daniel Das', role: 'CTO', bio: 'AI and backend architecture. Builds the inference pipelines that run on-premise.', image: '/team/dan.webp' },
  { name: 'Dheekshith', role: 'COO', bio: 'Operations, AI, and backend. Keeps the machine running and the models shipping.', image: '/team/dheek.webp' },
  { name: 'Aswin JD', role: 'CAIO', bio: 'Chief AI Officer. The core AI brain — model training, optimization, and research.', image: '/team/aswin.webp' },
  { name: 'Dinesh Kumar', role: 'CPO', bio: 'Visual creativity and marketing. Shapes how Kenesis looks, feels, and speaks.', image: '/team/dk.webp' },
  { name: 'Rakesh', role: 'Operations', bio: 'Factory deployments across Tamil Nadu. Every server ships and runs.', image: '/team/rakesh.webp' },
];

export default function TeamSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.team-card');

    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-[2] py-[120px] px-[24px] md:px-[48px]">
      <div className="mx-auto max-w-[1100px]">
        <BlurFade delay={0} duration={0.5} blur="6px" offset={10} inView inViewMargin="-80px">
          <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-amber-400/40 mb-[12px]">The team</p>
        </BlurFade>
        <BlurFade delay={0.1} duration={0.6} blur="8px" offset={14} inView inViewMargin="-80px">
          <h2 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.025em] text-white/90 mb-[64px]">
            Six people. One obsession.
          </h2>
        </BlurFade>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-[24px] md:gap-[32px]">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="team-card group cursor-pointer"
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] rounded-[16px] overflow-hidden mb-[20px] bg-[#0a0a0b]">
                {/* ASCII art portrait */}
                <AsciiImage
                  src={member.image}
                  alt={member.name}
                  cellWidth={3}
                  cellHeight={5}
                  contrastExponent={1.8}
                  colorMode="tinted"
                  color="#c9a04e"
                  bgColor="#0a0a0b"
                  bgBlur={0}
                  bgOpacity={0}
                  className="w-full h-full transition-opacity duration-700 group-hover:opacity-0"
                />
                {/* Real photo on hover */}
                <img
                  src={member.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  loading="lazy"
                  aria-hidden="true"
                />
                {/* Border */}
                <div className="absolute inset-0 rounded-[16px] border border-white/[0.04] group-hover:border-amber-400/25 transition-colors duration-500 pointer-events-none z-[2]" />
                {/* Bottom gradient + bio on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Bio on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-[20px] translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[14px] leading-[1.6] text-white/60">{member.bio}</p>
                </div>
              </div>
              {/* Name + role */}
              <h3 className="font-display text-[18px] font-semibold text-white/85 mb-[4px] group-hover:text-white transition-colors">{member.name}</h3>
              <p className="font-mono-accent text-[12px] uppercase tracking-[0.14em] text-white/25 group-hover:text-amber-400/50 transition-colors duration-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
