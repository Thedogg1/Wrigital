import { formatCurrency } from '@/lib/validation/validation-library-core';
import type { MatchedNarrativeRule, SnapshotContext } from './types';
import { DISCLAIMER_MODULES } from './narrativeRules';
import { collectDisclaimerTags } from './evaluateNarrativeRules';
import { BADR_RATE_LABEL } from './taxParameters202526';
import {
  formatAssumptionRows,
  formatCurrencyField,
  formatPercentField,
} from './formatAssumptionDisplay';

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
  .teaser { font-style: italic; color: #343a40; }
`;

function renderMetrics(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <div class="metric-grid">
      <div class="metric"><div class="metric-label">Exit value (your share)</div><div class="metric-value">${formatCurrency(c.equityValue)}</div></div>
      <div class="metric"><div class="metric-label">Capital gain</div><div class="metric-value">${formatCurrency(c.grossCapitalGain)}</div></div>
      <div class="metric"><div class="metric-label">Total tax liability</div><div class="metric-value">${formatCurrency(c.totalTaxLiability)}</div></div>
      <div class="metric"><div class="metric-label">Net proceeds</div><div class="metric-value">${formatCurrency(c.netProceeds)}</div></div>
      <div class="metric"><div class="metric-label">Effective tax rate</div><div class="metric-value">${c.effectiveTaxRate}%</div></div>
      <div class="metric"><div class="metric-label">Concentration</div><div class="metric-value">${c.businessValueShareOfNetWorth}%</div></div>
    </div>`;
}

function renderExecutiveSummary(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <h2>Executive Summary</h2>
    <p>Based on a business value of ${formatCurrency(Number(context.inputs.businessValue.replace(/[^0-9.-]/g, '')) || 0)} with ${c.ownershipPercent}% ownership, your estimated exit proceeds are ${formatCurrency(c.equityValue)}. After estimated tax of ${formatCurrency(c.totalTaxLiability)}, net proceeds are approximately <strong>${formatCurrency(c.netProceeds)}</strong>.</p>
    <p>Tax year: ${c.taxYear}. Calculation date: ${c.calculationDate}.</p>`;
}

function renderOwnershipSection(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <h2>Ownership Position</h2>
    <p>Ownership stake: ${c.ownershipPercent}%</p>
    <p>Share acquisition date: ${context.inputs.shareAcquisitionDate}</p>
    <p>Holding period: ${c.holdingPeriodYears} years</p>`;
}

function renderExitValueSection(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <h2>Exit Value</h2>
    <p>Your personal share of proceeds: <strong>${formatCurrency(c.equityValue)}</strong></p>
    <p>Cost basis: ${formatCurrency(Number(context.inputs.costBasis.replace(/[^0-9.-]/g, '')) || 0)}</p>`;
}

function renderConcentrationSection(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <h2>Concentration Risk</h2>
    <p>Approximately <strong>${c.businessValueShareOfNetWorth}%</strong> of net worth is linked to the business stake based on the assumptions entered.</p>`;
}

function renderBadrSection(context: SnapshotContext): string {
  const c = context.calculated;
  const checks = c.badrCheckResults
    .map(
      (ch) =>
        `<tr><td>${ch.checkName}</td><td class="${ch.passed ? 'check-pass' : 'check-fail'}">${ch.passed ? 'Pass' : 'Fail'}</td><td>${ch.detail}</td></tr>`,
    )
    .join('');
  return `
    <h2>BADR Eligibility</h2>
    <p>Overall eligibility: <strong>${c.badrEligible ? 'Meets stated tests' : 'Does not meet stated tests'}</strong> (subject to assumptions entered).</p>
    <p>BADR rate applied: ${BADR_RATE_LABEL} (${c.taxYear})</p>
    <p>Remaining lifetime headroom: ${formatCurrency(c.badrHeadroomRemaining)}</p>
    <table>
      <thead><tr><th>Check</th><th>Result</th><th>Detail</th></tr></thead>
      <tbody>${checks}</tbody>
    </table>`;
}

function renderCgtSection(context: SnapshotContext): string {
  const c = context.calculated;
  if (c.grossCapitalGain <= 0) {
    return `<h2>CGT Summary</h2><p>No capital gain — no CGT liability arises on the current assumptions.</p>`;
  }
  return `
    <h2>CGT Summary</h2>
    <table>
      <tr><td>Gross capital gain</td><td>${formatCurrency(c.grossCapitalGain)}</td></tr>
      <tr><td>Allowable losses applied</td><td>${formatCurrency(c.allowableLossesApplied)}</td></tr>
      <tr><td>Gains after losses</td><td>${formatCurrency(c.gainsAfterLosses)}</td></tr>
      <tr><td>BADR qualifying gain</td><td>${formatCurrency(c.badrQualifyingGain)}</td></tr>
      <tr><td>BADR tax (${BADR_RATE_LABEL})</td><td>${formatCurrency(c.badrTax)}</td></tr>
      <tr><td>Non-BADR gain</td><td>${formatCurrency(c.nonBadrGain)}</td></tr>
      <tr><td>Annual exempt amount applied</td><td>${formatCurrency(c.aeaApplied)}</td></tr>
      <tr><td>Gain at basic rate (18%)</td><td>${formatCurrency(c.basicRatePortion)}</td></tr>
      <tr><td>Gain at higher rate (24%)</td><td>${formatCurrency(c.higherRatePortion)}</td></tr>
      <tr><td>Standard CGT tax</td><td>${formatCurrency(c.nonBadrGainTax)}</td></tr>
      <tr><td><strong>Total tax liability</strong></td><td><strong>${formatCurrency(c.totalTaxLiability)}</strong></td></tr>
    </table>`;
}

function renderNetProceedsSection(context: SnapshotContext): string {
  const c = context.calculated;
  return `
    <h2>Net Proceeds</h2>
    <p>Estimated net proceeds: <strong>${formatCurrency(c.netProceeds)}</strong></p>
    <p>Based on the assumptions shown above and current law on ${c.calculationDate}.</p>
    <p><em>This is an illustration only and may change if your facts differ. It is not tax, legal, or investment advice. Please speak to a qualified adviser before acting.</em></p>`;
}

function renderAssumptionsSection(context: SnapshotContext): string {
  const rows = formatAssumptionRows(context.inputs);
  const tableRows = rows
    .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
    .join('');
  return `<h2>Assumptions</h2><table><tbody>${tableRows}</tbody></table>`;
}

function renderNarrativeSection(matchedRules: MatchedNarrativeRule[], limit?: number): string {
  const rules = limit ? matchedRules.slice(0, limit) : matchedRules;
  const items = rules
    .filter((r) => r.rule.category !== 'planning')
    .map((r) => `<div class="narrative">${r.renderedText}</div>`)
    .join('');
  return items ? `<h2>Observations</h2>${items}` : '';
}

function renderPlanningSection(matchedRules: MatchedNarrativeRule[]): string {
  const planning = matchedRules.filter((r) => r.rule.category === 'planning');
  if (planning.length === 0) return '';
  const items = planning.map((r) => `<li>${r.renderedText}</li>`).join('');
  return `<h2>Planning Topics</h2><ul>${items}</ul>`;
}

function renderDisclaimers(matchedRules: MatchedNarrativeRule[]): string {
  const tags = collectDisclaimerTags(matchedRules);
  tags.push('not-advice');
  const unique = Array.from(new Set(tags));
  const items = unique.map((tag) => `<p>${DISCLAIMER_MODULES[tag] ?? ''}</p>`).join('');
  return `
    <h2>Limitations &amp; Disclaimers</h2>
    <p>${DISCLAIMER_MODULES.limitations}</p>
    ${items}
    <p>Financial inputs entered in this tool remain in your browser only and are not stored on our servers.</p>`;
}

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>${REPORT_STYLES}</style>
</head>
<body>
  <h1>${title}</h1>
  ${body}
  <div class="disclaimer">
    <p>Generated by Wrigital Exit Snapshot Estimator. &copy; ${new Date().getFullYear()} Wrigital Ltd.</p>
  </div>
</body>
</html>`;
}

export function renderFull(context: SnapshotContext, matchedRules: MatchedNarrativeRule[]): string {
  const body = [
    renderExecutiveSummary(context),
    renderMetrics(context),
    renderNarrativeSection(matchedRules),
    renderOwnershipSection(context),
    renderExitValueSection(context),
    renderConcentrationSection(context),
    renderBadrSection(context),
    renderCgtSection(context),
    renderNetProceedsSection(context),
    renderAssumptionsSection(context),
    renderPlanningSection(matchedRules),
    renderDisclaimers(matchedRules),
  ].join('\n');
  return wrapHtml('UK Exit Snapshot — Full Report', body);
}

export function renderPreview(context: SnapshotContext, matchedRules: MatchedNarrativeRule[]): string {
  const narrativeTeaser = renderNarrativeSection(matchedRules, 2);
  const body = `
    ${renderExecutiveSummary(context)}
    ${renderMetrics(context)}
    ${narrativeTeaser}
    <p class="teaser">Download the full report for complete CGT breakdown, BADR checks, planning topics, and disclaimers.</p>
    <h2>Key Assumptions (excerpt)</h2>
    <p>Business value: ${formatCurrencyField(context.inputs.businessValue)} | Ownership: ${formatPercentField(context.inputs.ownershipPercentage)} | Tax year: ${context.calculated.taxYear}</p>`;
  return wrapHtml('UK Exit Snapshot — Preview', body);
}

export function buildSnapshotReport(
  context: SnapshotContext,
  matchedRules: MatchedNarrativeRule[],
): { fullHtml: string; previewHtml: string } {
  return {
    fullHtml: renderFull(context, matchedRules),
    previewHtml: renderPreview(context, matchedRules),
  };
}
