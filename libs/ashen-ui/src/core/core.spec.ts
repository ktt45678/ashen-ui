import { describe, it, expect, vi } from 'vitest';
import { snNextId } from './sn-next-id';
import { snWaitForAnimations } from './sn-animation';
import { resolveSnClass } from './sn-class';
import { SnIntl, provideSnIntl, provideSnIntlLocale } from './sn-intl';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('snNextId', () => {
  it('returns a string combining the prefix and a counter', () => {
    const id = snNextId('sn-test');
    expect(typeof id).toBe('string');
    expect(id).toMatch(/^sn-test-\d+$/);
  });

  it('increments across calls', () => {
    const a = snNextId('x');
    const b = snNextId('x');
    const numA = parseInt(a.split('-')[1], 10);
    const numB = parseInt(b.split('-')[1], 10);
    expect(numB).toBe(numA + 1);
  });

  it('supports different prefixes independently', () => {
    const btn = snNextId('sn-button');
    const inp = snNextId('sn-input');
    expect(btn).toContain('sn-button');
    expect(inp).toContain('sn-input');
  });
});

describe('resolveSnClass', () => {
  it('returns empty string for undefined value', () => {
    expect(resolveSnClass(undefined, 'root', true)).toBe('');
  });

  it('returns the string on root section when isRoot=true', () => {
    expect(resolveSnClass('extra-class', 'root', true)).toBe('extra-class');
  });

  it('returns empty for a string on non-root section', () => {
    expect(resolveSnClass('extra-class', 'label', false)).toBe('');
  });

  it('resolves SnClassMap string value for the matching section', () => {
    expect(resolveSnClass({ root: 'foo bar' }, 'root', false)).toBe('foo bar');
  });

  it('resolves SnClassMap array value for the matching section', () => {
    expect(resolveSnClass({ label: ['a', 'b'] }, 'label', false)).toBe('a b');
  });

  it('resolves SnClassMap record value, including only active classes', () => {
    expect(resolveSnClass({ root: { 'active': true, 'disabled': false } }, 'root', false)).toBe('active');
  });

  it('returns empty for SnClassMap when section does not match', () => {
    expect(resolveSnClass({ header: 'foo' }, 'root', false)).toBe('');
  });

  it('merges SnClassMap array in order', () => {
    const result = resolveSnClass([{ root: 'first' }, { root: 'second' }], 'root', false);
    expect(result).toBe('first second');
  });

  it('merges multiple SnClassMaps for the same section', () => {
    const result = resolveSnClass([{ label: 'a' }, { label: 'b' }], 'label', false);
    expect(result).toBe('a b');
  });
});

describe('SnIntl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('removeChip returns English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.removeChip('Angular')).toBe('Remove Angular');
    });
  });

  it('close has English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.close).toBe('Close');
    });
  });

  it('next has English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.next).toBe('Next');
    });
  });

  it('previous has English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.previous).toBe('Previous');
    });
  });

  it('selectPlaceholder has English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.selectPlaceholder).toBe('Select…');
    });
  });

  it('emptyMessage has English default', () => {
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.emptyMessage).toBe('No results found.');
    });
  });

  it('provideSnIntl overrides individual properties', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ close: 'Schließen', next: 'Weiter' }),
      ],
    });
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.close).toBe('Schließen');
      expect(intl.next).toBe('Weiter');
      expect(intl.previous).toBe('Previous');
    });
  });

  it('provideSnIntl partial override keeps unset properties as English', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ selectPlaceholder: '選択…' }),
      ],
    });
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.selectPlaceholder).toBe('選択…');
      expect(intl.emptyMessage).toBe('No results found.');
    });
  });

  it('provideSnIntlLocale derives localized month and weekday names', () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntlLocale('fr-FR')],
    });
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.locale).toBe('fr-FR');
      expect(intl.datePickerMonths[0]).toBe('janvier');
      expect(intl.datePickerMonths).toHaveLength(12);
      // Weekday names are generated Sunday-first to match the calendar grid.
      expect(intl.datePickerWeekdaysShort).toHaveLength(7);
      expect(intl.datePickerWeekdaysShort[0].toLowerCase()).toContain('dim');
    });
  });

  it('provideSnIntlLocale still applies text overrides', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntlLocale('de-DE', { datePickerPlaceholder: 'Datum wählen' }),
      ],
    });
    TestBed.runInInjectionContext(() => {
      const intl = TestBed.inject(SnIntl);
      expect(intl.datePickerMonths[0]).toBe('Januar');
      expect(intl.datePickerPlaceholder).toBe('Datum wählen');
    });
  });
});

describe('snWaitForAnimations', () => {
  function fakeAnimation(endTime: number, finished: Promise<unknown>): Animation {
    return {
      currentTime: 0,
      finished,
      effect: { getComputedTiming: () => ({ endTime }) },
    } as unknown as Animation;
  }

  function elementWith(animations: Animation[]): Element {
    return { getAnimations: () => animations } as unknown as Element;
  }

  const never = () => new Promise<void>(() => undefined);

  it('calls done at once when nothing animates', () => {
    let calls = 0;
    snWaitForAnimations(elementWith([]), () => calls++);
    snWaitForAnimations(null, () => calls++);
    snWaitForAnimations({} as Element, () => calls++);
    expect(calls).toBe(3);
  });

  it('waits for finite animations to finish', async () => {
    let finishAnimation!: () => void;
    const finished = new Promise<void>((resolve) => (finishAnimation = resolve));
    let calls = 0;
    snWaitForAnimations(elementWith([fakeAnimation(150, finished)]), () => calls++);
    await Promise.resolve();
    expect(calls).toBe(0);
    finishAnimation();
    await new Promise((resolve) => setTimeout(resolve));
    expect(calls).toBe(1);
  });

  it('ignores infinite animations such as spinners', () => {
    let calls = 0;
    snWaitForAnimations(elementWith([fakeAnimation(Infinity, never())]), () => calls++);
    expect(calls).toBe(1);
  });

  it('falls back to the expected end when finish never settles', () => {
    vi.useFakeTimers();
    try {
      let calls = 0;
      snWaitForAnimations(elementWith([fakeAnimation(150, never())]), () => calls++);
      vi.advanceTimersByTime(150);
      expect(calls).toBe(0);
      vi.advanceTimersByTime(60);
      expect(calls).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not call done after cancel', () => {
    vi.useFakeTimers();
    try {
      let calls = 0;
      const cancel = snWaitForAnimations(elementWith([fakeAnimation(150, never())]), () => calls++);
      cancel();
      vi.advanceTimersByTime(500);
      expect(calls).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
