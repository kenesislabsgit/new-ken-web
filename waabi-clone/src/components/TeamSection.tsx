'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Founder & CEO',
    role: 'Vision & Strategy',
    bio: 'Building the bridge between edge computing and industrial safety. Former ML engineer with deep roots in real-time inference systems.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'CTO',
    role: 'Architecture & AI',
    bio: 'Architecting on-premise AI pipelines that run 30 camera feeds on 35 watts. Obsessed with latency, efficiency, and doing more with less.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  },
  {
    name: 'Head of Product',
    role: 'Product & Design',
    bio: 'Translating complex computer vision capabilities into interfaces that factory floor managers actually want to use.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
  },
  {
    name: 'Lead Engineer',
    role: 'Edge Inference',
    bio: 'Optimizing YOLOv8 and Qwen2.5-VL to run at production speed on Apple Silicon. When the model fits, the factory wins.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
];

/* ── Animated Avatar with spring-physics tooltip ── */
function AnimatedAvatar({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const springX = useRef(0);
  const springRotate = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!avatarRef.current || !tooltipRef.current) return;
    const rect = avatarRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const offsetX = e.clientX - centerX;
    // Map offset to rotation (-15 to 15 deg) and translateX
    springX.current = offsetX * 0.4;
    springRotate.current = offsetX * 0.15;
    gsap.to(tooltipRef.current, {
      x: springX.current,
      rotateZ: springRotate.current,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    if (!tooltipRef.current) return;
    if (hovered) {
      gsap.fromTo(tooltipRef.current,
        { opacity: 0, y: 10, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    } else {
      gsap.to(tooltipRef.current, {
        opacity: 0, y: 10, scale: 0.85,
        duration: 0.2, ease: 'power2.in',
      });
    }
  }, [hovered]);

  return (
    <div
      className="relative -ml-4 first:ml-0 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ zIndex: hovered ? 50 : TEAM.length - index }}
    >
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 z-50"
        style={{ opacity: 0 }}
      >
        <div className="rounded-xl bg-[#18181b] border border-white/10 px-4 py-2.5 text-center shadow-2xl shadow-black/40">
          <p className="font-display text-[14px] font-semibold text-white/90 whitespace-nowrap">
            {member.name}
          </p>
          <p className="font-mono-accent text-[10px] uppercase tracking-[0.1em] text-amber-400/70 whitespace-nowrap">
            {member.role}
          </p>
          {/* Gradient accent line */}
          <div className="mt-2 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </div>
      </div>

      {/* Avatar */}
      <div
        ref={avatarRef}
        className="h-16 w-16 overflow-hidden rounded-full border-[3px] border-[#0a0a0b] ring-2 ring-white/10 transition-all duration-300 cursor-pointer"
        style={{
          transform: hovered ? 'translateY(-8px) scale(1.1)' : 'translateY(0) scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}

/* ── 3D Tilt Card ── */
function TiltCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 12;
    const rotateY = (x - 0.5) * 12;

    gsap.to(card, {
      rotateX, rotateY,
      duration: 0.4, ease: 'power2.out',
      transformPerspective: 800,
    });

    if (glow) {
      gsap.to(glow, {
        opacity: 0.15,
        background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(245,158,11,0.3), transparent 60%)`,
        duration: 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.3 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="team-card relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-8 cursor-pointer"
      style={{
        opacity: 0,
        transform: 'translateY(80px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Glow follow cursor */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0" />

      <div className="relative z-10 flex gap-6 items-start">
        {/* Photo */}
        <div className="team-img h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl" style={{ clipPath: 'inset(0 100% 0 0)' }}>
          <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[20px] font-semibold text-white/90 mb-1">{member.name}</h3>
          <p className="font-mono-accent text-[11px] uppercase tracking-[0.1em] text-amber-400/70 mb-4">{member.role}</p>
          <p className="text-[14px] leading-[1.7] text-white/45">{member.bio}</p>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
    </div>
  );
}

/* ── Main TeamSection ── */
export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    const line = lineRef.current;
    if (!section || !heading || !cards || !line) return;

    if (prefersReducedMotion()) {
      cards.querySelectorAll('.team-card').forEach(card => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
      cards.querySelectorAll('.team-img').forEach(img => {
        gsap.set(img, { clipPath: 'inset(0 0 0 0)' });
      });
      gsap.set(line, { scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.6,
          start: 'top top',
          end: `+=${TEAM.length * 120}vh`,
        },
      });

      // Heading words stagger in
      const words = heading.querySelectorAll('.tw');
      tl.fromTo(words,
        { y: 50, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.2, ease: 'power3.out' },
        0
      );

      // Progress line
      tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'none' }, 0.05);

      // Cards stagger in with overlap
      const cardEls = cards.querySelectorAll('.team-card');
      const imgEls = cards.querySelectorAll('.team-img');

      cardEls.forEach((card, i) => {
        const start = 0.12 + i * 0.2;

        // Card entrance: slide up + unblur + scale
        tl.fromTo(card,
          { y: 80, opacity: 0, scale: 0.94, filter: 'blur(10px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
          start
        );

        // Image clip-path wipe
        if (imgEls[i]) {
          tl.fromTo(imgEls[i],
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.15, ease: 'power2.out' },
            start + 0.06
          );
        }

        // Previous card fades back slightly
        if (i > 0 && cardEls[i - 1]) {
          tl.to(cardEls[i - 1],
            { y: -20, opacity: 0.5, scale: 0.98, duration: 0.12, ease: 'power1.in' },
            start
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const headingText = 'The people behind the platform';

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0a0a0b]" data-testid="team-section">
      <div className="relative flex h-screen w-full">
        {/* Left column */}
        <div className="flex w-[42%] flex-col justify-center pl-12 pr-8 lg:pl-[120px] lg:pr-16">
          <div ref={headingRef}>
            <p className="mb-4 font-mono-accent text-[11px] uppercase tracking-[0.14em] text-amber-400/70">
              Our Team
            </p>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white/90 mb-6">
              {headingText.split(' ').map((word, i) => (
                <span key={i} className="tw inline-block mr-[0.3em]" style={{ opacity: 0 }}>{word}</span>
              ))}
            </h2>
            <p className="max-w-[26rem] text-[14px] leading-[1.7] text-white/35 mb-8">
              Small team. Deep expertise. Every person here chose to build for the factory floor — not the cloud.
            </p>

            {/* Animated avatar row */}
            <div className="flex items-center mb-8">
              {TEAM.map((member, i) => (
                <AnimatedAvatar key={member.name} member={member} index={i} />
              ))}
            </div>
          </div>

          {/* Vertical progress line */}
          <div className="h-[100px] w-[1px] bg-white/10 relative overflow-hidden">
            <div ref={lineRef} className="absolute top-0 left-0 h-full w-full bg-amber-400/60 origin-top" style={{ transform: 'scaleY(0)' }} />
          </div>
        </div>

        {/* Right column — scrollytelling cards */}
        <div ref={cardsRef} className="flex w-[58%] flex-col justify-center gap-5 pr-12 lg:pr-[120px]">
          {TEAM.map((member, i) => (
            <TiltCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
