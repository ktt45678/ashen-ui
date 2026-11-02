import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import {
  type SnClass,
  resolveSnClass,
  snNextId,
} from 'ashen-ui/core';
import { SN_STEPPER } from './stepper-token';

@Component({
  selector: 'sn-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step.html',
  host: {
    class: 'sn-step',
    '[class]': 'rootClassExtra()',
  },
})
export class Step implements FocusableOption {
  readonly label = input('');
  readonly icon = input('');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly completedInput = input<boolean | undefined>(undefined, { alias: 'completed' });
  readonly snClass = input<SnClass>();

  get disabled(): boolean {
    return this.disabledInput();
  }

  readonly stepId = snNextId('sn-step');
  readonly buttonId = `${this.stepId}-btn`;
  readonly panelId = `${this.stepId}-panel`;

  protected readonly stepper = inject(SN_STEPPER, { optional: true });
  protected readonly contentTpl = viewChild<TemplateRef<unknown>>('contentTemplate');

  readonly index = computed(() => this.stepper?.indexOf(this) ?? -1);

  readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly buttonClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'header', false),
  );

  readonly markerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'marker', false),
  );

  readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  readonly panelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'panel', false),
  );

  isCompleted(): boolean {
    if (this.completedInput() !== undefined) return this.completedInput()!;
    if (!this.stepper) return false;
    return this.index() < this.stepper.activeStep();
  }

  isCurrent(): boolean {
    if (!this.stepper) return false;
    return this.index() === this.stepper.activeStep();
  }

  focus(): void {
    this.stepper?.focusStep(this.stepId);
  }

  getContentTemplate(): TemplateRef<unknown> | null {
    return this.contentTpl() ?? null;
  }
}
