'use client';

import { useId, useState } from 'react';
import { z } from 'zod';
import { BrochureDatePicker } from '@/components/BrochureDatePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  TIME_BANDS,
  isSelectableWorkingDay,
  isTimeBand,
  isValidUkPhone,
  type TimeBand,
} from '@/lib/brochure/dates';

const HONEYPOT_FIELD = 'b_hp';

type FormStatus = 'idle' | 'sending' | 'done';

type FieldErrors = {
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
};

const SUCCESS_MESSAGE =
  'On the way. Check your inbox in a minute or so, and your spam folder if nothing arrives. Terry will ring you on the day you picked.';

const FAILURE_MESSAGE =
  'Something went wrong at our end. Email hello@wrigital.com and we will send the brochure straight over.';

const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address.');

function validateFields(input: {
  email: string;
  phone: string;
  date: string;
  time: TimeBand | '';
}): FieldErrors {
  const errors: FieldErrors = {};

  const emailResult = emailSchema.safeParse(input.email);
  if (!emailResult.success) {
    errors.email =
      emailResult.error.issues[0]?.message ??
      'Please enter a valid email address.';
  }

  if (!input.phone.trim()) {
    errors.phone = 'Please enter your phone number.';
  } else if (!isValidUkPhone(input.phone)) {
    errors.phone =
      'Please enter a valid UK phone number, with or without spaces, or starting with +44.';
  }

  if (!input.date) {
    errors.date = 'Please choose a day for a call.';
  } else if (!isSelectableWorkingDay(input.date)) {
    errors.date = 'Please choose a working day in the next sixty days.';
  }

  if (!input.time || !isTimeBand(input.time)) {
    errors.time = 'Please choose a best time.';
  }

  return errors;
}

export function BrochureForm() {
  const emailId = useId();
  const phoneId = useId();
  const dateId = useId();
  const dateLabelId = useId();
  const timeLegendId = useId();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState<TimeBand | ''>('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const errors = validateFields({ email, phone, date, time });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          date,
          time,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };

      if (!res.ok || data.ok !== true) {
        setStatus('idle');
        setFormError(FAILURE_MESSAGE);
        return;
      }

      setStatus('done');
    } catch {
      setStatus('idle');
      setFormError(FAILURE_MESSAGE);
    }
  };

  if (status === 'done') {
    return (
      <p className="mt-8 max-w-xl text-lg text-[var(--color-primary)]" role="status">
        {SUCCESS_MESSAGE}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-8 max-w-md space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor={emailId}>Your email address</Label>
        <Input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'sending'}
          className="h-11 px-3 text-base"
          aria-invalid={Boolean(fieldErrors.email) || undefined}
        />
        {fieldErrors.email && (
          <p className="text-sm text-[var(--color-critical)]" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={phoneId}>Your phone number</Label>
        <Input
          id={phoneId}
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={status === 'sending'}
          className="h-11 px-3 text-base"
          aria-invalid={Boolean(fieldErrors.phone) || undefined}
        />
        {fieldErrors.phone && (
          <p className="text-sm text-[var(--color-critical)]" role="alert">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label id={dateLabelId} htmlFor={dateId}>
          Best day for a call
        </Label>
        <BrochureDatePicker
          id={dateId}
          labelledBy={dateLabelId}
          value={date}
          onChange={(iso) => {
            setDate(iso);
            setFieldErrors((prev) => ({ ...prev, date: undefined }));
          }}
          disabled={status === 'sending'}
          invalid={Boolean(fieldErrors.date)}
        />
        {fieldErrors.date && (
          <p className="text-sm text-[var(--color-critical)]" role="alert">
            {fieldErrors.date}
          </p>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend
          id={timeLegendId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          Best time
        </legend>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby={timeLegendId}
        >
          {TIME_BANDS.map((band) => {
            const selected = time === band;
            return (
              <button
                key={band}
                type="button"
                aria-pressed={selected}
                disabled={status === 'sending'}
                onClick={() => {
                  setTime(band);
                  setFieldErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className={cn(
                  'inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-colors',
                  selected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]'
                    : 'border-[var(--color-border-subtle)] bg-transparent text-[var(--color-primary)] hover:border-[var(--color-primary)]',
                  status === 'sending' && 'cursor-not-allowed opacity-50',
                )}
              >
                {band}
              </button>
            );
          })}
        </div>
        {fieldErrors.time && (
          <p className="text-sm text-[var(--color-critical)]" role="alert">
            {fieldErrors.time}
          </p>
        )}
      </fieldset>

      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="brochure-b-hp">Leave blank</label>
        <input
          id="brochure-b-hp"
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {formError && (
        <p className="text-sm text-[var(--color-critical)]" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-[var(--color-primary)] px-8 text-base font-semibold text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-cta-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending' : 'Send me the brochure'}
      </button>
    </form>
  );
}
