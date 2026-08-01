import fs from 'fs';
import path from 'path';

export type FigureCheckLeadRecord = {
  email: string;
  firmName?: string;
  domain: string;
  budgetRecheck: boolean;
  scannedAt: string;
  savedAt: string;
};

const DEFAULT_LEADS_FILE = path.join(
  process.cwd(),
  'data',
  'figure-check-leads.jsonl',
);

export function getFigureCheckLeadsFilePath(): string {
  return process.env.FIGURE_CHECK_LEADS_FILE?.trim() || DEFAULT_LEADS_FILE;
}

export async function saveFigureCheckLead(
  record: Omit<FigureCheckLeadRecord, 'savedAt'> & { savedAt?: string },
): Promise<void> {
  const filePath = getFigureCheckLeadsFilePath();
  const dir = path.dirname(filePath);
  const line: FigureCheckLeadRecord = {
    email: record.email,
    firmName: record.firmName,
    domain: record.domain,
    budgetRecheck: record.budgetRecheck,
    scannedAt: record.scannedAt,
    savedAt: record.savedAt ?? new Date().toISOString(),
  };

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.appendFile(filePath, `${JSON.stringify(line)}\n`, 'utf-8');
}
