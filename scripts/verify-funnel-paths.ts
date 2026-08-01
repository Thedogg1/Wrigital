/**
 * Asserts funnel route files and site.ts hrefs line up.
 * Run: npx tsx scripts/verify-funnel-paths.ts
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOOK_TAB, TABS } from '../lib/site';

const root = join(__dirname, '..');
const funnelApp = join(root, 'app', '(funnel)');

const required = [
  ...TABS.map((t) => t.href),
  BOOK_TAB.href,
  '/RAG_Offer/thank-you',
  '/RAG_Offer/privacy',
  '/RAG_Offer/website-figure-check',
];

const redirects: Array<{ from: string; file: string }> = [
  { from: '/RAG_Offer', file: join(funnelApp, 'RAG_Offer', 'page.tsx') },
  {
    from: '/website-figure-check',
    file: join(root, 'app', 'website-figure-check', 'page.tsx'),
  },
  {
    from: '/thank-you',
    file: join(funnelApp, 'thank-you', 'page.tsx'),
  },
  {
    from: '/verified-answers',
    file: join(funnelApp, 'verified-answers', 'page.tsx'),
  },
  {
    from: '/the-assistant',
    file: join(funnelApp, 'the-assistant', 'page.tsx'),
  },
  {
    from: '/RAG_Offer/book',
    file: join(funnelApp, 'RAG_Offer', 'book', 'page.tsx'),
  },
  {
    from: '/RAG_Offer/the-assistant',
    file: join(funnelApp, 'RAG_Offer', 'the-assistant', 'page.tsx'),
  },
];

function hrefToPage(href: string): string {
  const rel = href.replace(/^\//, '');
  return join(funnelApp, ...rel.split('/'), 'page.tsx');
}

const missing: string[] = [];

for (const href of required) {
  const page = hrefToPage(href);
  if (!existsSync(page)) missing.push(`Missing page for ${href} -> ${page}`);
}

for (const r of redirects) {
  if (!existsSync(r.file)) missing.push(`Missing redirect page ${r.from}`);
}

const wizardPage = join(
  funnelApp,
  'RAG_Offer',
  'verified-answers',
  'page.tsx',
);
const wizardBlock = join(
  root,
  'components',
  'funnel',
  'wizard',
  'WizardBlock.tsx',
);
const flow = join(
  root,
  'components',
  'unverified-answers',
  'UnverifiedAnswersFlow.tsx',
);
const api = join(root, 'app', 'api', 'unverified-answer-capture', 'route.ts');
const report = join(
  root,
  'app',
  'unverified-answer-count',
  'report',
  '[token]',
  'route.ts',
);

for (const [label, file] of [
  ['verified-answers page', wizardPage],
  ['WizardBlock', wizardBlock],
  ['UnverifiedAnswersFlow', flow],
  ['capture API', api],
  ['report token route', report],
] as const) {
  if (!existsSync(file)) missing.push(`Missing ${label}: ${file}`);
}

if (missing.length) {
  console.error('verify-funnel-paths failed:');
  for (const m of missing) console.error(' -', m);
  process.exit(1);
}

console.log(
  `verify-funnel-paths: ok (${required.length} routes, ${redirects.length} redirects, wizard chain present)`,
);
