import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kenesis | On-Premise AI Video Analytics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0a0a0b',
          position: 'relative',
        }}
      >
        {/* Amber glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Top: wordmark + eyebrow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'rgba(245,158,11,0.7)',
            }}
          >
            On-Premise AI Video Analytics
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          >
            Kenesis
          </div>
        </div>

        {/* Bottom: tagline + amber pill */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.4,
              maxWidth: '760px',
            }}
          >
            Turn your existing CCTV into a real-time safety system. PPE violations, zone breaches, hazard detection — on your hardware.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 45%, #f59e0b 100%)',
                color: '#1a1200',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              kenesis.ai
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
