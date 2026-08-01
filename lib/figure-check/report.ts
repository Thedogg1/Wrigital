import { siteUrl } from '@/lib/site';
import {
  actionableFindings,
  boldNumberInSentence,
  escapeHtml,
  formatGbp,
  historicFindings,
} from './compare';
import type { Finding, ScanResult } from './types';

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function fixFindingRow(f: Finding): string {
  const sentenceHtml = boldNumberInSentence(f.sentence, f.numberFound);
  const badge = f.classification === 'STALE' ? 'Stale' : 'Check';

  return `
  <tr>
    <td style="padding:12px 10px;border-bottom:1px solid #e4dcce;vertical-align:top;font-size:14px;line-height:1.45;">
      <div style="margin-bottom:6px;">
        <span style="display:inline-block;padding:2px 8px;border:1px solid #0a2342;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(badge)}</span>
        ${f.staleTaxYear ? `<span style="margin-left:8px;color:#475569;font-size:12px;">Matches ${escapeHtml(f.staleTaxYear)}</span>` : ''}
      </div>
      <div style="margin-bottom:6px;">
        <a href="${escapeHtml(f.pageUrl)}" style="color:#0a2342;word-break:break-all;">${escapeHtml(f.pageUrl)}</a>
      </div>
      <div style="margin-bottom:8px;">${sentenceHtml}</div>
      <div style="color:#475569;font-size:13px;">
        <strong>${escapeHtml(f.figureLabel)}</strong><br/>
        Found: ${escapeHtml(formatGbp(f.numberFound))} · Current: ${escapeHtml(formatGbp(f.currentValue))}<br/>
        Source: <a href="${escapeHtml(f.sourceUrl)}" style="color:#0a2342;">${escapeHtml(f.sourceLabel)}</a>
      </div>
    </td>
  </tr>`;
}

function historicRow(f: Finding): string {
  return `
  <tr>
    <td style="padding:8px 10px;border-bottom:1px solid #e4dcce;font-size:12px;line-height:1.4;color:#475569;">
      <a href="${escapeHtml(f.pageUrl)}" style="color:#0a2342;">${escapeHtml(f.pageTitle || f.pageUrl)}</a>
      — ${escapeHtml(f.figureLabel)}: ${escapeHtml(formatGbp(f.numberFound))}
      (current ${escapeHtml(formatGbp(f.currentValue))})
      · <a href="${escapeHtml(f.sourceUrl)}" style="color:#0a2342;">source</a>
    </td>
  </tr>`;
}

function pageRecordBlock(
  page: ScanResult['pagesRead'][number],
  findings: Finding[],
): string {
  const pageFindings = findings.filter((f) => f.pageUrl === page.url);
  const figureRows =
    pageFindings.length === 0
      ? `<tr><td style="padding:4px 0;font-size:12px;color:#475569;">No tracked figures found on this page.</td></tr>`
      : pageFindings
          .map(
            (f) => `
        <tr>
          <td style="padding:3px 0;font-size:12px;line-height:1.35;color:#475569;border-bottom:1px solid #f0ebe3;">
            <strong style="color:#1a1a1a;">${escapeHtml(f.figureLabel)}</strong>
            · published ${escapeHtml(formatGbp(f.numberFound))}
            · current ${escapeHtml(formatGbp(f.currentValue))}
            · ${escapeHtml(f.classification)}${f.historicContext ? ' (historic context)' : ''}
            · <a href="${escapeHtml(f.sourceUrl)}" style="color:#0a2342;">source</a>
          </td>
        </tr>`,
          )
          .join('');

  return `
  <tr>
    <td style="padding:10px 10px 8px 10px;border-bottom:1px solid #e4dcce;vertical-align:top;">
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;margin-bottom:4px;">
        <a href="${escapeHtml(page.url)}" style="color:#0a2342;word-break:break-all;">${escapeHtml(page.title || page.url)}</a>
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${figureRows}
      </table>
    </td>
  </tr>`;
}

export function buildReportHtml(
  scan: ScanResult,
  opts?: { firmName?: string; budgetRecheck?: boolean },
): string {
  const fixList = actionableFindings(scan.findings);
  const historic = historicFindings(scan.findings);
  const verifiedAnswersUrl = `${siteUrl.replace(/\/$/, '')}/RAG_Offer/verified-answers`;

  const fixRows =
    fixList.length > 0
      ? fixList.map(fixFindingRow).join('')
      : `<tr><td style="padding:12px 10px;font-size:14px;color:#475569;">Every figure found on this scan was current.</td></tr>`;

  const recordRows = scan.pagesRead
    .map((page) => pageRecordBlock(page, scan.findings))
    .join('');

  const historicRows =
    historic.length > 0
      ? historic.map(historicRow).join('')
      : `<tr><td style="padding:10px;font-size:13px;color:#475569;">None noted.</td></tr>`;

  const recheckLine = opts?.budgetRecheck
    ? `<tr>
            <td style="padding:8px 24px 16px 24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.5;color:#1a1a1a;">
              <p style="margin:0;border:1px solid #e4dcce;padding:12px 14px;">
                You asked us to re-check this site after the autumn Budget. We will email the results to the address used for this record.
              </p>
            </td>
          </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Stale Figure Check — ${escapeHtml(scan.domain)}</title>
</head>
<body style="margin:0;padding:0;background:#faf7f0;color:#1a1a1a;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f0;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e4dcce;">
          <tr>
            <td style="padding:28px 24px 8px 24px;">
              <p style="margin:0 0 4px 0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#b08d57;">Wrigital · Stale Figure Check</p>
              <h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:normal;color:#0a2342;">
                ${escapeHtml(scan.domain)}
              </h1>
              <p style="margin:8px 0 0 0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;color:#475569;">
                Scan date: ${escapeHtml(formatDate(scan.scannedAt))}
                ${opts?.firmName ? ` · ${escapeHtml(opts.firmName)}` : ''}
                ${scan.truncated ? ' · Partial scan (time limit reached)' : ''}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 16px 24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#1a1a1a;">
              <p style="margin:0;">
                This is a record of what was checked on that date. It checks the factual currency of published UK tax, allowance, and threshold figures only.
                It is not a compliance, suitability, or financial-promotion review. Your firm remains responsible for its own content.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4dcce;">
                <tr>
                  <td width="33%" style="padding:14px;text-align:center;border-right:1px solid #e4dcce;">
                    <div style="font-size:28px;color:#0a2342;">${scan.pagesRead.length}</div>
                    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.06em;">Pages read</div>
                  </td>
                  <td width="33%" style="padding:14px;text-align:center;border-right:1px solid #e4dcce;">
                    <div style="font-size:28px;color:#0a2342;">${scan.counts.figuresFound}</div>
                    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.06em;">Figures checked</div>
                  </td>
                  <td width="33%" style="padding:14px;text-align:center;">
                    <div style="font-size:28px;color:#0a2342;">${scan.counts.stale + scan.counts.check}</div>
                    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:12px;color:#475569;text-transform:uppercase;letter-spacing:0.06em;">Not current</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px 24px;">
              <h2 style="margin:0;font-size:20px;color:#0a2342;font-weight:normal;">Fix list</h2>
              <p style="margin:6px 0 0 0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:13px;color:#475569;">
                Stale first, then check.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4dcce;">
                ${fixRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px 24px;">
              <h2 style="margin:0;font-size:20px;color:#0a2342;font-weight:normal;">The record</h2>
              <p style="margin:6px 0 0 0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:13px;color:#475569;">
                Every page read, in site order, with figures found on each page.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4dcce;">
                ${recordRows || `<tr><td style="padding:12px 10px;font-size:14px;color:#475569;">No pages were read.</td></tr>`}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 4px 24px;">
              <h2 style="margin:0;font-size:20px;color:#0a2342;font-weight:normal;">Likely-intentional historic mentions</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4dcce;">
                ${historicRows}
              </table>
            </td>
          </tr>
          ${recheckLine}
          <tr>
            <td style="padding:8px 24px 28px 24px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;color:#475569;">
              For verified answers your firm can cite, see
              <a href="${escapeHtml(verifiedAnswersUrl)}" style="color:#0a2342;">${escapeHtml(verifiedAnswersUrl)}</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildLeadNotifyHtml(input: {
  domain: string;
  email: string;
  firmName?: string;
  counts: ScanResult['counts'];
  pagesScanned: number;
  budgetRecheck: boolean;
}): string {
  return `<!DOCTYPE html>
<html lang="en-GB"><body style="font-family:system-ui,sans-serif;color:#1a1a1a;">
  <h1 style="font-size:18px;">Stale Figure Check lead</h1>
  <p><strong>Domain:</strong> ${escapeHtml(input.domain)}</p>
  <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
  <p><strong>Firm:</strong> ${escapeHtml(input.firmName || '—')}</p>
  <p><strong>Pages scanned:</strong> ${input.pagesScanned}</p>
  <p><strong>Budget re-check:</strong> ${input.budgetRecheck ? 'Yes' : 'No'}</p>
  <p><strong>Counts:</strong> stale ${input.counts.stale}, check ${input.counts.check}, current ${input.counts.current}, total ${input.counts.figuresFound}</p>
</body></html>`;
}
