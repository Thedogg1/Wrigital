'use client';

export type CalculatorResultsTab = 'summary' | 'methodology';

interface CalculatorResultsTabsProps {
  activeTab: CalculatorResultsTab;
  onTabChange: (tab: CalculatorResultsTab) => void;
}

const TABS: { id: CalculatorResultsTab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'methodology', label: 'Inputs & Formulas' },
];

export default function CalculatorResultsTabs({
  activeTab,
  onTabChange,
}: CalculatorResultsTabsProps) {
  return (
    <div
      className='flex gap-1 mb-6 border-b border-[var(--color-border-subtle)]'
      role='tablist'
      aria-label='Calculator results'
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type='button'
          role='tab'
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === tab.id
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
