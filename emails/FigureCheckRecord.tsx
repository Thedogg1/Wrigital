import type { CheckResult, Finding } from '@/lib/check-types';
import { SITE, siteUrl } from '@/lib/site';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function findingBlockHtml(f: Finding): string {
  return `
  <div style="border-bottom:1px solid #D9DEE3;padding:12px 0;font-size:14px;">
    <p style="margin:0 0 6px 0;font-weight:600;">${escapeHtml(f.label)}</p>
    <p style="margin:0 0 4px 0;font-family:ui-monospace,monospace;">
      Found: ${escapeHtml(f.quotedValue)} · Published: ${escapeHtml(f.publishedValue)}
    </p>
    <p style="margin:0 0 4px 0;">
      Page: <a href="${escapeHtml(f.pageUrl)}">${escapeHtml(f.pageTitle || f.pageUrl)}</a>
    </p>
    <p style="margin:0;">
      Source: <a href="${escapeHtml(f.sourceUrl)}">${escapeHtml(f.sourceHost)}</a>
    </p>
  </div>`;
}

export function buildFigureCheckRecordHtml(
  result: CheckResult,
  budgetRecheck = false,
): string {
  const date = new Date(result.finishedAt).toLocaleDateString('en-GB');
  const hasFindings = result.findings.length > 0;
  const confirmedCount = result.findings.filter(
    (f) => f.verdict === 'current',
  ).length;
  const toChange = result.findings.filter(
    (f) => f.verdict === 'behind' || f.verdict === 'unconfirmed',
  );
  const confirmed = result.findings.filter((f) => f.verdict === 'current');

  const summary = hasFindings
    ? `${result.pagesScanned} pages read. ${result.figuresFound} figures found. ${confirmedCount} confirmed against the current published value. ${toChange.length} not. Unconfirmed matches on blog posts are omitted - those are usually scenario examples, not published claims.`
    : `${result.pagesScanned} pages read. ${result.figuresFound} figures found. Every figure matches the current published value.`;

  const changeSection =
    hasFindings && toChange.length > 0
      ? `<h2 style="margin-top:32px;font-size:18px;">What to change</h2>${toChange.map(findingBlockHtml).join('')}`
      : '';

  const confirmedBody =
    confirmed.length > 0
      ? confirmed.map(findingBlockHtml).join('')
      : result.pagesConfirmedClean
          .map(
            (p) => `
  <div style="border-bottom:1px solid #D9DEE3;padding:12px 0;font-size:14px;">
    <a href="${escapeHtml(p.url)}">${escapeHtml(p.title || p.url)}</a>
  </div>`,
          )
          .join('');

  const budgetBlock = budgetRecheck
    ? `<p style="margin-top:24px;">You asked for a re-check after the autumn Budget. The check will run again then and the results will arrive by email. Reply to stop at any time.</p>`
    : '';

  const layersUrl = `${siteUrl}/RAG_Offer/how-i-stop-hallucinations`;

  return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#0a2342;">
  <p style="font-size:22px;font-weight:600;">Wrigital</p>
  <p style="margin-top:24px;">This is the full record of the check on ${escapeHtml(result.domain)}, run on ${escapeHtml(date)}.</p>
  <p style="margin-top:16px;">${escapeHtml(summary)}</p>
  ${changeSection}
  <h2 style="margin-top:32px;font-size:18px;">What was confirmed correct</h2>
  ${confirmedBody}
  ${budgetBlock}
  <p style="margin-top:24px;">Keep this. The record is dated, so a year from now you can see what was checked and when.</p>
  <p style="margin-top:24px;color:#475569;font-size:14px;">This checks whether published figures are current. The check doesn't assess compliance, suitability or financial promotion rules, and doesn't replace anyone's review.</p>
  <h2 style="margin-top:32px;font-size:18px;">Where this check came from</h2>
  <p style="margin-top:16px;font-size:15px;line-height:1.6;">The tool you just used is not a marketing gadget. The same engineering is layer four of five inside the assistant I build for advice firms, pointed at your public pages rather than at a knowledge library.</p>
  <p style="margin-top:16px;font-size:15px;line-height:1.6;">On a recent build, 250 candidate sources were checked and 21 were dropped before reaching the library. Seven pages could not be retrieved at all, including a gov.uk Corporation Tax page returning a 404. The other 14 existed but did not support the claim closely enough. Every one of the 21 would have appeared in a generic tool's answer, with a link, and nobody would have known.</p>
  <p style="margin-top:16px;font-size:15px;line-height:1.6;">The Budget is the same problem on a timer. Figures move, published pages stay where they are, and a system with no checking carries the old number forward without a flicker.</p>
  <p style="margin-top:16px;font-size:15px;line-height:1.6;">The page below sets out all five layers and why every one of them runs before an adviser asks a single question.</p>
  <p style="margin-top:24px;font-size:15px;">
    <a href="${escapeHtml(layersUrl)}" style="color:#0a2342;font-weight:600;">How I stop hallucinations</a>
  </p>
  <p style="margin-top:12px;font-size:15px;">
    <a href="${escapeHtml(SITE.calendly)}" style="color:#0a2342;font-weight:600;">Book a call</a>
  </p>
  <p style="margin-top:32px;font-size:12px;color:#475569;">
    ${escapeHtml(SITE.name)}, company number ${escapeHtml(SITE.companyNumber)}. ${escapeHtml(SITE.registeredAddress)}.
    <a href="${escapeHtml(`${siteUrl}/RAG_Offer/privacy`)}">Privacy</a>
  </p>
</body>
</html>`;
}

/** Kept for typed imports; sending uses buildFigureCheckRecordHtml. */
export function FigureCheckRecord(props: {
  result: CheckResult;
  budgetRecheck?: boolean;
}) {
  return null;
}

export default FigureCheckRecord;
