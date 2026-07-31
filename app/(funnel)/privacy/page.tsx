import type { Metadata } from 'next';
import { Section } from '@/components/funnel/Section';
import { Prose } from '@/components/funnel/Prose';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description:
    'How Wrigital Ltd collects and uses website addresses and email addresses from the figure check.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Wrigital',
  },
};

export default function PrivacyPage() {
  return (
    <Section label="Privacy">
      <Prose>
        <h1 className="text-display-lg">Privacy notice</h1>
        <p>
          Wrigital Ltd, company number 16967085, is the data controller for this
          site.
        </p>
        <p>
          <strong>What this site collects.</strong> Two things. A website
          address you enter into the figure check, and an email address if you
          ask for the record of that check. Nothing else is requested.
        </p>
        <p>
          <strong>Why.</strong> The website address is used to read your public
          pages and compare the figures published there against current published
          values. The email address is used to send you the record, and may be
          used once to follow up about the check. The lawful basis is legitimate
          interest in responding to a request you made.
        </p>
        <p>
          <strong>How long.</strong> Check results are stored for 24 hours and
          then deleted automatically. Email addresses are held in the email
          sending account for as long as needed to answer a follow up, and are
          deleted on request.
        </p>
        <p>
          <strong>Who else sees this.</strong> Vercel hosts the site. Upstash
          stores check results for 24 hours. Resend delivers email. Calendly
          handles bookings if you book a call. Each acts under contract and none
          receives your data for their own marketing.
        </p>
        <p>
          <strong>Analytics.</strong> Vercel Analytics records page views and a
          small number of anonymous events. No cookies are set for analytics and
          no visitor is identified.
        </p>
        <p>
          <strong>The figure check reads public pages only.</strong> Pages that
          are publicly published on the address you enter. Nothing behind a login
          is read, and nothing is stored beyond the 24 hour window.
        </p>
        <p>
          <strong>Your rights.</strong> You can ask for a copy of what is held,
          ask for correction, or ask for deletion. Email hello@wrigital.com and
          you will have a reply within five working days. You can complain to the
          Information Commissioner&apos;s Office at ico.org.uk.
        </p>
        <p>Last updated 31 July 2026.</p>
      </Prose>
    </Section>
  );
}
