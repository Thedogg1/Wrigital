/**
 * Funnel copy — transcribed verbatim from wrigital-funnel-copy-v4.md.
 * Bold is carried as ** and rendered by Prose / formatInline.
 */

export const CHECK_HERO = {
  h1: 'Generic AI asks your firm to accept its standards. I build to yours.',
  sub: 'Verified AI systems for UK FCA-regulated advice firms. Every claim carries a citation, every citation is checked, and every source opens when you click it.',
} as const;

export const CHECK_FORM = {
  lead: "**Start with your own website.** Enter your firm's address. I read your public pages, find every allowance and threshold quoted in the copy, and compare each one against the current published value. Under a minute, nothing to install.",
  button: 'Check my site',
  small: 'Free. No account. The findings appear on screen.',
  label: "Your firm's website address",
  placeholder: 'yourfirm.co.uk',
} as const;

export const CHECK_WHO = {
  caption: 'Terry Martin, Wrigital Ltd, Nottingham.',
  p1: 'Among other well known companies, I spent 3 years working for Nat West Group Audit. I developed and provided second line support for the system the auditors used to collect and analyze audit findings. Everything had to be traceable, but their biggest fear was silent errors. This experience taught me to build with the assumption that my work will be scrutinized, because in regulated companies, it always will be.',
  p2: 'I now build AI systems for FCA-regulated advice firms.',
} as const;

export const CHECK_BOUNDARY = {
  p1: "I'm not your compliance officer and I won't pretend to be. Your compliance function sets the standard, and that is exactly as it should be. My job is to build to that standard, and to make sure the system can evidence that it has.",
  p2: "That's the same discipline I learned building for auditors. You don't argue that your work is correct. You make your work inspectable, and let someone check.",
} as const;

export const CHECK_2026 = {
  h2: 'Why this is worse than it looks in 2026',
  p1_before: 'The Capital Gains Tax annual exempt amount was ',
  p1_mid1: '. The allowance was ',
  p1_mid2: '. The dividend allowance went from ',
  p1_mid3: ' across the same period. The pension annual allowance rose from ',
  p1_after: ' in 2023/24.',
  mark1: '£12,300 in 2022/23',
  mark2: 'cut to £6,000, then to £3,000',
  mark3: '£2,000 to £1,000 to £500',
  mark4: '£40,000 to £60,000',
  p2: "**Anything stale has been stale for years.** These aren't April 2026 changes. A page still quoting £6,000 has been publicly wrong through two or three tax years.",
  p3: '**This April gave you no warning.** None of the main personal allowances moved in April 2026. The dividend rate change was the only thing most firms had to touch. A firm that updated its dividend rates and found nothing else to change concluded the site was current. The 2023 and 2024 cuts were never caught, because the review that would have caught them was looking at the wrong year.',
  p4: '**Your prospects check now.** They paste adviser websites into chatbots and ask them questions. A wrong allowance on a public page is no longer something a visitor has to notice for themselves.',
} as const;

export const CHECK_SCOPE = {
  body: "This checks whether published figures are current. The check doesn't assess compliance, suitability or financial promotion rules, and doesn't replace anyone's review. Your firm remains responsible for its own content. If the check finds nothing, that's a good result and cost you nothing to have confirmed.",
} as const;

export const CHECK_CAPTURE_FINDINGS = {
  h3: 'The full record, dated, plus a re-check after the Budget.',
  p1: 'The findings above are free. The email delivers the record: every page read, every figure found, each shown against the current published value with the source link that confirms the value. On a forty page site that is a line of findings and thirty-nine pages of confirmation.',
  p2: "Leave your address and the check runs again after the autumn Budget, with the results emailed. What you see above is true today. The email is the only way to be told when today's answer stops being true.",
} as const;

export const CHECK_CAPTURE_CLEAN = {
  h3: 'Nothing stale. Every figure on your site matches the current published value.',
  p1: 'That is the result you wanted, and the result hardest to prove. The email delivers the proof: every page read, every figure found, each shown against the current published value with the source link that confirms the value. Dated, so you know when the check was run.',
  p2: "A clean site stays clean only until something moves. Leave your address and the check runs again after the autumn Budget, with the results emailed. Today's answer is the answer you have. The email is the only way to be told when today's answer stops being true.",
} as const;

export const CHECK_CAPTURE_SHARED = {
  budgetLabel: 'Re-check my site after the autumn Budget.',
  button: 'Email me the record',
  consent:
    'I will email the record and may follow up once about this check. No list, no newsletter. See the privacy notice.',
} as const;

export const CHECK_FORWARD = {
  heading: 'That check took under a minute.',
  body: [
    'The Verified assistant works in a similar way. Fetch the page, check the page exists, check the page says what the claim says, drop the source if not.',
  ],
  label: 'How I stop hallucinations →',
} as const;

export const THANK_YOU = {
  h1Prefix: 'On its way to ',
  h1Fallback: 'your inbox',
  p1Prefix: 'The full record of the check on ',
  p1:
    '. Every page has been read and every figure has been found. Each number has been compared with the current published value on the page that the link leads to.',
  p2: "The report should arrive within a couple of minutes. If not, check your junk folder before assuming it's lost.",
  forward: {
    heading: "While that's landing",
    body: [
      'Stopping hallucinations takes five layers. The check you just ran is the fourth, and the only layer visible from outside the system.',
      'The next page sets out all five, and shows why every one of them is already finished before an adviser asks anything.',
    ],
    label: 'How I stop hallucinations →',
  },
} as const;

export const LAYERS_PAGE = {
  h1: 'How I stop hallucinations',
  intro: [
    'Defence in depth. Five independent layers, each catching what the previous layer missed.',
    'Every one of them runs before your firm asks a single question. By the time an adviser sits down, nothing is left to catch.',
  ],
  layers: [
    {
      lead: 'The research cannot choose its own sources.',
      body: 'The research runs against a fixed, approved list of links, decided in advance and signed off before the system goes live. A generic chatbot searches the open web and decides for itself what looks authoritative. This system has no such freedom. If a source is not on the list, the source does not exist.',
    },
    {
      lead: 'The research tool is given rules narrow enough to stop it inventing links.',
      body: 'Research tools fabricate sources. Not occasionally, routinely. A plausible-looking URL that has never existed is one of the most common failures in the whole field. Every research request carries a rule set written specifically to prevent that, and the rules are identical on the first request and the ten thousandth.',
    },
    {
      lead: 'The research is done in separate, narrow passes.',
      body: 'Not a single sweeping request gathering everything at once. Each pass answers a narrow question against its own inputs. Narrow questions are far harder to answer wrongly than broad ones, and because none of this happens while an adviser waits, the work can take as long as accuracy needs.',
    },
    {
      lead: 'Every source is fetched and checked.',
      body: 'The page has to exist. The content has to score above a relevance threshold against the claim the page is meant to support. Below the threshold, the source is dropped. This runs in code, not by an AI deciding whether something looks about right. You have seen this layer working. The check you ran on your own website is this layer, pointed at your public pages instead.',
    },
    {
      lead: 'Anything without a citation is deleted before the library is built.',
      body: 'The last step before handover. Every block with no verified citation attached is removed. Not flagged. Not warned about. Removed.',
    },
  ],
  afterHeading: 'Then the library is built',
  after: [
    'What reaches your advisers is what survived all five. The assistant does none of this work and makes no judgement about whether a source is sound, because every one of those judgements was already made, in advance, and can be inspected.',
    'Two things follow from that. Answers come back fast, because nothing is being checked while an adviser waits. And the assistant has one job left: presenting options and their trade-offs, so the expert makes the decision. Verification is not competing for attention with judgement.',
    'When a question falls outside the library, the assistant does not guess and does not quietly do its best. It stops and asks you: do you want an inferred answer, clearly marked as unsupported, or do you want to attach grounding material of your own so the answer can be sourced properly?',
  ],
  forward: {
    heading: '4 minute demonstration',
    body: [
      'A real question going in. Citations that open when you click them, and the numbers brief showing where every figure came from.',
    ],
    label: 'Watch it working →',
  },
} as const;

export const VIDEO_PAGE = {
  h1: 'The Verified Assistant in four minutes',
  sub: 'A real question going in. Clickable citations, the numbers brief, and the audit reports showing where every figure and information block came from.',
  runtime: 'four minutes',
  numbersBrief:
    'The numbers brief is a separate build. This offer is grounded answers with verified citations.',
  whatVideoDoesntShow:
    "**What the video doesn't show.** Ask anything that could shape a recommendation and the assistant returns labelled options with the trade-offs, never a single answer. You cannot proceed until you have recorded why you chose what you chose, and any variations you are making. That part needs an adviser sitting in front of it, so a demonstration would be me pretending to be something I'm not.",
  forward: {
    heading: 'What that costs, and what comes with it',
    body: [] as string[],
    label: "See what's included →",
  },
} as const;

export const FEATURES_PAGE = {
  h1: 'The Verified Assistant',
  h2: 'Founding Firms Programme',
  italic: 'Every citation checked. Every link real.',
  audience:
    "For UK FCA-regulated advice firms with 1 to 10 advisers whose clients have started turning up with AI, and who have tested a chatbot themselves and concluded the tool can't go anywhere near a client.",
  core: [
    'Your clients are already using AI. On you.',
    'Telling them the tools make things up loses more credibility with every passing month.',
    "The answer isn't to argue with their AI, and isn't a chatbot with better answers. Their AI is good at the part of your work clients can see. Your value is in the part they cannot.",
    "Your client's AI gives them a conclusion. Yours shows what went into a conclusion: what was checked, what was weighed, what was rejected, and why. Every source opens when you click.",
    'Their AI produces answers. Yours makes your judgement visible.',
  ],
  includedHeading: "What's included",
  included: [
    {
      term: 'Design and build.',
      detail:
        'We agree your niche collections, your own material and the grounding rules up front. Live on your intranet two working days after sign-off.',
    },
    {
      term: 'A defined library, in three layers, built for the firm rather than per adviser.',
      detail:
        'Eight universal collections built from HMRC, FCA and gov.uk, curated and verified once and deployed into your tenant. Five niche collections chosen for the specialisms your firm covers, so a pensions specialist asked an IHT question still receives a grounded answer. And your own firm documentation as a separate labelled tier: house positions, advice process, panel. No client records, so no per-user permissions to build. An adviser can always see whether a claim came from the regulator or from your files. That last layer is the layer no competitor tool can ever have.',
    },
    {
      term: 'Verified citations on every factual claim.',
      detail:
        'Every candidate source is checked automatically before entering your index: the page must exist, and must score above a relevance threshold against the claim the page supports. Done in code, not by an AI deciding whether something looks right.',
    },
    {
      term: `"I can't ground that" instead of a confident guess.`,
      detail:
        'The system fails loudly rather than degrading politely in the dark. Everything outside the library is out of scope by design.',
    },
    {
      term: "The system won't tell you what to advise.",
      detail:
        'Ask anything that could shape a recommendation, a drawdown route, a wrapper, a strategy, and you receive two to four labelled options with the trade-offs, who each suits, and what you\'d need to know about the client before choosing. Never a single "do this." Facts stay instant: a statutory allowance, a figure from the client brief, single answer, cited. The friction sits only where the judgement sits.',
    },
    {
      term: 'Every session ends as a file.',
      detail:
        'You cannot simply accept an option. First you record your rationale: why you chose what you chose, and any variations you are making to the advice. The final output then saves as a single HTML file, with the information audit and citations you can click. Send the file to your compliance officer as is, nothing to export, nothing written up afterwards from memory.',
    },
    {
      term: 'Built to your firm, not to my defaults.',
      detail:
        "This is a bespoke build, not a licence. The chat window, the grounding rules and how the assistant behaves are configured to your workflow, and to your compliance officer's instructions, at setup. Small changes afterwards are part of the service, not a change request.",
    },
    {
      term: 'Rebuilt, not patched.',
      detail:
        'Every quarter the index is deleted, rebuilt from source, and every citation re-verified from scratch.',
    },
    {
      term: 'A source audit report as standard.',
      detail:
        'What your assistant is allowed to read. Never sold as a premium. Charging for an audit trail would contradict the entire argument for having one.',
    },
    {
      term: 'You steer what goes in.',
      detail:
        'Send links to anything you want included and the material lands in the next build. Once a year we revisit the design properly.',
    },
    {
      term: 'Runs in your tenant, on your intranet.',
      detail:
        'Your questions never leave your environment. Azure costs at cost on your own subscription, with a spend cap set at setup. No standing access for me. Scoped, granted by you, revocable by you.',
    },
    {
      term: 'Support 11:00 to 16:00, Monday to Friday,',
      detail: 'on a shared Slack channel with a named responder.',
    },
  ],
  foundingHeading: 'Included with a founding place',
  founding: {
    p1: '**Continuous figure monitoring on your public website.** The check you ran to get here, run every month, automatically, for as long as you stay. A dated record each time showing every figure found and the published value each was compared against, and an alert the moment something you publish falls behind a change you didn\'t notice.',
    p2: 'Founding firms only. Never sold separately.',
  },
  priceHeading: 'Price',
  priceLead: '£1,200 setup, then £250 a month.',
  priceTerms:
    'Six-month term, monthly rolling after that. Founding firms keep their rate for as long as they stay.',
  priceAzure:
    'Azure running costs sit on your own subscription at cost, with a spend cap set at setup. No usage caps, no marked-up infrastructure, no surprise invoices.',
  priceExample:
    'A typical firm charging 0.5% to 1% ongoing earns £2,500 to £5,000 a year from a single £500,000 client. Retaining one fee-challenged client pays for this several times over.',
  excludedHeading: "What I won't sell you",
  excluded: [
    {
      term: 'No chatbot between you and your clients.',
      detail:
        'AI belongs behind the adviser, never between the adviser and the prospect.',
    },
    {
      term: 'Number checking is a separate build.',
      detail:
        'This offer is grounded answers with verified, clickable citations. Arithmetic auditing, where every figure in an answer is traced and checked, is real and I build it, but sits outside this price. Ask on the call and I\'ll quote honestly.',
    },
    {
      term: "No promises about when you'll hit your business objectives.",
      detail:
        'I build the capability and measure what the capability touches. The objective is yours, and we calculate the timeline together from your own numbers.',
    },
    {
      term: "Anything outside what I've built",
      detail: 'is quoted honestly as custom work, or referred elsewhere.',
    },
  ],
  cohortHeading: 'Why the cohort is three firms',
  cohort: [
    "Every library is built and verified end to end before going live, and the verification pass is slow by design. Every candidate source fetched and scored. That's the constraint, and that same constraint makes the citations worth anything.",
    'The opening cohort is three firms. Cohorts start monthly after that.',
    "The FCA's good and poor practice report on AI lands later this year. A firm starting now meets the report with a documented, evidenced position. A firm starting two intakes later meets the report with nothing on paper.",
  ],
  close: [
    'No five-figure first decision. No lock-in beyond the six-month term. And a system your compliance officer can inspect.',
    "If the citations don't stand up, don't sign.",
  ],
  forward: {
    heading: "Don't take the citations on trust",
    body: [
      'Eleven questions about how answers reach your clients today. Four minutes, and you will see where your firm currently accepts an answer nobody has checked.',
    ],
    label: 'Check the verified answers →',
  },
} as const;

export const VERIFIED_PAGE = {
  nod: [
    "You've tested the tools yourself. Evenings, weekends, a made-up client scenario. Genuinely impressive. And every session ends the same way: brilliant, but not client-ready.",
    'So you asked compliance. And you got back either "best to be cautious for now" or a policy document saying be careful with client data, which you already knew. So you\'re waiting for the FCA report to make things clearer.',
  ],
  whyNotHeading: 'Neither of those can ever produce a yes',
  whyNot: [
    'The testing can\'t, because you were evaluating a consumer product for properties the product architecturally cannot have. No amount of clever prompting makes a generic chatbot show its arithmetic, verify its sources, or leave an audit trail. Those aren\'t settings that were left off. They\'re absent by design.',
    'Worse, the loop teaches the wrong lesson. Each session reinforces "AI can\'t be used in regulated work," when the true statement is "this product class can\'t."',
    'And the compliance question can\'t produce a yes either, because "can we use AI?" has no answer. "Here is a specific system, with this data, producing this evidence, does that meet your requirements?" does.',
    'On the waiting: the FCA has already clarified its position. No new AI-specific rules. Existing frameworks apply. Which means the accountability exists today, and the upcoming report will illustrate practice rather than create obligations.',
  ],
  gapHeading: 'Nobody has ever written down what your AI would have to do',
  gap: [
    "Somewhere in your firm, on paper, or in your compliance officer's head, there's an answer to this question: what would we need to see before AI was client-ready?",
    'Which numbers must be checkable. Which claims must carry a source. What the system must do when the answer isn\'t known. What evidence must exist afterwards.',
    "That answer has never been turned into build requirements. Not by your compliance consultant, not by any vendor, not by you. And that isn't negligence. The translation requires someone fluent in both your obligations and software engineering, and that person doesn't exist in your world.",
    'Untranslated requirements can\'t be built to, and they can\'t be tested against. So the firm fails generic tools individually and concludes "we can\'t use AI," when the true statement is **"nothing has ever been built to our requirements."**',
    "That's the job. You set the bar; I'm the developer who builds to it. I did that for a bank's auditors. I'll do that for your compliance officer.",
  ],
  wizardIntroHeading: 'Meanwhile, how many unverified answers left your firm last month?',
  wizardIntro: [
    'Not hypothetically. Your people are already using AI on regulated subjects, and a proportion of what comes back cannot be tied to an approved source. Nobody has counted, because no tool in your firm counts.',
    'Eleven questions and the estimate appears on screen, with the arithmetic shown in full so you can check the working rather than take the figure on trust.',
    'Nothing to install, no account, and your answers stay in your browser.',
  ],
  startButton: 'Start the count',
  startSmall: 'Eleven questions, about four minutes.',
  resultHeadingSuffix: ' unverified answers a month',
  resultBody:
    'Each of these reached somebody without a source behind it. Not because your people are careless, but because nothing in your firm was built to check.',
  reportHeading: "The report the screen can't show you",
  reportLead: 'Leave your address and the full report arrives by email. Four things beyond the figure above:',
  reportBullets: [
    'A paragraph on AI use written from your own figures, ready to put in front of your PI broker',
    'Three questions to ask your compliance officer, in priority order, each with what a good answer sounds like',
    'What to do without hiring anybody, in named steps',
    'The ICO and FCA reading that actually applies, linked',
  ],
  reportButton: 'Email me the report',
  reportSmall: 'No follow-up sequence. The report, and nothing else.',
  reportConfirm:
    "On its way. Check your junk folder if it hasn't arrived in a couple of minutes.",
  forward: {
    heading: 'Then the part that needs a developer',
    body: [
      'The report tells you what to ask and what to fix. Turning your firm\'s answers into something buildable is the next step, and is the part that has never been done for your firm.',
      'Thirty minutes on a call, and within two working days you receive your requirements written as a technical specification. Yours to keep, whether you build with me or not.',
    ],
    label: 'Book a call →',
  },
} as const;

export const BOOK_PAGE = {
  h1: 'Thirty minutes to define your AI compliance blueprint',
  intro: [
    "You tell me what your compliance officer would need to see before an AI system is client-ready in your firm: which numbers must be checkable, which claims must carry a source, what the system must do when the answer isn't known, and what evidence must exist afterwards.",
    'Within two working days you receive that written as a technical specification. Yours to keep, whether you build with me or not.',
    'Bring your compliance officer. The whole thing is built for them.',
  ],
  offerHeading: "What you'd be starting",
  priceLead: '£1,200 setup, then £250 a month.',
  priceTerms:
    'Six-month term, monthly rolling after that. Founding firms keep their rate for as long as they stay.',
  bullets: [
    'Design and build against your requirements. Live on your intranet two working days after sign-off.',
    'A three-layer library: universal collections, niche collections for your specialisms, and your own firm documentation as a separate labelled tier. House positions, advice process, panel. No client records, so no per-user permissions to build.',
    'Five layers of hallucination defence, with every citation checked in code before display.',
    `"I can't ground that" instead of a confident guess.`,
    'Options and trade-offs, never a recommendation.',
    'You record your rationale before accepting, and the session saves as a single HTML file with clickable citations.',
    'Quarterly rebuild from source, every citation re-verified.',
    'Configured to your workflow and your compliance instructions. Small changes included.',
    'Continuous monthly monitoring of your public website figures, founding firms only.',
    'Runs in your tenant, on your intranet. Azure at cost on your own subscription.',
    'Support 11:00 to 16:00 weekdays, shared Slack channel, named responder.',
  ],
  numberChecking:
    "Number checking is a separate build and sits outside this price. Ask on the call and I'll quote honestly.",
} as const;

export const PRIVACY = {
  h2: 'Privacy notice',
  paragraphs: [
    'Wrigital Ltd, company number 16967085, is the data controller for this site.',
    '**What this site collects.** A website address you enter into the figure check, the answers you give the counting tool, and an email address if you ask for a record or a report. Nothing else is requested.',
    '**Why.** The website address is used to read your public pages and compare the figures published there against current published values. Your answers to the counting tool are used to produce your estimate and your report. An email address is used to send you what you asked for, and may be used once to follow up. If you ask for a re-check after the autumn Budget, your address and domain are kept until you tell me to stop. The lawful basis is legitimate interest in responding to a request you made.',
    '**How long.** Check results and counting results are stored for 24 hours and then deleted automatically. Email addresses are held in the email sending account for as long as needed to answer a follow up, and are deleted on request.',
    '**Who else sees this.** Vercel hosts the site. Upstash stores results for 24 hours. Resend delivers email. Calendly handles bookings if you book a call. Each acts under contract and none receives your data for their own marketing.',
    '**Analytics.** Vercel Analytics records page views and a small number of anonymous events. No cookies are set for analytics and no visitor is identified.',
    '**The figure check reads public pages only.** Nothing behind a login is read, and nothing is stored beyond the 24 hour window.',
    "**Your rights.** You can ask for a copy of what is held, ask for correction, or ask for deletion. Email hello@wrigital.com and you will have a reply within five working days. You can complain to the Information Commissioner's Office at ico.org.uk.",
    'Last updated 1 August 2026.',
  ],
} as const;

/** Source mark URLs for the 2026 section (spec §7.3). */
export const SOURCE_MARKS = [
  {
    n: 1,
    href: 'https://www.gov.uk/capital-gains-tax/allowances',
    text: CHECK_2026.mark1,
  },
  {
    n: 2,
    href: 'https://www.gov.uk/government/publications/reducing-the-annual-exempt-amount-for-capital-gains-tax',
    text: CHECK_2026.mark2,
  },
  {
    n: 3,
    href: 'https://www.gov.uk/tax-on-dividends',
    text: CHECK_2026.mark3,
  },
  {
    n: 4,
    href: 'https://www.gov.uk/tax-on-your-private-pension/annual-allowance',
    text: CHECK_2026.mark4,
  },
] as const;
