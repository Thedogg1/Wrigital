import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Shared OG card using main Wrigital navy / cream. */
export function funnelOgImage(headline: string, subline: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a2342',
          color: '#faf7f0',
          padding: 72,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: '#b08d57' }}>
          WRIGITAL
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 980 }}>
          {headline}
        </div>
        <div style={{ fontSize: 26, color: '#b08d57' }}>{subline}</div>
      </div>
    ),
    { ...size },
  );
}
