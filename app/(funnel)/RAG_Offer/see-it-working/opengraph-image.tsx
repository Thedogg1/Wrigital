import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'The Verified Assistant in four minutes';

export default async function Image() {
  return funnelOgImage(
    'The Verified Assistant in four minutes',
    'Every citation checked. Every link real.',
  );
}
