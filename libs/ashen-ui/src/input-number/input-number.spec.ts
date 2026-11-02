import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputNumber } from './input-number';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { FormFieldError } from '../form-field/form-field-error';

@Component({
  template: `<input snInputNumber placeholder="0" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'basic' },
})
class BasicHost {}

@Component({
  template: `<input snInputNumber size="sm" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'sm-size' },
})
class SmSizeHost {}

@Component({
  template: `<input snInputNumber size="lg" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'lg-size' },
})
class LgSizeHost {}

@Component({
  template: `<input snInputNumber [invalid]="true" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'invalid-prop' },
})
class InvalidPropHost {}

@Component({
  template: `<input snInputNumber [invalid]="invalid()" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'dynamic-invalid' },
})
class DynamicInvalidHost {
  readonly invalid = signal(false);
}

@Component({
  template: `<input snInputNumber [min]="min" [max]="max" [step]="step" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'constraints' },
})
class ConstraintsHost {
  min = 0;
  max = 100;
  step = 5;
}

@Component({
  template: `<input snInputNumber [min]="0" [max]="10" />`,
  imports: [InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'clamp' },
})
class ClampHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Quantity</sn-label>
      <input snInputNumber />
      <sn-hint>Enter a number</sn-hint>
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, FormFieldHint, InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'with-ff' },
})
class WithFormFieldHost {}

@Component({
  template: `
    <sn-form-field [autoDisplayErrors]="false">
      <sn-label>Quantity</sn-label>
      <input snInputNumber />
      <sn-error>Required</sn-error>
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, FormFieldError, InputNumber],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'with-ff-error' },
})
class WithFormFieldErrorHost {}

@Component({
  template: `<input snInputNumber [formControl]="ctrl" />`,
  imports: [InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive' },
})
class ReactiveFormHost {
  ctrl = new FormControl<number | null>(null);
}

@Component({
  template: `<input snInputNumber [formControl]="ctrl" />`,
  imports: [InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive-disabled' },
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl<number | null>({ value: null, disabled: true });
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Amount</sn-label>
      <input snInputNumber [formControl]="ctrl" />
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ff-with-ctrl' },
})
class FormFieldWithControlHost {
  ctrl = new FormControl<number | null>(null, Validators.required);
}

@Component({
  template: `<input snInputNumber [(ngModel)]="value" />`,
  imports: [InputNumber, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ngmodel' },
})
class NgModelHost {
  value: number | null = null;
}

@Component({
  template: `<input snInputNumber [formControl]="ctrl" [min]="0" [max]="10" />`,
  imports: [InputNumber, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'clamp-reactive' },
})
class ClampReactiveHost {
  ctrl = new FormControl<number | null>(null);
}

describe('InputNumber', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-input-number class to the host input', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-number');
  });

  it('applies sn-input-text class from the host directive', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text');
  });

  it('has type="number"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.type).toBe('number');
  });

  it('applies sn-input-text-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text-sm');
  });

  it('applies sn-input-text-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LgSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text-lg');
  });

  it('does not apply size modifier for default md size', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).not.toContain('sn-input-text-sm');
    expect(el.classList).not.toContain('sn-input-text-lg');
  });

  it('applies sn-input-text-error when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidPropHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text-error');
  });

  it('sets aria-invalid when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidPropHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('does not set aria-invalid when not invalid', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the error style when invalid changes after the initial render', async () => {
    const fixture = TestBed.createComponent(DynamicInvalidHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).not.toContain('sn-input-text-error');

    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    expect(el.classList).toContain('sn-input-text-error');
  });

  it('reflects min/max/step as attributes', async () => {
    const fixture = TestBed.createComponent(ConstraintsHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('min')).toBe('0');
    expect(el.getAttribute('max')).toBe('100');
    expect(el.getAttribute('step')).toBe('5');
  });

  it('applies default step=1 when step is not set', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('step')).toBe('1');
  });

  it('does not set min attribute when min is not provided', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('min')).toBeNull();
  });

  it('does not set max attribute when max is not provided', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.getAttribute('max')).toBeNull();
  });

  it('sets id on input matching the form-field label for attribute', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.id).toBeTruthy();
  });

  it('sets aria-required when field is required', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const input: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('sets aria-describedby pointing to hint id when no error', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const input: HTMLElement = fixture.nativeElement.querySelector('input');
    const hint: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(input.getAttribute('aria-describedby')).toContain(hint.id);
  });

  it('sets aria-describedby pointing to error id when error is present', async () => {
    const fixture = TestBed.createComponent(WithFormFieldErrorHost);
    await fixture.whenStable();
    const input: HTMLElement = fixture.nativeElement.querySelector('input');
    const error: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('reflects FormControl number value in the native input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.setValue(42);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.value).toBe('42');
  });

  it('marks control as touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(host.ctrl.touched).toBe(true);
  });

  it('shows error state after touched + invalid', async () => {
    const fixture = TestBed.createComponent(FormFieldWithControlHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.markAsTouched();
    host.ctrl.updateValueAndValidity();
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text-error');
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('reflects disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.disabled).toBe(true);
  });

  it('reflects ngModel number value changes in the native input', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.value = 99;
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.value).toBe('99');
  });

  it('clamps value below min to min on blur', async () => {
    const fixture = TestBed.createComponent(ClampHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    el.value = '-5';
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.value).toBe('0');
  });

  it('clamps value above max to max on blur', async () => {
    const fixture = TestBed.createComponent(ClampHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    el.value = '50';
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.value).toBe('10');
  });

  it('does not clamp value within range', async () => {
    const fixture = TestBed.createComponent(ClampHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    el.value = '5';
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.value).toBe('5');
  });

  it('does not modify empty value on blur', async () => {
    const fixture = TestBed.createComponent(ClampHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    el.value = '';
    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(el.value).toBe('');
  });

  it('dispatches input event on clamp so FormControl updates', async () => {
    const fixture = TestBed.createComponent(ClampReactiveHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');

    el.value = '99';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();

    el.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(el.value).toBe('10');
    expect(Number(host.ctrl.value)).toBe(10);
  });
});
