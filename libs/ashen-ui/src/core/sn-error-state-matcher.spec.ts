import { describe, it, expect, beforeEach } from 'vitest';
import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  SnErrorStateMatcher,
  SnImmediateErrorStateMatcher,
  SnTouchedErrorStateMatcher,
} from './sn-error-state-matcher';
import { FormField, FormFieldError } from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';

describe('SnErrorStateMatcher', () => {
  const control = (opts: { invalid?: boolean; touched?: boolean; dirty?: boolean }) =>
    ({
      invalid: opts.invalid ?? false,
      touched: opts.touched ?? false,
      dirty: opts.dirty ?? false,
    }) as never;

  describe('default policy', () => {
    const m = new SnErrorStateMatcher();

    it('is quiet while the control is valid, however much it was interacted with', () => {
      expect(m.isErrorState(control({ touched: true, dirty: true }), null)).toBe(false);
    });

    it('is quiet while an invalid control is still untouched and pristine', () => {
      expect(m.isErrorState(control({ invalid: true }), null)).toBe(false);
    });

    it('reports on touched, on dirty, and on submit', () => {
      expect(m.isErrorState(control({ invalid: true, touched: true }), null)).toBe(true);
      expect(m.isErrorState(control({ invalid: true, dirty: true }), null)).toBe(true);
      expect(
        m.isErrorState(control({ invalid: true }), { submitted: true } as never),
      ).toBe(true);
    });

    it('treats a missing control as no error', () => {
      expect(m.isErrorState(null, { submitted: true } as never)).toBe(false);
    });
  });

  describe('SnTouchedErrorStateMatcher', () => {
    const m = new SnTouchedErrorStateMatcher();

    it('ignores dirty and submitted, reporting only once touched', () => {
      expect(m.isErrorState(control({ invalid: true, dirty: true }), null)).toBe(false);
      expect(
        m.isErrorState(control({ invalid: true }), { submitted: true } as never),
      ).toBe(false);
      expect(m.isErrorState(control({ invalid: true, touched: true }), null)).toBe(true);
    });
  });

  describe('SnImmediateErrorStateMatcher', () => {
    const m = new SnImmediateErrorStateMatcher();

    it('reports as soon as the control is invalid, before any interaction', () => {
      expect(m.isErrorState(control({ invalid: true }), null)).toBe(true);
      expect(m.isErrorState(control({}), null)).toBe(false);
    });
  });

  it('is injectable without any app-side providers', () => {
    // The base class is both the default and the token, so it must not be abstract.
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(TestBed.inject(SnErrorStateMatcher)).toBeInstanceOf(SnErrorStateMatcher);
  });
});

@Component({
  template: `
    <sn-form-field>
      <input snInputText [formControl]="ctrl" />
      <sn-error>Required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldError, InputText, ReactiveFormsModule],
})
class MatcherHost {
  readonly ctrl = new FormControl('', Validators.required);
}

describe('SnErrorStateMatcher wired into snInputText', () => {
  function setup(providers: unknown[] = []) {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...(providers as never[])],
    });
    return TestBed.createComponent(MatcherHost);
  }

  beforeEach(() => TestBed.resetTestingModule());

  it('does not mark the control invalid before interaction (default policy)', async () => {
    const f = setup();
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBeNull();
  });

  it('marks it invalid once touched (default policy)', async () => {
    const f = setup();
    await f.whenStable();
    f.componentInstance.ctrl.markAsTouched();
    f.componentInstance.ctrl.updateValueAndValidity();
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('an overridden matcher actually changes what the control reports', async () => {
    // The whole point of making the policy injectable. Immediate policy shows
    // the error with no interaction at all.
    const f = setup([{ provide: SnErrorStateMatcher, useClass: SnImmediateErrorStateMatcher }]);
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('a touched-only matcher suppresses the error while merely dirty', async () => {
    const f = setup([{ provide: SnErrorStateMatcher, useClass: SnTouchedErrorStateMatcher }]);
    await f.whenStable();

    f.componentInstance.ctrl.markAsDirty();
    f.componentInstance.ctrl.updateValueAndValidity();
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBeNull();

    f.componentInstance.ctrl.markAsTouched();
    f.componentInstance.ctrl.updateValueAndValidity();
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });

  it('the explicit [invalid] input still wins over any matcher', async () => {
    @Component({
      template: `
        <sn-form-field>
          <input snInputText [invalid]="true" />
        </sn-form-field>
      `,
      imports: [FormField, InputText, FormsModule],
    })
    class ForcedHost {
      readonly on = signal(true);
    }

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: SnErrorStateMatcher, useClass: SnTouchedErrorStateMatcher },
      ],
    });
    const f = TestBed.createComponent(ForcedHost);
    await f.whenStable();
    expect(f.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
  });
});
