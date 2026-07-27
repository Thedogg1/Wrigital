import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { CompleteUnverifiedAnswersInput } from '@/lib/unverifiedAnswers';

/** Report links expire after 30 days. */
export const REPORT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const REPORT_TOKEN_VERSION = 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface StoredUnverifiedReport {
  token: string;
  createdAt: string;
  expiresAt: string;
  email: string;
  complianceOfficerEmail?: string;
  answers: CompleteUnverifiedAnswersInput;
  marketingConsent: boolean;
  consentWordingVersion: string;
  consentCapturedAt: string;
}

export interface BuildReportTokenInput {
  email: string;
  complianceOfficerEmail?: string;
  answers: CompleteUnverifiedAnswersInput;
  marketingConsent: boolean;
  consentWordingVersion: string;
  consentCapturedAt: string;
}

interface SignedReportPayload {
  v: typeof REPORT_TOKEN_VERSION;
  email: string;
  answers: CompleteUnverifiedAnswersInput;
  createdAt: string;
  expiresAt: string;
  day: number;
}

const DEFAULT_REPORTS_DIR = path.join(
  process.cwd(),
  'data',
  'unverified-reports',
);

function getReportsDir(): string {
  return process.env.UNVERIFIED_REPORTS_DIR?.trim() || DEFAULT_REPORTS_DIR;
}

function legacyReportPath(token: string): string {
  return path.join(getReportsDir(), `${token}.json`);
}

export function getReportSigningSecret(): string {
  const secret = process.env.REPORT_SIGNING_SECRET?.trim();
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'dev-only-report-signing-secret';
  }

  throw new Error('REPORT_SIGNING_SECRET is not configured');
}

function signPayload(payload: string): string {
  return crypto
    .createHmac('sha256', getReportSigningSecret())
    .update(payload)
    .digest('base64url');
}

function utcDayBucket(at = Date.now()): number {
  return Math.floor(at / MS_PER_DAY);
}

function dayStartIso(day: number): string {
  return new Date(day * MS_PER_DAY).toISOString();
}

function encodeSignedReport(payload: SignedReportPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${signPayload(encoded)}`;
}

function decodeSignedReport(token: string): SignedReportPayload | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) {
    return null;
  }

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!encoded || !signature) {
    return null;
  }

  if (signPayload(encoded) !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as SignedReportPayload;

    if (parsed.v !== REPORT_TOKEN_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/** Signed, self-contained token for Vercel and other serverless hosts. */
export function buildReportToken(input: BuildReportTokenInput): string {
  const day = utcDayBucket();
  const createdAt = dayStartIso(day);
  const expiresAt = new Date(day * MS_PER_DAY + REPORT_TTL_MS).toISOString();

  const payload: SignedReportPayload = {
    v: REPORT_TOKEN_VERSION,
    email: input.email.trim().toLowerCase(),
    answers: input.answers,
    createdAt,
    expiresAt,
    day,
  };

  return encodeSignedReport(payload);
}

export async function loadReport(
  token: string,
): Promise<StoredUnverifiedReport | null> {
  const signed = decodeSignedReport(token);
  if (signed) {
    return {
      token,
      email: signed.email,
      answers: signed.answers,
      marketingConsent: false,
      consentWordingVersion: '1.0',
      consentCapturedAt: signed.createdAt,
      createdAt: signed.createdAt,
      expiresAt: signed.expiresAt,
    };
  }

  return loadLegacyFilesystemReport(token);
}

async function loadLegacyFilesystemReport(
  token: string,
): Promise<StoredUnverifiedReport | null> {
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  try {
    const raw = await fs.promises.readFile(legacyReportPath(token), 'utf-8');
    return JSON.parse(raw) as StoredUnverifiedReport;
  } catch {
    return null;
  }
}

export function isReportExpired(report: StoredUnverifiedReport): boolean {
  return Date.now() > new Date(report.expiresAt).getTime();
}

export function buildIdempotencyKey(
  email: string,
  answers: CompleteUnverifiedAnswersInput,
): string {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    answers,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}
