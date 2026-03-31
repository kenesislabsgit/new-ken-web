'use client';

import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { CircularGallery } from '@/components/magicui/circular-gallery';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { UnblurTextReveal } from '@/components/magicui/unblur-text-reveal';
import TeamSection from '@/components/TeamSection';
import { ImageMaskedText } from '@/components/magicui/image-masked-text';
import { AsciiTextDisplay } from '@/components/magicui/ascii-text-display';
const DitheredWaves = dynamic(
  () => import('@/components/magicui/dithered-waves').then(m => ({ default: m.DitheredWaves })),
  { ssr: false }
);

const LiquidMetalLogo = dynamic(
  () => import('@/components/magicui/liquid-metal-logo').then(m => ({ default: m.LiquidMetalLogo })),
  { ssr: false }
);

export default function AboutPage() {
  return (
    <PageShell>
      {/* DitheredWaves — full page background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <DitheredWaves
          color="#f59e0b"
          cellSize={10}
          speed={1.2}
          layers={3}
          amplitude={35}
          frequency={0.012}
          charset=" .:=+#"
          enableMouse={true}
          mouseRadius={250}
          className="h-full w-full"
        />
      </div>

      {/* ── Hero: heading ── */}
      <section className="relative z-[2] mx-auto max-w-[72rem] px-6 pb-16 md:px-12">
        <div>
          <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
            <p className="font-mono-accent text-[1rem] uppercase tracking-[0.14em] text-amber-400/50 mb-10">About</p>
          </BlurFade>
          <UnblurTextReveal
            as="h1"
            blurAmount={24}
            scaleFrom={0.9}
            scrub={false}
            start="top 95%"
            end="top 40%"
            splitBy="word"
            stagger={0.06}
            className="font-display text-[clamp(3rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-white mb-8"
          >
            We keep your footage inside your walls.
          </UnblurTextReveal>
          <BlurFade delay={0.6} duration={0.5} blur="6px" offset={8}>
            <p className="max-w-lg text-[1.2rem] leading-[1.7] text-white/35">
              Kenesis Labs · Chennai · Edge AI for Indian manufacturing
            </p>
          </BlurFade>
        </div>
      </section>

      {/* LiquidMetal logo — standalone contained element between hero and manifesto */}
      <section className="relative z-[2] flex items-center justify-center py-8 overflow-hidden">
        <div className="relative w-[700px] h-[560px] md:w-[900px] md:h-[720px]"
          style={{ maskImage: 'radial-gradient(ellipse 80% 80% at center, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 20%, transparent 70%)' }}
        >
          <LiquidMetalLogo
            src="/kenesis-icon.png"
            width={900}
            height={720}
            className="!w-full !h-full"
            colorBack="#0a0a0b"
            colorTint="#f59e0b"
            speed={0.3}
            distortion={0.02}
            shiftRed={0.1}
            shiftBlue={0.05}
            softness={0.25}
            contour={0.2}
            angle={40}
            scale={0.45}
          />
        </div>
      </section>

      {/* ── Manifesto: large editorial text, not cards ── */}
      <section className="relative z-[2] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <div className="max-w-3xl space-y-10">
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.5] text-white/70 font-display tracking-[-0.01em]"
          >
            Factory floors are dangerous and full of blind spots. The cameras are already there. The intelligence isn&apos;t.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.5] text-white/50 font-display tracking-[-0.01em]"
          >
            Cloud-based CCTV analytics send your footage to remote servers, process it with generic models, and return generic alerts. That&apos;s a privacy risk, a latency problem, and a compliance nightmare.
          </TextReveal>
          <TextReveal
            variant="highlight"
            scrub={1}
            start="top 85%"
            end="bottom 30%"
            className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.5] text-white/90 font-display tracking-[-0.01em]"
          >
            We run everything on a server you own. Footage never leaves. Detection works when the internet doesn&apos;t.
          </TextReveal>
        </div>
      </section>

      {/* ── Visual: circular gallery ── */}
      <section className="relative z-[2] py-24 overflow-hidden">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <CircularGallery
            className="h-[380px] mx-auto"
            radius={300}
            rotationSpeed={35}
            images={[
              { src: '/images/gallery/1.png', alt: 'Edge AI hardware' },
              { src: '/images/gallery/2.png', alt: 'Computing hardware' },
              { src: '/images/gallery/3.png', alt: 'Factory floor' },
              { src: '/images/gallery/4.png', alt: 'Engineer at work' },
              { src: '/images/gallery/5.png', alt: 'CCTV array' },
              { src: '/images/gallery/6.png', alt: 'Robotic arm' },
              { src: '/images/gallery/7.png', alt: 'Kenesis team' },
            ]}
          />
        </BlurFade>
      </section>

      {/* ── Numbers: full-bleed strip ── */}
      <section className="relative z-[2] border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-[80rem] px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-y-10">
          <div className="text-center">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-white/90 leading-none mb-2">
              <NumberTicker value={2025} delay={0.1} />
            </p>
            <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">Founded</p>
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-white/90 leading-none mb-2">Chennai</p>
            <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">Headquarters</p>
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-white/90 leading-none mb-2">Edge AI</p>
            <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">Focus</p>
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold text-white/90 leading-none mb-2">
              <NumberTicker value={30} delay={0.3} />+
            </p>
            <p className="font-mono-accent text-[0.85rem] uppercase tracking-[0.1em] text-white/25">Cameras per node</p>
          </div>
        </div>
      </section>

      {/* ── ASCII text display ── */}
      <section className="relative z-[2] py-16 flex items-center justify-center overflow-hidden">
        <AsciiTextDisplay
          text="EDGE AI"
          fontSize={140}
          cellW={7}
          cellH={13}
          charset=" .,:;i1tfLCG08@#"
          color="#f59e0b"
          glitchRate={0.006}
          className="w-full max-w-[72rem] mx-auto px-6 opacity-70"
        />
      </section>

      {/* ── What we believe: left-aligned list, not grid cards ── */}
      <section className="relative z-[2] mx-auto max-w-[72rem] px-6 py-32 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <TextReveal
              variant="word-blur"
              as="h2"
              start="top 85%"
              duration={0.7}
              className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90 sticky top-32"
            >
              What we believe
            </TextReveal>
          </div>
          <div className="space-y-8">
            {[
              ['Your data is yours.', 'Not ours, not AWS\'s, not anyone else\'s. The footage from your factory floor stays on your factory floor. Period.'],
              ['Context beats bounding boxes.', '"Worker in welding zone without face shield during active operation" is useful. A red rectangle around a person is not.'],
              ['The internet is optional.', 'Indian industrial zones have unreliable connectivity. A safety system that depends on it isn\'t a safety system.'],
              ['Compliance shouldn\'t be an afterthought.', 'DPDP Act, factory safety regulations, data sovereignty requirements — we\'re built for these from day one, not retrofitted.'],
            ].map(([title, desc], i) => (
              <ScrollReveal key={title} variant="fade-left" delay={i * 0.1} duration={0.6}>
                <div className="border-l-2 border-white/[0.06] pl-6 hover:border-amber-400/30 transition-colors duration-300">
                  <p className="text-[1.2rem] text-white/80 mb-1 font-medium">{title}</p>
                  <p className="text-[1.05rem] text-white/35 leading-[1.6]">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline: minimal, dense ── */}
      <section className="relative z-[2] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <div className="flex items-start justify-between gap-8 mb-12">
          <TextReveal
            variant="word-slide"
            as="h2"
            start="top 85%"
            duration={0.7}
            className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-white/90"
          >
            So far
          </TextReveal>
        </div>
        <div>
          {[
            ['2025 Q1', 'Incorporated in Chennai. CIN: U62099TN2025PTC178068'],
            ['2025 Q2', 'First edge prototype — 30 cameras on a Mac Mini M4 Pro at 35W'],
            ['2025 Q3', 'YOLOv8 + Qwen2.5-VL pipeline validated on live factory floor'],
            ['2025 Q4', 'Platform launch: PPE compliance, zone detection, shift analytics'],
            ['2026 Q1', 'First enterprise deployments across Tamil Nadu manufacturing belt'],
          ].map(([date, event], i) => (
            <ScrollReveal key={date} variant="fade-up" delay={i * 0.08} duration={0.5}>
              <div className="flex items-baseline gap-8 py-4 border-b border-white/[0.04]">
                <span className="font-mono-accent text-[0.9rem] text-amber-400/40 w-[80px] flex-shrink-0">{date}</span>
                <span className="text-[1.1rem] text-white/50">{event}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <TeamSection />

      {/* ── Closing: image-masked statement ── */}
      <section className="relative z-[2] mx-auto max-w-[72rem] px-6 py-32 md:px-12 border-t border-white/[0.06]">
        <BlurFade delay={0} duration={0.7} blur="10px" offset={16} inView inViewMargin="-80px">
          <div className="space-y-4">
            <ImageMaskedText
              text="Scale fast."
              imageSrc="/images/gallery/3.png"
              fontSize="clamp(3rem, 8vw, 7rem)"
              fontWeight={800}
              bgPosition="center 40%"
              className="block"
            />
            <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.3] tracking-[-0.02em] text-white/35 max-w-3xl">
              India&apos;s factories are scaling fast. Their safety infrastructure should keep up.
            </p>
          </div>
        </BlurFade>
      </section>
    </PageShell>
  );
}
