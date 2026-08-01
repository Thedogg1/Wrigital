export type FigureUnit = 'gbp' | 'percent';

export type FigureEntry = {
  id: string;
  label: string;
  unit: FigureUnit;
  currentValue: number;
  effectiveFrom: string; // ISO date
  sourceUrl: string;
  sourceLabel: string;
  keywords: string[]; // matched case-insensitively
  priorValues: { value: number; taxYear: string }[];
  verified: boolean;
};

export type Classification = 'CURRENT' | 'STALE' | 'CHECK';

export type Finding = {
  pageUrl: string;
  pageTitle: string;
  sentence: string;
  numberFound: number;
  figureId: string;
  figureLabel: string;
  currentValue: number;
  matchedKeyword: string;
  matchLocation: 'sentence' | 'heading';
  classification: Classification;
  staleTaxYear?: string; // set when classification is STALE
  historicContext: boolean;
  sourceUrl: string;
  sourceLabel: string;
  /** Surrounding element HTML for review tooling (not emailed). */
  surroundingHtml?: string;
};

export type RejectedDetection = {
  pageUrl: string;
  numberFound: number;
  sentence: string;
  reason: string;
};

export type PagesSkipped = { url: string; reason: string };

export type PageRead = {
  url: string;
  title: string;
  figuresFound: number;
};

export type ScanResult = {
  scanId: string;
  domain: string;
  pagesScanned: number;
  pagesSkipped: PagesSkipped[];
  truncated: boolean;
  counts: {
    figuresFound: number;
    current: number;
    stale: number;
    check: number;
  };
  findings: Finding[];
  pagesRead: PageRead[];
  rejected: RejectedDetection[];
  scannedAt: string;
};

export type DetectedNumber = {
  value: number;
  raw: string;
  unit: FigureUnit;
  sentence: string;
  /** True containing sentence used for keyword association (no ±120 padding). */
  associationSentence: string;
  headingContext: string;
  matchLocation: 'sentence' | 'heading';
  matchedKeyword?: string;
  figureId?: string;
  surroundingHtml: string;
  inTable: boolean;
};
