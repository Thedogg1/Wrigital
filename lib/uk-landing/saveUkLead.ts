import fs from 'fs';
import path from 'path';

export interface UkLeadRecord {
  name: string;
  email: string;
  firmName: string;
  source: string;
  submittedAt: string;
}

const DEFAULT_LEADS_FILE = path.join(process.cwd(), 'data', 'uk-leads.jsonl');

export function getUkLeadsFilePath(): string {
  return process.env.UK_LEADS_FILE?.trim() || DEFAULT_LEADS_FILE;
}

export async function saveUkLead(record: UkLeadRecord): Promise<void> {
  const filePath = getUkLeadsFilePath();
  const dir = path.dirname(filePath);

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf-8');
}
