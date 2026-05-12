"use client";

import { PerspectiveMarquee, type LogoItem } from "@/components/ui/perspective-marquee";

const SECTION_BG = "#0a0a0b";

const PARTNER_LOGOS: LogoItem[] = [
  { src: "/partners/meity.png",  alt: "MeitY",  w: 200, h: 80 },
  { src: "/partners/AWS.png",    alt: "AWS",    w: 140, h: 80 },
  { src: "/partners/Nvidia.png", alt: "Nvidia", w: 220, h: 80 },
  { src: "/partners/TiE.png",    alt: "TiE",    w: 140, h: 80 },
  { src: "/partners/Zoho.png",   alt: "Zoho",   w: 190, h: 80 },
  { src: "/partners/forge.png",  alt: "Forge",  w: 220, h: 64 },
  { src: "/partners/iTNT.PNG",   alt: "iTNT",   w: 170, h: 80 },
];

export default function PartnerLogosSection() {
  return (
    <section className="relative bg-[#0a0a0b] border-y border-white/[0.05] overflow-hidden">
      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/20 pt-14 pb-10">
        Trusted in the ecosystem
      </p>

      {/* Fixed-height track — the marquee fills it absolutely */}
      <div className="relative w-full" style={{ height: 'clamp(120px, 22vw, 200px)' }}>
        <PerspectiveMarquee
          items={PARTNER_LOGOS}
          background={SECTION_BG}
          fadeColor={SECTION_BG}
          pixelsPerFrame={1.8}
          itemGap={80}
          rotateY={-22}
          rotateX={6}
          perspective={1200}
        />
      </div>

      <div className="pb-14" />
    </section>
  );
}
