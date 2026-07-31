export type Verdict = 'current' | 'behind' | 'unconfirmed';

export interface Finding {
  id: string;
  label: string;
  quotedValue: string;
  publishedValue: string;
  taxYear: string;
  pageUrl: string;
  pageTitle: string;
  sourceUrl: string;
  sourceHost: string;
  verdict: Verdict;
}

export interface CheckResult {
  checkId: string;
  domain: string;
  startedAt: string;
  finishedAt: string;
  pagesScanned: number;
  pagesConfirmedClean: { url: string; title: string }[];
  figuresFound: number;
  behindCount: number;
  findings: Finding[];
}

export type CheckErrorCode =
  | 'invalid_domain'
  | 'unreachable'
  | 'blocked'
  | 'no_pages'
  | 'rate_limited'
  | 'server_error';

export const CHECK_ERROR_MESSAGES: Record<CheckErrorCode, string> = {
  invalid_domain:
    "That address doesn't look right. Try the form yourfirm.co.uk",
  unreachable:
    'Nothing responded at that address. Check the spelling and run the check again.',
  blocked:
    'That site blocks automated readers, so the check cannot run. Email hello@wrigital.com and I will run the check by hand.',
  no_pages: 'No public pages could be read at that address.',
  rate_limited:
    "That's several checks from this connection. Try again in an hour, or book a call and I will run the check with you.",
  server_error:
    'The check failed partway through. Run the check again, and if the failure repeats, email hello@wrigital.com',
};
