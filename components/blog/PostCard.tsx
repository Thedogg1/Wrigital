import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '@/sanity/lib/image';
import { calculateReadTime } from '@/lib/readTime';
import type { Post } from '@/types';

export function PostCard({ post }: { post: Post }) {
  const readTime = calculateReadTime(post.body);
  const slug = post.slug?.current;

  if (!slug) return null;

  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-overlay)]">
        {post.mainImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={urlForImage(post.mainImage)}
              alt={post.mainImage.alt ?? post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          {post.categories && post.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
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
          <h2 className="mb-2 line-clamp-2 text-xl font-bold text-[var(--color-primary)] group-hover:text-[var(--color-primary-soft)]">
            {post.title}
          </h2>
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-[var(--color-text-secondary)]">
            {post.description}
          </p>
          <div className="mt-auto border-t border-[var(--color-border-subtle)] pt-4 text-xs text-[var(--color-text-secondary)]">
            <div className="flex justify-between">
              <span>By {post.authorName}</span>
              <span>{readTime} min read</span>
            </div>
            <time dateTime={post.publishedAt} className="mt-2 block">
              {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
