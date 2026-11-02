import {
  Component,
  Directive,
  ElementRef,
  inject,
  provideZonelessChangeDetection,
  ChangeDetectionStrategy
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormField, FormFieldLabel } from 'ashen-ui/form-field';
import { InputText } from './input-text';

const TEMPLATE = '(___) ___-____';

/**
 * Stands in for any third-party mask: it writes characters into the element
 * that the user never typed, which is the exact situation the seam exists for.
 */
@Directive({ selector: 'input[fakeMask]' })
class FakeMask {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly host = inject(InputText, { self: true });

  constructor() {
    this.el.nativeElement.value = TEMPLATE;
    this.host.setEmptyPredicate(() => this.unmasked() === '');
  }

  unmasked(): string {
    return this.el.nativeElement.value.replace(/\D/g, '');
  }

  /** Fill the first `digits.length` slots, leaving the rest as placeholders. */
  type(digits: string): void {
    let i = 0;
    this.el.nativeElement.value = TEMPLATE.replace(/_/g, () => digits[i++] ?? '_');
    this.host.updateFilled();
  }
}

@Component({
  template: `
    <sn-form-field floatLabel="auto">
      <sn-label>Phone</sn-label>
      <input snInputText fakeMask />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText, FakeMask],
})
class MaskedHost {}

@Component({
  template: `
    <sn-form-field floatLabel="auto">
      <sn-label>Plain</sn-label>
      <input snInputText />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, InputText],
})
class PlainHost {}

describe('InputText emptiness seam', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function render<T>(type: new () => T) {
    const fixture = TestBed.createComponent(type);
    await fixture.whenStable();
    return fixture;
  }

  function floated(fixture: { nativeElement: HTMLElement }): boolean {
    return fixture.nativeElement
      .querySelector('sn-form-field')!
      .classList.contains('sn-form-field-should-float');
  }

  it('an unmodified input still treats "" as empty', async () => {
    const fixture = await render(PlainHost);
    expect(floated(fixture)).toBe(false);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(floated(fixture)).toBe(true);
  });

  it('a mask template in the element does not count as filled', async () => {
    const fixture = await render(MaskedHost);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    // The bug the seam removes: the element is non-empty from the first frame,
    // so the default rule floats the label over a field the user hasn't filled.
    expect(input.value).toBe(TEMPLATE);
    expect(floated(fixture)).toBe(false);
  });

  it('typing into the mask does count as filled', async () => {
    const fixture = await render(MaskedHost);
    fixture.debugElement.query(By.directive(FakeMask)).injector.get(FakeMask).type('555');
    await fixture.whenStable();
    expect(floated(fixture)).toBe(true);
  });

  it('setEmptyPredicate(null) restores the DOM-value default', async () => {
    const fixture = await render(MaskedHost);
    fixture.debugElement
      .query(By.directive(InputText))
      .injector.get(InputText)
      .setEmptyPredicate(null);
    await fixture.whenStable();
    // Back to the default rule, the mask template reads as filled again.
    expect(floated(fixture)).toBe(true);
  });
});
