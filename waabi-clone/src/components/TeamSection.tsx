'use client';

import { useEffect, useRef, useState } from 'react';
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

function TeamCard({ member }: { member: TeamMember }) {
  const [tapped, setTapped] = useState(false);
  const active = tapped ? 'active' : '';

  return (
    <div
      className={`team-card group cursor-pointer ${active}`}
      style={{ opacity: 0 }}
      onClick={() => setTapped(prev => !prev)}
    >
      <div className="relative aspect-[3/4] rounded-[16px] overflow-hidden mb-[20px] bg-[#0a0a0b]">
        <AsciiImage
          src={member.image}
          alt={member.name}
          cellWidth={4}
          cellHeight={6}
          contrastExponent={1.8}
          colorMode="tinted"
          color="#c9a04e"
          bgColor="#0a0a0b"
          bgBlur={0}
          bgOpacity={0}
          className={`w-full h-full transition-opacity duration-700 ${tapped ? 'opacity-0' : 'group-hover:opacity-0'}`}
        />
        <img
          src={member.image}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${tapped ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          loading="lazy"
          aria-hidden="true"
        />
        <div className={`absolute inset-0 rounded-[16px] border transition-colors duration-500 pointer-events-none z-[2] ${tapped ? 'border-amber-400/25' : 'border-white/[0.04] group-hover:border-amber-400/25'}`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-transparent to-transparent transition-opacity duration-500 ${tapped ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        <div className={`absolute bottom-0 left-0 right-0 p-[20px] transition-all duration-500 ${tapped ? 'translate-y-0 opacity-100' : 'translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
          <p className="text-[14px] leading-[1.6] text-white/60">{member.bio}</p>
        </div>
      </div>
      <h3 className={`font-display text-[18px] font-semibold mb-[4px] transition-colors ${tapped ? 'text-white' : 'text-white/85 group-hover:text-white'}`}>{member.name}</h3>
      <p className={`font-mono-accent text-[12px] uppercase tracking-[0.14em] transition-colors duration-500 ${tapped ? 'text-amber-400/50' : 'text-white/25 group-hover:text-amber-400/50'}`}>{member.role}</p>
    </div>
  );
}

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

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[20px] sm:gap-[24px] md:gap-[32px]">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
