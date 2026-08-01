import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'Wrigital, verified AI for UK advice firms';

export default async function Image() {
  return funnelOgImage(
    'Generic AI asks your firm to accept its standards. I build to yours.',
    'Verified AI for UK FCA-regulated advice firms',
  );
}
