'use client';

import { useState } from 'react';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';
import UnverifiedAnswersFlow from '@/components/unverified-answers/UnverifiedAnswersFlow';
import { VERIFIED_PAGE } from '@/content/copy';
import { track } from '@/lib/analytics';

export function WizardBlock() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <Section label="Count">
        <Prose>
          <h2>{VERIFIED_PAGE.wizardIntroHeading}</h2>
          {VERIFIED_PAGE.wizardIntro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Prose>
        <button
          type="button"
          onClick={() => {
            track('wizard_started', {});
            setStarted(true);
          }}
          className="mt-8 inline-flex items-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
        >
          {VERIFIED_PAGE.startButton}
        </button>
        <p className="mt-3 text-sm text-ink-soft">{VERIFIED_PAGE.startSmall}</p>
      </Section>
    );
  }

  return (
    <Section label="Count" id="count-wizard">
      <UnverifiedAnswersFlow
        variant="funnel"
        onExitIntro={() => setStarted(false)}
        onComplete={(monthly) =>
          track('wizard_completed', { monthly_unverified: monthly })
        }
      />
    </Section>
  );
}
