'use client';

import { FormEvent, useMemo, useState } from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  ASSUMPTIONS_NOTE,
  BACK_BUTTON_LABEL,
  BROWSER_ONLY_REMINDER,
  CLIENT_TRACE_OPTIONS,
  COMPLIANCE_OFFICER_EMAIL_HINT,
  COMPLIANCE_OFFICER_EMAIL_LABEL,
  CONSENT_WORDING_VERSION,
  DEFAULT_UNVERIFIED_ANSWERS_INPUT,
  DISCLAIMER_LINE,
  EMAIL_ERROR_MESSAGE,
  EMAIL_INPUT_LABEL,
  EMAIL_REPORT_CONTENTS,
  EMAIL_SECTION_BODY,
  EMAIL_SECTION_HEADING,
  EMAIL_SUBMIT_LABEL,
  EMAIL_SUCCESS_MESSAGE,
  FIRM_NAME_LABEL,
  FIRM_NAME_PLACEHOLDER,
  FREQUENCY_OPTIONS,
  HONEYPOT_FIELD_NAME,
  INTRO_BODY,
  INTRO_CTA,
  INTRO_HEADLINE,
  LINK_CHECK_OPTIONS,
  MARKETING_CONSENT_DEFAULT,
  MARKETING_CONSENT_LABEL,
  MAX_PEOPLE,
  MIN_PEOPLE,
  NEXT_BUTTON_LABEL,
  NOT_COUNTED_BODY,
  NOT_COUNTED_CLOSING,
  NOT_COUNTED_HEADLINE,
  NOT_COUNTED_REASON_COPY,
  PEOPLE_VALIDATION_ERROR,
  PI_BOUNDARY_LINE,
  PI_DISCLOSURE_OPTIONS,
  PI_RENEWAL_MONTH_OPTIONS,
  POLICY_OPTIONS,
  PRIVACY_NOTE,
  PROGRESS_LABEL,
  QUESTION_1_HINT,
  QUESTION_1_PROMPT,
  QUESTION_2_PROMPT,
  QUESTION_10_HINT,
  QUESTION_10_PROMPT,
  QUESTION_11_HINT,
  QUESTION_11_PROMPT,
  QUESTION_3_HINT,
  QUESTION_3_PROMPT,
  QUESTION_4_PROMPT,
  QUESTION_5_HINT,
  QUESTION_5_PROMPT,
  QUESTION_6_PROMPT,
  QUESTION_7_PROMPT,
  QUESTION_8_PROMPT,
  QUESTION_9_PROMPT,
  REGULATED_SHARE_OPTIONS,
  RESULT_INTRO,
  RESULT_ZERO_BODY,
  RESULT_ZERO_HEADLINE,
  SEE_RESULT_BUTTON_LABEL,
  SHOW_WORKING_TOGGLE_HIDE_LABEL,
  SHOW_WORKING_TOGGLE_LABEL,
  SOURCE_ACCESS_OPTIONS,
  SUBJECT_OPTIONS,
  TOOL_OPTIONS,
  TOTAL_QUESTIONS,
  ZERO_RESULT_BELOW_FOLD,
  calculateUnverifiedAnswers,
  isComplete,
  isCountedResult,
  isValidPeople,
  toggleToolSelection,
  type ClientTraceAnswer,
  type FrequencyBandId,
  type LinkCheckAnswer,
  type PiDisclosureAnswer,
  type PiRenewalMonthId,
  type PolicyAnswer,
  type RegulatedShareBandId,
  type SourceAccessAnswer,
  type SubjectId,
  type ToolId,
  type UnverifiedAnswersInput,
  type UnverifiedAnswersResult,
} from '@/lib/unverifiedAnswers';
import { VERIFIED_PAGE } from '@/content/copy';
import { track } from '@/lib/analytics';

type Phase = 'intro' | 'questions' | 'result';

function progressLabel(current: number): string {
  return PROGRESS_LABEL.replace('{current}', String(current)).replace(
    '{total}',
    String(TOTAL_QUESTIONS),
  );
}

function peopleHint(): string {
  return QUESTION_1_HINT.replace('{min}', String(MIN_PEOPLE)).replace(
    '{max}',
    String(MAX_PEOPLE),
  );
}

function peopleError(): string {
  return PEOPLE_VALIDATION_ERROR.replace('{min}', String(MIN_PEOPLE)).replace(
    '{max}',
    String(MAX_PEOPLE),
  );
}

function toggleSubject(
  current: SubjectId[],
  toggled: SubjectId,
): SubjectId[] {
  if (current.includes(toggled)) {
    return current.filter((id) => id !== toggled);
  }
  return [...current, toggled];
}

function canAdvance(step: number, input: UnverifiedAnswersInput): boolean {
  switch (step) {
    case 1:
      return isValidPeople(input.people);
    case 2:
      return input.frequencyBand !== null;
    case 3:
      return input.subjects.length > 0;
    case 4:
      return input.regulatedShareBand !== null;
    case 5:
      return input.tools.length > 0;
    case 6:
      return input.sourceAccess !== null;
    case 7:
      return input.linkCheck !== null;
    case 8:
      return input.clientTrace !== null;
    case 9:
      return input.policy !== null;
    case 10:
      return input.piDisclosure !== null;
    case 11:
      return input.piRenewalMonth !== null;
    default:
      return false;
  }
}

const optionButtonClass = (selected: boolean) =>
  cn(
    'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors',
    selected
      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
      : 'border-[var(--color-border-subtle)] bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)]',
  );

type FlowProps = {
  /** Funnel embed: skip standalone intro, use funnel tokens and copy. */
  variant?: 'standalone' | 'funnel';
  onExitIntro?: () => void;
  onComplete?: (monthlyUnverified: number) => void;
};

export default function UnverifiedAnswersFlow({
  variant = 'standalone',
  onExitIntro,
  onComplete,
}: FlowProps) {
  const funnel = variant === 'funnel';
  const [phase, setPhase] = useState<Phase>(funnel ? 'questions' : 'intro');
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<UnverifiedAnswersInput>(
    DEFAULT_UNVERIFIED_ANSWERS_INPUT,
  );
  const [peopleDraft, setPeopleDraft] = useState('');
  const [peopleErrorVisible, setPeopleErrorVisible] = useState(false);
  const [showWorking, setShowWorking] = useState(false);
  const [result, setResult] = useState<UnverifiedAnswersResult | null>(null);

  const [email, setEmail] = useState('');
  const [firmName, setFirmName] = useState('');
  const [complianceOfficerEmail, setComplianceOfficerEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(
    MARKETING_CONSENT_DEFAULT,
  );
  const [honeypot, setHoneypot] = useState('');
  const [emailStatus, setEmailStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  const update = (patch: Partial<UnverifiedAnswersInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
  };

  const goNext = () => {
    let nextInput = input;

    if (step === 1) {
      const parsed = Number(peopleDraft);
      if (!Number.isInteger(parsed) || !isValidPeople(parsed)) {
        setPeopleErrorVisible(true);
        return;
      }
      setPeopleErrorVisible(false);
      nextInput = { ...input, people: parsed };
      setInput(nextInput);
    }

    if (!canAdvance(step, nextInput)) return;

    if (step < TOTAL_QUESTIONS) {
      setStep((s) => s + 1);
      return;
    }

    if (!isComplete(nextInput)) return;
    const calculated = calculateUnverifiedAnswers(nextInput);
    setResult(calculated);
    setPhase('result');
    if (isCountedResult(calculated)) {
      onComplete?.(calculated.untraceable);
    } else {
      onComplete?.(0);
    }
  };

  const goBack = () => {
    if (step === 1) {
      if (funnel && onExitIntro) {
        onExitIntro();
        return;
      }
      setPhase('intro');
      return;
    }
    setStep((s) => s - 1);
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isComplete(input)) return;

    setEmailStatus('sending');
    setEmailError(null);

    try {
      const res = await fetch('/api/unverified-answer-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firmName: firmName.trim() || '',
          complianceOfficerEmail: complianceOfficerEmail.trim() || '',
          marketingConsent,
          consentWordingVersion: CONSENT_WORDING_VERSION,
          source: funnel
            ? '/RAG_Offer/verified-answers'
            : '/unverified-answer-count',
          answers: {
            people: input.people,
            frequencyBand: input.frequencyBand,
            subjects: input.subjects,
            regulatedShareBand: input.regulatedShareBand,
            tools: input.tools,
            sourceAccess: input.sourceAccess,
            linkCheck: input.linkCheck,
            clientTrace: input.clientTrace,
            policy: input.policy,
            piDisclosure: input.piDisclosure,
            piRenewalMonth: input.piRenewalMonth,
          },
          [HONEYPOT_FIELD_NAME]: honeypot,
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setEmailStatus('error');
        setEmailError(data.error || EMAIL_ERROR_MESSAGE);
        return;
      }

      setEmailStatus('success');
      if (funnel && isCountedResult(result!)) {
        track('wizard_report_requested', {
          monthly_unverified: result!.untraceable,
        });
      } else if (funnel) {
        track('wizard_report_requested', { monthly_unverified: 0 });
      }
    } catch {
      setEmailStatus('error');
      setEmailError(EMAIL_ERROR_MESSAGE);
    }
  };

  const nextDisabled = useMemo(() => {
    if (step === 1) {
      const parsed = Number(peopleDraft);
      return !Number.isInteger(parsed) || !isValidPeople(parsed);
    }
    return !canAdvance(step, input);
  }, [step, input, peopleDraft]);

  if (phase === 'intro') {
    return (
      <Card className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Free tool
        </p>
        <h1 className="mb-4 text-3xl font-semibold text-[var(--color-primary)] sm:text-4xl">
          {INTRO_HEADLINE}
        </h1>
        <p className="mb-6 text-lg text-[var(--color-text-secondary)]">
          {INTRO_BODY}
        </p>
        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
          {PRIVACY_NOTE}
        </p>
        <Button
          onClick={() => {
            setPhase('questions');
            setStep(1);
          }}
        >
          {INTRO_CTA}
        </Button>
      </Card>
    );
  }

  if (phase === 'result' && result) {
    const counted = isCountedResult(result);

    if (funnel) {
      return (
        <div className="space-y-10" aria-live="polite">
          <div>
            {counted && !result.isZeroResult ? (
              <>
                <h2 className="text-display-lg">
                  {result.untraceable.toLocaleString('en-GB')}
                  {VERIFIED_PAGE.resultHeadingSuffix}
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-[1.7]">
                  {VERIFIED_PAGE.resultBody}
                </p>
              </>
            ) : null}
            <div className="mt-8">
              <ResultPanel
                result={result}
                showWorking={showWorking}
                onToggleWorking={() => setShowWorking((v) => !v)}
                funnel
                hideHeadline={counted && !result.isZeroResult}
              />
            </div>
          </div>

          <div className="max-w-4xl rounded border border-rule bg-card p-6 lg:p-8">
            <h3 className="text-display-md">{VERIFIED_PAGE.reportHeading}</h3>
            <p className="mt-4 text-[1.0625rem] leading-[1.7] text-ink-soft">
              {VERIFIED_PAGE.reportLead}
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.7] text-ink-soft">
              {VERIFIED_PAGE.reportBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {emailStatus === 'success' ? (
              <p
                className="mt-6 text-sm text-ink-soft"
                role="status"
              >
                {VERIFIED_PAGE.reportConfirm}
              </p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="relative mt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-rule bg-paper px-4 py-3 text-[0.9375rem] text-ink"
                  />
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending'}
                    className="inline-flex shrink-0 items-center justify-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {emailStatus === 'sending'
                      ? 'Sending…'
                      : VERIFIED_PAGE.reportButton}
                  </button>
                </div>
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input
                    name={HONEYPOT_FIELD_NAME}
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                {(emailStatus === 'error' || emailError) && (
                  <p className="mt-3 text-sm text-stale" role="alert">
                    {emailError || EMAIL_ERROR_MESSAGE}
                  </p>
                )}
                <p className="mt-3 text-sm text-ink-soft">
                  {VERIFIED_PAGE.reportSmall}
                </p>
              </form>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <ResultPanel
          result={result}
          showWorking={showWorking}
          onToggleWorking={() => setShowWorking((v) => !v)}
        />

        <Card>
          <h2 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
            {EMAIL_SECTION_HEADING}
          </h2>
          <p className="mb-4 text-[var(--color-text-secondary)]">
            {EMAIL_SECTION_BODY}
          </p>
          <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
            {EMAIL_REPORT_CONTENTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {emailStatus === 'success' ? (
            <p className="text-[var(--color-text-primary)]" role="status">
              {EMAIL_SUCCESS_MESSAGE}
            </p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="relative space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unverified-email">{EMAIL_INPUT_LABEL}</Label>
                <Input
                  id="unverified-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unverified-firm-name">{FIRM_NAME_LABEL}</Label>
                <Input
                  id="unverified-firm-name"
                  type="text"
                  autoComplete="organization"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder={FIRM_NAME_PLACEHOLDER}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unverified-compliance-email">
                  {COMPLIANCE_OFFICER_EMAIL_LABEL}
                </Label>
                <Input
                  id="unverified-compliance-email"
                  type="email"
                  autoComplete="email"
                  value={complianceOfficerEmail}
                  onChange={(e) => setComplianceOfficerEmail(e.target.value)}
                  className="h-11"
                />
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {COMPLIANCE_OFFICER_EMAIL_HINT}
                </p>
              </div>

              <label className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                />
                <span>{MARKETING_CONSENT_LABEL}</span>
              </label>

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="unverified-website">Website</label>
                <input
                  id="unverified-website"
                  name={HONEYPOT_FIELD_NAME}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {(emailStatus === 'error' || emailError) && (
                <p className="text-sm text-[var(--color-critical)]" role="alert">
                  {emailError || EMAIL_ERROR_MESSAGE}
                </p>
              )}

              <Button type="submit" disabled={emailStatus === 'sending'}>
                {emailStatus === 'sending' ? 'Sending…' : EMAIL_SUBMIT_LABEL}
              </Button>

              <p className="text-sm text-[var(--color-text-secondary)]">
                {BROWSER_ONLY_REMINDER}
              </p>
            </form>
          )}
        </Card>

        <p className="text-sm text-[var(--color-text-secondary)]">
          {DISCLAIMER_LINE}
        </p>
      </div>
    );
  }

  return (
    <Card className={funnel ? 'max-w-none border-rule bg-card shadow-none' : 'mx-auto max-w-2xl'}>
      <p
        className={
          funnel
            ? 'mb-6 text-sm text-ink-soft'
            : 'mb-6 text-sm font-medium text-[var(--color-accent)]'
        }
      >
        {progressLabel(step)}
      </p>

      {step === 1 && (
        <QuestionBlock title={QUESTION_1_PROMPT} hint={peopleHint()}>
          <Input
            type="number"
            inputMode="numeric"
            min={MIN_PEOPLE}
            max={MAX_PEOPLE}
            step={1}
            value={peopleDraft}
            onChange={(e) => {
              setPeopleDraft(e.target.value);
              setPeopleErrorVisible(false);
            }}
            className="h-11 max-w-xs"
            aria-invalid={peopleErrorVisible}
          />
          {peopleErrorVisible && (
            <p className="mt-2 text-sm text-[var(--color-critical)]" role="alert">
              {peopleError()}
            </p>
          )}
        </QuestionBlock>
      )}

      {step === 2 && (
        <QuestionBlock title={QUESTION_2_PROMPT}>
          <OptionList>
            {FREQUENCY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.frequencyBand === option.id)}
                onClick={() =>
                  update({ frequencyBand: option.id as FrequencyBandId })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 3 && (
        <QuestionBlock title={QUESTION_3_PROMPT} hint={QUESTION_3_HINT}>
          <OptionList>
            {SUBJECT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(
                  input.subjects.includes(option.id),
                )}
                onClick={() =>
                  update({
                    subjects: toggleSubject(input.subjects, option.id),
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 4 && (
        <QuestionBlock title={QUESTION_4_PROMPT}>
          <OptionList>
            {REGULATED_SHARE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(
                  input.regulatedShareBand === option.id,
                )}
                onClick={() =>
                  update({
                    regulatedShareBand: option.id as RegulatedShareBandId,
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 5 && (
        <QuestionBlock title={QUESTION_5_PROMPT} hint={QUESTION_5_HINT}>
          <OptionList>
            {TOOL_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.tools.includes(option.id))}
                onClick={() =>
                  update({
                    tools: toggleToolSelection(
                      input.tools,
                      option.id as ToolId,
                    ),
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 6 && (
        <QuestionBlock title={QUESTION_6_PROMPT}>
          <OptionList>
            {SOURCE_ACCESS_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.sourceAccess === option.id)}
                onClick={() =>
                  update({ sourceAccess: option.id as SourceAccessAnswer })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 7 && (
        <QuestionBlock title={QUESTION_7_PROMPT}>
          <OptionList>
            {LINK_CHECK_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.linkCheck === option.id)}
                onClick={() =>
                  update({ linkCheck: option.id as LinkCheckAnswer })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 8 && (
        <QuestionBlock title={QUESTION_8_PROMPT}>
          <OptionList>
            {CLIENT_TRACE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.clientTrace === option.id)}
                onClick={() =>
                  update({ clientTrace: option.id as ClientTraceAnswer })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 9 && (
        <QuestionBlock title={QUESTION_9_PROMPT}>
          <OptionList>
            {POLICY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.policy === option.id)}
                onClick={() => update({ policy: option.id as PolicyAnswer })}
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 10 && (
        <QuestionBlock title={QUESTION_10_PROMPT} hint={QUESTION_10_HINT}>
          <OptionList>
            {PI_DISCLOSURE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(input.piDisclosure === option.id)}
                onClick={() =>
                  update({ piDisclosure: option.id as PiDisclosureAnswer })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      {step === 11 && (
        <QuestionBlock title={QUESTION_11_PROMPT} hint={QUESTION_11_HINT}>
          <OptionList>
            {PI_RENEWAL_MONTH_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={optionButtonClass(
                  input.piRenewalMonth === option.id,
                )}
                onClick={() =>
                  update({ piRenewalMonth: option.id as PiRenewalMonthId })
                }
              >
                {option.label}
              </button>
            ))}
          </OptionList>
        </QuestionBlock>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={goBack}>
          {BACK_BUTTON_LABEL}
        </Button>
        <Button onClick={goNext} disabled={nextDisabled}>
          {step === TOTAL_QUESTIONS ? SEE_RESULT_BUTTON_LABEL : NEXT_BUTTON_LABEL}
        </Button>
      </div>
    </Card>
  );
}

function QuestionBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-[var(--color-primary)]">
        {title}
      </h2>
      {hint && (
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">{hint}</p>
      )}
      {children}
    </div>
  );
}

function OptionList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ResultPanel({
  result,
  showWorking,
  onToggleWorking,
  funnel = false,
  hideHeadline = false,
}: {
  result: UnverifiedAnswersResult;
  showWorking: boolean;
  onToggleWorking: () => void;
  funnel?: boolean;
  hideHeadline?: boolean;
}) {
  const counted = isCountedResult(result);
  const titleClass = funnel
    ? 'mb-4 text-display-lg text-ink'
    : 'mb-4 text-3xl font-semibold text-[var(--color-primary)]';
  const bodyClass = funnel
    ? 'mb-4 text-[1.0625rem] leading-[1.7] text-ink-soft'
    : 'mb-4 text-lg text-[var(--color-text-secondary)]';

  return (
    <Card className={funnel ? 'border-rule bg-card shadow-none' : undefined}>
      {!hideHeadline && !counted ? (
        <>
          <h1 className={titleClass}>{NOT_COUNTED_HEADLINE}</h1>
          <p className={bodyClass}>{NOT_COUNTED_BODY}</p>
          <ul
            className={
              funnel
                ? 'mb-4 list-disc space-y-2 pl-5 text-ink-soft'
                : 'mb-4 list-disc space-y-2 pl-5 text-[var(--color-text-secondary)]'
            }
          >
            {result.reasons.map((reason) => (
              <li key={reason}>{NOT_COUNTED_REASON_COPY[reason]}</li>
            ))}
          </ul>
          <p className={bodyClass}>{NOT_COUNTED_CLOSING}</p>
        </>
      ) : !hideHeadline && counted && result.isZeroResult ? (
        <>
          <h1 className={titleClass}>{RESULT_ZERO_HEADLINE}</h1>
          <p className={bodyClass}>{RESULT_ZERO_BODY}</p>
          <p className={bodyClass}>{ZERO_RESULT_BELOW_FOLD}</p>
        </>
      ) : !hideHeadline && counted ? (
        <>
          <p
            className={
              funnel
                ? 'mb-2 text-sm text-ink-soft'
                : 'mb-2 text-sm text-[var(--color-text-secondary)]'
            }
          >
            {RESULT_INTRO}
          </p>
          <h1
            className={
              funnel
                ? 'mb-4 text-display-lg text-ink'
                : 'mb-4 text-4xl font-bold leading-tight text-[var(--color-primary)] sm:text-5xl'
            }
          >
            <span className={funnel ? 'block' : 'block text-5xl sm:text-6xl'}>
              {result.untraceable.toLocaleString('en-GB')}
            </span>
            <span
              className={
                funnel
                  ? 'mt-2 block text-display-md font-medium'
                  : 'mt-2 block text-xl font-semibold sm:text-2xl'
              }
            >
              {result.headlineSuffix}
            </span>
          </h1>
        </>
      ) : null}

      {result.subjectsLine && (
        <p className="mb-4 text-[var(--color-text-secondary)]">
          {result.subjectsLine}
        </p>
      )}

      {result.teaser && (
        <p className="mb-4 rounded-lg bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)]">
          {result.teaser}
        </p>
      )}

      {result.piTeaser && (
        <>
          <p className="mb-4 rounded-lg bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)]">
            {result.piTeaser}
          </p>
          <p className="mb-4 text-sm font-semibold text-[var(--color-primary)]">
            {PI_BOUNDARY_LINE}
          </p>
        </>
      )}

      {result.notSureCallout && (
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          {result.notSureCallout}
        </p>
      )}

      {result.personalAccountCallout && (
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          {result.personalAccountCallout}
        </p>
      )}

      <button
        type="button"
        onClick={onToggleWorking}
        className="mb-4 text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
      >
        {showWorking ? SHOW_WORKING_TOGGLE_HIDE_LABEL : SHOW_WORKING_TOGGLE_LABEL}
      </button>

      {showWorking && (
        <div className="mb-6 overflow-x-auto rounded-lg border border-[var(--color-border-subtle)]">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[var(--color-surface)] text-[var(--color-primary)]">
              <tr>
                <th className="px-3 py-2 font-semibold">Step</th>
                <th className="px-3 py-2 font-semibold">Working</th>
                <th className="px-3 py-2 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {result.workingSteps.map((step) => (
                <tr
                  key={step.name + step.substitution}
                  className="border-t border-[var(--color-border-subtle)]"
                >
                  <td className="px-3 py-2 align-top">{step.name}</td>
                  <td className="px-3 py-2 align-top font-mono text-xs">
                    {step.substitution}
                  </td>
                  <td className="px-3 py-2 align-top">
                    {step.notDoneReason ?? step.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--color-border-subtle)] px-3 py-3 text-xs text-[var(--color-text-secondary)]">
            {ASSUMPTIONS_NOTE}
          </p>
        </div>
      )}
    </Card>
  );
}
