import { ScrollReveal } from '@/components/marketing/ScrollReveal';

type Step = { title: string; body: string };

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-8">
      {steps.map((step, i) => (
        <ScrollReveal key={step.title} delay={i * 0.08}>
          <li className="flex gap-6">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-[var(--color-text-inverse)]"
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--color-primary)]">
                {step.title}
              </h3>
              <p className="text-[var(--color-text-secondary)]">{step.body}</p>
            </div>
          </li>
        </ScrollReveal>
      ))}
    </ol>
  );
}
