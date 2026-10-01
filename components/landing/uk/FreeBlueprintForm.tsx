'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { contactEmail } from '@/lib/email/config';
import {
  MANDATORY_FIELDS,
  NICHE_FIELDS,
  OPTIONAL_HOST_FIELDS,
  UK_ENTITY_TYPES,
  defaultFieldValues,
  uniqueGroups,
  type BlueprintField,
} from '@/lib/uk-landing/blueprintFields';
import {
  FINPRINT_SAMPLE_HONEYPOT_FIELD,
  calculatedPicture,
  formatGbp,
  formatPercentFromDecimal,
  isDefaultValue,
  parseLooseNumber,
  prepareBlueprintRequest,
  provenanceFor,
} from '@/lib/uk-landing/blueprintRequest';

const DESCRIPTION_PLACEHOLDER =
  'The client is the owner of a high precision engineering firm. He has a mother in her 90s and 2 children. One wants to work in the business and the other wants to do his own thing. He wants to retire so he can look after his mother.';

const inputClass =
  'h-12 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-4 text-base text-[var(--color-text-primary)] outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50';

function domId(path: string): string {
  return `bp-${path.replace(/\./g, '-')}`;
}

function FieldControl({
  field,
  value,
  error,
  disabled,
  onChange,
  onReset,
}: {
  field: BlueprintField;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onReset?: () => void;
}) {
  const helpId = `${domId(field.path)}-help`;
  const errorId = `${domId(field.path)}-error`;
  const describedBy = error ? `${helpId} ${errorId}` : helpId;
  const provenance = field.blocking ? provenanceFor(field, value || field.defaultValue || '') : null;
  const showReset = field.blocking && value !== undefined && !isDefaultValue(field, value);

  return (
    <div className="space-y-2">
      <label
        htmlFor={domId(field.path)}
        className="block text-sm font-semibold text-[var(--color-text-primary)]"
      >
        {field.label}
      </label>
      {field.kind === 'entity' ? (
        <select
          id={domId(field.path)}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          {UK_ENTITY_TYPES.map((entity) => (
            <option key={entity} value={entity}>
              {entity === 'SoleTrader' ? 'Sole trader' : entity}
            </option>
          ))}
        </select>
      ) : field.kind === 'boolean' ? (
        <select
          id={domId(field.path)}
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          <option value="">Not provided</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : (
        <input
          id={domId(field.path)}
          type={field.kind === 'date' ? 'date' : 'text'}
          inputMode={
            field.kind === 'gbp' ||
            field.kind === 'number' ||
            field.kind === 'integer' ||
            field.kind === 'percent_0_100' ||
            field.kind === 'decimal_0_1'
              ? 'decimal'
              : undefined
          }
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
      <p id={helpId} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {field.help}
      </p>
      {provenance === 'DEFAULT - DEMONSTRATION' && (
        <p className="text-xs font-semibold tracking-wide text-[var(--color-accent)] uppercase">
          Representative default
        </p>
      )}
      {provenance === 'ADVISER PROVIDED' && (
        <p className="text-xs font-semibold tracking-wide text-[var(--color-accent)] uppercase">
          Adviser provided
        </p>
      )}
      {field.blocking && provenance === 'DEFAULT - DEMONSTRATION' && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          Representative default. Change this if you want.
        </p>
      )}
      {showReset && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-[var(--color-primary)] underline"
        >
          Reset to default
        </button>
      )}
      {error && (
        <p id={errorId} className="text-sm text-[var(--color-critical)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldGroup({
  title,
  fields,
  values,
  errors,
  disabled,
  onChange,
  onReset,
}: {
  title: string;
  fields: BlueprintField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  disabled: boolean;
  onChange: (path: string, value: string) => void;
  onReset: (path: string) => void;
}) {
  return (
    <div className="space-y-6">
      {title ? (
        <h4 className="text-base font-semibold text-[var(--color-primary)]">{title}</h4>
      ) : null}
      {fields.map((field) => (
        <FieldControl
          key={field.path}
          field={field}
          value={values[field.path] ?? ''}
          error={errors[field.path]}
          disabled={disabled}
          onChange={(value) => onChange(field.path, value)}
          onReset={
            field.blocking ? () => onReset(field.path) : undefined
          }
        />
      ))}
    </div>
  );
}

export default function FreeBlueprintForm() {
  const descriptionId = useId();
  const nameId = useId();
  const firmId = useId();
  const emailId = useId();
  const honeypotId = useId();

  const [description, setDescription] = useState('');
  const [adviserName, setAdviserName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [values, setValues] = useState<Record<string, string>>(defaultFieldValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const router = useRouter();

  const picture = calculatedPicture(values);
  const ownership = parseLooseNumber(
    values['client_profile.primary_business.ownership_percentage'] ?? '',
  );

  const setField = (path: string, value: string) => {
    setValues((current) => ({ ...current, [path]: value }));
  };

  const resetField = (path: string) => {
    const field = MANDATORY_FIELDS.find((item) => item.path === path);
    if (!field?.defaultValue) return;
    setField(path, field.defaultValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const prepared = prepareBlueprintRequest({
      description,
      adviserName,
      firmName,
      email,
      fields: values,
    });
    setErrors(prepared.errors);
    if (!prepared.request) {
      const firstKey = Object.keys(prepared.errors)[0];
      const focusIds: Record<string, string> = {
        description: descriptionId,
        adviserName: nameId,
        firmName: firmId,
        email: emailId,
      };
      if (firstKey) {
        document.getElementById(focusIds[firstKey] ?? domId(firstKey))?.focus();
      }
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/uk-finprint-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: prepared.request.description,
          adviserName: prepared.request.adviserName,
          firmName: prepared.request.firmName,
          email: prepared.request.email,
          fields: values,
          [FINPRINT_SAMPLE_HONEYPOT_FIELD]: honeypot,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok || data.ok !== true) {
        setStatus('idle');
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(
          data.error ||
            `We could not send your request. Please try again or email ${contactEmail}.`,
        );
        return;
      }
      router.push(
        `/uk/thank-you?email=${encodeURIComponent(prepared.request.email)}`,
      );
    } catch {
      setStatus('idle');
      setFormError(
        `We could not send your request. Please try again or email ${contactEmail}.`,
      );
    }
  };

  const sending = status === 'sending';

  return (
    <form onSubmit={handleSubmit} className="relative space-y-12" noValidate>
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-[var(--color-primary)]">
          Tell us about the HNW business owners you want to explore
        </h3>
        <label htmlFor={descriptionId} className="block text-sm font-semibold text-[var(--color-text-primary)]">
          Describe the business-owner situation you want analysed.
        </label>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          A few sentences is enough. FinPrint will use this to carry out the
          Complimentary Business Owner Analysis and create the Blueprint. Use a
          representative scenario, or a genuine situation with nothing that
          identifies the individual or the business.
        </p>
        <textarea
          id={descriptionId}
          name="description"
          rows={8}
          value={description}
          placeholder={DESCRIPTION_PLACEHOLDER}
          disabled={sending}
          aria-invalid={Boolean(errors.description) || undefined}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-48 w-full rounded-lg border border-[var(--color-border-subtle)] bg-white px-4 py-3 text-base leading-relaxed text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]/70 focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30"
        />
        {errors.description && (
          <p className="text-sm text-[var(--color-critical)]" role="alert">
            {errors.description}
          </p>
        )}
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-[var(--color-primary)]">
            Starting financial picture
          </h3>
          <p className="leading-relaxed text-[var(--color-text-secondary)]">
            Representative values are already filled in, so you can request the
            analysis without assembling a full picture from scratch. Change
            anything that should reflect your scenario. Do not enter information
            that identifies a real client or prospect.
          </p>
        </div>
        {uniqueGroups(MANDATORY_FIELDS).map((group) => (
          <FieldGroup
            key={group}
            title={group}
            fields={MANDATORY_FIELDS.filter((field) => field.group === group)}
            values={values}
            errors={errors}
            disabled={sending}
            onChange={setField}
            onReset={resetField}
          />
        ))}
        {picture && (
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <p className="font-semibold text-[var(--color-text-primary)]">
              Calculated from these figures
            </p>
            <p className="mt-2">
              Owner&apos;s stake: {formatGbp(picture.ownerStakeGbp)}. Business
              value multiplied by ownership percentage.
            </p>
            <p>
              Business concentration: {formatPercentFromDecimal(picture.businessConcentration)}.
              Owner&apos;s stake divided by net worth. This is calculated, not a
              second entered figure.
            </p>
          </div>
        )}
        {ownership !== null && ownership > 0 && ownership < 5 && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ownership below 5% may fall short of the BADR ordinary share capital
            test. Adviser review required in a live FinPrint.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-[var(--color-primary)]">
          Deepen the Blueprint
        </h3>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          The Blueprint is designed for higher-value owner-managed businesses
          where the company forms a material part of the owner&apos;s wealth and
          issues such as valuation, exit, succession, liquidity and personal
          financial planning may intersect.
        </p>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          FinPrint can use additional information to make the analysis more
          specific. None of the fields below are required. Complete anything
          you know and leave the rest blank.
        </p>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          These questions also show the kinds of information FinPrint may
          identify as useful to establish when preparing for a real prospect
          conversation. Not every question will be relevant to every business
          or owner.
        </p>
        {uniqueGroups(NICHE_FIELDS).map((group, index) => (
          <details
            key={group}
            open={index === 0}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-4"
          >
            <summary className="cursor-pointer text-base font-semibold text-[var(--color-primary)]">
              {group}
            </summary>
            <div className="mt-6">
              <FieldGroup
                title=""
                fields={NICHE_FIELDS.filter((field) => field.group === group)}
                values={values}
                errors={errors}
                disabled={sending}
                onChange={setField}
                onReset={resetField}
              />
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-[var(--color-primary)]">
          Additional information
        </h3>
        <p className="leading-relaxed text-[var(--color-text-secondary)]">
          Optional information that may enable or refine further analysis. Leave
          blank anything you do not want included.
        </p>
        {uniqueGroups(OPTIONAL_HOST_FIELDS).map((group) => (
          <details
            key={group}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-white p-4"
          >
            <summary className="cursor-pointer text-base font-semibold text-[var(--color-primary)]">
              {group}
            </summary>
            <div className="mt-6">
              <FieldGroup
                title=""
                fields={OPTIONAL_HOST_FIELDS.filter((field) => field.group === group)}
                values={values}
                errors={errors}
                disabled={sending}
                onChange={setField}
                onReset={resetField}
              />
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-3 rounded-lg border border-[rgba(0,200,224,0.35)] bg-white p-5">
        <h3 className="text-xl font-bold text-[var(--color-primary)]">
          What happens to missing information?
        </h3>
        <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <li>Some figures can be calculated from values already known.</li>
          <li>Some points may be established from external research, with the source kept.</li>
          <li>
            About 25% of eligible missing information may later be inferred as
            representative assumptions. Nothing is inferred just to fill a quota,
            and nothing is inferred in this form before you submit.
          </li>
          <li>Some gaps will deliberately remain unknown.</li>
          <li>Assumptions will be labelled. Adviser review required in a live FinPrint.</li>
          <li>
            Missing information can become guidance about what may be useful to
            establish in discovery.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-[var(--color-primary)]">Your details</h3>
        <div className="space-y-2">
          <label htmlFor={nameId} className="text-sm font-semibold text-[var(--color-text-primary)]">
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            autoComplete="name"
            value={adviserName}
            disabled={sending}
            aria-invalid={Boolean(errors.adviserName) || undefined}
            onChange={(event) => setAdviserName(event.target.value)}
            className={inputClass}
          />
          {errors.adviserName && (
            <p className="text-sm text-[var(--color-critical)]" role="alert">
              {errors.adviserName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor={firmId} className="text-sm font-semibold text-[var(--color-text-primary)]">
            Firm name
          </label>
          <input
            id={firmId}
            name="organization"
            autoComplete="organization"
            value={firmName}
            disabled={sending}
            aria-invalid={Boolean(errors.firmName) || undefined}
            onChange={(event) => setFirmName(event.target.value)}
            className={inputClass}
          />
          {errors.firmName && (
            <p className="text-sm text-[var(--color-critical)]" role="alert">
              {errors.firmName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor={emailId} className="text-sm font-semibold text-[var(--color-text-primary)]">
            Work email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={sending}
            aria-invalid={Boolean(errors.email) || undefined}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
          {errors.email && (
            <p className="text-sm text-[var(--color-critical)]" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </section>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Leave blank</label>
        <input
          id={honeypotId}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {formError && (
        <p className="text-sm text-[var(--color-critical)]" role="alert">
          {formError}
        </p>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center rounded-lg border-none bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[var(--color-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? 'Sending' : 'Request My Complimentary Business Owner Analysis'}
        </button>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Do not include information that identifies a real client or prospect.
          The analysis produces a Blueprint. It will distinguish between
          information you supplied, representative defaults, and calculated
          values. Inferred assumptions and external research, if used later,
          will be labelled separately.
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          We use your name, firm and email to prepare and send the Blueprint.{' '}
          <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </form>
  );
}
