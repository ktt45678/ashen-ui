import {
  applyMask,
  caretAfterFormat,
  isMaskComplete,
  maskPlaceholder,
  parseMask,
  unmask,
} from './mask-core';

const PHONE = parseMask('(999) 999-9999');
const DATE = parseMask('99/99/9999');
const PLATE = parseMask('aa-9999');
const ZIP = parseMask('99999?-9999');

describe('parseMask', () => {
  it('classifies tokens and literals', () => {
    expect(parseMask('9a*-').map((s) => s.kind)).toEqual([
      'token',
      'token',
      'token',
      'literal',
    ]);
  });

  it('marks everything after ? optional', () => {
    const slots = ZIP.filter((s) => s.kind === 'token');
    expect(slots.slice(0, 5).every((s) => s.kind === 'token' && !s.optional)).toBe(true);
    expect(slots.slice(5).every((s) => s.kind === 'token' && s.optional)).toBe(true);
  });

  it('escapes a token character with a backslash', () => {
    const slots = parseMask('\\9-99');
    expect(slots[0]).toEqual({ kind: 'literal', char: '9' });
    expect(slots[2].kind).toBe('token');
  });
});

describe('applyMask', () => {
  it('formats progressively as characters arrive', () => {
    expect(applyMask('', PHONE)).toBe('');
    expect(applyMask('5', PHONE)).toBe('(5');
    expect(applyMask('55', PHONE)).toBe('(55');
    // Auto-advance: the separator appears once the group before it is full.
    expect(applyMask('555', PHONE)).toBe('(555) ');
    expect(applyMask('5551', PHONE)).toBe('(555) 1');
    expect(applyMask('5551234567', PHONE)).toBe('(555) 123-4567');
  });

  it('emits nothing for input that fills no token', () => {
    // Not `(`. A mask must not render its own punctuation into a field the
    // user has not filled, which is what makes an untouched input empty.
    expect(applyMask('', PHONE)).toBe('');
    expect(applyMask('abc', PHONE)).toBe('');
  });

  it('is idempotent, so reformatting an already-masked value is a no-op', () => {
    const once = applyMask('5551234567', PHONE);
    expect(applyMask(once, PHONE)).toBe(once);
  });

  it('accepts a paste that already carries the literals', () => {
    expect(applyMask('(555) 123-4567', PHONE)).toBe('(555) 123-4567');
  });

  it('accepts a paste with different punctuation', () => {
    expect(applyMask('555.123.4567', PHONE)).toBe('(555) 123-4567');
  });

  it('drops characters the token rejects', () => {
    expect(applyMask('5a5b5c', PHONE)).toBe('(555) ');
    expect(applyMask('ab12', PLATE)).toBe('ab-12');
  });

  it('stops at the end of the mask', () => {
    expect(applyMask('99999999999999999999', PHONE)).toBe('(999) 999-9999');
  });

  it('handles a mask that starts with a token', () => {
    expect(applyMask('1', DATE)).toBe('1');
    expect(applyMask('12', DATE)).toBe('12/');
    expect(applyMask('12312024', DATE)).toBe('12/31/2024');
  });
});

describe('unmask', () => {
  it('returns only what the user supplied', () => {
    expect(unmask('(555) 123-4567', PHONE)).toBe('5551234567');
    expect(unmask('(555) ', PHONE)).toBe('555');
    expect(unmask('', PHONE)).toBe('');
  });

  it('round-trips with applyMask', () => {
    const raw = '5551234567';
    expect(unmask(applyMask(raw, PHONE), PHONE)).toBe(raw);
  });
});

describe('isMaskComplete', () => {
  it('requires every non-optional token', () => {
    expect(isMaskComplete('(555) 123-456', PHONE)).toBe(false);
    expect(isMaskComplete('(555) 123-4567', PHONE)).toBe(true);
  });

  it('ignores optional tokens', () => {
    expect(isMaskComplete(applyMask('12345', ZIP), ZIP)).toBe(true);
    expect(isMaskComplete(applyMask('1234', ZIP), ZIP)).toBe(false);
  });
});

describe('maskPlaceholder', () => {
  it('keeps literals and replaces tokens', () => {
    expect(maskPlaceholder(PHONE, '_')).toBe('(___) ___-____');
    expect(maskPlaceholder(DATE, '_')).toBe('__/__/____');
    expect(maskPlaceholder(DATE, '#')).toBe('##/##/####');
  });
});

describe('caretAfterFormat', () => {
  it('lands after the character just typed', () => {
    // Typed "5" into an empty field: caret sits after "(5".
    expect(caretAfterFormat('5', PHONE)).toBe(2);
  });

  it('advances past a separator the mask inserted', () => {
    // The third digit produces "(555) ", so the caret must skip the separator,
    // not sit before it, or the next keystroke lands in the wrong slot.
    expect(caretAfterFormat('555', PHONE)).toBe(6);
  });

  it('stays put when editing mid-value', () => {
    expect(caretAfterFormat('5551', PHONE)).toBe(7);
  });
});
