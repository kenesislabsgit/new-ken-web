'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

gsap.registerPlugin(ScrollTrigger);

interface FeatureTab {
  id: string;
  label: string;
  title: string;
  description: string;
}

const TABS: FeatureTab[] = [
  {
    id: 'detect',
    label: 'Detect',
    title: 'Real-time safety detection',
    description:
      'YOLOv8 object detection runs directly on your cameras — PPE violations, restricted zone breaches, and safety incidents flagged in milliseconds, not minutes.',
  },
  {
    id: 'reason',
    label: 'Reason',
    title: 'Contextual AI reasoning',
    description:
      'Qwen2.5-VL 7B adds contextual understanding to raw detections. Not just "person without helmet" — but "worker in welding zone without face shield during active operation."',
  },
  {
    id: 'control',
    label: 'Control',
    title: 'Your data, your premises',
    description:
      'Everything runs on a server you own. No cloud. No footage leaving your network. No internet dependency. Full data sovereignty for Indian compliance requirements.',
  },
];

export function getActiveTabIndex(progress: number): number {
  return Math.min(Math.floor(progress * 3), 2);
}

export default function PinnedFeatureTabs() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const videoCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const prevTabRef = useRef(0);
  const hasAnimatedIn = useRef(false);

  /* ── Entrance animation for left column (runs once when pinned) ── */
  const animateEntrance = useCallback(() => {
    if (hasAnimatedIn.current || prefersReducedMotion()) return;
    hasAnimatedIn.current = true;

    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    if (!heading || !subtitle) return;

    // Split heading into words for staggered reveal
    const words = heading.querySelectorAll('.word-reveal');
    gsap.fromTo(
      words,
      { y: 40, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.8, stagger: 0.1, ease: 'power3.out',
      }
    );

    gsap.fromTo(
      subtitle,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.5, ease: 'power2.out' }
    );
  }, []);

  /* ── Main ScrollTrigger: pin + scrub + tab switching ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) { setActiveTab(0); return; }

    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: true,
      scrub: true,
      start: 'top top',
      end: '+=300vh',
      onEnter: animateEntrance,
      onEnterBack: () => { hasAnimatedIn.current = true; },
      onUpdate(self) {
        const newTab = getActiveTabIndex(self.progress);
        setActiveTab(newTab);

        // Update progress bar width (continuous, not stepped)
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${self.progress * 100}%`;
        }
      },
    });
    return () => { trigger.kill(); };
  }, [animateEntrance]);

  /* ── Tab transition animations ── */
  useEffect(() => {
    const prev = prevTabRef.current;
    if (prev === activeTab) return;
    if (prefersReducedMotion()) { prevTabRef.current = activeTab; return; }

    const direction = activeTab > prev ? 1 : -1;
    const tweens: gsap.core.Tween[] = [];

    // Exit: slide out + blur + fade
    const exitContent = contentRefs.current[prev];
    if (exitContent) {
      tweens.push(
        gsap.to(exitContent, {
          x: -60 * direction,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.35,
          ease: 'power2.in',
        })
      );
    }

    // Enter: slide in from opposite side + unblur + fade in
    const enterContent = contentRefs.current[activeTab];
    if (enterContent) {
      tweens.push(
        gsap.fromTo(
          enterContent,
          { x: 80 * direction, opacity: 0, filter: 'blur(8px)' },
          {
            x: 0, opacity: 1, filter: 'blur(0px)',
            duration: 0.55, ease: 'power3.out', delay: 0.05,
          }
        )
      );
    }

    // Video card: clip-path wipe reveal
    const videoCard = videoCardRefs.current[activeTab];
    if (videoCard) {
      tweens.push(
        gsap.fromTo(
          videoCard,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.7, ease: 'power2.out', delay: 0.1,
          }
        )
      );
    }

    // Title: staggered char reveal
    const titleEl = titleRefs.current[activeTab];
    if (titleEl) {
      tweens.push(
        gsap.fromTo(
          titleEl,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.15 }
        )
      );
    }

    // Description: fade up
    const descEl = descRefs.current[activeTab];
    if (descEl) {
      tweens.push(
        gsap.fromTo(
          descEl,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.25 }
        )
      );
    }

    prevTabRef.current = activeTab;
    return () => { tweens.forEach(t => t.kill()); };
  }, [activeTab]);

  // Split heading text into words for staggered animation
  const headingLine1 = 'Edge AI that sees';
  const headingLine2 = 'what matters';

  return (
    <section
      ref={sectionRef}
      id="platform"
      className="relative w-full bg-[#0a0a0b]"
      data-testid="pinned-feature-tabs"
    >
      {/* Flickering grid background */}
      <FlickeringGrid
        className="absolute inset-0 z-0 opacity-30"
        squareSize={3}
        gridGap={8}
        color="rgb(245, 158, 11)"
        maxOpacity={0.12}
        flickerChance={0.15}
      />

      <div className="relative flex h-screen w-full z-[1]">
        {/* Left column — heading + description */}
        <div ref={leftColRef} className="flex w-1/2 flex-col justify-center px-12 lg:pl-[343px] lg:pr-16">
          <h2
            ref={headingRef}
            className="mb-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/90"
          >
            {headingLine1.split(' ').map((word, i) => (
              <span key={i} className="word-reveal inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
            <br />
            {headingLine2.split(' ').map((word, i) => (
              <span key={`l2-${i}`} className="word-reveal inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                {word}
              </span>
            ))}
          </h2>
          <p
            ref={subtitleRef}
            className="font-mono-accent text-[13px] leading-relaxed text-white/40 uppercase tracking-[0.08em]"
            style={{ opacity: 0 }}
          >
            On-premise video analytics that turns your existing CCTV into an intelligent safety system. No cloud dependency. No data leaving your network.
          </p>
        </div>

        {/* Right column — tabs + video card */}
        <div className="flex w-1/2 flex-col justify-center pr-12 lg:pr-[343px]">
          {/* Tab bar with progress indicator */}
          <div ref={tabBarRef} className="relative mb-8">
            <div className="flex gap-8 border-b border-white/10">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  className="relative pb-3 text-[15px] font-medium transition-colors duration-300 cursor-pointer"
                  style={{ color: activeTab === i ? '#ffffff' : 'rgba(255,255,255,0.35)' }}
                  data-tab-button={i}
                >
                  {tab.label}
                  {/* Individual tab underline */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-amber-400 transition-transform duration-300"
                    style={{ transform: activeTab === i ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                </button>
              ))}
            </div>
            {/* Continuous scroll progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-amber-500/60 via-amber-400/40 to-transparent"
                style={{ width: '0%', transition: 'none' }}
              />
            </div>
          </div>

          {/* Tab content */}
          <div className="relative min-h-[200px]">
            {TABS.map((tab, i) => (
              <div
                key={tab.id}
                ref={el => { contentRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{
                  opacity: activeTab === i ? 1 : 0,
                  pointerEvents: activeTab === i ? 'auto' : 'none',
                }}
                data-tab-content={i}
              >
                {/* Video placeholder card with clip-path reveal */}
                <div
                  ref={el => { videoCardRefs.current[i] = el; }}
                  className="mb-6 aspect-video w-full overflow-hidden rounded-2xl bg-white/5 border border-white/[0.06]"
                  style={{ clipPath: i === 0 ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
                >
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <h3
                  ref={el => { titleRefs.current[i] = el; }}
                  className="mb-2 text-xl font-display font-semibold text-white/90"
                >
                  {tab.title}
                </h3>
                <p
                  ref={el => { descRefs.current[i] = el; }}
                  className="font-mono-accent text-[13px] leading-relaxed text-white/40 tracking-[0.02em]"
                >
                  {tab.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
