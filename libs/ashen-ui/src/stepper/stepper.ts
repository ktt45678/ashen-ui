import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocusableOption } from '@angular/cdk/a11y';
import {
  SN_PART_SOURCE,
  SnIconRegistry,
  SnPart,
  SnStepperIntl,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snRenderGate,
} from 'ashen-ui/core';
import { snListNavigator } from 'ashen-ui/cdk';
import { Icon } from 'ashen-ui/icon';
import { SN_STEPPER } from './stepper-token';
import { Step } from './step';

const STEPPER_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  list: ['aria-label'],
  header: ['type', 'id', 'aria-current', 'aria-controls', 'tabindex', 'disabled'],
  marker: ['aria-hidden'],
  connector: ['aria-hidden'],
  panel: ['role', 'id', 'aria-labelledby'],
};

@Component({
  selector: 'sn-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './stepper.html',
  providers: [
    {
      provide: SN_STEPPER,
      useFactory: (self: Stepper) => self.context,
      deps: [Stepper],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Stepper) },
  ],
  host: {
    class: 'sn-stepper',
    '[class.sn-stepper-animate]': '_animate()',
    '[class.sn-stepper--horizontal]': 'orientation() === "horizontal"',
    '[class.sn-stepper--vertical]': 'orientation() === "vertical"',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-orientation]': 'orientation()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Stepper implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly activeStep = model(0);
  protected readonly _animate = snRenderGate();
  readonly linear = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** `aria-label` of the step list. Defaults to `SnStepperIntl.label`. */
  readonly ariaLabel = input<string>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  private readonly intl = inject(SnStepperIntl);
  protected readonly listLabel = computed(() => this.ariaLabel() || this.intl.label);

  readonly reservedAttrs = (section: string): readonly string[] =>
    STEPPER_RESERVED_ATTRS[section] ?? [];

  protected readonly stepItems = contentChildren(Step);
  protected readonly stepButtons = viewChildren<ElementRef<HTMLButtonElement>>('stepBtn');

  private readonly focusableSteps = computed(
    () => this.stepItems() as unknown as FocusableOption[],
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly listClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'list', false),
  );

  protected readonly panelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'panel', false),
  );

  /**
   * A vertical stepper is the same list read down the page, so the navigator
   * takes the orientation and owns which arrows move it, including in RTL.
   */
  private readonly navigator = snListNavigator({
    items: this.focusableSteps,
    orientation: this.orientation,
    wrap: true,
    homeAndEnd: true,
    skipPredicate: (item) => (item as unknown as Step).disabled,
  });

  readonly context = {
    activeStep: this.activeStep.asReadonly(),
    linear: this.linear,
    selectStep: (index: number) => {
      const steps = this.stepItems();
      if (index < 0 || index >= steps.length) return;
      const step = steps[index];
      if (step.disabled) return;
      if (this.linear() && index > this.activeStep() + 1) return;
      this.activeStep.set(index);
    },
    focusStep: (stepId: string) => {
      const index = this.stepItems().findIndex((s) => s.stepId === stepId);
      this.stepButtons()[index]?.nativeElement.focus();
    },
    indexOf: (step: FocusableOption) => this.stepItems().findIndex((s) => s === step),
  };

  constructor() {
    effect(() => {
      const idx = this.activeStep();
      this.stepItems();
      // Untracked for the same reason as Tabs: setting the active item reads
      // it too, and tracking that read makes this effect answer its own write.
      untracked(() => this.navigator.setActiveItem(idx));
    });
  }

  protected isStepClickable(index: number): boolean {
    const steps = this.stepItems();
    const step = steps[index];
    if (!step || step.disabled) return false;
    if (this.linear()) {
      return index <= this.activeStep() || index === this.activeStep() + 1;
    }
    return true;
  }

  protected selectAndFocus(index: number): void {
    if (!this.isStepClickable(index)) return;
    this.activeStep.set(index);
    this.navigator.setActiveItem(index);
  }

  protected getStepState(index: number): 'completed' | 'active' | 'upcoming' {
    const steps = this.stepItems();
    const step = steps[index];
    if (step?.isCompleted()) return 'completed';
    if (index === this.activeStep()) return 'active';
    return 'upcoming';
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.navigator.onKeydown(event)) return;
    event.preventDefault();
    const activeIndex = this.navigator.activeIndex();
    if (activeIndex === null) return;
    const step = this.stepItems()[activeIndex];
    if (step && !step.disabled && this.isStepClickable(activeIndex)) {
      this.activeStep.set(activeIndex);
    }
  }
}
