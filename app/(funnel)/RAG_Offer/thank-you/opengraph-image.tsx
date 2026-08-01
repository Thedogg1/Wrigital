import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'Your figure check record is on its way';

export default async function Image() {
  return funnelOgImage(
    'Your figure check record is on its way',
    'Every citation checked. Every link real.',
  );
}
