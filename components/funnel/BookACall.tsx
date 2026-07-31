'use client';

import { SITE } from '@/lib/site';
import { track } from '@/lib/analytics';

export function BookACall({
  variant = 'standing',
  placement,
}: {
  variant?: 'standing' | 'compliance';
  placement: string;
}) {
  const heading =
    variant === 'compliance'
      ? 'Bring your compliance officer'
      : 'Thirty minutes to define your AI compliance blueprint';

  return (
    <section className="border-t border-rule bg-card">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
        <div className="max-w-[68ch] rounded border border-rule bg-paper p-7 lg:p-9">
          <h2 className="text-display-md">{heading}</h2>
          {variant === 'compliance' ? (
            <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.7]">
              <p>
                Thirty minutes to define your AI compliance blueprint. You tell
                me what your compliance officer would need to see before an AI
                system is client-ready in your firm: which numbers must be
                checkable, which claims must carry a source, what the system
                must do when the answer isn&apos;t known, and what evidence must
                exist afterwards.
              </p>
              <p>
                Within two working days you receive that written as a technical
                specification. Yours to keep, whether you build with me or not.
              </p>
              <p>
                Most vendors would rather your compliance officer saw the end
                result. I&apos;d rather they wrote the specification.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.7]">
              <p>
                A structured call with a fixed agenda. You tell me what your
                compliance officer would need to see before an AI system is
                client-ready in your firm: which numbers must be checkable,
                which claims must carry a source, what the system must do when
                the answer isn&apos;t known, and what evidence must exist
                afterwards.
              </p>
              <p>
                Within two working days you receive that written as a technical
                specification. Yours to keep, whether you build with me or not.
              </p>
              <p>
                Invite your compliance officer along if you can. The whole thing
                is built for them.
              </p>
            </div>
          )}
          <a
            href={SITE.calendly}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('calendly_clicked', { placement, variant })}
            className="mt-7 inline-flex items-center rounded bg-source px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}
