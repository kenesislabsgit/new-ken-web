'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  step: number;
  label: string;
  headline: string;
  body: string;
}

interface FrameSet {
  path: string;
  count: number;
}

interface Props {
  frameSets: FrameSet[];
  panels: Panel[];
  sectionLabel?: string;
  sectionTitle?: string;
}

export default function ScrollFrameSection({ frameSets, panels, sectionLabel, sectionTitle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameObj = useRef({ frame: 0 });
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  // Stable serialized key for frameSets to avoid re-render loops
  const frameKey = useMemo(() => JSON.stringify(frameSets), [frameSets]);

  // ── Preload all frames ──
  useEffect(() => {
    let cancelled = false;
    const allImgs: HTMLImageElement[] = [];
    let remaining = 0;

    const sets: FrameSet[] = JSON.parse(frameKey);
    sets.forEach(set => { remaining += set.count; });
    const total = remaining;

    sets.forEach(set => {
      for (let i = 1; i <= set.count; i++) {
        const img = new Image();
        img.src = `${set.path}/f_${String(i).padStart(3, '0')}.jpg`;
        img.onload = img.onerror = () => {
          remaining--;
          if (!cancelled && remaining === 0) {
            imagesRef.current = allImgs.filter(i => i.complete && i.naturalWidth > 0);
            setLoaded(true);
          }
        };
        allImgs.push(img);
      }
    });

    return () => { cancelled = true; };
  }, [frameKey]);

  // ── Canvas draw (cover-fit, DPR-aware) ──
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const imgs = imagesRef.current;
    if (!canvas || imgs.length === 0) return;
    const img = imgs[Math.max(0, Math.min(idx, imgs.length - 1))];
    if (!img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.round(rect.width * dpr);
    const ch = Math.round(rect.height * dpr);

    // Only resize canvas when dimensions actually change
    if (canvasSizeRef.current.w !== cw || canvasSizeRef.current.h !== ch) {
      canvas.width = cw;
      canvas.height = ch;
      canvasSizeRef.current = { w: cw, h: ch };
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Cover fit
    const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (rect.width - w) / 2, (rect.height - h) / 2, w, h);
  }, []);

  // ── GSAP scroll animation ──
  useEffect(() => {
    if (!loaded || imagesRef.current.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    // Reset frame position
    frameObj.current.frame = 0;
    drawFrame(0);

    // Set all cards to invisible initially
    cardRefs.current.forEach(card => {
      if (card) gsap.set(card, { opacity: 0, y: 60, filter: 'blur(10px)' });
    });

    const n = panels.length;
    const totalFrames = imagesRef.current.length - 1;
    const scrollPx = n * 180; // vh per panel

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${scrollPx}vh`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress dots
            const panelIdx = Math.min(Math.floor(self.progress * n), n - 1);
            dotRefs.current.forEach((dot, j) => {
              if (!dot) return;
              dot.style.width = j === panelIdx ? '32px' : '12px';
              dot.style.background = j === panelIdx ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.08)';
            });
          },
        },
      });

      // Frame scrub
      tl.to(frameObj.current, {
        frame: totalFrames,
        ease: 'none',
        duration: n,
        onUpdate: () => {
          drawFrame(Math.round(frameObj.current.frame));
        },
      }, 0);

      // Card enter/exit animations
      panels.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const enter = i * 1.0;
        const exit = enter + 0.75;

        tl.to(card, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.25, ease: 'power3.out' }, enter);
        if (i < n - 1) {
          tl.to(card, { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.2, ease: 'power2.in' }, exit);
        }
      });
    }, container);

    const onResize = () => {
      canvasSizeRef.current = { w: 0, h: 0 }; // force canvas resize
      drawFrame(Math.round(frameObj.current.frame));
    };
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [loaded, panels, drawFrame]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0b]">
      {/* Canvas — full viewport */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/75 via-[#0a0a0b]/30 to-transparent pointer-events-none hidden md:block" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-[#0a0a0b]/20 to-transparent pointer-events-none md:hidden" />

      {/* Text panel — left side */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full md:w-[48%] px-[24px] md:px-[48px] lg:px-[64px]">
          {sectionLabel && (
            <p className="font-mono-accent text-[12px] uppercase tracking-[0.2em] text-amber-400/40 mb-[4px]">{sectionLabel}</p>
          )}
          {sectionTitle && (
            <p className="font-display text-[16px] text-white/15 mb-[40px] hidden md:block">{sectionTitle}</p>
          )}

          <div className="relative h-[320px] md:h-[400px]">
            {panels.map((panel, i) => (
              <div
                key={panel.step}
                ref={el => { cardRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-[16px] mb-[32px]">
                  <span className="font-mono-accent text-[13px] tracking-[0.16em] text-amber-400/70">
                    {String(panel.step).padStart(2, '0')}
                  </span>
                  <span className="h-[1px] w-[40px] bg-amber-400/25" />
                  <span className="font-mono-accent text-[13px] uppercase tracking-[0.12em] text-white/25">
                    {panel.label}
                  </span>
                </div>
                <h2 className="font-display text-[clamp(36px,6vw,72px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-[24px]">
                  {panel.headline}
                </h2>
                <p className="text-[18px] leading-[1.7] text-white/35 max-w-[460px]">
                  {panel.body}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex gap-[8px] mt-[24px]">
            {panels.map((_, j) => (
              <div
                key={j}
                ref={el => { dotRefs.current[j] = el; }}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{ width: j === 0 ? '32px' : '12px', background: j === 0 ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.08)' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]">
          <div className="w-[32px] h-[32px] border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
