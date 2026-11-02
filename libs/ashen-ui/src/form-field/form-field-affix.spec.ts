import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField } from './form-field';
import { FormFieldLabel } from './form-field-label';
import { FormFieldPrefix, FormFieldSuffix } from './form-field-affix';
import { InputText } from 'ashen-ui/input-text';

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input snInputText />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText],
})
class NoAffixHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Amount</sn-label>
      <span snPrefix id="the-prefix">$</span>
      <input snInputText />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldPrefix, InputText],
})
class PrefixHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Search</sn-label>
      <input snInputText />
      <button snSuffix type="button" id="the-suffix">go</button>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldSuffix, InputText],
})
class SuffixHost {}

@Component({
  template: `
    <sn-form-field [snClass]="{ prefix: 'px-class', suffix: 'sx-class' }">
      <span snPrefix>a</span>
      <input snInputText />
      <span snSuffix>b</span>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldPrefix, FormFieldSuffix, InputText],
})
class BothHost {}

@Component({
  template: `
    <sn-form-field>
      @if (show()) {
        <span snSuffix>x</span>
      }
      <input snInputText />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldSuffix, InputText],
})
class ToggleHost {
  readonly show = signal(false);
}

describe('FormField affixes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function render<T>(type: new () => T) {
    const fixture = TestBed.createComponent(type);
    await fixture.whenStable();
    return fixture;
  }

  it('a field with no affix carries no affix state', async () => {
    const fixture = await render(NoAffixHost);
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    // The guard on every affix CSS rule; without it every field gains affix padding.
    expect(field.classList.contains('sn-form-field-has-prefix')).toBe(false);
    expect(field.classList.contains('sn-form-field-has-suffix')).toBe(false);
    expect(field.getAttribute('data-sn-has-prefix')).toBeNull();
    expect(field.getAttribute('data-sn-has-suffix')).toBeNull();
  });

  it('snPrefix marks the field and projects into the prefix slot', async () => {
    const fixture = await render(PrefixHost);
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(field.classList.contains('sn-form-field-has-prefix')).toBe(true);
    expect(field.getAttribute('data-sn-has-prefix')).toBe('');
    expect(field.classList.contains('sn-form-field-has-suffix')).toBe(false);

    const slot = fixture.nativeElement.querySelector('.sn-form-field-affix--prefix');
    expect(slot.querySelector('#the-prefix')).not.toBeNull();
  });

  it('snSuffix marks the field and projects into the suffix slot', async () => {
    const fixture = await render(SuffixHost);
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(field.classList.contains('sn-form-field-has-suffix')).toBe(true);
    expect(field.getAttribute('data-sn-has-suffix')).toBe('');
    expect(field.classList.contains('sn-form-field-has-prefix')).toBe(false);

    const slot = fixture.nativeElement.querySelector('.sn-form-field-affix--suffix');
    expect(slot.querySelector('#the-suffix')).not.toBeNull();
  });

  it('the control stays a sibling of both slots, not inside one', async () => {
    const fixture = await render(BothHost);
    const flex: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-flex');
    const input = fixture.nativeElement.querySelector('input');
    // The padding rule targets `.sn-form-field-flex > :not(.sn-form-field-affix)`,
    // so the control has to be a direct child of the row.
    expect(input.parentElement).toBe(flex);
    expect(flex.querySelectorAll(':scope > .sn-form-field-affix').length).toBe(2);
  });

  it('routes snClass prefix/suffix sections to their slots', async () => {
    const fixture = await render(BothHost);
    expect(
      fixture.nativeElement
        .querySelector('.sn-form-field-affix--prefix')
        .classList.contains('px-class'),
    ).toBe(true);
    expect(
      fixture.nativeElement
        .querySelector('.sn-form-field-affix--suffix')
        .classList.contains('sx-class'),
    ).toBe(true);
  });

  it('tracks an affix that appears after first render', async () => {
    const fixture = await render(ToggleHost);
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(field.classList.contains('sn-form-field-has-suffix')).toBe(false);

    fixture.componentInstance.show.set(true);
    await fixture.whenStable();
    expect(field.classList.contains('sn-form-field-has-suffix')).toBe(true);
  });
});
