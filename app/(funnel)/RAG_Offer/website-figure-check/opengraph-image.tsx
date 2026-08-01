import { funnelOgImage, size, contentType } from '@/components/funnel/funnelOgImage';

export { size, contentType };
export const alt = "Check your firm's published figures";

export default async function Image() {
  return funnelOgImage(
    "Check your firm's published figures",
    'Every citation checked. Every link real.',
  );
}
