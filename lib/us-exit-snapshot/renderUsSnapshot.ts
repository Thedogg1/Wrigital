import { formatUsd } from '@/lib/validation/validateUsSnapshotInputs';
import type { MatchedNarrativeRule, UsSnapshotContext } from './types';

const REPORT_STYLES = `
  body { font-family: system-ui, -apple-system, sans-serif; color: #212529; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
  h1 { color: #0a2463; font-size: 1.75rem; border-bottom: 2px solid #0a2463; padding-bottom: 0.5rem; }
  h2 { color: #0a2463; font-size: 1.25rem; margin-top: 2rem; }
  .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0; }
  .metric { background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; border: 1px solid #dee2e6; }
  .metric-label { font-size: 0.875rem; color: #343a40; }
  .metric-value { font-size: 1.25rem; font-weight: 600; color: #0a2463; }
  .narrative { background: #f8f9fa; padding: 1rem; border-left: 4px solid #00b4d8; margin: 0.75rem 0; }
  .disclaimer { font-size: 0.875rem; color: #343a40; border-top: 1px solid #dee2e6; padding-top: 1rem; margin-top: 2rem; }
  .check-pass { color: #06d6a0; }
  .check-fail { color: #e63946; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #dee2e6; }
`;

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${title}</title><style>${REPORT_STYLES}</style></head><body>${body}</body></html>`;
}

export function buildUsSnapshotReport(
  context: UsSnapshotContext,
  matchedRules: MatchedNarrativeRule[],
): { fullHtml: string } {
  const c = context.calculated;
  const qsbsChecks = c.qsbsCheckResults
    .map(
      (ch) =>
        `<tr><td>${ch.checkName}</td><td class="${ch.passed ? 'check-pass' : 'check-fail'}">${ch.passed ? 'Pass' : 'Fail'}</td><td>${ch.detail}</td></tr>`,
    )
    .join('');

  const observations = matchedRules
    .filter((r) => r.rule.category !== 'planning')
    .map((r) => `<div class="narrative">${r.renderedText}</div>`)
    .join('');

  const body = `
    <h1>US Exit Tax Snapshot</h1>
    <p><strong>Strategy:</strong> ${c.strategyLabel} (${c.taxYear})</p>
    <h2>Executive Summary</h2>
    <p>Estimated net proceeds after tax: <strong>${formatUsd(c.netProceeds)}</strong>. Total estimated tax: ${formatUsd(c.totalTaxLiability)}. Effective rate: ${c.effectiveTaxRate}%.</p>
    <div class="metric-grid">
      <div class="metric"><div class="metric-label">Exit value (your share)</div><div class="metric-value">${formatUsd(c.equityValue)}</div></div>
      <div class="metric"><div class="metric-label">Capital gain</div><div class="metric-value">${formatUsd(c.grossCapitalGain)}</div></div>
      <div class="metric"><div class="metric-label">QSBS excluded gain</div><div class="metric-value">${formatUsd(c.qsbsExcludedGain)}</div></div>
      <div class="metric"><div class="metric-label">Concentration</div><div class="metric-value">${c.businessValueShareOfNetWorth}%</div></div>
    </div>
    <h2>Tax Breakdown</h2>
    <table>
      <tr><th>Component</th><th>Amount</th></tr>
      <tr><td>Federal tax</td><td>${formatUsd(c.federalTax)}</td></tr>
      <tr><td>State tax (modelled)</td><td>${formatUsd(c.stateTax)}</td></tr>
      <tr><td>Total tax</td><td>${formatUsd(c.totalTaxLiability)}</td></tr>
      <tr><td>Net proceeds</td><td>${formatUsd(c.netProceeds)}</td></tr>
    </table>
    <h2>QSBS Eligibility</h2>
    <p>Overall: <strong>${c.qsbsEligible ? 'Meets stated tests' : 'Does not meet stated tests'}</strong></p>
    <p>Exclusion tier: ${c.qsbsExclusionPercent}% · Per-issuer cap: ${formatUsd(c.qsbsPerIssuerCap)}</p>
    <table><thead><tr><th>Check</th><th>Result</th><th>Detail</th></tr></thead><tbody>${qsbsChecks}</tbody></table>
    ${observations ? `<h2>Observations</h2>${observations}` : ''}
    <div class="disclaimer">
      <p>FinPrint is a technology product from Wrigital. It does not provide financial, tax, or investment advice. All outputs are designed for use by SEC- and FINRA-regulated financial advisors and are subject to advisor review and approval before use.</p>
      <p>Calculation date: ${c.calculationDate}. State tax modelled at default rate; actual state treatment may vary.</p>
    </div>`;

  return { fullHtml: wrapHtml('US Exit Tax Snapshot — Full Report', body) };
}
