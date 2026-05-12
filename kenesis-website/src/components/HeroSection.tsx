'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animations';
import { ProgressiveBlur } from '@/components/magicui/progressive-blur';
import { BlurFade } from '@/components/magicui/blur-fade';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const introRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force inline autoplay on iOS Safari — prevents the native play button overlay.
  // iOS blocks autoplay until `.play()` is called programmatically, even when
  // `autoPlay`, `muted`, and `playsInline` are all set as attributes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // setAttribute ensures `playsinline` and `webkit-playsinline` are both
    // present in the DOM for older iOS WebKit versions.
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;

    const attempt = () => {
      video.play().catch(() => {
        // Autoplay blocked (e.g. Low Power Mode) — silently ignore.
        // Video stays hidden behind the overlay divs so no broken UI.
      });
    };

    if (video.readyState >= 2) {
      attempt();
    } else {
      video.addEventListener('loadeddata', attempt, { once: true });
    }

    return () => {
      video.removeEventListener('loadeddata', attempt);
    };
  }, []);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return;
    const trigger = ScrollTrigger.create({
      trigger: intro, start: 'top top', end: 'bottom top', scrub: true,
      onUpdate(self) {
        intro.style.opacity = `${1 - self.progress}`;
        intro.style.transform = `translateY(${-self.progress * 80}px)`;
      },
    });
    return () => { trigger.kill(); };
  }, []);

  return (
    <section className="relative w-full">
      {/* Video background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover"
          style={{ WebkitTransform: 'translateZ(0)' }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55 md:bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay" />
      </div>

      {/* Intro screen */}
      <div ref={introRef} className="relative z-[2] h-[100svh] w-full will-change-[opacity,transform]">

        {/* Progressive blur beneath navbar */}
        <ProgressiveBlur position="top" height="80px" className="absolute top-0 left-0 right-0 z-10 pointer-events-none" />

        {/* ── MOBILE layout: single stacked block, vertically centered ── */}
        <div className="md:hidden absolute inset-0 flex flex-col justify-center px-6 pt-[80px]">

          <BlurFade delay={0.1} duration={0.6} blur="6px" offset={8}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-400/60 mb-4">
              On-Premise AI · Industrial Safety
            </p>
          </BlurFade>

          <h1 className="font-display text-[28px] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-5">
            <BlurFade delay={0.3} duration={0.7} blur="12px" offset={20}>
              <span className="block">Your cameras see everything.</span>
            </BlurFade>
            <BlurFade delay={0.5} duration={0.7} blur="12px" offset={20}>
              <span className="block text-white/60">Now they <em>understand</em> it.</span>
            </BlurFade>
          </h1>

          <BlurFade delay={1.0} duration={0.7} blur="8px" offset={14}>
            <p className="text-[14px] leading-[1.7] text-white/55 font-normal max-w-[340px] mb-7">
              Kenesis turns your CCTV into a real-time safety system - PPE violations,
              zone breaches and hazard detection, all on your hardware.
            </p>
          </BlurFade>

          <BlurFade delay={1.4} duration={0.5} blur="6px" offset={10}>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 self-start
                         min-h-[44px] px-5
                         border border-white/15 rounded-full
                         text-[11px] uppercase tracking-[0.14em] font-medium
                         text-white/60 hover:text-white hover:border-amber-400/40
                         transition-all duration-300 group"
            >
              <span>Book a walkthrough</span>
              <span className="text-white/30 group-hover:text-amber-400/70 group-hover:translate-x-0.5 transition-all duration-200">&rarr;</span>
            </a>
          </BlurFade>

        </div>

        {/* ── DESKTOP layout: headline top center, subtext bottom center ── */}

        {/* Headline — top center below navbar */}
        <div className="hidden md:flex absolute top-0 left-0 right-0 flex-col items-center text-center px-8
                        pt-[180px]">

          <BlurFade delay={0.1} duration={0.6} blur="6px" offset={8}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/60 mb-5">
              On-Premise AI · Industrial Safety
            </p>
          </BlurFade>

          <h1 className="font-display font-bold leading-[1.05] tracking-[-0.04em] text-white
                         text-[clamp(32px,5.5vw,80px)] max-w-[80vw] lg:max-w-[70vw]">
            <BlurFade delay={0.3} duration={0.7} blur="12px" offset={20}>
              <span className="block">Your cameras see everything.</span>
            </BlurFade>
            <BlurFade delay={0.5} duration={0.7} blur="12px" offset={20}>
              <span className="block text-white/60">Now they <em>understand</em> it.</span>
            </BlurFade>
          </h1>

        </div>

        {/* Subtext + CTA — bottom center */}
        <div className="hidden md:flex absolute bottom-14 left-0 right-0
                        flex-col items-center text-center px-8">

          <BlurFade delay={1.2} duration={0.7} blur="8px" offset={14}>
            <p className="max-w-[min(520px,80vw)] text-[15px] md:text-[17px]
                          leading-[1.7] text-white/45 font-normal">
              Kenesis turns your CCTV into a real-time safety system - PPE violations,
              zone breaches and hazard detection, all on your hardware.
            </p>
          </BlurFade>

          <BlurFade delay={1.6} duration={0.5} blur="6px" offset={10}>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2
                         min-h-[44px] px-6
                         border border-white/15 rounded-full
                         text-[12px] uppercase tracking-[0.14em] font-medium
                         text-white/60 hover:text-white hover:border-amber-400/40
                         transition-all duration-300 group"
            >
              <span>Book a walkthrough</span>
              <span className="text-white/30 group-hover:text-amber-400/70 group-hover:translate-x-0.5 transition-all duration-200">&rarr;</span>
            </a>
          </BlurFade>

        </div>

      </div>
    </section>
  );
}
