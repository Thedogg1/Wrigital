import { describe, expect, it } from 'vitest';
import { calculateReadTime } from '@/lib/readTime';
import type { Block } from '@/types';

describe('calculateReadTime', () => {
  it('returns 0 for empty blocks', () => {
    expect(calculateReadTime([])).toBe(0);
  });

  it('estimates reading time from block text', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    const blocks: Block[] = [
      {
        _key: 'a',
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          { _key: 'b', _type: 'span', marks: [], text: words },
        ],
      },
    ];
    expect(calculateReadTime(blocks)).toBe(2);
  });
});
