import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputText } from './input-text';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { FormFieldError } from '../form-field/form-field-error';

@Component({
  template: `<input snInputText placeholder="Type here" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'basic' },
})
class BasicHost {}

@Component({
  template: `<input snInputText size="xs" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class XsSizeHost {}

@Component({
  template: `<input snInputText size="sm" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'sm-size' },
})
class SmSizeHost {}

@Component({
  template: `<input snInputText size="lg" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'lg-size' },
})
class LgSizeHost {}

@Component({
  template: `<input snInputText [invalid]="true" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'invalid-prop' },
})
class InvalidPropHost {}

@Component({
  template: `<input snInputText [invalid]="invalid()" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'dynamic-invalid' },
})
class DynamicInvalidHost {
  readonly invalid = signal(false);
}

@Component({
  template: `<input snInputText snClass="extra-cls" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'snclass-string' },
})
class SnClassStringHost {}

@Component({
  template: `<input snInputText [snClass]="{ root: 'my-root' }" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'snclass-obj' },
})
class SnClassObjectHost {}

@Component({
  template: `<input snInputText [snClass]="[{ root: 'a' }, { root: 'b' }]" />`,
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'snclass-arr' },
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Name</sn-label>
      <input snInputText />
      <sn-hint>Enter your full name</sn-hint>
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, FormFieldHint, InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'with-ff' },
})
class WithFormFieldHost {}

@Component({
  template: `
    <sn-form-field [autoDisplayErrors]="false">
      <sn-label>Name</sn-label>
      <input snInputText />
      <sn-error>Required</sn-error>
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, FormFieldError, InputText],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'with-ff-error' },
})
class WithFormFieldErrorHost {}

@Component({
  template: `<input snInputText [formControl]="ctrl" />`,
  imports: [InputText, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive' },
})
class ReactiveFormHost {
  ctrl = new FormControl('');
}

@Component({
  template: `<input snInputText [formControl]="ctrl" />`,
  imports: [InputText, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive-disabled' },
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: '', disabled: true });
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Username</sn-label>
      <input snInputText [formControl]="ctrl" />
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, InputText, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ff-with-ctrl' },
})
class FormFieldWithControlHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  template: `
    <sn-form-field autoDisplayErrors>
      <sn-label>Username</sn-label>
      <input snInputText [formControl]="ctrl" />
      <sn-error>Username is required</sn-error>
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, FormFieldError, InputText, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'auto-errors' },
})
class AutoErrorsHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  template: `<input snInputText [(ngModel)]="value" />`,
  imports: [InputText, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ngmodel' },
})
class NgModelHost {
  value = 'initial';
}

@Component({
  template: `
    <sn-form-field floatLabel="auto">
      <sn-label>Name</sn-label>
      <input snInputText [(ngModel)]="value" />
    </sn-form-field>
  `,
  imports: [FormField, FormFieldLabel, InputText, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'ff-float' },
})
class FloatFieldHost {
  value = '';
}

describe('InputText', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-input-text class to the host input', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text');
  });

  it('applies sn-input-text-xs for size="xs"', async () => {
    const fixture = TestBed.createComponent(XsSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('sn-input-text-xs');
    expect(el.getAttribute('data-sn-size')).toBe('xs');
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
    expect(el.classList).not.toContain('sn-input-text-xs');
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

  it('updates error class reactively when invalid signal changes', async () => {
    const fixture = TestBed.createComponent(DynamicInvalidHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).not.toContain('sn-input-text-error');

    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    expect(el.classList).toContain('sn-input-text-error');
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

  it('reflects FormControl value in the native input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.setValue('hello');
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.value).toBe('hello');
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

  it('autoDisplayErrors hides sn-error until the control is touched & invalid', async () => {
    const fixture = TestBed.createComponent(AutoErrorsHost);
    await fixture.whenStable();
    // Invalid (required, empty) but untouched -> error not rendered.
    expect(fixture.nativeElement.querySelector('.sn-form-field-error')).toBeNull();

    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error).not.toBeNull();
    expect(error.textContent).toContain('Username is required');
  });

  it('autoDisplayErrors keeps errors hidden once the control becomes valid', async () => {
    const fixture = TestBed.createComponent(AutoErrorsHost);
    const ctrl = fixture.componentInstance.ctrl;
    ctrl.markAsTouched();
    ctrl.setValue('alice');
    ctrl.updateValueAndValidity();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-form-field-error')).toBeNull();
  });

  it('reflects disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.disabled).toBe(true);
  });

  it('enables input when FormControl is re-enabled', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.enable();
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.disabled).toBe(false);
  });

  it('reflects ngModel value changes in the native input', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.value = 'world';
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(el.value).toBe('world');
  });

  it('floats the label on focus (should-float class on the field)', async () => {
    const fixture = TestBed.createComponent(FloatFieldHost);
    await fixture.whenStable();
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(field.classList).not.toContain('sn-form-field-should-float');

    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    expect(field.classList).toContain('sn-form-field-should-float');
  });

  it('keeps the label floated while the input has a value after blur', async () => {
    const fixture = TestBed.createComponent(FloatFieldHost);
    await fixture.whenStable();
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(field.classList).toContain('sn-form-field-should-float');
  });

  it('applies plain string snClass to the host input', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies object snClass root section to the host input', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('my-root');
  });

  it('merges array snClass root sections in order', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('input');
    expect(el.classList).toContain('a');
    expect(el.classList).toContain('b');
  });
});
