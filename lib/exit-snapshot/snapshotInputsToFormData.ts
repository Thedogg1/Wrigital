import type { SnapshotFormData } from '@/lib/validation/validateSnapshotInputs';

/** Maps snapshot form fields to validation-compatible structure. */
export function snapshotInputsToFormData(inputs: SnapshotFormData): SnapshotFormData {
  return { ...inputs };
}

export { type SnapshotFormData } from '@/lib/validation/validateSnapshotInputs';
