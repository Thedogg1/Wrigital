import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

/**
 * The Sanity Studio route (/studio) is protected by Clerk authentication.
 * See proxy.ts and app/(authenticated)/sign-in.
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
