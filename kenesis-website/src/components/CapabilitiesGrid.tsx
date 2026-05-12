'use client';

import { ShieldCheck, Brain, LockKey, Activity, ChartLineUp } from '@phosphor-icons/react';
import DottedMap from 'dotted-map';
import { Area, AreaChart, CartesianGrid } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

/* ── Dotted floor-plan map (repurposed as facility zone overlay) ── */
const map = new DottedMap({ height: 55, grid: 'diagonal' });
const points = map.getPoints();

// Coordinates derived from equirectangular projection:
// x = (lon + 180) * (119/360), y = (90 - lat) * (55/180)
const PINGS = [
  { cx: 35,  cy: 15,  delay: '0s' },    // New York
  { cx: 60,  cy: 12,  delay: '0.6s' },  // London
  { cx: 84,  cy: 22,  delay: '1.1s' },  // Mumbai
  { cx: 106, cy: 17,  delay: '0.3s' },  // Tokyo
  { cx: 44,  cy: 35,  delay: '0.9s' },  // São Paulo
  { cx: 72,  cy: 28,  delay: '1.5s' },  // Nairobi
  { cx: 78,  cy: 20,  delay: '0.7s' },  // Dubai
];

const FacilityMap = () => (
  <svg
    viewBox="0 0 120 60"
    style={{ background: 'transparent' }}
    className="w-full h-full"
  >
    {points.map((point, i) => (
      <circle
        key={i}
        cx={point.x}
        cy={point.y}
        r={0.18}
        fill="rgba(245,158,11,0.45)"
      />
    ))}
    {PINGS.map((p, i) => (
      <g key={i}>
        <circle cx={p.cx} cy={p.cy} r={0.9} fill="rgba(245,158,11,0.95)" />
        <circle cx={p.cx} cy={p.cy} r={0.9} fill="none" stroke="rgba(245,158,11,0.55)" strokeWidth={0.5}>
          <animate attributeName="r" from="0.9" to="5" dur="2s" begin={p.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin={p.delay} repeatCount="indefinite" />
        </circle>
        <circle cx={p.cx} cy={p.cy} r={0.9} fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth={0.3}>
          <animate attributeName="r" from="0.9" to="8" dur="2s" begin={p.delay} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="2s" begin={p.delay} repeatCount="indefinite" />
        </circle>
      </g>
    ))}
  </svg>
);

/* ── Alert activity chart ── */
const chartConfig = {
  alerts: { label: 'Alerts', color: '#f59e0b' },
  resolved: { label: 'Resolved', color: '#78716c' },
} satisfies ChartConfig;

const chartData = [
  { time: '6 AM', alerts: 2, resolved: 2 },
  { time: '8 AM', alerts: 5, resolved: 4 },
  { time: '10 AM', alerts: 3, resolved: 3 },
  { time: '12 PM', alerts: 8, resolved: 6 },
  { time: '2 PM', alerts: 4, resolved: 4 },
  { time: '4 PM', alerts: 11, resolved: 9 },
  { time: '6 PM', alerts: 6, resolved: 6 },
];

const AlertChart = () => (
  <ChartContainer className="h-full w-full" config={chartConfig}>
    <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
      <defs>
        <linearGradient id="fillAlerts" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
          <stop offset="80%" stopColor="#f59e0b" stopOpacity={0.02} />
        </linearGradient>
        <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78716c" stopOpacity={0.2} />
          <stop offset="80%" stopColor="#78716c" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
      <ChartTooltip
        cursor={false}
        content={
          <ChartTooltipContent
            className="bg-[#1a1916] border-white/10 text-white"
          />
        }
      />
      <Area
        strokeWidth={1.5}
        dataKey="resolved"
        type="monotone"
        fill="url(#fillResolved)"
        stroke="#78716c"
        stackId="a"
      />
      <Area
        strokeWidth={2}
        dataKey="alerts"
        type="monotone"
        fill="url(#fillAlerts)"
        stroke="#f59e0b"
        stackId="b"
      />
    </AreaChart>
  </ChartContainer>
);

/* ── Live alert feed simulation ── */
const ALERT_FEED = [
  { time: '14:32', zone: 'Bay 3', msg: 'Worker without helmet detected', severity: 'high' },
  { time: '14:28', zone: 'Entry A', msg: 'Unauthorised zone access', severity: 'high' },
  { time: '14:19', zone: 'Bay 1', msg: 'Safety vest missing', severity: 'med' },
  { time: '14:05', zone: 'Bay 2', msg: 'All clear — 0 violations', severity: 'ok' },
];

/* ── Main component ── */
export function CapabilitiesGrid() {
  return (
    <section
      id="platform"
      className="relative w-full px-4 sm:px-6 md:px-12 py-16 md:py-24"
      style={{ background: '#0a0a0b' }}
    >
      <div className="mx-auto max-w-[1100px]">

        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="font-mono-accent text-[11px] text-amber-400/60 mb-3">Platform</p>
          <h2 className="font-display text-[clamp(26px,4.5vw,52px)] font-semibold text-white leading-[1.08] mb-4">
            Intelligence that<br />understands context
          </h2>
          <p className="text-[15px] text-white/40 max-w-xl leading-relaxed">
            Turn your existing cameras into a full safety intelligence system. On-premise, offline, always on.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* ── Cell 1: Detect — facility map ── */}
          <div className="border-b border-white/[0.07] md:border-b md:border-r">
            <div className="p-6 sm:p-10">
              <span className="flex items-center gap-2 text-white/40 text-[14px] mb-6">
              <ShieldCheck className="size-4 text-amber-400" weight="duotone" />
                Real-time hazard detection
              </span>
              <p className="font-display text-[20px] sm:text-[22px] font-semibold text-white leading-snug">
                Spots every violation, across every camera, in under a second.
              </p>
            </div>
            <div className="relative px-6 sm:px-10 pb-6 sm:pb-10 overflow-hidden">
              {/* Tooltip badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
                <div className="bg-[#1a1916] border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white/80 shadow-lg whitespace-nowrap flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Alert: Bay 3 — No helmet
                </div>
                <div className="w-px h-3 bg-amber-400/30" />
              </div>
              {/* Fade-out bottom */}
              <div className="absolute bottom-0 inset-x-0 h-16 z-10"
                style={{ background: 'linear-gradient(to top, #0a0a0b, transparent)' }} />
              <FacilityMap />
            </div>
          </div>

          {/* ── Cell 2: Reason — alert feed ── */}
          <div className="border-b border-white/[0.07]">
            <div className="p-6 sm:p-10">
              <span className="flex items-center gap-2 text-white/40 text-[14px] mb-6">
              <Brain className="size-4 text-amber-400" weight="duotone" />
                Contextual AI reasoning
              </span>
              <p className="font-display text-[20px] sm:text-[22px] font-semibold text-white leading-snug">
                Not just "something detected." It tells you exactly what and why.
              </p>
            </div>
            <div className="px-6 sm:px-10 pb-6 sm:pb-8 flex flex-col gap-2">
              {ALERT_FEED.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                >
                  <span
                    className={`mt-[3px] size-2 shrink-0 rounded-full ${
                      a.severity === 'high'
                        ? 'bg-amber-400'
                        : a.severity === 'med'
                        ? 'bg-amber-600'
                        : 'bg-white/20'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white/80 leading-snug">{a.msg}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{a.zone} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cell 4: Alert activity chart ── */}
          <div className="col-span-full border-b border-white/[0.07]">
            <div className="p-6 sm:p-10 pb-4">
              <span className="flex items-center gap-2 text-white/40 text-[14px] mb-5">
              <ChartLineUp className="size-4 text-amber-400" weight="duotone" />
                Alert activity — today's shift
              </span>
              <p className="font-display text-[20px] sm:text-[22px] font-semibold text-white leading-snug">
                Every incident logged. Every trend visible.{' '}
                <span className="text-white/35">Search it, review it, act on it.</span>
              </p>
            </div>
            <div className="h-[180px] sm:h-[220px] w-full">
              <AlertChart />
            </div>
          </div>

          {/* ── Cell 5: Data sovereignty — 3-point strip ── */}
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
            {[
              { icon: <LockKey className="size-5 text-amber-400" weight="duotone" />, title: 'No cloud uploads', body: 'All footage is processed and stored on your own hardware.' },
              { icon: <ShieldCheck className="size-5 text-amber-400" weight="duotone" />, title: 'No internet required', body: 'Fully offline-capable. Works even when your connection drops.' },
              { icon: <Brain className="size-5 text-amber-400" weight="duotone" />, title: 'Meets data protection laws', body: 'Built for compliance with data protection requirements from day one.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-6 sm:p-8">
                {item.icon}
                <p className="text-[14px] font-semibold text-white mt-1">{item.title}</p>
                <p className="text-[13px] text-white/35 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
