import type { Block } from '@/types';

export function calculateReadTime(blocks: Block[]): number {
  if (!blocks || blocks.length === 0) {
    return 0;
  }

  let wordCount = 0;

  blocks.forEach((block) => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((child) => {
        if (child._type === 'span' && child.text) {
          const words = child.text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
          wordCount += words.length;
        }
      });
    }
  });

  const wordsPerMinute = 200;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime > 0 ? readingTime : 1;
}
