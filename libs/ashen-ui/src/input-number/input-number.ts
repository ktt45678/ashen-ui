import { Directive, ElementRef, inject, input } from '@angular/core';
import { InputText } from 'ashen-ui/input-text';

export type InputNumberSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'input[snInputNumber]',
  exportAs: 'snInputNumber',
  hostDirectives: [{ directive: InputText, inputs: ['size', 'invalid', 'snClass'] }],
  host: {
    class: 'sn-input-number',
    type: 'number',
    '[attr.min]': 'min() ?? null',
    '[attr.max]': 'max() ?? null',
    '[attr.step]': 'step()',
    '(blur)': 'clampToRange()',
  },
})
export class InputNumber {
  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input<number>(1);

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Adds one step, staying within min/max. Does nothing while disabled or read-only. */
  stepUp(): void {
    this.stepBy(1);
  }

  /** Subtracts one step, staying within min/max. Does nothing while disabled or read-only. */
  stepDown(): void {
    this.stepBy(-1);
  }

  private stepBy(direction: 1 | -1): void {
    const el = this.el.nativeElement;
    if (el.disabled || el.readOnly) return;

    const before = el.value;
    if (direction > 0) el.stepUp();
    else el.stepDown();
    // The native step methods do not fire events, so tell form bindings.
    if (el.value !== before) el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  protected clampToRange(): void {
    const el = this.el.nativeElement;
    if (el.value === '') return;

    const val = parseFloat(el.value);
    const minVal = this.min();
    const maxVal = this.max();
    let clamped = val;

    if (minVal !== undefined && val < minVal) clamped = minVal;
    if (maxVal !== undefined && val > maxVal) clamped = maxVal;

    if (clamped !== val) {
      el.value = String(clamped);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
