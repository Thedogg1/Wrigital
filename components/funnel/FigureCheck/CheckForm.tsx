'use client';

import { FormEvent, useState } from 'react';
import { useFigureCheck } from './FigureCheckProvider';
import { CheckProgress } from './CheckProgress';
import { CHECK_ERROR_MESSAGES } from '@/lib/check-types';
import { CHECK_FORM } from '@/content/copy';

export function CheckForm({ variant }: { variant: 'hero' | 'inline' }) {
  const { status, errorCode, run } = useFigureCheck();
  const [domain, setDomain] = useState('');
  const running = status === 'running';
  const errored = status === 'error';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await run(domain, variant);
  }

  return (
    <div
      className={`rounded border bg-card p-6 lg:p-7 ${errored ? 'border-stale' : 'border-rule'}`}
    >
      <form onSubmit={onSubmit}>
        <label
          htmlFor={`figure-check-domain-${variant}`}
          className="block font-semibold"
        >
          {CHECK_FORM.label}
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <input
            id={`figure-check-domain-${variant}`}
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder={CHECK_FORM.placeholder}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={running}
            className="w-full rounded border border-rule bg-paper px-4 py-3 text-[0.9375rem] text-ink"
            required
          />
          <button
            type="submit"
            disabled={running}
            className="inline-flex shrink-0 items-center justify-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {running ? 'Checking' : CHECK_FORM.button}
          </button>
        </div>
        <p className="mt-3 text-sm text-ink-soft">{CHECK_FORM.small}</p>
      </form>
      {running && <CheckProgress />}
      {errored && errorCode && (
        <p className="mt-4 text-[1.0625rem] text-stale" role="alert">
          {CHECK_ERROR_MESSAGES[errorCode]}
        </p>
      )}
    </div>
  );
}
