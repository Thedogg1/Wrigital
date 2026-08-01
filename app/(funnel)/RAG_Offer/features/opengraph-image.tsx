import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'The Verified Assistant, Founding Firms Programme';

export default async function Image() {
  return funnelOgImage(
    'The Verified Assistant',
    'Founding Firms Programme',
  );
}
