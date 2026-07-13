'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import UsExitSnapshotForm from '@/components/us-exit-snapshot/UsExitSnapshotForm';
import LandingUsExitPreview from '@/components/landing/us/LandingUsExitPreview';
import LeadCaptureModal from '@/features/lead-capture/LeadCaptureModal';
import {
  EMPTY_US_SNAPSHOT_FORM,
  validateUsSnapshotInputs,
  type UsSnapshotFormData,
} from '@/lib/validation/validateUsSnapshotInputs';
import { calculateUsExitSnapshot } from '@/lib/us-exit-snapshot/calculateUsExitSnapshot';
import {
  buildUsSnapshotContext,
  evaluateUsNarrativeRules,
} from '@/lib/us-exit-snapshot/evaluateUsNarrativeRules';
import { buildUsSnapshotReport } from '@/lib/us-exit-snapshot/renderUsSnapshot';
import type { MatchedNarrativeRule, UsSnapshotCalculated } from '@/lib/us-exit-snapshot/types';

function serializeFormState(formState: UsSnapshotFormData): string {
  return JSON.stringify(formState);
}

export default function LandingUsExitCalculator() {
  const [formState, setFormState] = useState<UsSnapshotFormData>(EMPTY_US_SNAPSHOT_FORM);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [formSnapshotAtGeneration, setFormSnapshotAtGeneration] = useState<string | null>(null);
  const [exitReportHtml, setExitReportHtml] = useState('');
  const [calculated, setCalculated] = useState<UsSnapshotCalculated | null>(null);
  const [matchedRules, setMatchedRules] = useState<MatchedNarrativeRule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const validation = useMemo(() => validateUsSnapshotInputs(formState), [formState]);
  const inputsChangedSinceReport = useMemo(() => {
    if (!formSnapshotAtGeneration) return false;
    return serializeFormState(formState) !== formSnapshotAtGeneration;
  }, [formState, formSnapshotAtGeneration]);

  const handleGenerateReport = useCallback(() => {
    if (!validation.isValid) return;
    setGenerateError('');
    setIsGenerating(true);
    try {
      const calc = calculateUsExitSnapshot(formState);
      const context = buildUsSnapshotContext(formState, calc);
      const rules = evaluateUsNarrativeRules(context);
      const { fullHtml } = buildUsSnapshotReport(context, rules);

      setCalculated(calc);
      setMatchedRules(rules);
      setExitReportHtml(fullHtml);
      setFormSnapshotAtGeneration(serializeFormState(formState));
      setReportGenerated(true);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      console.error('US exit calculator error:', error);
      setGenerateError(
        'We could not generate your report. Please check your inputs and try again.',
      );
    } finally {
      setIsGenerating(false);
    }
  }, [formState, validation.isValid]);

  return (
    <>
      <div className='space-y-8'>
        <UsExitSnapshotForm
          formState={formState}
          onChange={setFormState}
          onGenerate={handleGenerateReport}
          isGenerating={isGenerating}
          reportGenerated={reportGenerated}
          inputsChangedSinceReport={inputsChangedSinceReport}
          generateError={generateError}
        />

        {reportGenerated && calculated && (
          <div ref={resultsRef} id='calculator-results' className='scroll-mt-24'>
            <LandingUsExitPreview
              inputs={formState}
              calculated={calculated}
              matchedRules={matchedRules}
              inputsStale={inputsChangedSinceReport}
              onRequestFullReport={() => setLeadModalOpen(true)}
            />
          </div>
        )}
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        reportHtml={exitReportHtml}
        endpoint="/api/us-lead-capture"
      />
    </>
  );
}
