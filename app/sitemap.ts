import type { MetadataRoute } from 'next';
import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { hasSanityConfig } from '@/sanity/env';
import { siteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl;
  const staticRoutes = [
    '',
    '/consultancy',
    '/client-conversion-financial-advisers',
    '/client-intelligence-engine',
    '/unverified-answer-count',
    '/about',
    '/blog',
    '/privacy',
    '/terms',
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : 0.8,
  }));

  if (hasSanityConfig()) {
    try {
      const slugs: { slug: string }[] = await client.fetch(
        groq`*[_type=="post" && defined(slug.current)]{ "slug": slug.current }`,
      );
      entries.push(
        ...slugs.map((s) => ({
          url: `${base}/blog/${s.slug}`,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })),
      );
    } catch {
      // Sanity unavailable at build time
    }
  }

  return entries;
}
