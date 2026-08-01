/**
 * Extracts blockquoted prose from wrigital-funnel-copy-v4.md and asserts
 * fingerprints appear in content/copy.ts or emails/. Run: npx tsx scripts/verify-copy.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..');
const copyMd = readFileSync(
  join(root, 'docs/wrigital-funnel-copy-v5.md'),
  'utf8',
);
const corpus = [
  readFileSync(join(root, 'content/copy.ts'), 'utf8'),
  readFileSync(join(root, 'emails/FigureCheckRecord.tsx'), 'utf8'),
]
  .join('\n')
  .replace(/\*\*/g, '')
  .replace(/\\'/g, "'")
  .replace(/\\"/g, '"');

/** Skip emailed-record section and bracketed UI tokens. */
let inEmail = false;
const lines = copyMd.split(/\r?\n/).flatMap((raw) => {
  if (raw.startsWith('## Emailed record')) inEmail = true;
  if (raw.startsWith('# 2.')) inEmail = false;
  if (inEmail) return [];
  if (!raw.startsWith('> ')) return [];
  let line = raw
    .replace(/^>\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/^-\s+/, '')
    .trim();
  if (line.length < 20) return [];
  if (line.startsWith('[')) return [];
  if (line.includes('[domain]') || line.includes('[email]') || line.includes('[n]'))
    return [];
  return [line];
});

const missing: string[] = [];
for (const line of lines) {
  const fingerprint = line.slice(0, 32).trimEnd();
  if (!corpus.includes(fingerprint)) {
    const short = line.slice(0, 18).trimEnd();
    if (short.length >= 12 && !corpus.includes(short)) {
      missing.push(line.slice(0, 90));
    }
  }
}

if (missing.length) {
  console.error(`verify-copy: ${missing.length} line(s) missing:`);
  for (const m of missing.slice(0, 25)) console.error(' -', m);
  process.exit(1);
}

console.log(`verify-copy: ok (${lines.length} lines checked)`);
