import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Wrigital, verified AI for UK advice firms';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0E1A26',
          color: '#F6F7F8',
          padding: 72,
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: '#8FA6C6' }}>
          WRIGITAL
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 980 }}>
          Generic AI asks your firm to accept its standards. I build to yours.
        </div>
        <div style={{ fontSize: 26, color: '#8FA6C6' }}>
          Verified AI for UK FCA-regulated advice firms
        </div>
      </div>
    ),
    { ...size },
  );
}
