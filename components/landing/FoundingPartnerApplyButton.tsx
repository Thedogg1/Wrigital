'use client';

import { useId, useState } from 'react';
import Button from '@/components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FOUNDING_PARTNER_CALENDLY_URL,
  FOUNDING_PARTNER_QUESTIONS,
  emptyFoundingPartnerAnswers,
  foundingPartnerApplyResult,
  type FoundingPartnerAnswer,
  type FoundingPartnerQuestionId,
} from '@/lib/landing/foundingPartnerApply';

const accentButtonClass =
  'border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)]';

export default function FoundingPartnerApplyButton({
  variant = 'primary',
  className = accentButtonClass,
}: {
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState(emptyFoundingPartnerAnswers);
  const result = foundingPartnerApplyResult(answers);

  function setAnswer(id: FoundingPartnerQuestionId, value: FoundingPartnerAnswer) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setAnswers(emptyFoundingPartnerAnswers());
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        Apply to Become a Founding Partner
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto border border-[#e4dcce] bg-[#faf7f0] p-6 text-[#1a1a1a] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="pr-8 text-xl text-[#0a2342]">
              Apply to Become a Founding Partner
            </DialogTitle>
            <DialogDescription className="text-base text-[#475569]">
              Answer both questions. A call is offered when both answers are yes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 text-left">
            {FOUNDING_PARTNER_QUESTIONS.map((question, index) => {
              const groupName = `${baseId}-${question.id}`;
              return (
                <fieldset key={question.id} className="space-y-3">
                  <legend className="text-base leading-relaxed font-semibold text-[#1a1a1a]">
                    {index + 1}. {question.text}
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {(['yes', 'no'] as const).map((value) => (
                      <label
                        key={value}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#475569] bg-white px-4 py-2 text-sm font-semibold text-[#1a1a1a] has-checked:border-[#0a2342] has-checked:bg-[#f3ede1]"
                      >
                        <input
                          type="radio"
                          name={groupName}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => setAnswer(question.id, value)}
                        />
                        {value === 'yes' ? 'Yes' : 'No'}
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
            <div aria-live="polite">
              {result === 'book' && (
                <div className="space-y-4 rounded-lg border border-[rgba(0,200,224,0.35)] bg-[var(--color-surface)] p-4">
                  <p className="leading-relaxed text-[var(--color-text-primary)]">
                    Both answers are yes. Book a 30-minute call to talk about the
                    Founding Partner pilot.
                  </p>
                  <Button href={FOUNDING_PARTNER_CALENDLY_URL} className={accentButtonClass}>
                    Book a call
                  </Button>
                </div>
              )}
              {result === 'not-a-fit' && (
                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                  The Founding Partner pilot is for firms that answer yes to both
                  of these.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
