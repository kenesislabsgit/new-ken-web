'use client';

import { useState, useRef, useCallback } from 'react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';

/* ── Data ── */
const cameras = [
  { id: 'CAM-01', zone: 'Welding Bay A', status: 'ok', img: '/images/tech/3.png' },
  { id: 'CAM-02', zone: 'Assembly Line', status: 'alert', img: '/images/tech/1.png' },
  { id: 'CAM-03', zone: 'Loading Dock', status: 'ok', img: '/images/gallery/3.png' },
  { id: 'CAM-04', zone: 'Chemical Store', status: 'ok', img: '/images/gallery/5.png' },
  { id: 'CAM-05', zone: 'Main Entrance', status: 'ok', img: '/images/gallery/6.png' },
  { id: 'CAM-06', zone: 'Furnace Room', status: 'alert', img: '/images/tech/2.png' },
];
const alerts = [
  { time: '2m ago', msg: 'No face shield — Welding Bay A', sev: 'high' as const, cam: 'CAM-01' },
  { time: '8m ago', msg: 'Unauthorized zone entry — Furnace', sev: 'high' as const, cam: 'CAM-06' },
  { time: '15m ago', msg: 'Missing hard hat — Assembly Line', sev: 'medium' as const, cam: 'CAM-02' },
  { time: '23m ago', msg: 'Slip hazard — Loading Dock', sev: 'low' as const, cam: 'CAM-03' },
  { time: '41m ago', msg: 'PPE compliance drop below 90%', sev: 'medium' as const, cam: 'ALL' },
  { time: '1h ago', msg: 'Camera offline — Chemical Store', sev: 'low' as const, cam: 'CAM-04' },
  { time: '2h ago', msg: 'Restricted zone breach — Bay B', sev: 'high' as const, cam: 'CAM-01' },
];
const weeklyData = [32, 18, 45, 28, 12, 38, 22];
const zones = [
  { name: 'Welding Bay A', cameras: 4, status: 'active', alerts: 3 },
  { name: 'Assembly Line', cameras: 8, status: 'active', alerts: 1 },
  { name: 'Loading Dock', cameras: 3, status: 'active', alerts: 0 },
  { name: 'Chemical Store', cameras: 2, status: 'warning', alerts: 0 },
  { name: 'Furnace Room', cameras: 4, status: 'alert', alerts: 2 },
  { name: 'Main Entrance', cameras: 3, status: 'active', alerts: 0 },
];
const sevColor: Record<string, string> = { high: '#f87171', medium: '#fbbf24', low: '#60a5fa' };
const tabList = ['Overview', 'Cameras', 'Alerts', 'Zones', 'Analytics', 'System'];

/* ── Glass card style helper ── */
const glass = (inset = false): React.CSSProperties => ({
  background: inset
    ? 'linear-gradient(145deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.008) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: inset
    ? '0 1px 0 rgba(255,255,255,0.03) inset, 0 -1px 0 rgba(0,0,0,0.15) inset, 0 4px 12px rgba(0,0,0,0.2)'
    : '0 2px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.2) inset, 0 8px 24px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1) inset',
});

/* ── Tab content ── */

function OverviewTab() {
  return (
    <div className="space-y-[20px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[12px]">
        {[
          { label: 'Active Cameras', val: 28, suf: '/30', pct: 93, col: '#4ade80' },
          { label: 'Alerts Today', val: 12, suf: '', pct: 40, col: '#fbbf24' },
          { label: 'PPE Compliance', val: 94, suf: '%', pct: 94, col: '#34d399' },
          { label: 'Avg Latency', val: 0.3, suf: 's', pct: 15, col: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="group rounded-[16px] p-[16px] cursor-default hover:scale-[1.03] transition-all duration-300 relative overflow-hidden" style={{ ...glass(), boxShadow: `0 4px 16px rgba(0,0,0,0.25), 0 0 30px ${s.col}08, 0 2px 0 rgba(255,255,255,0.04) inset` }}>
            {/* Glass reflection streak */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)', transform: 'rotate(-30deg)' }} />
            <p className="font-mono-accent text-[9px] uppercase tracking-[0.12em] text-white/20 mb-[8px]">{s.label}</p>
            <p className="font-display text-[26px] font-bold leading-none mb-[10px]" style={{ color: s.col, textShadow: `0 0 20px ${s.col}30` }}><NumberTicker value={s.val} delay={0.3} />{s.suf}</p>
            <div className="h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 1px 2px rgba(0,0,0,0.3) inset' }}>
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.col}, ${s.col}80)`, boxShadow: `0 0 8px ${s.col}40, 0 0 2px ${s.col}` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-[16px]">
        <div>
          <p className="font-mono-accent text-[9px] uppercase tracking-[0.14em] text-white/15 mb-[12px]">Live Feeds</p>
          <div className="grid grid-cols-3 gap-[8px]">{cameras.slice(0, 6).map(c => <CamCard key={c.id} cam={c} />)}</div>
        </div>
        <div className="rounded-[14px] p-[16px]" style={glass(true)}>
          <p className="font-mono-accent text-[9px] uppercase tracking-[0.14em] text-white/15 mb-[14px]">Recent Alerts</p>
          <div className="space-y-[10px]">{alerts.slice(0, 4).map((a, i) => <AlertRow key={i} a={a} />)}</div>
        </div>
      </div>
    </div>
  );
}

function CamerasTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-[16px]">
        <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-white/20">{cameras.filter(c => c.status === 'ok').length} Online · {cameras.filter(c => c.status === 'alert').length} Alert</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
        {cameras.map(c => (
          <button key={c.id} onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            className={`relative rounded-[16px] overflow-hidden cursor-pointer group text-left transition-all duration-500 ${expanded === c.id ? 'md:col-span-2 md:row-span-2' : ''}`}
            style={{ aspectRatio: expanded === c.id ? '16/9' : '16/10', ...glass(), border: expanded === c.id ? '1.5px solid rgba(245,158,11,0.25)' : c.status === 'alert' ? '1.5px solid rgba(248,113,113,0.2)' : '1px solid rgba(255,255,255,0.06)', boxShadow: expanded === c.id ? '0 8px 40px rgba(245,158,11,0.08), 0 2px 0 rgba(255,255,255,0.04) inset' : '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <img src={c.img} alt={c.zone} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-65 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-[12px] z-[1]">
              <div className="flex items-center justify-between">
                <span className="font-mono-accent text-[10px] text-white/40 px-[8px] py-[3px] rounded-[8px]" style={{ ...glass(true), padding: '3px 8px' }}>{c.id}</span>
                <span className="w-[8px] h-[8px] rounded-full" style={{ background: c.status === 'alert' ? '#f87171' : '#4ade80', boxShadow: `0 0 10px ${c.status === 'alert' ? 'rgba(248,113,113,0.6)' : 'rgba(74,222,128,0.4)'}` }} />
              </div>
              <div><p className="text-[13px] text-white/60 font-medium">{c.zone}</p><p className="font-mono-accent text-[9px] text-white/20 mt-[2px]">{c.status === 'alert' ? '⚠ Alert active' : '● Streaming'}</p></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertsTab() {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.sev === filter);
  return (
    <div>
      <div className="flex items-center gap-[6px] mb-[20px]">
        {['all', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="font-mono-accent text-[10px] uppercase tracking-[0.1em] px-[12px] py-[6px] rounded-[10px] transition-all duration-300 cursor-pointer"
            style={filter === f ? { ...glass(), background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.15)', color: 'rgba(245,158,11,0.8)' } : { color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}
          >{f}</button>
        ))}
        <span className="ml-auto font-mono-accent text-[10px] text-white/15">{filtered.length} alerts</span>
      </div>
      <div className="space-y-[6px]">{filtered.map((a, i) => (
        <div key={i} className="flex items-center gap-[14px] rounded-[12px] p-[14px] hover:translate-x-[4px] transition-all duration-300 cursor-pointer group" style={{ ...glass(true), border: '1px solid rgba(255,255,255,0.03)' }}>
          <span className="w-[10px] h-[10px] rounded-full flex-shrink-0 group-hover:scale-[1.4] transition-transform duration-300" style={{ background: sevColor[a.sev], boxShadow: `0 0 10px ${sevColor[a.sev]}50` }} />
          <p className="flex-1 text-[13px] text-white/45 group-hover:text-white/70 transition-colors truncate">{a.msg}</p>
          <span className="font-mono-accent text-[9px] text-white/15 flex-shrink-0">{a.cam}</span>
          <span className="font-mono-accent text-[9px] text-white/10 flex-shrink-0 w-[50px] text-right">{a.time}</span>
        </div>
      ))}</div>
    </div>
  );
}

function ZonesTab() {
  return (
    <div>
      <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-white/15 mb-[16px]">{zones.length} Factory Zones</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
        {zones.map(z => (
          <div key={z.name} className="rounded-[14px] p-[16px] hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative overflow-hidden" style={{ ...glass(), borderColor: z.status === 'alert' ? 'rgba(248,113,113,0.15)' : z.status === 'warning' ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)' }}>
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)', transform: 'rotate(-30deg)' }} />
            <div className="flex items-center justify-between mb-[12px]">
              <span className="w-[8px] h-[8px] rounded-full" style={{ background: z.status === 'alert' ? '#f87171' : z.status === 'warning' ? '#fbbf24' : '#4ade80', boxShadow: `0 0 8px ${z.status === 'alert' ? 'rgba(248,113,113,0.5)' : z.status === 'warning' ? 'rgba(251,191,36,0.4)' : 'rgba(74,222,128,0.3)'}` }} />
              {z.alerts > 0 && <span className="font-mono-accent text-[9px] text-red-400/60 px-[6px] py-[2px] rounded-[6px]" style={glass(true)}>{z.alerts}</span>}
            </div>
            <p className="text-[14px] text-white/55 font-medium mb-[4px] group-hover:text-white/75 transition-colors">{z.name}</p>
            <p className="font-mono-accent text-[10px] text-white/15">{z.cameras} cameras</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const max = Math.max(...weeklyData);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div>
      <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-white/15 mb-[20px]">Weekly Alert Trend</p>
      <div className="rounded-[16px] p-[20px]" style={glass()}>
        <div className="flex items-end gap-[8px] h-[160px]">
          {weeklyData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-[6px]">
              <div className="w-full rounded-[8px] transition-all duration-500 hover:brightness-125 cursor-pointer group relative"
                style={{ height: `${(v / max) * 100}%`, background: 'linear-gradient(180deg, #fbbf24 0%, #b45309 100%)', opacity: 0.7, boxShadow: '0 0 12px rgba(251,191,36,0.1), 0 2px 4px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1) inset' }}
              >
                <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 font-mono-accent text-[9px] text-amber-400/0 group-hover:text-amber-400/80 transition-colors duration-200">{v}</span>
              </div>
              <span className="font-mono-accent text-[9px] text-white/15">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[12px] mt-[16px]">
        {[{ l: 'Total', v: '195', c: '#fbbf24' }, { l: 'Resolved', v: '183', c: '#4ade80' }, { l: 'Pending', v: '12', c: '#f87171' }].map(s => (
          <div key={s.l} className="rounded-[12px] p-[14px]" style={{ ...glass(true) }}>
            <p className="font-mono-accent text-[9px] uppercase tracking-[0.1em] text-white/15 mb-[6px]">{s.l}</p>
            <p className="font-display text-[22px] font-bold" style={{ color: s.c, textShadow: `0 0 16px ${s.c}25` }}>{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemTab() {
  return (
    <div className="space-y-[8px]">
      <p className="font-mono-accent text-[10px] uppercase tracking-[0.14em] text-white/15 mb-[12px]">System Configuration</p>
      {[
        { l: 'Detection Model', v: 'Proprietary', d: 'Real-time multi-class' },
        { l: 'Reasoning Model', v: 'Proprietary', d: 'Contextual understanding' },
        { l: 'Alert Threshold', v: '0.85', d: 'Confidence minimum' },
        { l: 'Frame Rate', v: '15 fps', d: 'Per camera rate' },
        { l: 'Storage', v: '2.4 / 4 TB', d: 'Local encrypted' },
        { l: 'Network', v: 'Offline', d: 'No internet needed' },
      ].map(s => (
        <div key={s.l} className="flex items-center justify-between rounded-[12px] p-[14px] hover:translate-x-[3px] transition-all duration-200 cursor-pointer group" style={{ ...glass(true), border: '1px solid rgba(255,255,255,0.03)' }}>
          <div><p className="text-[13px] text-white/45 group-hover:text-white/65 transition-colors">{s.l}</p><p className="font-mono-accent text-[9px] text-white/12 mt-[2px]">{s.d}</p></div>
          <span className="font-mono-accent text-[12px] text-amber-400/50 group-hover:text-amber-400/80 transition-colors" style={{ textShadow: '0 0 8px rgba(245,158,11,0.15)' }}>{s.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Shared ── */
function CamCard({ cam }: { cam: typeof cameras[0] }) {
  return (
    <div className="relative rounded-[12px] aspect-video overflow-hidden cursor-pointer group" style={{ ...glass(true), border: cam.status === 'alert' ? '1.5px solid rgba(248,113,113,0.2)' : '1px solid rgba(255,255,255,0.05)', boxShadow: cam.status === 'alert' ? '0 4px 16px rgba(248,113,113,0.06)' : '0 4px 12px rgba(0,0,0,0.3)' }}>
      <img src={cam.img} alt={cam.zone} className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-60 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-[8px] z-[1]">
        <div className="flex items-center justify-between">
          <span className="font-mono-accent text-[8px] text-white/35 px-[6px] py-[2px] rounded-[5px]" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>{cam.id}</span>
          <span className="w-[6px] h-[6px] rounded-full" style={{ background: cam.status === 'alert' ? '#f87171' : '#4ade80', boxShadow: `0 0 8px ${cam.status === 'alert' ? 'rgba(248,113,113,0.6)' : 'rgba(74,222,128,0.4)'}` }} />
        </div>
        <span className="font-mono-accent text-[8px] text-white/20">{cam.zone}</span>
      </div>
    </div>
  );
}

function AlertRow({ a }: { a: typeof alerts[0] }) {
  return (
    <div className="flex items-start gap-[10px] cursor-pointer hover:translate-x-[3px] transition-transform duration-200 group">
      <span className="mt-[4px] w-[8px] h-[8px] rounded-full flex-shrink-0 group-hover:scale-[1.3] transition-transform" style={{ background: sevColor[a.sev], boxShadow: `0 0 8px ${sevColor[a.sev]}40` }} />
      <div><p className="text-[12px] text-white/40 leading-[1.4] group-hover:text-white/60 transition-colors">{a.msg}</p><p className="font-mono-accent text-[9px] text-white/10 mt-[3px]">{a.time}</p></div>
    </div>
  );
}

/* ── Main Dashboard with cursor spotlight ── */
export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const content = [<OverviewTab key={0} />, <CamerasTab key={1} />, <AlertsTab key={2} />, <ZonesTab key={3} />, <AnalyticsTab key={4} />, <SystemTab key={5} />];

  return (
    <div className="relative mx-auto max-w-[1100px]">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-amber-500/[0.025] blur-[100px] pointer-events-none" />

      <div ref={containerRef} onMouseMove={handleMouseMove}
        className="relative rounded-[24px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #18181c 0%, #111114 50%, #0c0c0f 100%)',
          border: '1.5px solid rgba(255,255,255,0.06)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.03) inset, 0 -1px 0 rgba(0,0,0,0.3) inset',
        }}
      >
        <BorderBeam size={300} duration={16} colorFrom="#f59e0b" colorTo="#d97706" borderWidth={1} />

        {/* Cursor spotlight — follows mouse */}
        <div className="absolute inset-0 pointer-events-none z-[2] transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245,158,11,0.04), transparent 60%)`,
            opacity: mousePos.x > 0 ? 1 : 0,
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        {/* Title bar */}
        <div className="relative z-[3] flex items-center gap-[8px] px-[24px] py-[14px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 100%)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="w-[12px] h-[12px] rounded-full cursor-pointer hover:brightness-130 transition-all" style={{ background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b)', boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 4px rgba(255,95,87,0.2)' }} />
          <span className="w-[12px] h-[12px] rounded-full cursor-pointer hover:brightness-130 transition-all" style={{ background: 'radial-gradient(circle at 30% 30%, #ffd93d, #c0920b)', boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 4px rgba(254,188,46,0.2)' }} />
          <span className="w-[12px] h-[12px] rounded-full cursor-pointer hover:brightness-130 transition-all" style={{ background: 'radial-gradient(circle at 30% 30%, #6bcb77, #0e8a1e)', boxShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 4px rgba(40,200,64,0.2)' }} />
          <span className="ml-[20px] font-mono-accent text-[10px] text-white/12 tracking-[0.14em] uppercase">Kenesis Dashboard</span>
          <span className="ml-auto flex items-center gap-[6px]">
            <span className="w-[7px] h-[7px] rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(74,222,128,0.5)' }} />
            <span className="text-[10px] text-green-400/35">Live</span>
          </span>
        </div>

        <div className="relative z-[3] grid grid-cols-1 md:grid-cols-[180px_1fr] min-h-[520px]">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col gap-[3px] p-[14px]" style={{ borderRight: '1px solid rgba(255,255,255,0.03)', background: 'rgba(0,0,0,0.1)' }}>
            {tabList.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className="text-left px-[12px] py-[10px] rounded-[10px] text-[12px] cursor-pointer transition-all duration-300 relative overflow-hidden"
                style={i === activeTab ? {
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)',
                  border: '1px solid rgba(245,158,11,0.12)',
                  color: 'rgba(245,158,11,0.85)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.04), 0 2px 4px rgba(0,0,0,0.2) inset',
                } : { color: 'rgba(255,255,255,0.18)', border: '1px solid transparent' }}
              >{tab}</button>
            ))}
          </div>

          {/* Content area */}
          <div className="p-[22px]">{content[activeTab]}</div>
        </div>
      </div>
    </div>
  );
}
