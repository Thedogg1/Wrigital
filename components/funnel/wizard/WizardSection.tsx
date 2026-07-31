'use client';

import { RequirementsWizard } from '@/components/funnel/wizard/RequirementsWizard';
import { track } from '@/lib/analytics';

export function WizardSection() {
  return (
    <RequirementsWizard
      onComplete={(payload) =>
        track('wizard_completed', { steps: payload.steps })
      }
    />
  );
}
