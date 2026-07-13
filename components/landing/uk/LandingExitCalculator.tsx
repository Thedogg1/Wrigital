'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import ExitSnapshotForm, { EMPTY_SNAPSHOT_FORM } from '@/components/exit-snapshot/ExitSnapshotForm';
import LandingExitPreview from '@/components/landing/uk/LandingExitPreview';
import LeadCaptureModal from '@/features/lead-capture/LeadCaptureModal';
import {
  type SnapshotFormData,
  validateSnapshotInputs,
} from '@/lib/validation/validateSnapshotInputs';
import { calculateUkExitSnapshot } from '@/lib/exit-snapshot/calculateUkExitSnapshot';
import { buildSnapshotContext } from '@/lib/exit-snapshot/buildSnapshotContext';
import { evaluateNarrativeRules } from '@/lib/exit-snapshot/evaluateNarrativeRules';
import { buildSnapshotReport } from '@/lib/exit-snapshot/renderSnapshot';
import type { MatchedNarrativeRule, SnapshotCalculated } from '@/lib/exit-snapshot/types';

function serializeFormState(formState: SnapshotFormData): string {
  return JSON.stringify(formState);
}

export default function LandingExitCalculator() {
  const [formState, setFormState] = useState<SnapshotFormData>(EMPTY_SNAPSHOT_FORM);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [formSnapshotAtGeneration, setFormSnapshotAtGeneration] = useState<string | null>(null);
  const [exitReportHtml, setExitReportHtml] = useState('');
  const [calculated, setCalculated] = useState<SnapshotCalculated | null>(null);
  const [matchedRules, setMatchedRules] = useState<MatchedNarrativeRule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const validation = useMemo(() => validateSnapshotInputs(formState), [formState]);
  const inputsChangedSinceReport = useMemo(() => {
    if (!formSnapshotAtGeneration) return false;
    return serializeFormState(formState) !== formSnapshotAtGeneration;
  }, [formState, formSnapshotAtGeneration]);

  const handleGenerateReport = useCallback(() => {
    if (!validation.isValid) return;
    setGenerateError('');
    setIsGenerating(true);
    try {
      const calc = calculateUkExitSnapshot(formState);
      const context = buildSnapshotContext(formState, calc);
      const rules = evaluateNarrativeRules(context);
      const { fullHtml } = buildSnapshotReport(context, rules);

      setCalculated(calc);
      setMatchedRules(rules);
      setExitReportHtml(fullHtml);
      setFormSnapshotAtGeneration(serializeFormState(formState));
      setReportGenerated(true);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (error) {
      console.error('UK exit calculator error:', error);
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
        <ExitSnapshotForm
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
            <LandingExitPreview
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
        endpoint="/api/uk-lead-capture"
      />
    </>
  );
}
