'use client';

import { CheckForm } from './CheckForm';
import { useFigureCheck } from './FigureCheckProvider';

export function FigureCheck({ variant }: { variant: 'hero' | 'inline' }) {
  const { status } = useFigureCheck();

  if (variant === 'inline' && status === 'done') {
    return null;
  }

  return <CheckForm variant={variant} />;
}

export { FigureCheckProvider } from './FigureCheckProvider';
export { CheckResult } from './CheckResult';
