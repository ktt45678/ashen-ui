/**
 * Fixed-pattern character masking.
 *
 * Deliberately small. It covers patterns whose shape is known up front: phone
 * numbers, dates, postal codes, card numbers, tax IDs. It does not do numeric
 * masks with thousand separators and decimals, self-correcting dates (typing
 * `13` for a month), masks that change shape as you type (card-type detection),
 * or regex masks. Those need a real mask engine; see `InputMask`'s docs for
 * wiring one in instead.
 */

/** Placeholder tokens. */
const TOKENS: Readonly<Record<string, RegExp>> = {
  9: /[0-9]/,
  a: /[A-Za-z]/,
  '*': /[A-Za-z0-9]/,
};

/** One position in a parsed mask: either a slot the user fills or a fixed character. */
export type MaskSlot =
  | { readonly kind: 'token'; readonly test: RegExp; readonly optional: boolean }
  | { readonly kind: 'literal'; readonly char: string };

/**
 * Parse a mask string into positions.
 *
 * - `9` digit, `a` letter, `*` alphanumeric
 * - `?` makes everything after it optional (the value is valid without it)
 * - `\` escapes the next character, so `\9` is a literal nine
 * - anything else is a literal
 */
export function parseMask(mask: string): MaskSlot[] {
  const slots: MaskSlot[] = [];
  let optional = false;

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];

    if (char === '\\') {
      const next = mask[++i];
      if (next !== undefined) slots.push({ kind: 'literal', char: next });
      continue;
    }
    if (char === '?') {
      optional = true;
      continue;
    }
    const test = TOKENS[char];
    slots.push(test ? { kind: 'token', test, optional } : { kind: 'literal', char });
  }

  return slots;
}

/**
 * Apply a mask to raw input.
 *
 * Characters that don't fit the next token are skipped rather than rejected, so
 * pasting `(555) 123-4567` into `(999) 999-9999` yields the same string and
 * pasting `5551234567` yields it too.
 *
 * Trailing literals are emitted once the preceding slot is filled: typing the
 * third digit of `(999)` produces `(555) `, the auto-advance behaviour people
 * expect from a mask.
 */
export function applyMask(raw: string, slots: MaskSlot[]): string {
  let out = '';
  // Hold literals back until a token consumes a character, so an empty field stays empty.
  let pending = '';
  let i = 0;

  for (const slot of slots) {
    if (slot.kind === 'literal') {
      pending += slot.char;
      // The user may have typed the literal themselves, so consume it rather
      // than offer it to the next token as data.
      if (raw[i] === slot.char) i++;
      continue;
    }

    while (i < raw.length && !slot.test.test(raw[i])) i++;
    if (i >= raw.length) break;
    out += pending + raw[i++];
    pending = '';
  }

  // Flush trailing literals once every earlier token is filled.
  return out.length > 0 && i >= raw.length ? out + pending : out;
}

/** Strip the mask's literals, leaving only what the user supplied. */
export function unmask(value: string, slots: MaskSlot[]): string {
  let out = '';
  let i = 0;

  for (const slot of slots) {
    if (i >= value.length) break;
    if (slot.kind === 'literal') {
      if (value[i] === slot.char) i++;
      continue;
    }
    if (slot.test.test(value[i])) out += value[i];
    i++;
  }

  return out;
}

/** Every non-optional token is filled. */
export function isMaskComplete(value: string, slots: MaskSlot[]): boolean {
  const required = slots.filter((s) => s.kind === 'token' && !s.optional).length;
  return unmask(value, slots).length >= required;
}

/**
 * The mask rendered as a placeholder: tokens become `placeholderChar`, literals
 * stay. Shown via the element's native `placeholder`, so the value holds only
 * what the user typed, which keeps an untouched field genuinely empty and the
 * caret arithmetic trivial.
 */
export function maskPlaceholder(slots: MaskSlot[], placeholderChar: string): string {
  return slots.map((s) => (s.kind === 'literal' ? s.char : placeholderChar)).join('');
}

/**
 * Where the caret belongs after reformatting.
 *
 * Formatting the text *before* the caret gives the answer directly: its length
 * is the new offset. That keeps the caret attached to the character the user
 * just typed rather than to an absolute index the reformat may have shifted.
 */
export function caretAfterFormat(rawBeforeCaret: string, slots: MaskSlot[]): number {
  return applyMask(rawBeforeCaret, slots).length;
}
