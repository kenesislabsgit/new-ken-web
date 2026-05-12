'use client';

import { cn } from '@/lib/utils';

/* ── Reusable ASCII decorative elements ── */

/** Horizontal divider using box-drawing characters */
export function AsciiDivider({ className, char = '─', accent = '�-�' }: {
  className?: string; char?: string; accent?: string;
}) {
  return (
    <div className={cn('font-mono-accent text-white/[0.08] text-[0.7rem] select-none overflow-hidden whitespace-nowrap', className)} aria-hidden="true">
      {char.repeat(20)}{accent}{char.repeat(20)}{accent}{char.repeat(20)}
    </div>
  );
}

/** ASCII art block - renders pre-formatted monospace art */
export function AsciiBlock({ art, className, color = 'text-amber-400/15' }: {
  art: string; className?: string; color?: string;
}) {
  return (
    <pre className={cn('font-mono-accent leading-none select-none pointer-events-none', color, className)} aria-hidden="true">
      {art}
    </pre>
  );
}

/** Corner bracket decoration */
export function AsciiCorners({ children, className }: {
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <span className="absolute -top-2 -left-3 font-mono-accent text-amber-400/20 text-[0.8rem] select-none" aria-hidden="true">┌</span>
      <span className="absolute -top-2 -right-3 font-mono-accent text-amber-400/20 text-[0.8rem] select-none" aria-hidden="true">┐</span>
      <span className="absolute -bottom-2 -left-3 font-mono-accent text-amber-400/20 text-[0.8rem] select-none" aria-hidden="true">└</span>
      <span className="absolute -bottom-2 -right-3 font-mono-accent text-amber-400/20 text-[0.8rem] select-none" aria-hidden="true">┘</span>
      {children}
    </div>
  );
}

/** Inline terminal prompt decoration */
export function AsciiPrompt({ text, className }: {
  text: string; className?: string;
}) {
  return (
    <span className={cn('font-mono-accent text-[0.75rem] text-white/15 select-none', className)} aria-hidden="true">
      <span className="text-amber-400/30">$</span> {text} <span className="animate-pulse">▌</span>
    </span>
  );
}

/* ── ASCII Art Library ── */

export const ASCII_ARTS = {
  camera: `
    ┌──────────┐
    │ �-�  CAM   │
    │  ╱────╲  │
    │ │ �-��-��-� │  │
    │  ╲────╱  │
    │   ▔▔▔▔   │
    └──────────┘`,

  eye: `
      ╭───────╮
     ╱ �-�     �-� ╲
    │  ╭─────╮  │
    │  │ �-��-��-� │  │
    │  ╰─────╯  │
     ╲         ╱
      ╰───────╯`,

  shield: `
      ╱╲
     ╱  ╲
    ╱ �-��-� ╲
    │ �-��-� │
    │    │
     ╲  ╱
      ╲╱`,

  chip: `
    ┌─┬─┬─┬─┐
    ├─┤     ├─┤
    ├─┤ CPU ├─┤
    ├─┤     ├─┤
    └─┴─┴─┴─┘`,

  signal: `
         ╱│
        ╱ │
    ───╱  │
       ╲  │
        ╲ │
         ╲│`,

  factory: `
     ╱╲    ╱╲
    ╱  ╲  ╱  ╲
   ╱    ╲╱    ╲
   │ ▓▓ ││ ▓▓ │
   │ ▓▓ ││ ▓▓ │
   └────┘└────┘`,

  network: `
    �-�───────�-�
    │╲     ╱│
    │ �-�───�-� │
    │╱     ╲│
    �-�───────�-�`,

  lock: `
      ┌──┐
      │  │
    ┌─┴──┴─┐
    │ �-��-��-�  │
    │  ▼   │
    └──────┘`,
} as const;
