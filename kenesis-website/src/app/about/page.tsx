// Server Component — pre-rendered HTML shipped from server, no blocking JS on initial load
import dynamic from 'next/dynamic';
import PageShell from '@/components/PageShell';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ScrollReveal } from '@/components/magicui/scroll-reveal';
import { TextReveal } from '@/components/magicui/text-reveal';
import { UnblurTextReveal } from '@/components/magicui/unblur-text-reveal';
import { ImageMaskedText } from '@/components/magicui/image-masked-text';

// Heavy canvas/shader components deferred — excluded from initial parse/execution
const DitheredWaves = dynamic(
  () => import('@/components/magicui/dithered-waves').then(m => ({ default: m.DitheredWaves }))
);
const LiquidMetalLogo = dynamic(
  () => import('@/components/magicui/liquid-metal-logo').then(m => ({ default: m.LiquidMetalLogo }))
);
const CircularGallery = dynamic(
  () => import('@/components/magicui/circular-gallery').then(m => ({ default: m.CircularGallery }))
);
const NumberTicker = dynamic(
  () => import('@/components/magicui/number-ticker').then(m => ({ default: m.NumberTicker }))
);
const TeamSection = dynamic(() => import('@/components/TeamSection'));

export default function AboutPage() {
  return (
    <PageShell>
      {/* DitheredWaves - full page background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]">
        <DitheredWaves
          color="#f59e0b"
          cellSize={16}
          speed={1.2}
          layers={2}
          amplitude={35}
          frequency={0.012}
          charset=" .:=+#"
          enableMouse={true}
          mouseRadius={250}
          className="h-full w-full"
        />
      </div>

      {/* â”€â”€ Hero: heading â”€â”€ */}
      <section className="relative z-[2] mx-auto max-w-[1152px] px-4 sm:px-6 pb-4 md:px-12">
        <div>
          <BlurFade delay={0.1} duration={0.5} blur="6px" offset={12}>
            <p className="font-mono-accent text-[14px] uppercase text-amber-400/60 mb-10">About</p>
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
            className="font-display text-[clamp(32px,7.5vw,64px)] font-semibold leading-[0.95] text-white mb-8"
          >
            Visual intelligence for every factory.
          </UnblurTextReveal>
          <BlurFade delay={0.6} duration={0.5} blur="6px" offset={8}>
            <p className="text-[18px] sm:text-[20px] leading-[1.6] text-white/70 font-normal">
              Founded in Chennai. We build AI software that turns existing CCTV cameras into intelligent safety systems, no cloud, no new hardware.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* LiquidMetal logo */}
      <section className="relative z-[2] flex items-center justify-center overflow-hidden">
          {/* Mobile */}
          <div className="sm:hidden w-[300px] h-[300px]"
            style={{ clipPath: 'circle(50% at 50% 50%)' }}
          >
            <LiquidMetalLogo
              src="/kenesis-circle.png"
              width={300}
              height={300}
              colorBack="rgba(0,0,0,0)"
              colorTint="#d4a843"
              speed={0.4}
              distortion={0.05}
              shiftRed={0.15}
              shiftBlue={0.15}
              softness={0.1}
              contour={0.35}
              repetition={2}
              angle={65}
              scale={0.7}
            />
          </div>
          {/* Desktop */}
          <div className="hidden sm:block w-[700px] h-[700px]"
            style={{ clipPath: 'circle(50% at 50% 50%)' }}
          >
            <LiquidMetalLogo
              src="/kenesis-circle.png"
              width={700}
              height={700}
              colorBack="rgba(0,0,0,0)"
              colorTint="#d4a843"
              speed={0.4}
              distortion={0.05}
              shiftRed={0.15}
              shiftBlue={0.15}
              softness={0.1}
              contour={0.35}
              repetition={2}
              angle={65}
              scale={0.7}
            />
          </div>
      </section>

      {/* Manifesto */}
      <section className="relative z-[2] mx-auto max-w-[1152px] px-6 py-32 md:px-12 border-t border-amber-400/[0.08]">
        <div className="max-w-3xl space-y-10">
          <BlurFade delay={0.1} duration={0.7} blur="8px" offset={12} inView inViewMargin="-60px">
            <p className="text-[clamp(18px,3vw,26px)] leading-[1.5] text-white font-display">
              Factories have cameras everywhere. What they lack is intelligence: the ability to understand what those cameras see and act on it in real time.
            </p>
          </BlurFade>
          <BlurFade delay={0.2} duration={0.7} blur="8px" offset={12} inView inViewMargin="-60px">
            <p className="text-[clamp(18px,3vw,26px)] leading-[1.5] text-white font-display">
              Cloud-based analytics require your footage to leave your facility, get processed on shared infrastructure, and return generic results. That means privacy risk, latency, and compliance challenges.
            </p>
          </BlurFade>
          <BlurFade delay={0.3} duration={0.7} blur="8px" offset={12} inView inViewMargin="-60px">
            <p className="text-[clamp(18px,3vw,26px)] leading-[1.5] text-white font-display">
              Kenesis runs entirely on your premises. Your footage never leaves your network. And when the internet goes down, your safety system keeps running.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* â”€â”€ Visual: circular gallery â”€â”€ */}
      <section className="relative z-[2] py-24 overflow-hidden">
        <BlurFade delay={0} duration={0.6} blur="8px" offset={14} inView inViewMargin="-60px">
          <CircularGallery
            className="h-[280px] sm:h-[380px] mx-auto"
            radius={300}
            rotationSpeed={35}
            images={[
              { src: '/images/gallery/1.webp', alt: 'AI analytics dashboard' },
              { src: '/images/gallery/2.webp', alt: 'CCTV monitoring system' },
              { src: '/images/gallery/3.webp', alt: 'Factory floor' },
              { src: '/images/gallery/4.webp', alt: 'Engineer at work' },
              { src: '/images/gallery/5.webp', alt: 'CCTV array' },
              { src: '/images/gallery/6.webp', alt: 'Robotic arm' },
              { src: '/images/gallery/7.webp', alt: 'Kenesis team' },
            ]}
          />
        </BlurFade>
      </section>

      {/* â”€â”€ Numbers: full-bleed strip â”€â”€ */}
      <section className="relative z-[2] border-y border-amber-400/[0.08] py-16">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-4">
          <div className="text-center">
            <p className="font-display text-[clamp(28px,5vw,40px)] font-semibold text-white leading-none mb-2">
              2025
            </p>
            <p className="font-mono-accent text-[13px] uppercase text-white/40">Founded</p>
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(28px,5vw,40px)] font-semibold text-white leading-none mb-2">Chennai</p>
            <p className="font-mono-accent text-[13px] uppercase text-white/40">Headquarters</p>
          </div>
          <div className="text-center">
            <p className="font-display text-[clamp(28px,5vw,40px)] font-semibold text-white leading-none mb-2">AI-First</p>
            <p className="font-mono-accent text-[13px] uppercase text-white/40">Built from the ground up</p>
          </div>
        </div>
      </section>

      {/* â”€â”€ What we believe: left-aligned list, not grid cards â”€â”€ */}
      <section className="relative z-[2] mx-auto max-w-[1152px] px-6 py-32 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <TextReveal
              variant="word-blur"
              as="h2"
              start="top 85%"
              duration={0.7}
              className="font-display text-[clamp(24px,4vw,36px)] font-semibold text-white sticky top-32"
            >
              What we believe
            </TextReveal>
          </div>
          <div className="space-y-8">
            {[
              ['Complete data sovereignty.', 'Your camera footage is processed and stored exclusively on your premises. No cloud provider, no third party, no external entity ever accesses your data.'],
              ['Contextual intelligence.', 'Our AI doesn\'t just detect objects. It understands context. "Worker in welding zone without face shield during active operation" is actionable. A simple "something detected" with no context is not.'],
              ['Zero internet dependency.', 'Many industrial facilities have unreliable connectivity. Kenesis is designed to operate completely offline. Your safety system should never go down just because your internet does.'],
              ['Compliance shouldn\'t be an afterthought.', 'Data protection laws, factory safety regulations, compliance requirements: we\'re built for these from day one, not retrofitted.'],
            ].map(([title, desc], i) => (
              <ScrollReveal key={title} variant="fade-up" delay={i * 0.1} duration={0.6}>
                <div className="border-l-2 border-white/[0.08] pl-6 hover:border-amber-400/40 transition-colors duration-300">
                  <p className="text-[16px] text-white/90 mb-1 font-medium">{title}</p>
                  <p className="text-[15px] text-white/50 leading-[1.6]">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Timeline: minimal, dense â”€â”€ */}
      <section className="relative z-[2] mx-auto max-w-[1152px] px-6 py-32 md:px-12 border-t border-amber-400/[0.08]">
        <div className="flex items-start justify-between gap-8 mb-12">
          <TextReveal
            variant="word-slide"
            as="h2"
            start="top 85%"
            duration={0.7}
            className="font-display text-[clamp(24px,4vw,36px)] font-semibold text-white"
          >
            So far
          </TextReveal>
        </div>
        <div>
          {[
            ['2025 Q1', 'Incorporated in Chennai, India'],
            ['2025 Q2', 'First prototype: AI analyzing 30 camera feeds in real time'],
            ['2025 Q3', 'System tested on a live factory floor'],
            ['2025 Q4', 'Platform launch: safety gear monitoring, zone alerts, daily safety reports'],
            ['2026 Q2', 'Pilot deployments in progress'],
          ].map(([date, event], i) => (
            <ScrollReveal key={date} variant="fade-up" delay={i * 0.08} duration={0.5}>
              <div className="flex items-baseline gap-4 sm:gap-8 py-4 border-b border-white/[0.06]">
                <span className="font-mono-accent text-[13px] text-amber-400/60 w-[70px] sm:w-[80px] flex-shrink-0">{date}</span>
                <span className="text-[16px] text-white/65">{event}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* â”€â”€ Team â”€â”€ */}
      <TeamSection />

      {/* â”€â”€ Closing: image-masked statement â”€â”€ */}
      <section className="relative z-[2] mx-auto max-w-[1152px] px-4 sm:px-6 py-16 md:py-32 md:px-12 border-t border-amber-400/[0.08]">
        <BlurFade delay={0} duration={0.7} blur="10px" offset={16} inView inViewMargin="-80px">
          <div className="space-y-4">
            <ImageMaskedText
              text="Scale fast."
              imageSrc="/images/gallery/3.webp"
              fontSize="clamp(3rem, 8vw, 7rem)"
              fontWeight={800}
              bgPosition="center 40%"
              className="block"
            />
            <p className="font-display text-[clamp(18px,4.5vw,28px)] sm:text-[clamp(20px,3vw,28px)] font-semibold leading-[1.5] text-white max-w-[55ch]">
              The manufacturing sector is growing rapidly. Safety infrastructure needs to keep pace.
            </p>
          </div>
        </BlurFade>
      </section>
    </PageShell>
  );
}

