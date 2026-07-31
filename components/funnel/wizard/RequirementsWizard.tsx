'use client';

import { SITE } from '@/lib/site';
import { track } from '@/lib/analytics';

/**
 * Requirements wizard slot. No wizard implementation exists in this repo yet.
 * Interface matches spec §6.2: onComplete, funnel tokens, SITE.calendly CTA.
 */
export function RequirementsWizard({
  onComplete,
}: {
  onComplete: (payload: { steps: number }) => void;
}) {
  return (
    <div className="rounded border border-rule bg-card p-7 lg:p-9">
      <p className="text-[1.0625rem] leading-[1.7]">
        Thirty minutes to define your AI compliance blueprint. You tell me what
        your compliance officer would need to see before an AI system is
        client-ready in your firm: which numbers must be checkable, which claims
        must carry a source, what the system must do when the answer isn&apos;t
        known, and what evidence must exist afterwards.
      </p>
      <a
        href={SITE.calendly}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          onComplete({ steps: 0 });
          track('calendly_clicked', {
            placement: 'wizard',
            variant: 'standing',
          });
        }}
        className="mt-7 inline-flex items-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
      >
        Book a call
      </a>
    </div>
  );
}
