import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputText } from 'ashen-ui/input-text';
import { Select } from 'ashen-ui/select';
import { FormField } from './form-field';
import { FormFieldLabel } from './form-field-label';
import { FormFieldHint } from './form-field-hint';
import { FormFieldError } from './form-field-error';

@Component({
  template: `
    <sn-form-field>
      <sn-label>Email</sn-label>
      <input snInputText id="email" />
      <sn-hint>Work address</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, InputText],
})
class AuthoredIdHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Email</sn-label>
      <input snInputText [id]="controlId()" />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText],
})
class BoundIdHost {
  readonly controlId = signal('first');
}

@Component({
  template: `
    <sn-form-field>
      <sn-label for="outside">Email</sn-label>
      <input snInputText />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText],
})
class AuthoredForHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Email</sn-label>
      <input snInputText aria-describedby="legend" />
      <sn-hint id="email-hint">Work address</sn-hint>
      <sn-error id="email-error">Required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, InputText],
})
class AuthoredDescribedByHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Country</sn-label>
      <sn-select id="country" />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, Select],
})
class AuthoredComponentIdHost {}

@Component({
  template: `<input snInputText id="standalone" aria-describedby="legend" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputText],
})
class NoFieldHost {}

describe('form field authored attributes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('keeps an authored control id and points the label at it', async () => {
    const fixture = TestBed.createComponent(AuthoredIdHost);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(input.getAttribute('id')).toBe('email');
    expect(label.getAttribute('for')).toBe('email');
  });

  it('still describes the control by the generated hint id', async () => {
    const fixture = TestBed.createComponent(AuthoredIdHost);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const hint: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(hint.id).toMatch(/^sn-ff-hint-/);
  });

  it('follows a bound control id when it changes', async () => {
    const fixture = TestBed.createComponent(BoundIdHost);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(label.getAttribute('for')).toBe('first');

    fixture.componentInstance.controlId.set('second');
    await fixture.whenStable();
    expect(input.getAttribute('id')).toBe('second');
    expect(label.getAttribute('for')).toBe('second');
  });

  it('generates a control id when none is authored', async () => {
    const fixture = TestBed.createComponent(BoundIdHost);
    fixture.componentInstance.controlId.set(undefined as unknown as string);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(input.getAttribute('id')).toMatch(/^sn-ff-ctrl-/);
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('honours an authored for on the label', async () => {
    const fixture = TestBed.createComponent(AuthoredForHost);
    await fixture.whenStable();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(label.getAttribute('for')).toBe('outside');
  });

  it('merges an authored aria-describedby with authored hint and error ids', async () => {
    const fixture = TestBed.createComponent(AuthoredDescribedByHost);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(fixture.nativeElement.querySelector('.sn-form-field-hint').id).toBe('email-hint');
    expect(input.getAttribute('aria-describedby')).toBe('legend email-hint');
  });

  it('leaves an authored id and aria-describedby alone with no field around', async () => {
    const fixture = TestBed.createComponent(NoFieldHost);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('id')).toBe('standalone');
    expect(input.getAttribute('aria-describedby')).toBe('legend');
  });

  it('moves an authored id off a component control onto its trigger', async () => {
    const fixture = TestBed.createComponent(AuthoredComponentIdHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-select');
    const trigger: HTMLElement = fixture.nativeElement.querySelector('.sn-select-trigger');
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(host.hasAttribute('id')).toBe(false);
    expect(trigger.id).toBe('country');
    expect(label.getAttribute('for')).toBe('country');
  });
});
