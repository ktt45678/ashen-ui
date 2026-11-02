import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Textarea } from './textarea';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { FormFieldError } from '../form-field/form-field-error';

@Component({
  template: `<textarea snTextarea placeholder="Type here"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class BasicHost {}

@Component({
  template: `<textarea snTextarea size="sm"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class SmSizeHost {}

@Component({
  template: `<textarea snTextarea size="lg"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class LgSizeHost {}

@Component({
  template: `<textarea snTextarea [invalid]="true"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class InvalidPropHost {}

@Component({
  template: `<textarea snTextarea [invalid]="invalid()"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class DynamicInvalidHost {
  readonly invalid = signal(false);
}

@Component({
  template: `<textarea snTextarea snClass="extra-cls"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class SnClassStringHost {}

@Component({
  template: `<textarea snTextarea [snClass]="{ root: 'my-root' }"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class SnClassObjectHost {}

@Component({
  template: `<textarea snTextarea [snClass]="[{ root: 'a' }, { root: 'b' }]"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Request body</sn-label>
      <textarea snTextarea></textarea>
      <sn-hint>JSON format</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, Textarea],
})
class WithFormFieldHost {}

@Component({
  template: `
    <sn-form-field [autoDisplayErrors]="false">
      <sn-label>Notes</sn-label>
      <textarea snTextarea></textarea>
      <sn-error>Required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldError, Textarea],
})
class WithFormFieldErrorHost {}

@Component({
  template: `<textarea snTextarea [formControl]="ctrl"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl('');
}

@Component({
  template: `<textarea snTextarea [formControl]="ctrl"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: '', disabled: true });
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Notes</sn-label>
      <textarea snTextarea [formControl]="ctrl"></textarea>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, Textarea, ReactiveFormsModule],
})
class FormFieldWithControlHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  template: `<textarea snTextarea [(ngModel)]="value"></textarea>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Textarea, FormsModule],
})
class NgModelHost {
  value = 'initial';
}

describe('Textarea', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-input-text class to the host textarea', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-input-text');
  });

  it('applies sn-textarea class to the host textarea', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-textarea');
  });

  it('applies sn-input-text-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-input-text-sm');
  });

  it('applies sn-input-text-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LgSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-input-text-lg');
  });

  it('does not apply size modifier for default md size', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).not.toContain('sn-input-text-sm');
    expect(el.classList).not.toContain('sn-input-text-lg');
  });

  it('applies sn-input-text-error when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidPropHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-input-text-error');
  });

  it('sets aria-invalid when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidPropHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('does not set aria-invalid when not invalid', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.getAttribute('aria-invalid')).toBeNull();
  });

  it('updates error class reactively when invalid signal changes', async () => {
    const fixture = TestBed.createComponent(DynamicInvalidHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).not.toContain('sn-input-text-error');

    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    expect(el.classList).toContain('sn-input-text-error');
  });

  it('sets id on textarea matching the form-field label for attribute', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(label.getAttribute('for')).toBe(textarea.id);
    expect(textarea.id).toBeTruthy();
  });

  it('sets aria-required when field is required', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const textarea: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.getAttribute('aria-required')).toBe('true');
  });

  it('sets aria-describedby pointing to hint id when no error', async () => {
    const fixture = TestBed.createComponent(WithFormFieldHost);
    await fixture.whenStable();
    const textarea: HTMLElement = fixture.nativeElement.querySelector('textarea');
    const hint: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(textarea.getAttribute('aria-describedby')).toContain(hint.id);
  });

  it('sets aria-describedby pointing to error id when error is present', async () => {
    const fixture = TestBed.createComponent(WithFormFieldErrorHost);
    await fixture.whenStable();
    const textarea: HTMLElement = fixture.nativeElement.querySelector('textarea');
    const error: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(textarea.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('reflects FormControl value in the native textarea', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.setValue('hello');
    await fixture.whenStable();
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(el.value).toBe('hello');
  });

  it('marks control as touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
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
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('sn-input-text-error');
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('reflects disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(el.disabled).toBe(true);
  });

  it('enables textarea when FormControl is re-enabled', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.ctrl.enable();
    await fixture.whenStable();
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(el.disabled).toBe(false);
  });

  it('reflects ngModel value changes in the native textarea', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.value = 'world';
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(el.value).toBe('world');
  });

  it('applies plain string snClass to the host textarea', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies object snClass root section to the host textarea', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('my-root');
  });

  it('merges array snClass root sections in order', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('textarea');
    expect(el.classList).toContain('a');
    expect(el.classList).toContain('b');
  });
});
