'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import { track } from '@/lib/analytics';

export function CalendlyEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!ref.current || load) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          track('calendly_viewed', {});
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    if (!load) return;
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(l);

    const h = (e: MessageEvent) => {
      if (
        typeof e.origin === 'string' &&
        e.origin.includes('calendly.com') &&
        e.data?.event === 'calendly.event_scheduled'
      ) {
        track('calendly_booked', {});
      }
    };
    window.addEventListener('message', h);
    return () => window.removeEventListener('message', h);
  }, [load]);

  return (
    <div ref={ref} className="mx-auto max-w-4xl px-5 pb-20">
      {load ? (
        <div
          className="calendly-inline-widget rounded border border-rule bg-card"
          data-url={`${SITE.calendly}?hide_gdpr_banner=1&background_color=faf7f0&text_color=0a2342&primary_color=0a2342`}
          style={{ minWidth: 320, height: 760 }}
        />
      ) : (
        <div
          className="h-[760px] rounded border border-rule bg-card"
          aria-hidden="true"
        />
      )}
      <noscript>
        <a href={SITE.calendly} className="underline">
          Book a call
        </a>
      </noscript>
    </div>
  );
}
