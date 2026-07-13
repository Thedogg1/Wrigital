import React from 'react';

type CalloutBoxProps = {
  type?: 'regulatory' | 'risk' | 'tip' | 'info';
  children: React.ReactNode;
};

export function CalloutBox({ type = 'info', children }: CalloutBoxProps) {
  const styles = {
    regulatory: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-[var(--color-primary)]',
      label: 'Regulatory Context',
      labelColor: 'text-[var(--color-primary)]',
    },
    risk: {
      bg: 'bg-orange-50',
      border: 'border-l-4 border-[var(--color-warning)]',
      label: 'Risk Note',
      labelColor: 'text-[var(--color-warning)]',
    },
    tip: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-[var(--color-success)]',
      label: 'Implementation Tip',
      labelColor: 'text-[var(--color-success)]',
    },
    info: {
      bg: 'bg-gray-50',
      border: 'border-l-4 border-[var(--color-info)]',
      label: 'Note',
      labelColor: 'text-[var(--color-info)]',
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.border} p-6 my-8 rounded-r-lg`}>
      <div className={`text-sm font-semibold ${style.labelColor} mb-2`}>
        {style.label}
      </div>
      <div className='text-[var(--color-text-primary)]'>
        {children}
      </div>
    </div>
  );
}
