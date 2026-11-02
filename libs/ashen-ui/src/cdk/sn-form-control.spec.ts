import { Component, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SN_FORM_FIELD, type SnFormFieldContext } from 'ashen-ui/core';
import { snFormControl } from './sn-form-control';

const field: SnFormFieldContext = {
  controlId: () => 'test-control',
  setControlId: () => {},
  invalid: () => false,
  required: () => false,
  hasError: () => false,
  filled: () => false,
  getDescribedBy: () => null,
  registerFocus: () => {},
  setInvalid: () => {},
  setRequired: () => {},
  setFilled: vi.fn(),
  setLabelWidth: () => {},
  registerDescribedBy: () => {},
  unregisterDescribedBy: () => {},
  isReady: () => true,
  setErrorState: () => {},
};

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [{ provide: SN_FORM_FIELD, useValue: field }],
})
class FormControlHost {
  readonly value = model<string | null>(null);
  readonly disabled = signal(false);
  readonly control = snFormControl({
    value: this.value,
    disabled: this.disabled,
    isEmpty: (value) => !value?.trim(),
  });
}

describe('snFormControl', () => {
  let fixture: ComponentFixture<FormControlHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(FormControlHost);
    await fixture.whenStable();
    vi.mocked(field.setFilled).mockClear();
  });

  it('commits a value through the model, form callbacks, and form field', () => {
    const changed = vi.fn();
    const touched = vi.fn();
    fixture.componentInstance.control.registerOnChange(changed);
    fixture.componentInstance.control.registerOnTouched(touched);

    fixture.componentInstance.control.commit('hello');

    expect(fixture.componentInstance.value()).toBe('hello');
    expect(changed).toHaveBeenCalledWith('hello');
    expect(touched).toHaveBeenCalledOnce();
    expect(field.setFilled).toHaveBeenCalledWith(true);
  });

  it('writes form values without reporting a user interaction', () => {
    const changed = vi.fn();
    const touched = vi.fn();
    fixture.componentInstance.control.registerOnChange(changed);
    fixture.componentInstance.control.registerOnTouched(touched);

    fixture.componentInstance.control.writeValue('   ');

    expect(fixture.componentInstance.value()).toBe('   ');
    expect(changed).not.toHaveBeenCalled();
    expect(touched).not.toHaveBeenCalled();
    expect(field.setFilled).toHaveBeenCalledWith(false);
  });

  it('combines component and forms disabled state', async () => {
    const { control, disabled } = fixture.componentInstance;

    expect(control.isDisabled()).toBe(false);
    disabled.set(true);
    await fixture.whenStable();
    expect(control.isDisabled()).toBe(true);

    disabled.set(false);
    control.setDisabledState(true);
    await fixture.whenStable();
    expect(control.isDisabled()).toBe(true);
  });
});
