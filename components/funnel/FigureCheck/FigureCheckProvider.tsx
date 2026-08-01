'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { track } from '@/lib/analytics';
import type { CheckErrorCode, CheckResult } from '@/lib/check-types';

type Status = 'idle' | 'running' | 'done' | 'error';

interface Ctx {
  status: Status;
  domain: string;
  result: CheckResult | null;
  error: string | null;
  errorCode: CheckErrorCode | null;
  run: (domain: string, variant: 'hero' | 'inline') => Promise<void>;
  sendReport: (
    email: string,
    budgetRecheck: boolean,
  ) => Promise<{ ok: boolean; message?: string }>;
}

const FigureCheckContext = createContext<Ctx | null>(null);

export function FigureCheckProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('idle');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<CheckErrorCode | null>(null);

  const run = useCallback(async (rawDomain: string, variant: 'hero' | 'inline') => {
    setStatus('running');
    setError(null);
    setErrorCode(null);
    setDomain(rawDomain);
    track('check_started', { variant });

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: rawDomain }),
      });
      const data = await res.json();
      if (!res.ok) {
        const code = (data.error ?? 'server_error') as CheckErrorCode;
        setErrorCode(code);
        setStatus('error');
        track('check_failed', { code });
        return;
      }
      setResult(data as CheckResult);
      setDomain(data.domain);
      setStatus('done');
      track('check_completed', {
        behind_count: data.behindCount,
        figures_found: data.figuresFound,
      });

      const preferReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = document.getElementById('check-result');
      if (el) {
        el.scrollIntoView({ behavior: preferReduced ? 'auto' : 'smooth' });
        const heading = el.querySelector('h2');
        heading?.focus();
      }
    } catch {
      setErrorCode('server_error');
      setStatus('error');
      track('check_failed', { code: 'server_error' });
    }
  }, []);

  const sendReport = useCallback(
    async (email: string, budgetRecheck: boolean) => {
      if (!result) return { ok: false, message: 'No check result' };
      try {
        const res = await fetch('/api/check/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkId: result.checkId,
            email,
            budgetRecheck,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return {
            ok: false,
            message:
              data.error === 'email_used'
                ? 'That email has already been used for a record. Book a call and I will run a fresh check with you.'
                : data.error === 'send_failed' || res.status === 502
                  ? 'The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.'
                  : data.error === 'rate_limited'
                    ? "That's several checks from this connection. Try again in an hour, or book a call and I will run the check with you."
                    : 'The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.',
          };
        }
        track('report_requested', { behind_count: result.behindCount });
        return { ok: true };
      } catch {
        return {
          ok: false,
          message:
            'The record did not send. Try again, or email hello@wrigital.com and I will send the record by hand.',
        };
      }
    },
    [result],
  );

  const value = useMemo(
    () => ({
      status,
      domain,
      result,
      error,
      errorCode,
      run,
      sendReport,
    }),
    [status, domain, result, error, errorCode, run, sendReport],
  );

  return (
    <FigureCheckContext.Provider value={value}>
      {children}
    </FigureCheckContext.Provider>
  );
}

export function useFigureCheck() {
  const ctx = useContext(FigureCheckContext);
  if (!ctx) {
    throw new Error('useFigureCheck must be used within FigureCheckProvider');
  }
  return ctx;
}
