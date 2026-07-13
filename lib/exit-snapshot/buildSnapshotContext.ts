import type { SnapshotFormData } from '@/lib/validation/validateSnapshotInputs';
import type { SnapshotCalculated, SnapshotContext, SnapshotFlags } from './types';
import { buildSnapshotFlags } from './calculateUkExitSnapshot';

export function buildSnapshotContext(
  inputs: SnapshotFormData,
  calculated: SnapshotCalculated,
): SnapshotContext {
  const flags: SnapshotFlags = buildSnapshotFlags(inputs, calculated);
  return { inputs, calculated, flags };
}
