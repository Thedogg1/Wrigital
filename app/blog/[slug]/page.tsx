import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { groq, PortableText } from 'next-sanity';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { RichText } from '@/components/blog/RichText';
import { CtaBand } from '@/components/marketing/CtaBand';
import { client } from '@/sanity/lib/client';
import { hasSanityConfig } from '@/sanity/env';
import { urlForImage } from '@/sanity/lib/image';
import { calculateReadTime } from '@/lib/readTime';
import { calendlyUrl, siteUrl } from '@/lib/site';
import type { Post } from '@/types';

const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ...,
    categories[]->,
    "comments": *[_type == "comment" && post._ref == ^._id && approved == true],
  }
`;

const slugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`;

export const revalidate = 60;

export async function generateStaticParams() {
  if (!hasSanityConfig()) return [];
  const slugs: { slug: string }[] = await client.fetch(slugsQuery).catch(() => []);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!hasSanityConfig()) return {};
  const post: Post | null = await client
    .fetch(postBySlugQuery, { slug })
    .catch(() => null);
  if (!post) return {};
  return {
    title: `${post.title} | Wrigital Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.mainImage ? [urlForImage(post.mainImage)] : [],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!hasSanityConfig()) notFound();
  const post: Post | null = await client
    .fetch(postBySlugQuery, { slug })
    .catch(() => null);

  if (!post) notFound();

  const readTime = calculateReadTime(post.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.authorName },
    image: post.mainImage ? urlForImage(post.mainImage) : undefined,
    url: `${siteUrl}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="min-h-screen bg-[var(--color-surface)]">
        {post.mainImage && (
          <div className="relative h-[300px] w-full overflow-hidden sm:h-[400px] md:h-[500px]">
            <Image
              src={urlForImage(post.mainImage)}
              alt={post.mainImage.alt ?? post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <article className="mx-auto max-w-4xl px-6 py-12">
          <header className="mb-10 border-b border-[var(--color-border-subtle)] pb-8">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category._id}
                    className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-medium text-[var(--color-text-inverse)]"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}
            <h1 className="mb-4 text-3xl font-bold text-[var(--color-primary)] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
              <span>By {post.authorName}</span>
              <span>{readTime} min read</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
          </header>
          <div className="prose max-w-none">
            <PortableText value={post.body} components={RichText} />
          </div>
        </article>
        <CtaBand
          title="Ready to see FinPrint or book an assessment?"
          cta={{ label: 'Book an assessment', href: calendlyUrl }}
          secondary={{
            label: 'See FinPrint',
            href: '/client-conversion-financial-advisers',
          }}
          tone="paper"
        />
      </main>
      <Footer />
    </>
  );
}
