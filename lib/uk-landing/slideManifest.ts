export const UK_LANDING_SLIDES = [
  {
    id: 'slide-01',
    file: 'slide-01-hero.html',
    label: 'Show HNW Business Owners You Understand Their World, and Progress Them Towards Paid Advice',
  },
  {
    id: 'slide-02',
    file: 'slide-02-adviser-notes.html',
    label: 'Start With the Context You Already Have',
  },
  {
    id: 'slide-03',
    file: 'slide-03-approved-fields.html',
    label: 'Your Firm Retains Control',
  },
  {
    id: 'slide-04',
    file: 'slide-04-your-story.html',
    label: "Numbers Show What's There. Context Shows What Matters.",
  },
  {
    id: 'slide-05',
    file: 'slide-05-discussion.html',
    label: 'Turn Analysis Into a Better Discovery Conversation',
  },
  {
    id: 'slide-06',
    file: 'slide-06-workflow.html',
    label: 'Before, During and After Discovery',
  },
  {
    id: 'slide-07',
    file: 'slide-07-controlled.html',
    label: 'Understand What Sits Behind the Output',
  },
  {
    id: 'slide-08',
    file: 'slide-08-closing.html',
    label: "We're Looking for 10 Firms FinPrint Was Built For",
  },
] as const;

export type UkLandingSlideId = (typeof UK_LANDING_SLIDES)[number]['id'];
