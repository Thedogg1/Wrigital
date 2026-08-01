# Wrigital Funnel — Approved Copy v4

Seven pages in a chain. One forward CTA per page. Objective: a booked call.

The tab bar and the footer Calendly link are the only other exits. Nothing jumps the queue.

No em dashes anywhere in rendered output.

## The chain

| # | Route | Job | Forward CTA to |
|---|---|---|---|
| 1 | `/website-figure-check` | Lead magnet. Capture the email. | 2 |
| 2 | `/thank-you` | Confirm, then hand off. | 3 |
| 3 | `/how-i-stop-hallucinations` | Prove the method. | 4 |
| 4 | `/see-it-working` | The four minute video. | 5 |
| 5 | `/features` | What you get. | 6 |
| 6 | `/verified-answers` | Count their own unverified answers. | 7 |
| 7 | `/book-a-call` | The full stack, then the booking. | Calendly |

## Tab bar

Six tabs, on every page.

| Label | Route |
|---|---|
| Check your site | `/website-figure-check` |
| No hallucinations | `/how-i-stop-hallucinations` |
| The assistant | `/see-it-working` |
| What's included | `/features` |
| Count your answers | `/verified-answers` |
| **Book a call** | `/book-a-call` |

Book a call is filled and accent coloured, pinned right, never scrolls out of view.
`/thank-you` is the only page showing no active tab.

---

# 1. `/website-figure-check`

The check already exists at `app/website-figure-check` and is integrated, never rebuilt.

## Hero

> # Generic AI asks your firm to accept its standards. I build to yours.
>
> Verified AI systems for UK FCA-regulated advice firms. Every claim carries a citation, every citation is checked, and every source opens when you click it.

## The check

Above the fold. No scrolling required.

> **Start with your own website.** Enter your firm's address. I read your public pages, find every allowance and threshold quoted in the copy, and compare each one against the current published value. Under a minute, nothing to install.

**[ website input field ] [ Check my site ]**

Small, beneath the field: *Free. No account. The findings appear on screen.*

## Who I am

Photograph at `public/images/terry-martin-founder.jpg`. Caption: **Terry Martin, Wrigital Ltd, Nottingham.**

> Among other well known companies, I spent 3 years working for Nat West Group Audit. I developed and provided second line support for the system the auditors used to collect and analyze audit findings. Everything had to be traceable, but their biggest fear was silent errors. This experience taught me to build with the assumption that my work will be scrutinized, because in regulated companies, it always will be.
>
> I now build AI systems for FCA-regulated advice firms.

## The boundary

> I'm not your compliance officer and I won't pretend to be. Your compliance function sets the standard, and that is exactly as it should be. My job is to build to that standard, and to make sure the system can evidence that it has.
>
> That's the same discipline I learned building for auditors. You don't argue that your work is correct. You make your work inspectable, and let someone check.

## Why this is worse than it looks in 2026

> The Capital Gains Tax annual exempt amount was £12,300 in 2022/23. The allowance was cut to £6,000, then to £3,000. The dividend allowance went from £2,000 to £1,000 to £500 across the same period. The pension annual allowance rose from £40,000 to £60,000 in 2023/24.
>
> **Anything stale has been stale for years.** These aren't April 2026 changes. A page still quoting £6,000 has been publicly wrong through two or three tax years.
>
> **This April gave you no warning.** None of the main personal allowances moved in April 2026. The dividend rate change was the only thing most firms had to touch. A firm that updated its dividend rates and found nothing else to change concluded the site was current. The 2023 and 2024 cuts were never caught, because the review that would have caught them was looking at the wrong year.
>
> **Your prospects check now.** They paste adviser websites into chatbots and ask them questions. A wrong allowance on a public page is no longer something a visitor has to notice for themselves.

Repeat the input field and button here.

## What the check is not

> This checks whether published figures are current. The check doesn't assess compliance, suitability or financial promotion rules, and doesn't replace anyone's review. Your firm remains responsible for its own content. If the check finds nothing, that's a good result and cost you nothing to have confirmed.

## Check result — email capture

Counts panel, both states: `[pages] pages read. [figures] figures checked. [confirmed] figures confirmed.`

Budget re-check checkbox, both states, opt-in:

> Re-check my site after the autumn Budget.

Button, both states: **Email me the record**

### When findings were returned

> ### The full record, dated, plus a re-check after the Budget.
>
> The findings above are free. The email delivers the record: every page read, every figure found, each shown against the current published value with the source link that confirms the value. On a forty page site that is a line of findings and thirty-nine pages of confirmation.
>
> Leave your address and the check runs again after the autumn Budget, with the results emailed. What you see above is true today. The email is the only way to be told when today's answer stops being true.

### When no findings were returned

> ### Nothing stale. Every figure on your site matches the current published value.
>
> That is the result you wanted, and the result hardest to prove. The email delivers the proof: every page read, every figure found, each shown against the current published value with the source link that confirms the value. Dated, so you know when the check was run.
>
> A clean site stays clean only until something moves. Leave your address and the check runs again after the autumn Budget, with the results emailed. Today's answer is the answer you have. The email is the only way to be told when today's answer stops being true.

## Forward CTA

Foot of the result state, beneath the email capture.

> ### That check took under a minute.
>
> The Verified assistant works in a similar way. Fetch the page, check the page exists, check the page says what the claim says, drop the source if not.
>
> **[ How I stop hallucinations → ]**

## Rules for this page

- Findings and sources show free on screen. The email delivers the full dated record, including pages confirmed correct.
- On successful email send, redirect to `/thank-you?domain=<domain>`.
- Never describe the record as evidence, an audit, or a compliance artefact. The record is something the firm keeps.
- No countdown, no urgency wording, no scarcity in either result state.

## Emailed record

### When findings exist

Subject: `Your figure check: [domain], [date]`

> This is the full record of the check on [domain], run on [date].
>
> [pages] pages read. [figures] figures found. [confirmed] confirmed against the current published value. [stale] not.
>
> **What to change.** Findings listed first: figure found, current published value, page, source link.
>
> **What was confirmed correct.** Remaining figures in page order, each against the current published value with the source link.

### When no findings

Subject: `Your figure check: [domain] is clean, [date]`

> This is the full record of the check on [domain], run on [date].
>
> [pages] pages read. [figures] figures found. Every figure matches the current published value.
>
> **What was confirmed correct.** Every figure in page order, each against the current published value with the source link. No "What to change" section renders.

### Shared closing, both versions

If the Budget re-check was ticked:

> You asked for a re-check after the autumn Budget. The check will run again then and the results will arrive by email. Reply to stop at any time.

Then, always:

> Keep this. The record is dated, so a year from now you can see what was checked and when.
>
> This checks whether published figures are current. The check doesn't assess compliance, suitability or financial promotion rules, and doesn't replace anyone's review.

Then a link to `/how-i-stop-hallucinations` and the Calendly link beneath.

---

# 2. `/thank-you`

No video on this page. The video lives at `/see-it-working`.

## Confirmation

> # On its way to [email]
>
> The full record of the check on [domain]. Every page has been read and every figure has been found. Each number has been compared with the current published value on the page that the link leads to.
>
> The report should arrive within a couple of minutes. If not, check your junk folder before assuming it's lost.

## Forward CTA

> ### While that's landing
>
> Stopping hallucinations takes five layers. The check you just ran is the fourth, and the only layer visible from outside the system.
>
> The next page sets out all five.
>
> **[ How I stop hallucinations → ]**

Nothing else on this page.

---

# 3. `/how-i-stop-hallucinations`

The method. Nothing about the offer.

> # How I stop hallucinations
>
> Defence in depth. Five independent layers, each catching what the previous layer missed. No single one of them is enough on its own, and that is the point. A hallucination has to survive all five to reach the screen.
>
> **1. The assistant cannot choose its own sources.**
> The search runs against a fixed, approved list of links, decided in advance and signed off before the system goes live. A generic chatbot searches the open web and decides for itself what looks authoritative. This assistant has no such freedom. If a source is not on the list, the source does not exist as far as the assistant is concerned.
>
> **2. The assistant is told what is out of bounds, in writing, on every request.**
> Not a friendly instruction to be careful. A narrow set of rules that arrives with every single question, defining what the assistant may state, what must carry a source, and what must be refused. The rules are the same on question one and question ten thousand.
>
> **3. The work is split into separate passes rather than answered in a single breath.**
> Ask a chatbot a question and a single request does everything at once: recall, reason, phrase. This system breaks the work apart, and each pass answers a narrow question with its own inputs. Narrow questions are far harder to answer wrongly than broad ones.
>
> **4. Every source is fetched and checked before entering the index.**
> The page has to exist. The content has to score above a relevance threshold against the claim the page is meant to support. Below the threshold, the source is dropped. This runs in code, not by an AI deciding whether something looks about right. You have seen this layer working. The check you ran on your own website is this layer, pointed at your public pages instead.
>
> **5. The final pass deletes anything that failed.**
> A separate stage assembles the answer and removes every block without a verified citation attached. Not flags. Not warns. Removes. What survives to the screen is what carried a source through all four layers before.
>
> When nothing survives, the assistant says so. "I can't ground that" instead of a confident guess.

## Forward CTA

> ### Four minutes of it running
>
> A real question going in. Citations that open when you click them, and the numbers brief showing where every figure came from.
>
> **[ Watch it working → ]**

---

# 4. `/see-it-working`

Video: `https://youtu.be/MVECWSCr7bM`

## Above the video

> # The Verified Assistant in four minutes
>
> A real question going in. Clickable citations, the numbers brief, and the audit reports showing where every figure and information block came from.

Video embedded. Not autoplaying. Poster frame. Captions on. Full width on mobile. Runtime stated: four minutes.

## Beneath the video

> The numbers brief is a separate build. This offer is grounded answers with verified citations.

> **What the video doesn't show.** Ask anything that could shape a recommendation and the assistant returns labelled options with the trade-offs, never a single answer. You cannot proceed until you have recorded why you chose what you chose, and any variations you are making. That part needs an adviser sitting in front of it, so a demonstration would be me pretending to be something I'm not.

## Forward CTA

> ### What that costs, and what comes with it
>
> **[ See what's included → ]**

---

# 5. `/features`

## Header

> # The Verified Assistant
> ## Founding Firms Programme
>
> *Every citation checked. Every link real.*
>
> For UK FCA-regulated advice firms with 1 to 10 advisers whose clients have started turning up with AI, and who have tested a chatbot themselves and concluded the tool can't go anywhere near a client.

## The core message

> Your clients are already using AI. On you.
>
> Telling them the tools make things up loses more credibility with every passing month.
>
> The answer isn't to argue with their AI, and isn't a chatbot with better answers. Their AI is good at the part of your work clients can see. Your value is in the part they cannot.
>
> Your client's AI gives them a conclusion. Yours shows what went into a conclusion: what was checked, what was weighed, what was rejected, and why. Every source opens when you click.
>
> Their AI produces answers. Yours makes your judgement visible.

## What's included

> ## What's included
>
> **Design and build.** We agree your niche collections, your own material and the grounding rules up front. Live on your intranet two working days after sign-off.
>
> **A defined library, in three layers, built for the firm rather than per adviser.** Eight universal collections built from HMRC, FCA and gov.uk, curated and verified once and deployed into your tenant. Five niche collections chosen for the specialisms your firm covers, so a pensions specialist asked an IHT question still receives a grounded answer. And your own firm documentation as a separate labelled tier: house positions, advice process, panel. No client records, so no per-user permissions to build. An adviser can always see whether a claim came from the regulator or from your files. That last layer is the layer no competitor tool can ever have.
>
> **Verified citations on every factual claim.** Every candidate source is checked automatically before entering your index: the page must exist, and must score above a relevance threshold against the claim the page supports. Done in code, not by an AI deciding whether something looks right.
>
> **"I can't ground that" instead of a confident guess.** The system fails loudly rather than degrading politely in the dark. Everything outside the library is out of scope by design.
>
> **The system won't tell you what to advise.** Ask anything that could shape a recommendation, a drawdown route, a wrapper, a strategy, and you receive two to four labelled options with the trade-offs, who each suits, and what you'd need to know about the client before choosing. Never a single "do this." Facts stay instant: a statutory allowance, a figure from the client brief, single answer, cited. The friction sits only where the judgement sits.
>
> **Every session ends as a file.** You cannot simply accept an option. First you record your rationale: why you chose what you chose, and any variations you are making to the advice. The final output then saves as a single HTML file, with the information audit and citations you can click. Send the file to your compliance officer as is, nothing to export, nothing written up afterwards from memory.
>
> **Built to your firm, not to my defaults.** This is a bespoke build, not a licence. The chat window, the grounding rules and how the assistant behaves are configured to your workflow, and to your compliance officer's instructions, at setup. Small changes afterwards are part of the service, not a change request.
>
> **Rebuilt, not patched.** Every quarter the index is deleted, rebuilt from source, and every citation re-verified from scratch.
>
> **A source audit report as standard.** What your assistant is allowed to read. Never sold as a premium. Charging for an audit trail would contradict the entire argument for having one.
>
> **You steer what goes in.** Send links to anything you want included and the material lands in the next build. Once a year we revisit the design properly.
>
> **Runs in your tenant, on your intranet.** Your questions never leave your environment. Azure costs at cost on your own subscription, with a spend cap set at setup. No standing access for me. Scoped, granted by you, revocable by you.
>
> **Support 11:00 to 16:00, Monday to Friday,** on a shared Slack channel with a named responder.

## Included with a founding place

> ## Included with a founding place
>
> **Continuous figure monitoring on your public website.** The check you ran to get here, run every month, automatically, for as long as you stay. A dated record each time showing every figure found and the published value each was compared against, and an alert the moment something you publish falls behind a change you didn't notice.
>
> Founding firms only. Never sold separately.

## Price

> ## Price
>
> **£1,200 setup, then £250 a month.** Six-month term, monthly rolling after that. Founding firms keep their rate for as long as they stay.
>
> Azure running costs sit on your own subscription at cost, with a spend cap set at setup. No usage caps, no marked-up infrastructure, no surprise invoices.
>
> A typical firm charging 0.5% to 1% ongoing earns £2,500 to £5,000 a year from a single £500,000 client. Retaining one fee-challenged client pays for this several times over.

No table. No tiers. No add-ons on this page.

## What I won't sell you

> ## What I won't sell you
>
> **No chatbot between you and your clients.** AI belongs behind the adviser, never between the adviser and the prospect.
>
> **Number checking is a separate build.** This offer is grounded answers with verified, clickable citations. Arithmetic auditing, where every figure in an answer is traced and checked, is real and I build it, but sits outside this price. Ask on the call and I'll quote honestly.
>
> **No promises about when you'll hit your business objectives.** I build the capability and measure what the capability touches. The objective is yours, and we calculate the timeline together from your own numbers.
>
> **Anything outside what I've built** is quoted honestly as custom work, or referred elsewhere.

## Why the cohort is three firms

> ## Why the cohort is three firms
>
> Every library is built and verified end to end before going live, and the verification pass is slow by design. Every candidate source fetched and scored. That's the constraint, and that same constraint makes the citations worth anything.
>
> The opening cohort is three firms. Cohorts start monthly after that.
>
> The FCA's good and poor practice report on AI lands later this year. A firm starting now meets the report with a documented, evidenced position. A firm starting two intakes later meets the report with nothing on paper.

## The close

> No five-figure first decision. No lock-in beyond the six-month term. And a system your compliance officer can inspect.
>
> If the citations don't stand up, don't sign.

## Forward CTA

> ### Don't take the citations on trust
>
> Eleven questions about how answers reach your clients today. Four minutes, and you will see where your firm currently accepts an answer nobody has checked.
>
> **[ Check the verified answers → ]**

---

# 6. `/verified-answers`

The wizard already exists in the codebase at `/unverified-answers-count`. Embed the existing wizard into this page. Never rebuild it, and never link out to it as a separate route.

## The nod

Opens the page cold. No heading.

> You've tested the tools yourself. Evenings, weekends, a made-up client scenario. Genuinely impressive. And every session ends the same way: brilliant, but not client-ready.
>
> So you asked compliance. And you got back either "best to be cautious for now" or a policy document saying be careful with client data, which you already knew. So you're waiting for the FCA report to make things clearer.

## Neither of those can ever produce a yes

> ## Neither of those can ever produce a yes
>
> The testing can't, because you were evaluating a consumer product for properties the product architecturally cannot have. No amount of clever prompting makes a generic chatbot show its arithmetic, verify its sources, or leave an audit trail. Those aren't settings that were left off. They're absent by design.
>
> Worse, the loop teaches the wrong lesson. Each session reinforces "AI can't be used in regulated work," when the true statement is "this product class can't."
>
> And the compliance question can't produce a yes either, because "can we use AI?" has no answer. "Here is a specific system, with this data, producing this evidence, does that meet your requirements?" does.
>
> On the waiting: the FCA has already clarified its position. No new AI-specific rules. Existing frameworks apply. Which means the accountability exists today, and the upcoming report will illustrate practice rather than create obligations.

## Nobody has ever written down what your AI would have to do

> ## Nobody has ever written down what your AI would have to do
>
> Somewhere in your firm, on paper, or in your compliance officer's head, there's an answer to this question: what would we need to see before AI was client-ready?
>
> Which numbers must be checkable. Which claims must carry a source. What the system must do when the answer isn't known. What evidence must exist afterwards.
>
> That answer has never been turned into build requirements. Not by your compliance consultant, not by any vendor, not by you. And that isn't negligence. The translation requires someone fluent in both your obligations and software engineering, and that person doesn't exist in your world.
>
> Untranslated requirements can't be built to, and they can't be tested against. So the firm fails generic tools individually and concludes "we can't use AI," when the true statement is **"nothing has ever been built to our requirements."**
>
> That's the job. You set the bar; I'm the developer who builds to it. I did that for a bank's auditors. I'll do that for your compliance officer.

## The wizard intro

> ## Meanwhile, how many unverified answers left your firm last month?
>
> Not hypothetically. Your people are already using AI on regulated subjects, and a proportion of what comes back cannot be tied to an approved source. Nobody has counted, because no tool in your firm counts.
>
> Eleven questions and the estimate appears on screen, with the arithmetic shown in full so you can check the working rather than take the figure on trust.
>
> Nothing to install, no account, and your answers stay in your browser.

**[ Start the count ]**

Small: *Eleven questions, about four minutes.*

## The wizard

The existing wizard from `/unverified-answers-count`, embedded inline and replacing the intro block in place. Not a modal, not an iframe, not a separate route. The reader never leaves `/verified-answers`.

## The result

> ## [n] unverified answers a month
>
> Each of these reached somebody without a source behind it. Not because your people are careless, but because nothing in your firm was built to check.

Then the working panel, the callouts, and the teaser naming what needs attention first, as the wizard already produces them.

## Email capture

Full width. The report is the substantial deliverable here.

> ### The report the screen can't show you
>
> Leave your address and the full report arrives by email. Four things beyond the figure above:
>
> - A paragraph on AI use written from your own figures, ready to put in front of your PI broker
> - Three questions to ask your compliance officer, in priority order, each with what a good answer sounds like
> - What to do without hiring anybody, in named steps
> - The ICO and FCA reading that actually applies, linked

**[ email field ] [ Email me the report ]**

Small: *No follow-up sequence. The report, and nothing else.*

## Forward CTA

> ### Then the part that needs a developer
>
> The report tells you what to ask and what to fix. Turning your firm's answers into something buildable is the next step, and is the part that has never been done for your firm.
>
> Thirty minutes on a call, and within two working days you receive your requirements written as a technical specification. Yours to keep, whether you build with me or not.
>
> **[ Book a call → ]**

## Rules for this page

- The email capture never blocks the result. The count, the working and the callouts render on screen whether or not an address is entered.
- Submitting the email does not redirect. The reader stays on the result and the button becomes a confirmation line in place.
- No countdown, no scarcity, no popup.

---

# 7. `/book-a-call`

The only page where everything appears together. Calendly embedded directly beneath the copy. No further CTA on this page.

> # Thirty minutes to define your AI compliance blueprint
>
> You tell me what your compliance officer would need to see before an AI system is client-ready in your firm: which numbers must be checkable, which claims must carry a source, what the system must do when the answer isn't known, and what evidence must exist afterwards.
>
> Within two working days you receive that written as a technical specification. Yours to keep, whether you build with me or not.
>
> Bring your compliance officer. The whole thing is built for them.

> ## What you'd be starting
>
> **£1,200 setup, then £250 a month.** Six-month term, monthly rolling after that. Founding firms keep their rate for as long as they stay.
>
> - Design and build against your requirements. Live on your intranet two working days after sign-off.
> - A three-layer library: universal collections, niche collections for your specialisms, and your own firm documentation as a separate labelled tier. House positions, advice process, panel. No client records, so no per-user permissions to build.
> - Five layers of hallucination defence, with every citation checked in code before display.
> - "I can't ground that" instead of a confident guess.
> - Options and trade-offs, never a recommendation.
> - You record your rationale before accepting, and the session saves as a single HTML file with clickable citations.
> - Quarterly rebuild from source, every citation re-verified.
> - Configured to your workflow and your compliance instructions. Small changes included.
> - Continuous monthly monitoring of your public website figures, founding firms only.
> - Runs in your tenant, on your intranet. Azure at cost on your own subscription.
> - Support 11:00 to 16:00 weekdays, shared Slack channel, named responder.
>
> Number checking is a separate build and sits outside this price. Ask on the call and I'll quote honestly.

Calendly: `https://calendly.com/hello-wrigital/30min`

---

# Footer

On every page. Company name, registration number 16967085, registered address 12 Vernon Avenue, Old Basford, Nottingham, NG6 0AE, contact email, privacy link. Nothing else.

---

# Assets

| # | Asset | Status |
|---|---|---|
| 1 | Founder photograph | `public/images/terry-martin-founder.jpg` |
| 2 | Company number and registered address | Confirmed |
| 3 | Calendly URL | `https://calendly.com/hello-wrigital/30min` |
| 4 | Four minute video | `https://youtu.be/MVECWSCr7bM` |
| 5 | Video poster frame image | Needed |
| 6 | Video captions file | Needed |
| 7 | Email template for the check record | Needed |
| 8 | Email template for the wizard report | Needed |
| 9 | Privacy policy page | Needed |
| 10 | Per-page OG images (seven), titles and descriptions | Needed |
