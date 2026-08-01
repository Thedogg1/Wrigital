import type { CheckResult } from '@/lib/check-types';
import { siteUrl } from '@/lib/site';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildInternalCheckAlertHtml(
  result: CheckResult,
  email: string,
): string {
  const behind = result.findings
    .filter((f) => f.verdict === 'behind')
    .slice(0, 5);

  const behindList =
    behind.length > 0
      ? `<ul>${behind
          .map(
            (f) =>
              `<li>${escapeHtml(f.label)}: ${escapeHtml(f.quotedValue)} (published ${escapeHtml(f.publishedValue)})</li>`,
          )
          .join('')}</ul>`
      : '<p>None</p>';

  return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;font-size:14px;">
  <p>Email: ${escapeHtml(email)}</p>
  <p>Domain: ${escapeHtml(result.domain)}</p>
  <p>Figures found: ${result.figuresFound}</p>
  <p>Behind: ${result.behindCount}</p>
  <p>Top behind findings:</p>
  ${behindList}
  <p>Check id: ${escapeHtml(result.checkId)} (${escapeHtml(siteUrl)})</p>
</body>
</html>`;
}

export function InternalCheckAlert(_props: {
  result: CheckResult;
  email: string;
}) {
  return null;
}

export default InternalCheckAlert;
