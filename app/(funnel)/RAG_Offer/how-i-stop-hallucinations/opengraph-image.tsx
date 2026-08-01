import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'How I stop hallucinations';

export default async function Image() {
  return funnelOgImage(
    'How I stop hallucinations',
    'Every citation checked. Every link real.',
  );
}
