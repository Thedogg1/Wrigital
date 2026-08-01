import * as cheerio from 'cheerio';
import type { AnyNode, Element } from 'domhandler';
import { FIGURES } from './figures';
import {
  FORWARD_SEARCH_MAX_CHARS,
  isNonValueMention,
  isValueLinkIntervening,
  matchTaperGuard,
} from './taper-guards';
import type { DetectedNumber, FigureUnit, RejectedDetection } from './types';

function isKnownFigureValue(figureId: string, value: number): boolean {
  const figure = FIGURES.find((f) => f.id === figureId);
  if (!figure) return false;
  if (Math.abs(figure.currentValue - value) < 0.001) return true;
  return figure.priorValues.some((p) => Math.abs(p.value - value) < 0.001);
}

const STRIP_TAGS = new Set([
  'script',
  'style',
  'nav',
  'header',
  'footer',
  'noscript',
  'svg',
  'iframe',
]);

const GBP_RE =
  /£\s*([\d,]+(?:\.\d+)?)\s*(k)?\b|\b([\d,]+(?:\.\d+)?)\s*(k)?\s*(?:pounds?|gbp)\b/gi;
const PCT_RE = /(\d+(?:\.\d+)?)\s*%/g;

function parseGbp(rawDigits: string, kSuffix?: string): number {
  const n = Number(rawDigits.replace(/,/g, ''));
  if (!Number.isFinite(n)) return NaN;
  return kSuffix ? n * 1000 : n;
}

function cleanText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordIndex(haystack: string, keyword: string): number {
  const re = new RegExp(
    `(?:^|[^a-z0-9])(${escapeRegExp(keyword)})(?=[^a-z0-9]|$)`,
    'i',
  );
  const m = re.exec(haystack);
  if (!m || m.index === undefined) return -1;
  // Point at the keyword itself, not the boundary char
  const full = m[0];
  const kw = m[1] ?? keyword;
  return m.index + (full.length - kw.length);
}

function sentenceSpan(
  text: string,
  index: number,
  length: number,
): { start: number; end: number; sentence: string } {
  const before = text.slice(0, index);
  const after = text.slice(index + length);
  const startCandidates = [
    before.lastIndexOf('. '),
    before.lastIndexOf('? '),
    before.lastIndexOf('! '),
  ];
  const startBound = Math.max(-1, ...startCandidates);
  const endCandidates = [
    after.indexOf('. '),
    after.indexOf('? '),
    after.indexOf('! '),
  ].filter((i) => i >= 0);
  const endRel = endCandidates.length ? Math.min(...endCandidates) : -1;

  const start = startBound >= 0 ? startBound + 2 : 0;
  const end = endRel >= 0 ? index + length + endRel + 1 : text.length;
  return { start, end, sentence: cleanText(text.slice(start, end)) };
}

function withContext(text: string, index: number, length: number): string {
  const ctxStart = Math.max(0, index - 120);
  const ctxEnd = Math.min(text.length, index + length + 120);
  return cleanText(text.slice(ctxStart, ctxEnd));
}


function numberIndexInHaystack(
  haystack: string,
  raw: string,
  value: number,
): number {
  const idx = haystack.indexOf(raw);
  if (idx >= 0) return idx;
  const formatted = value.toLocaleString('en-GB');
  const pound = haystack.indexOf(`£${formatted}`);
  if (pound >= 0) return pound;
  return haystack.indexOf(String(value));
}

function findKeywordMatch(
  haystack: string,
): { figureId: string; keyword: string } | null {
  let best: { figureId: string; keyword: string; len: number } | null = null;

  for (const fig of FIGURES) {
    for (const kw of fig.keywords) {
      if (keywordIndex(haystack, kw) < 0) continue;
      if (!best || kw.length > best.len) {
        best = { figureId: fig.id, keyword: kw, len: kw.length };
      }
    }
  }
  return best ? { figureId: best.figureId, keyword: best.keyword } : null;
}

function surroundingHtml($: cheerio.CheerioAPI, el: AnyNode | null): string {
  if (!el || el.type !== 'tag') return '';
  const html = $.html(el as Element) ?? '';
  return html.length > 800 ? `${html.slice(0, 800)}…` : html;
}

function stripUnwanted($: cheerio.CheerioAPI): void {
  $('*').each((_, el) => {
    if (el.type !== 'tag') return;
    const tag = el.tagName.toLowerCase();
    if (STRIP_TAGS.has(tag)) {
      $(el).remove();
      return;
    }
    if ($(el).attr('aria-hidden') === 'true') {
      $(el).remove();
    }
  });
}

type TextBlock = {
  text: string;
  /** Nearest preceding heading text; used only with known figure values. */
  headingContext: string;
  surroundingHtml: string;
  inTable: boolean;
  /**
   * Governing column header text for table cells only.
   * Row labels and cell prose are never used for figure association.
   */
  columnHeader: string;
};

/** Column headers must contain one of these before any figure match is attempted. */
const TABLE_HEADER_TRIGGER_CUE =
  /\b(allowance|allowances|limit|limits|threshold|thresholds|exemption|exemptions)\b/i;

/** Nested elements that must never be flattened into a parent block's text. */
const NESTED_BLOCK_SELECTOR = [
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'p',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'section',
  'article',
  'main',
  'aside',
  'header',
  'footer',
  'nav',
  'blockquote',
  'figure',
  'form',
  'div',
].join(',');

function columnHeaderHasTriggerCue(header: string): boolean {
  return TABLE_HEADER_TRIGGER_CUE.test(header);
}

/**
 * Text belonging to this element only — nested block elements are stripped
 * so a prose trigger cannot reach a table cell or sibling block.
 */
function elementOwnText($: cheerio.CheerioAPI, el: AnyNode): string {
  if (!el || el.type !== 'tag') return '';
  const clone = $(el).clone();
  clone.find(NESTED_BLOCK_SELECTOR).remove();
  return cleanText(clone.text());
}

function pushProseBlock(
  blocks: TextBlock[],
  $: cheerio.CheerioAPI,
  el: AnyNode,
  headingContext: string,
): void {
  const text = elementOwnText($, el);
  if (!text) return;
  blocks.push({
    text,
    headingContext,
    surroundingHtml: surroundingHtml($, el),
    inTable: false,
    columnHeader: '',
  });
}

function collectTableBlocks(
  $: cheerio.CheerioAPI,
  table: Element,
  blocks: TextBlock[],
): void {
  const $table = $(table);
  const rows = $table.find('tr').toArray();
  if (rows.length === 0) return;

  const colHeaders: string[] = [];
  const firstRowCells = $(rows[0]!).find('th, td').toArray();
  const firstIsHeader =
    $(rows[0]!).find('th').length > 0 ||
    firstRowCells.every((c) => !GBP_RE.test($(c).text()));
  if (firstIsHeader) {
    firstRowCells.forEach((cell, i) => {
      colHeaders[i] = cleanText($(cell).text());
    });
  }

  // Illustrative tables: no statutory cue in any column header → skip entirely.
  if (!colHeaders.some(columnHeaderHasTriggerCue)) return;

  const dataRows = firstIsHeader ? rows.slice(1) : rows;

  for (const row of dataRows) {
    const cells = $(row).find('th, td').toArray();
    if (cells.length === 0) continue;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]!;
      const cellText = elementOwnText($, cell);
      if (!cellText) continue;

      GBP_RE.lastIndex = 0;
      PCT_RE.lastIndex = 0;
      if (!GBP_RE.test(cellText) && !PCT_RE.test(cellText)) continue;
      GBP_RE.lastIndex = 0;
      PCT_RE.lastIndex = 0;

      const columnHeader = colHeaders[i] ?? '';
      if (!columnHeaderHasTriggerCue(columnHeader)) continue;

      blocks.push({
        text: cellText,
        headingContext: '',
        surroundingHtml: surroundingHtml($, row),
        inTable: true,
        columnHeader,
      });
    }
  }
}

function collectBlocks($: cheerio.CheerioAPI): TextBlock[] {
  const blocks: TextBlock[] = [];
  let currentHeading = '';
  const root = $('body').length ? $('body') : $('html');

  function walk(nodes: AnyNode[]): void {
    for (const node of nodes) {
      if (node.type !== 'tag') continue;
      const tag = node.tagName.toLowerCase();
      if (STRIP_TAGS.has(tag)) continue;
      if ($(node).attr('aria-hidden') === 'true') continue;

      // Tables are their own block universe — never flatten into surrounding prose.
      if (tag === 'table') {
        collectTableBlocks($, node as Element, blocks);
        continue;
      }

      if (/^h[1-6]$/.test(tag)) {
        currentHeading = elementOwnText($, node);
        pushProseBlock(blocks, $, node, currentHeading);
        continue;
      }

      if (
        tag === 'p' ||
        tag === 'li' ||
        tag === 'blockquote' ||
        tag === 'dd' ||
        tag === 'td' ||
        tag === 'th'
      ) {
        pushProseBlock(blocks, $, node, currentHeading);
        continue;
      }

      if (
        tag === 'div' ||
        tag === 'section' ||
        tag === 'article' ||
        tag === 'main' ||
        tag === 'ul' ||
        tag === 'ol' ||
        tag === 'figure' ||
        tag === 'aside'
      ) {
        const childTags = $(node)
          .children()
          .toArray()
          .filter((c) => c.type === 'tag');
        if (childTags.length > 0) {
          walk(node.children ?? []);
        } else {
          pushProseBlock(blocks, $, node, currentHeading);
        }
        continue;
      }

      walk(node.children ?? []);
    }
  }

  walk(
    root
      .toArray()
      .flatMap((n) => ('children' in n && n.children ? n.children : [n])),
  );

  return blocks;
}

function detectInText(
  text: string,
  unit: FigureUnit,
): { value: number; raw: string; index: number; length: number }[] {
  const out: { value: number; raw: string; index: number; length: number }[] =
    [];
  if (unit === 'gbp') {
    const re = new RegExp(GBP_RE.source, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const digits = m[1] ?? m[3];
      const k = m[2] ?? m[4];
      if (!digits) continue;
      // Skip scale words: "£1 million", "£2.5bn", etc.
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 16);
      if (/^\s*(million|billion|trillion|m\b|bn\b|tn\b)/i.test(after)) {
        continue;
      }
      const value = parseGbp(digits, k);
      if (!Number.isFinite(value)) continue;
      out.push({ value, raw: m[0], index: m.index, length: m[0].length });
    }
  } else {
    const re = new RegExp(PCT_RE.source, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const value = Number(m[1]);
      if (!Number.isFinite(value)) continue;
      out.push({
        value,
        raw: m[0],
        index: m.index!,
        length: m[0].length,
      });
    }
  }
  return out;
}

function findAllKeywordIndexes(haystack: string, keyword: string): number[] {
  const indexes: number[] = [];
  let from = 0;
  while (from < haystack.length) {
    const rel = keywordIndex(haystack.slice(from), keyword);
    if (rel < 0) break;
    const abs = from + rel;
    indexes.push(abs);
    from = abs + Math.max(keyword.length, 1);
  }
  return indexes;
}

type TriggerOccurrence = {
  figureId: string;
  keyword: string;
  start: number;
  end: number;
};

/** Reference-list triggers in the sentence; longest wins on overlap. */
function collectTriggerOccurrences(sentence: string): TriggerOccurrence[] {
  const raw: TriggerOccurrence[] = [];
  for (const fig of FIGURES) {
    for (const kw of fig.keywords) {
      for (const start of findAllKeywordIndexes(sentence, kw)) {
        raw.push({
          figureId: fig.id,
          keyword: kw,
          start,
          end: start + kw.length,
        });
      }
    }
  }

  raw.sort(
    (a, b) =>
      a.start - b.start ||
      b.keyword.length - a.keyword.length ||
      b.end - a.end,
  );

  const chosen: TriggerOccurrence[] = [];
  for (const t of raw) {
    if (chosen.some((c) => t.start < c.end && t.end > c.start)) continue;
    chosen.push(t);
  }
  return chosen.sort((a, b) => a.start - b.start);
}

type ForwardMatch = { figureId: string; keyword: string };
type ForwardTaper = ForwardMatch & {
  numberIndex: number;
  numberValue: number;
  guardId: string;
};

type ForwardSkipped = ForwardMatch & {
  numberIndex: number;
  numberValue: number;
  reason: string;
};

type ForwardBindings = {
  byNumberIndex: Map<number, ForwardMatch>;
  tapered: ForwardTaper[];
  skipped: ForwardSkipped[];
};

/** When the number comes first ("£12,570 personal allowance"). */
const FOLLOWING_LABEL_MAX_CHARS = 30;

/**
 * Label-first: each trigger claims the first number to its right.
 * Hard stop at next trigger, ~60 chars, or sentence end.
 * Taper wording / non-value mentions / non-value intervening text skip the bind.
 * Second pass: number-then-label within a short window.
 */
function buildForwardBindings(sentence: string): ForwardBindings {
  const triggers = collectTriggerOccurrences(sentence);
  const numbers = [
    ...detectInText(sentence, 'gbp'),
    ...detectInText(sentence, 'percent'),
  ].sort((a, b) => a.index - b.index);

  const byNumberIndex = new Map<number, ForwardMatch>();
  const tapered: ForwardTaper[] = [];
  const skipped: ForwardSkipped[] = [];
  const claimed = new Set<number>();

  for (let i = 0; i < triggers.length; i++) {
    const trigger = triggers[i]!;
    const nextTriggerStart = triggers[i + 1]?.start ?? sentence.length;
    const windowEnd = Math.min(
      trigger.end + FORWARD_SEARCH_MAX_CHARS,
      nextTriggerStart,
      sentence.length,
    );

    if (isNonValueMention(sentence.slice(0, trigger.start))) {
      continue;
    }

    const number = numbers.find(
      (n) =>
        n.index >= trigger.end &&
        n.index < windowEnd &&
        !claimed.has(n.index),
    );
    if (!number) continue;

    claimed.add(number.index);
    const intervening = sentence.slice(trigger.end, number.index);
    const guardId = matchTaperGuard(intervening, number.raw);
    if (guardId) {
      tapered.push({
        figureId: trigger.figureId,
        keyword: trigger.keyword,
        numberIndex: number.index,
        numberValue: number.value,
        guardId,
      });
      continue;
    }

    if (!isValueLinkIntervening(intervening)) {
      skipped.push({
        figureId: trigger.figureId,
        keyword: trigger.keyword,
        numberIndex: number.index,
        numberValue: number.value,
        reason:
          'Trigger mention is not a value attribution for the following number',
      });
      continue;
    }

    byNumberIndex.set(number.index, {
      figureId: trigger.figureId,
      keyword: trigger.keyword,
    });
  }

  // Number then label: "£12,570 personal allowance"
  for (const number of numbers) {
    if (claimed.has(number.index)) continue;
    const numberEnd = number.index + number.length;
    const windowEnd = Math.min(
      numberEnd + FOLLOWING_LABEL_MAX_CHARS,
      sentence.length,
    );
    const candidates = triggers.filter(
      (t) => t.start >= numberEnd && t.start < windowEnd,
    );
    if (candidates.length === 0) continue;
    const best = [...candidates].sort(
      (a, b) => b.keyword.length - a.keyword.length || a.start - b.start,
    )[0]!;
    const intervening = sentence.slice(numberEnd, best.start);
    // Only tight label attachment — not "£260,000 can have their pension…"
    if (
      intervening.trim().length > 0 &&
      !/^(\s+|\s+(is|as)\s+(the|a|an)?\s*)$/i.test(intervening)
    ) {
      continue;
    }
    claimed.add(number.index);
    byNumberIndex.set(number.index, {
      figureId: best.figureId,
      keyword: best.keyword,
    });
  }

  return { byNumberIndex, tapered, skipped };
}

export type ExtractResult = {
  detections: DetectedNumber[];
  rejected: RejectedDetection[];
};

export function extractFiguresFromHtml(
  html: string,
  pageUrl: string,
): ExtractResult {
  const $ = cheerio.load(html);
  stripUnwanted($);

  const blocks = collectBlocks($);
  const detections: DetectedNumber[] = [];
  const rejected: RejectedDetection[] = [];
  const seenKeys = new Set<string>();
  const forwardCache = new Map<string, ForwardBindings>();

  for (const block of blocks) {
    const hits = [
      ...detectInText(block.text, 'gbp').map((h) => ({
        ...h,
        unit: 'gbp' as const,
      })),
      ...detectInText(block.text, 'percent').map((h) => ({
        ...h,
        unit: 'percent' as const,
      })),
    ];

    for (const hit of hits) {
      const span = sentenceSpan(block.text, hit.index, hit.length);
      const matchSentence = span.sentence;
      const displaySentence = withContext(block.text, hit.index, hit.length);
      const dedupeKey = `${pageUrl}|${hit.value}|${matchSentence}|${block.columnHeader}`;
      if (seenKeys.has(dedupeKey)) continue;
      seenKeys.add(dedupeKey);

      // Statutory GBP figures we track are never tiny amounts (e.g. £1 for £2 taper).
      if (hit.unit === 'gbp' && hit.value < 100) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason: 'Amount too small to be a tracked statutory figure',
        });
        continue;
      }

      let match: {
        figureId: string;
        keyword: string;
        location: 'sentence' | 'heading';
      } | null = null;

      if (block.inTable) {
        // Tables: meaning comes only from the column header, never row labels
        // or cell prose. Header must already carry a statutory cue (enforced
        // when the block was collected).
        const headerMatch = findKeywordMatch(block.columnHeader);
        if (headerMatch) {
          match = { ...headerMatch, location: 'sentence' };
        } else {
          rejected.push({
            pageUrl,
            numberFound: hit.value,
            sentence: `${block.columnHeader}: ${displaySentence}`.trim(),
            reason:
              'Table column header has no matching figure trigger phrase',
          });
          continue;
        }
      } else {
        let bindings = forwardCache.get(matchSentence);
        if (!bindings) {
          bindings = buildForwardBindings(matchSentence);
          forwardCache.set(matchSentence, bindings);
        }

        const numIdxInSentence = numberIndexInHaystack(
          matchSentence,
          hit.raw,
          hit.value,
        );

        const tapered = bindings.tapered.find(
          (t) => t.numberIndex === numIdxInSentence,
        );
        if (tapered) {
          rejected.push({
            pageUrl,
            numberFound: hit.value,
            sentence: displaySentence,
            reason: `Conditional variant (taper guard: ${tapered.guardId}); excluded from comparison`,
          });
          continue;
        }

        const skipped = bindings.skipped.find(
          (s) => s.numberIndex === numIdxInSentence,
        );
        if (skipped) {
          rejected.push({
            pageUrl,
            numberFound: hit.value,
            sentence: displaySentence,
            reason: skipped.reason,
          });
          continue;
        }

        const sentenceMatch =
          numIdxInSentence >= 0
            ? bindings.byNumberIndex.get(numIdxInSentence)
            : undefined;
        if (sentenceMatch) {
          match = { ...sentenceMatch, location: 'sentence' };
        } else if (block.headingContext) {
          // Heading may label a following block only when the number is a
          // known current/prior value for that figure — blocks the £30,000
          // under "personal allowance" false positive, keeps real £12,570.
          const headingMatch = findKeywordMatch(block.headingContext);
          if (
            headingMatch &&
            isKnownFigureValue(headingMatch.figureId, hit.value)
          ) {
            match = { ...headingMatch, location: 'heading' };
          }
        }
      }

      if (!match) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason: 'No matching figure keyword in the same block as this number',
        });
        continue;
      }

      // Residence nil-rate band is a different figure from the standard NRB
      if (
        match.figureId === 'iht-nil-rate-band' &&
        /residence\s+nil[-\s]?rate\s+band/i.test(matchSentence)
      ) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason:
            'Ambiguous: sentence refers to the residence nil-rate band, not the standard nil rate band',
        });
        continue;
      }

      // Combined couple thresholds are not the single-person NRB value
      if (
        match.figureId === 'iht-nil-rate-band' &&
        /(combine|combined|couple|civil partners).{0,80}(650,?000|£650)/i.test(
          matchSentence,
        ) &&
        hit.value === 650000
      ) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason:
            'Ambiguous: combined couple nil-rate band total is not the single-person threshold',
        });
        continue;
      }

      const figure = FIGURES.find((f) => f.id === match!.figureId);
      if (!figure) continue;
      if (figure.unit !== hit.unit) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason: `Unit mismatch for ${figure.label}`,
        });
        continue;
      }

      // JISA / LISA limits are not the adult ISA subscription limit
      if (
        match.figureId === 'isa-annual-subscription' &&
        /\b[jl]isa\b/i.test(matchSentence) &&
        hit.value !== 20000
      ) {
        const nearJisa = /£[\d,]+\s*(?:in\s+)?(?:a\s+)?[jl]isa|[jl]isa\s*£?[\d,]+/i.test(
          matchSentence,
        );
        if (nearJisa || hit.value === 9000 || hit.value === 4000) {
          rejected.push({
            pageUrl,
            numberFound: hit.value,
            sentence: displaySentence,
            reason: 'Ambiguous: JISA/LISA limit is not the adult ISA subscription limit',
          });
          continue;
        }
      }

      // Small gifts / annual gift exemptions are not the pension annual allowance
      if (
        match.figureId === 'pension-annual-allowance' &&
        /(small\s+gifts?|gifts?\s+(?:allowance|exemption)|annual\s+exemption\s+for\s+gifts?|give\s+away|give\s+as\s+many\s+gifts?)/i.test(
          matchSentence,
        )
      ) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason:
            'Ambiguous: sentence refers to gifting exemptions, not the pension annual allowance',
        });
        continue;
      }

      // Bare "annual allowance" is shared by several tax concepts — only keep it
      // when the same block is about pensions, or the value is a known AA.
      if (
        match.figureId === 'pension-annual-allowance' &&
        match.keyword.toLowerCase() === 'annual allowance' &&
        !isKnownFigureValue(match.figureId, hit.value)
      ) {
        if (!/\bpension/i.test(matchSentence)) {
          rejected.push({
            pageUrl,
            numberFound: hit.value,
            sentence: displaySentence,
            reason:
              'Ambiguous: "annual allowance" without pension context and value is not a known pension annual allowance',
          });
          continue;
        }
      }

      // Holding / portfolio amounts near the word ISA are not the annual subscription limit
      if (
        match.figureId === 'isa-annual-subscription' &&
        !isKnownFigureValue(match.figureId, hit.value) &&
        !/\b(allowance|limit|subscription|invest up to|pay(?:\s+in)?|contribut)/i.test(
          matchSentence,
        )
      ) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason:
            'Ambiguous: ISA mention without limit/allowance language is not the annual subscription limit',
        });
        continue;
      }

      // Bare "cgt" / "capital gains tax" often names the tax, not the annual exempt amount
      if (
        match.figureId === 'cgt-annual-exempt-amount' &&
        /^(cgt|capital gains tax)$/i.test(match.keyword) &&
        !isKnownFigureValue(match.figureId, hit.value) &&
        !/\b(allowance|exempt|aea|annual\s+exempt)\b/i.test(matchSentence)
      ) {
        rejected.push({
          pageUrl,
          numberFound: hit.value,
          sentence: displaySentence,
          reason:
            'Ambiguous: CGT mention without allowance/exempt language is not the annual exempt amount',
        });
        continue;
      }

      detections.push({
        value: hit.value,
        raw: hit.raw,
        unit: hit.unit,
        sentence: displaySentence,
        associationSentence: matchSentence,
        headingContext: block.headingContext,
        matchLocation: match.location,
        matchedKeyword: match.keyword,
        figureId: match.figureId,
        surroundingHtml: block.surroundingHtml,
        inTable: block.inTable,
      });
    }
  }

  return { detections, rejected };
}

export function logRejected(rejected: RejectedDetection[]): void {
  // "No matching keyword" is the common discard path and floods the console.
  // Log only decisions that look like guarded / ambiguous exclusions.
  for (const r of rejected) {
    if (
      r.reason.startsWith('No matching figure keyword') ||
      r.reason.startsWith('Table column header has no matching')
    ) {
      continue;
    }
    console.info(
      `[figure-check:reject] ${r.pageUrl} | ${r.numberFound} | ${r.reason} | ${r.sentence.slice(0, 120)}`,
    );
  }
}
