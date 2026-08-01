import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = 'How many unverified answers left your firm last month';

export default async function Image() {
  return funnelOgImage(
    'How many unverified answers left your firm last month',
    'Eleven questions. The estimate appears on screen.',
  );
}
