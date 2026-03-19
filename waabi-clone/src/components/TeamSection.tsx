'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
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
  {
    name: 'ML Research Lead',
    role: 'Computer Vision',
    bio: 'Pushing the boundaries of on-device vision models. Published researcher turning SOTA papers into production-grade inference pipelines.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    name: 'Head of Operations',
    role: 'Deployment & Scale',
    bio: 'Orchestrating factory deployments across Tamil Nadu. Making sure every edge node ships, installs, and runs without a hitch.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
  },
];

const CARD_W = 300;
const CARD_H = 400;

/* ── 3D Curved Carousel — GSAP-driven per-card transforms ── */
function CurvedCarousel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, angle: 0, lastX: 0, lastTime: 0 });
  const isHovered = useRef(false);
  const rafId = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const count = TEAM.length;
  const step = 360 / count;
  const radius = 420;

  const updateCards = useCallback(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    let bestIdx = 0;
    let bestZ = -Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const a = angleRef.current + i * step;
      const rad = (a * Math.PI) / 180;

      // Position on the ring
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius;

      // Normalize z to 0..1 (back..front)
      const zNorm = (z + radius) / (2 * radius);

      // Scale: back cards smaller, front card full size
      const scale = 0.55 + zNorm * 0.45;
      // Opacity: back cards dim
      const opacity = 0.15 + zNorm * 0.85;
      // Blur: back cards blurred
      const blur = (1 - zNorm) * 8;
      // Y-axis rotation to face outward from the ring center
      const rotY = -a % 360;

      gsap.set(card, {
        x,
        z,
        rotateY: rotY,
        scale,
        opacity,
        zIndex: Math.round(zNorm * 100),
        filter: `blur(${blur.toFixed(1)}px)`,
      });

      if (z > bestZ) { bestZ = z; bestIdx = i; }
    }
    setActiveIdx(bestIdx);
  }, [count, step, radius]);

  // Animation loop
  const tick = useCallback(() => {
    if (!isDragging.current) {
      // Momentum decay
      if (Math.abs(velocityRef.current) > 0.01) {
        angleRef.current += velocityRef.current;
        velocityRef.current *= 0.94;
      } else {
        velocityRef.current = 0;
        // Auto-rotate
        const speed = isHovered.current ? 0.04 : 0.12;
        angleRef.current += speed;
      }
    }
    updateCards();
    rafId.current = requestAnimationFrame(tick);
  }, [updateCards]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      updateCards();
      return;
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [tick, updateCards]);

  // Pointer handlers
  const onDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    velocityRef.current = 0;
    dragStart.current = { x: e.clientX, angle: angleRef.current, lastX: e.clientX, lastTime: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    angleRef.current = dragStart.current.angle + dx * 0.25;
    // Track velocity
    const now = performance.now();
    const dt = now - dragStart.current.lastTime;
    if (dt > 0) {
      velocityRef.current = ((e.clientX - dragStart.current.lastX) * 0.25) / Math.max(dt / 16, 1);
    }
    dragStart.current.lastX = e.clientX;
    dragStart.current.lastTime = now;
    updateCards();
  }, [updateCards]);

  const onUp = useCallback(() => { isDragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    angleRef.current += e.deltaY * 0.06;
    velocityRef.current = 0;
  }, []);

  return (
    <div className="relative w-full">
      {/* Edge fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative mx-auto flex items-center justify-center select-none overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px', height: `${CARD_H + 60}px` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => { isHovered.current = false; }}
        onWheel={onWheel}
      >
        <div
          ref={trackRef}
          className="relative"
          style={{ transformStyle: 'preserve-3d', width: `${CARD_W}px`, height: `${CARD_H}px` }}
        >
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-2xl overflow-hidden border bg-[#111113]`}
              style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                transformStyle: 'preserve-3d',
                borderColor: i === activeIdx ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)',
                transition: 'border-color 0.3s',
              }}
            >
              {/* Photo */}
              <div className="relative h-[52%] overflow-hidden">
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" loading="lazy" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
              </div>
              {/* Info */}
              <div className="px-5 pt-3 pb-4">
                <h3 className="font-display text-[1.1rem] font-semibold text-white/90 mb-1">{member.name}</h3>
                <p className="font-mono-accent text-[0.6rem] uppercase tracking-[0.12em] text-amber-400/70 mb-2">{member.role}</p>
                <p className="text-[0.75rem] leading-[1.6] text-white/40">{member.bio}</p>
              </div>
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Active member label */}
      <div className="mt-8 text-center">
        <p className="font-display text-[1.3rem] font-semibold text-white/80">{TEAM[activeIdx]?.name}</p>
        <p className="font-mono-accent text-[0.7rem] uppercase tracking-[0.12em] text-amber-400/60 mt-1">{TEAM[activeIdx]?.role}</p>
      </div>
      <p className="mt-4 text-center font-mono-accent text-[0.65rem] text-white/20 tracking-[0.06em]">Drag or scroll to explore</p>
    </div>
  );
}

/* ── Main Section ── */
export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;
    if (prefersReducedMotion()) {
      gsap.set(heading.querySelectorAll('.tw'), { opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(heading.querySelectorAll('.tw'),
        { y: 40, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.05, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' } }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  const headingText = 'The people behind the platform';

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0a0a0b]" data-testid="team-section">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-24">
        <div ref={headingRef} className="mb-12 text-center px-6">
          <p className="mb-4 font-mono-accent text-[11px] uppercase tracking-[0.14em] text-amber-400/70">Our Team</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white/90">
            {headingText.split(' ').map((word, i) => (
              <span key={i} className="tw inline-block mr-[0.35em]" style={{ opacity: 0 }}>{word}</span>
            ))}
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-[14px] leading-[1.7] text-white/35">
            Small team. Deep expertise. Every person here chose to build for the factory floor — not the cloud.
          </p>
        </div>
        <CurvedCarousel />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[1100px] h-[1100px] rounded-full border border-white/[0.02]" />
          <div className="absolute w-[800px] h-[800px] rounded-full border border-white/[0.015]" />
        </div>
      </div>
    </section>
  );
}
