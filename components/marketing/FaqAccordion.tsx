'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { CtaLink } from '@/components/marketing/shared';

type FaqItem = { q: string; a: React.ReactNode };

export function FaqAccordion({
  items,
  footerLink,
}: {
  items: FaqItem[];
  footerLink?: CtaLink;
}) {
  return (
    <div>
      <Accordion className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={item.q} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-lg font-medium text-[var(--color-primary)]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-[var(--color-text-secondary)]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {footerLink && (
        <p className="mt-8">
          <Link
            href={footerLink.href}
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {footerLink.label}
          </Link>
        </p>
      )}
    </div>
  );
}
