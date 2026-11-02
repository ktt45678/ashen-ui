import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputPassword } from './input-password';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { FormFieldError } from '../form-field/form-field-error';
import { provideSnIntl } from '../core/sn-intl';

@Component({
  template: `<sn-input-password />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class DefaultHost {}

@Component({
  template: `<sn-input-password [meter]="true" [value]="pw()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class MeterHost {
  readonly pw = signal('');
}

@Component({
  template: `<sn-input-password [disabled]="true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class DisabledHost {}

@Component({
  template: `<sn-input-password [invalid]="true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class InvalidHost {}

@Component({
  template: `<sn-input-password size="sm" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class SmSizeHost {}

@Component({
  template: `<sn-input-password size="lg" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class LgSizeHost {}

@Component({
  template: `<sn-input-password [(value)]="val" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class TwoWayHost {
  readonly val = signal('');
}

@Component({
  template: `<sn-input-password [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, ReactiveFormsModule],
})
class ReactiveFormHost {
  ctrl = new FormControl('');
}

@Component({
  template: `<sn-input-password [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, ReactiveFormsModule],
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl({ value: 'secret', disabled: true });
}

@Component({
  template: `<sn-input-password [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, ReactiveFormsModule],
})
class ReactiveFormValidationHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  template: `<sn-input-password [(ngModel)]="val" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, FormsModule],
})
class NgModelHost {
  readonly val = signal('');
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Password</sn-label>
      <sn-input-password />
      <sn-hint>Enter a strong password</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Password</sn-label>
      <sn-input-password [formControl]="ctrl" />
      @if (ctrl.touched && ctrl.invalid) {
        <sn-error>Password is required</sn-error>
      }
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword, FormField, FormFieldLabel, FormFieldError, ReactiveFormsModule],
})
class FormFieldReactiveHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  template: `<sn-input-password snClass="extra-cls" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class SnClassStringHost {}

@Component({
  template: `<sn-input-password [snClass]="{ root: 'root-x', input: 'input-x', toggle: 'toggle-x', meter: 'meter-x', meterBar: 'bar-x', meterLabel: 'label-x' }" [meter]="true" value="Testing123!" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-input-password showPasswordLabel="Reveal" hidePasswordLabel="Conceal" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class CustomLabelsHost {}

@Component({
  template: `
    <sn-input-password
      [meter]="true"
      value="Testing123!"
      [snStyle]="{
        root: { outline: '1px solid red' },
        input: { color: 'rgb(1, 2, 3)' },
        meter: { color: 'rgb(4, 5, 6)' },
        meterBar: { color: 'rgb(7, 8, 9)' },
        meterLabel: { color: 'rgb(10, 11, 12)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'pw-root', 'data-sn-hidden': 'evil' },
        input: {
          'data-testid': 'pw-input',
          type: 'email',
          disabled: true,
          id: 'hostile-id',
          'aria-invalid': 'false'
        },
        meter: { 'data-testid': 'pw-meter' },
        meterBar: { 'data-testid': 'pw-bar' },
        meterLabel: { 'data-testid': 'pw-label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPassword],
})
class SnPartHost {}

function getInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('input')!;
}

function getToggle(el: HTMLElement): HTMLButtonElement {
  return el.querySelector('.sn-input-password-toggle')!;
}

function getMeter(el: HTMLElement): HTMLElement | null {
  return el.querySelector('.sn-input-password-meter');
}

describe('InputPassword', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders host with sn-input-password class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-password');
    expect(host.classList).toContain('sn-input-password');
  });

  it('renders native input element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input).toBeTruthy();
  });

  it('renders toggle button', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn).toBeTruthy();
  });

  it('input type is password by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.type).toBe('password');
  });

  it('toggle flips input type to text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.type).toBe('text');
  });

  it('toggle flips back to password on second click', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    btn.click();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.type).toBe('password');
  });

  it('toggle shows visibility icon when password hidden', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-input-password-toggle .sn-icon');
    expect(icon.textContent.trim()).toBe('visibility');
  });

  it('toggle shows visibility_off icon when password visible', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-input-password-toggle .sn-icon');
    expect(icon.textContent.trim()).toBe('visibility_off');
  });

  it('toggle aria-label is show password by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn.getAttribute('aria-label')).toBe('Show password');
  });

  it('toggle aria-label changes to hide password when visible', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-label')).toBe('Hide password');
  });

  it('respects custom showPasswordLabel input', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn.getAttribute('aria-label')).toBe('Reveal');
  });

  it('respects custom hidePasswordLabel input', async () => {
    const fixture = TestBed.createComponent(CustomLabelsHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-label')).toBe('Conceal');
  });

  it('disables input when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('disables toggle button when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn.disabled).toBe(true);
  });

  it('does not flip type when disabled and toggle clicked', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    btn.click();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.type).toBe('password');
  });

  it('applies sn-input-text-error class when invalid=true', async () => {
    const fixture = TestBed.createComponent(InvalidHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('sn-input-text-error');
  });

  it('sets aria-invalid="true" when invalid', async () => {
    const fixture = TestBed.createComponent(InvalidHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('does not apply error class when not invalid', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).not.toContain('sn-input-text-error');
  });

  it('applies sn-input-text-sm for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmSizeHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('sn-input-text-sm');
  });

  it('applies sn-input-text-lg for size="lg"', async () => {
    const fixture = TestBed.createComponent(LgSizeHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('sn-input-text-lg');
  });

  it('does not apply size modifier for default size', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).not.toContain('sn-input-text-sm');
    expect(input.classList).not.toContain('sn-input-text-lg');
  });

  it('does not show meter when meter=false', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const meter = getMeter(fixture.nativeElement);
    expect(meter).toBeNull();
  });

  it('does not show meter when meter=true but value is empty', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    await fixture.whenStable();
    const meter = getMeter(fixture.nativeElement);
    expect(meter).toBeNull();
  });

  it('shows meter when meter=true and value is not empty', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('abc');
    await fixture.whenStable();
    const meter = getMeter(fixture.nativeElement);
    expect(meter).toBeTruthy();
  });

  it('shows Weak label for short simple password', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('abc');
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-input-password-meter-label');
    expect(label.textContent.trim()).toBe('Weak');
  });

  it('shows Fair label for password with len>=8 + mixed case', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('Abcdefgh');
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-input-password-meter-label');
    expect(label.textContent.trim()).toBe('Fair');
  });

  it('shows Good label for password with len>=8 + mixed case + digit', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('Abcdefg1');
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-input-password-meter-label');
    expect(label.textContent.trim()).toBe('Good');
  });

  it('shows Strong label for password with all criteria', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('Abcdefg1!');
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-input-password-meter-label');
    expect(label.textContent.trim()).toBe('Strong');
  });

  it('meter bar width is 25% for score 1 (weak)', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('abcdefgh');
    await fixture.whenStable();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.sn-input-password-meter-bar');
    expect(bar.style.width).toBe('25%');
  });

  it('meter bar width is 100% for score 4 (strong)', async () => {
    const fixture = TestBed.createComponent(MeterHost);
    fixture.componentInstance.pw.set('Abcdefg1!');
    await fixture.whenStable();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.sn-input-password-meter-bar');
    expect(bar.style.width).toBe('100%');
  });

  it('reflects value model in input', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.val.set('mypassword');
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.value).toBe('mypassword');
  });

  it('updates value model on input event', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    input.value = 'newval';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('newval');
  });

  it('writes FormControl value to input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.setValue('testpass');
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.value).toBe('testpass');
  });

  it('emits value to FormControl on input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    input.value = 'newpass';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe('newpass');
  });

  it('marks FormControl as touched on blur', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.touched).toBe(true);
  });

  it('disables input when FormControl is disabled', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('applies setDisabledState via FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.disabled).toBe(false);
  });

  it('applies error class after touch+invalid on reactive form', async () => {
    const fixture = TestBed.createComponent(ReactiveFormValidationHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('sn-input-text-error');
  });

  it('reflects ngModel value in input', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.val.set('ngpass');
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.value).toBe('ngpass');
  });

  it('updates ngModel on input event', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    input.value = 'updated';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe('updated');
  });

  it('sets input id from FormField controlId', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.id).toMatch(/^sn-ff-ctrl/);
  });

  it('sets aria-describedby from FormField hint', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('applies error class via FormField after reactive form touch+invalid', async () => {
    const fixture = TestBed.createComponent(FormFieldReactiveHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity();
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('sn-input-text-error');
  });

  it('applies string snClass to root host', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-password');
    expect(host.classList).toContain('extra-cls');
  });

  it('applies object snClass root section to host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-input-password');
    expect(host.classList).toContain('root-x');
  });

  it('applies object snClass input section to input element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const input = getInput(fixture.nativeElement);
    expect(input.classList).toContain('input-x');
  });

  it('applies object snClass toggle section to toggle button', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn.classList).toContain('toggle-x');
  });

  it('applies object snClass meter section to meter element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const meter = getMeter(fixture.nativeElement);
    expect(meter).toBeTruthy();
    expect(meter!.classList).toContain('meter-x');
  });

  it('applies object snClass meterBar section to bar element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.sn-input-password-meter-bar');
    expect(bar.classList).toContain('bar-x');
  });

  it('applies object snClass meterLabel section to label element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const label: HTMLElement = fixture.nativeElement.querySelector('.sn-input-password-meter-label');
    expect(label.classList).toContain('label-x');
  });

  it('uses custom SnIntl labels via provideSnIntl', async () => {
    TestBed.overrideComponent(DefaultHost, { set: { providers: [provideSnIntl({ showPassword: 'Reveal', hidePassword: 'Conceal' })] } });
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const btn = getToggle(fixture.nativeElement);
    expect(btn.getAttribute('aria-label')).toBe('Reveal');
  });

  it('applies snStyle and allowed snAttrs to named parts without breaking reserved input attrs', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-input-password')!;
    const input = getInput(el);
    const meter = getMeter(el)!;
    const bar: HTMLElement = el.querySelector('.sn-input-password-meter-bar')!;
    const label: HTMLElement = el.querySelector('.sn-input-password-meter-label')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('pw-root');
    expect(root.getAttribute('data-sn-hidden')).not.toBe('evil');

    expect(input.style.color).toBe('rgb(1, 2, 3)');
    expect(input.getAttribute('data-testid')).toBe('pw-input');
    // type, disabled, id and aria-invalid are library-owned; the hostile overrides never land.
    expect(input.type).toBe('password');
    expect(input.disabled).toBe(false);
    expect(input.getAttribute('id')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();

    expect(meter.style.color).toBe('rgb(4, 5, 6)');
    expect(meter.getAttribute('data-testid')).toBe('pw-meter');
    expect(bar.style.color).toBe('rgb(7, 8, 9)');
    expect(bar.getAttribute('data-testid')).toBe('pw-bar');
    expect(label.style.color).toBe('rgb(10, 11, 12)');
    expect(label.getAttribute('data-testid')).toBe('pw-label');
  });
});
