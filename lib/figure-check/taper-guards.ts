/**
 * Extensible taper / conditional-variant phrases found between a trigger and
 * its candidate number. When any pattern matches, the binding is skipped and
 * the amount is excluded from comparison.
 *
 * Grow this list as adviser sites surface new wording.
 */
export const TAPER_GUARD_PATTERNS = [
  { id: 'reduced', pattern: /\breduced\b/i },
  { id: 'tapered', pattern: /\btapered\b/i },
  { id: 'down-to', pattern: /\bdown\s+to\b/i },
  { id: 'as-little-as', pattern: /\bas\s+little\s+as\b/i },
  { id: 'minimum', pattern: /\bminimum\b/i },
  { id: 'from-pound', pattern: /from\s*£/i },
] as const;

export type TaperGuardId = (typeof TAPER_GUARD_PATTERNS)[number]['id'];

/** Hard cap on how far rightward a trigger may search for its number. */
export const FORWARD_SEARCH_MAX_CHARS = 60;

/**
 * Trigger is a mere containment mention ("within/under the … allowance"), not a
 * statement of the published value. Do not include above/below/over — those
 * often introduce the threshold itself ("above the CGT allowance of £3,000").
 */
const NON_VALUE_MENTION_BEFORE_RE =
  /\b(within|under|inside)\s+(the\s+)?$/i;

/**
 * Trigger is qualified as a leftover / calculation residue, not the statutory
 * figure itself ("unused personal allowance of £1,260").
 */
const RESIDUAL_AMOUNT_BEFORE_RE =
  /\b(unused|remaining|leftover|left[\s-]over|spare|residual|unutilised|unutilized)\s+(the\s+)?$/i;

/**
 * Returns the matching guard id, or null if the span is clean.
 * Patterns are tested against the intervening text and against intervening +
 * the number raw string (so `from £` matches when £ begins the number).
 */
export function matchTaperGuard(
  intervening: string,
  numberRaw: string,
): TaperGuardId | null {
  const withNumber = `${intervening}${numberRaw}`;
  for (const { id, pattern } of TAPER_GUARD_PATTERNS) {
    if (pattern.test(intervening) || pattern.test(withNumber)) {
      return id;
    }
  }
  return null;
}

/**
 * True when the text between trigger and number still attributes a value to
 * the trigger. False when a clause break means the number belongs to later prose
 * ("within the personal allowance … He then takes £30,000 from his ISA"),
 * or when intervening text re-attributes the amount to another figure
 * ("…CGT) but have an annual subscription of £20,000").
 */
export function isValueLinkIntervening(intervening: string): boolean {
  const t = intervening.replace(/\u00a0/g, ' ');
  if (t.trim().length === 0) return true;
  // New clause — do not bind across it
  if (/[.!?;]/.test(t)) return false;
  if (
    /\b(then|takes?|took|puts?|put|withdraws?|from his|from her|from their|so can|so he|so she|so they)\b/i.test(
      t,
    )
  ) {
    return false;
  }
  // Number is introduced under a different figure's wording
  if (
    /\b(annual\s+subscription|isa\s+(allowance|limit|subscription)|subscription\s+limit|dividend\s+allowance|personal\s+allowance|nil[-\s]?rate\s+band|annual\s+allowance|pension\s+annual\s+allowance)\b/i.test(
      t,
    )
  ) {
    return false;
  }
  return true;
}

/** True when the trigger is preceded by within/under/above-style wording,
 *  or by unused/remaining-style residual wording. */
export function isNonValueMention(beforeTrigger: string): boolean {
  const tail = beforeTrigger.slice(-48);
  return (
    NON_VALUE_MENTION_BEFORE_RE.test(tail) ||
    RESIDUAL_AMOUNT_BEFORE_RE.test(tail)
  );
}
