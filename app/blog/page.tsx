import type { Metadata } from 'next';
import { groq } from 'next-sanity';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import { client } from '@/sanity/lib/client';
import { hasSanityConfig } from '@/sanity/env';
import type { Post } from '@/types';

const postsQuery = groq`
  *[_type == "post"]{
    ...,
    categories[]->,
  } | order(publishedAt desc)
`;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Thought leadership on AI, compliance and regulated professional services from Wrigital.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts: Post[] = hasSanityConfig()
    ? await client.fetch(postsQuery).catch(() => [])
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-surface)] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-[var(--color-primary)]">
              Wrigital Blog
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              AI, compliance and regulated professional services
            </p>
          </div>
          {!posts?.length ? (
            <p className="py-16 text-center text-[var(--color-text-secondary)]">
              No posts found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
