import { SITE } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-ink-soft">
        <p>
          Wrigital Ltd, registered in England and Wales, company number{' '}
          {SITE.companyNumber}.
        </p>
        <p>{SITE.registeredAddress}</p>
        <p className="mt-3">
          <a
            className="underline underline-offset-4"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
          <span aria-hidden="true"> / </span>
          <a
            className="underline underline-offset-4"
            href="/RAG_Offer/privacy"
          >
            Privacy
          </a>
        </p>
      </div>
    </footer>
  );
}
