import fs from 'fs';
import path from 'path';
import type { CompleteUnverifiedAnswersInput } from '@/lib/unverifiedAnswers';

export interface UnverifiedLeadRecord {
  email: string;
  firmName?: string;
  complianceOfficerEmail?: string;
  marketingConsent: boolean;
  consentWordingVersion: string;
  consentCapturedAt: string;
  answers: CompleteUnverifiedAnswersInput;
  resultStatus: 'counted' | 'not_counted';
  untraceable: number | null;
  reportToken: string;
  source: string;
  submittedAt: string;
  clientIp?: string;
}

const DEFAULT_LEADS_FILE = path.join(
  process.cwd(),
  'data',
  'unverified-leads.jsonl',
);

export function getUnverifiedLeadsFilePath(): string {
  return process.env.UNVERIFIED_LEADS_FILE?.trim() || DEFAULT_LEADS_FILE;
}

export async function saveUnverifiedLead(
  record: UnverifiedLeadRecord,
): Promise<void> {
  const filePath = getUnverifiedLeadsFilePath();
  const dir = path.dirname(filePath);

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.appendFile(
    filePath,
    `${JSON.stringify(record)}\n`,
    'utf-8',
  );
}
