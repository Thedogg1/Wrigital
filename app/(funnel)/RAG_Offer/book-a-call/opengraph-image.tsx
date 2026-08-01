import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'Thirty minutes to define your AI compliance blueprint';

export default async function Image() {
  return funnelOgImage(
    'Thirty minutes to define your AI compliance blueprint',
    'Every citation checked. Every link real.',
  );
}
