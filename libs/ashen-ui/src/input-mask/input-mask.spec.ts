import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { FormField, FormFieldLabel } from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';
import { InputMask } from './input-mask';

@Component({
  template: `
    <sn-form-field floatLabel="auto">
      <sn-label>Phone</sn-label>
      <input snInputText snMask="(999) 999-9999" [(ngModel)]="phone" />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText, InputMask, FormsModule],
})
class NgModelHost {
  phone = '';
}

@Component({
  template: `<input snInputText snMask="(999) 999-9999" unmask [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask, ReactiveFormsModule],
})
class UnmaskHost {
  readonly ctrl = new FormControl('');
}

@Component({
  template: `<input snInputText [snMask]="mask()" [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask, ReactiveFormsModule],
})
class DynamicMaskHost {
  readonly mask = signal('999-999');
  readonly ctrl = new FormControl('');
}

@Component({
  template: `<input snInputText snMask="99/99/9999" placeholder="Pick a date" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask],
})
class OwnPlaceholderHost {}

@Component({
  template: `<input snInputText snMask="99:99:99" [placeholder]="text" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask],
})
class BoundPlaceholderHost {
  readonly text = 'Duration (hh:mm:ss)';
}

@Component({
  template: `<input snInputText snMask="99:99:99" [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask, ReactiveFormsModule],
})
class AutoClearHost {
  readonly ctrl = new FormControl('', { nonNullable: true });
}

@Component({
  template: `<input snInputText snMask="99:99:99" [autoClear]="false" [formControl]="ctrl" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText, InputMask, ReactiveFormsModule],
})
class RetainIncompleteHost {
  readonly ctrl = new FormControl('', { nonNullable: true });
}

describe('InputMask', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function render<T>(type: new () => T) {
    const fixture = TestBed.createComponent(type);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    return { fixture, input };
  }

  /** Type as a browser would: set the value, put the caret at the end, fire `input`. */
  function type(input: HTMLInputElement, text: string): void {
    input.value = text;
    input.setSelectionRange(text.length, text.length);
    input.dispatchEvent(new Event('input'));
  }

  it('formats as the user types', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, '5');
    await fixture.whenStable();
    expect(input.value).toBe('(5');

    type(input, '(555');
    await fixture.whenStable();
    expect(input.value).toBe('(555) ');
  });

  it('shows the mask template as the placeholder, not as the value', async () => {
    const { input } = await render(NgModelHost);
    // The whole reason the template lives in the placeholder: an untouched
    // field has to stay genuinely empty.
    expect(input.placeholder).toBe('(___) ___-____');
    expect(input.value).toBe('');
  });

  it('leaves an app-supplied placeholder alone', async () => {
    const { input } = await render(OwnPlaceholderHost);
    expect(input.placeholder).toBe('Pick a date');
  });

  it('keeps a bound placeholder over the mask template', async () => {
    const { input } = await render(BoundPlaceholderHost);
    expect(input.placeholder).toBe('Duration (hh:mm:ss)');
  });

  it('does not float the label until something is typed', async () => {
    const { fixture, input } = await render(NgModelHost);
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(field.classList.contains('sn-form-field-should-float')).toBe(false);

    type(input, '5');
    await fixture.whenStable();
    expect(field.classList.contains('sn-form-field-should-float')).toBe(true);
  });

  it('reports the masked value to the model by default', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, '5551234567');
    await fixture.whenStable();
    expect(input.value).toBe('(555) 123-4567');
    expect(fixture.componentInstance.phone).toBe('(555) 123-4567');
  });

  it('reports the bare value when [unmask] is set', async () => {
    const { fixture, input } = await render(UnmaskHost);
    type(input, '5551234567');
    await fixture.whenStable();
    // The element still shows the mask; only the model differs.
    expect(input.value).toBe('(555) 123-4567');
    expect(fixture.componentInstance.ctrl.value).toBe('5551234567');
  });

  it('masks a value written from the model', async () => {
    const { fixture, input } = await render(UnmaskHost);
    fixture.componentInstance.ctrl.setValue('5551234567');
    await fixture.whenStable();
    expect(input.value).toBe('(555) 123-4567');
  });

  it('marks a complete value with data-sn-mask-complete', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, '555123');
    await fixture.whenStable();
    expect(input.getAttribute('data-sn-mask-complete')).toBeNull();

    type(input, '5551234567');
    await fixture.whenStable();
    expect(input.getAttribute('data-sn-mask-complete')).toBe('');
  });

  it('clears an incomplete value and model on blur by default', async () => {
    const { fixture, input } = await render(AutoClearHost);
    type(input, '1234');
    await fixture.whenStable();
    expect(input.value).toBe('12:34:');
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(true);

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(input.value).toBe('');
    expect(fixture.componentInstance.ctrl.value).toBe('');
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(false);
  });

  it('retains and validates an incomplete value when autoClear is false', async () => {
    const { fixture, input } = await render(RetainIncompleteHost);
    type(input, '1234');
    await fixture.whenStable();
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(input.value).toBe('12:34:');
    expect(fixture.componentInstance.ctrl.value).toBe('12:34:');
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(true);

    type(input, '123456');
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(false);
  });

  it('reformats the existing value when the mask changes', async () => {
    const { fixture, input } = await render(DynamicMaskHost);
    type(input, '123456');
    await fixture.whenStable();
    expect(input.value).toBe('123-456');

    fixture.componentInstance.mask.set('99/99/99');
    await fixture.whenStable();
    // Same data, new shape.
    expect(input.value).toBe('12/34/56');
  });

  it('revalidates an incomplete value when the mask changes', async () => {
    const { fixture, input } = await render(DynamicMaskHost);
    type(input, '12');
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(true);

    fixture.componentInstance.mask.set('99');
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.hasError('maskIncomplete')).toBe(false);
  });

  it('drops characters the mask rejects', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, 'abc555');
    await fixture.whenStable();
    expect(input.value).toBe('(555) ');
  });

  it('accepts a paste that already carries the literals', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, '(555) 123-4567');
    await fixture.whenStable();
    expect(input.value).toBe('(555) 123-4567');
  });

  it('deleting a literal removes the data character in front of it', async () => {
    const { fixture, input } = await render(NgModelHost);
    type(input, '5551234567');
    await fixture.whenStable();
    expect(input.value).toBe('(555) 123-4567');

    // Backspace over the "-": the browser hands us the value without it, the
    // mask would put it straight back, and the keystroke would do nothing.
    input.value = '(555) 1234567';
    input.setSelectionRange(9, 9);
    input.dispatchEvent(new InputEvent('beforeinput', { inputType: 'deleteContentBackward' }));
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(input.value).toBe('(555) 124-567');
  });
});
