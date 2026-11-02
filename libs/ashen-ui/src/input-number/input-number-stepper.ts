import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SnIconRegistry } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import type { InputNumber } from './input-number';

/**
 * Stacked increment and decrement buttons for an `snInputNumber` input. Place it
 * after the input inside an `sn-input-group` so the two join as one control.
 *
 * The buttons are mouse and touch helpers only. They are skipped by Tab and
 * hidden from screen readers, because the number input already steps with the
 * arrow keys and announces itself as a spin button.
 */
@Component({
  selector: 'sn-input-number-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './input-number-stepper.html',
  host: { class: 'sn-input-number-stepper' },
})
export class InputNumberStepper {
  /** The input to step, e.g. `<input snInputNumber #qty="snInputNumber">` then `[for]="qty"`. */
  readonly for = input.required<InputNumber>();

  protected readonly icons = inject(SnIconRegistry);
}
