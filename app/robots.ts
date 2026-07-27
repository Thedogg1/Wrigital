import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/uk', '/us', '/studio', '/unverified-answer-count/report'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
