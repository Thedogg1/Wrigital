import fs from 'fs/promises';
import path from 'path';

export interface UsaLeadRecord {
  name: string;
  email: string;
  firmName: string;
  source: string;
  submittedAt: string;
}

export function getUsLeadsFilePath(): string {
  return process.env.US_LEADS_FILE?.trim() || path.join(process.cwd(), 'data', 'us-leads.jsonl');
}

export async function saveUsLead(record: UsaLeadRecord): Promise<void> {
  const filePath = getUsLeadsFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf-8');
}
