import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  IconTemplate,
  SnIconRegistry,
  snRenderGate,
} from 'ashen-ui/core';

export type CheckboxSize = 'sm' | 'md' | 'lg';

const CHECKBOX_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-checked', 'aria-disabled', 'tabindex'],
  box: ['aria-hidden'],
  icon: ['aria-hidden'],
};

@Component({
  selector: 'sn-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './checkbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Checkbox) },
  ],
  host: {
    class: 'sn-checkbox-wrapper',
    '[class.sn-checkbox-checked]': 'checked()',
    '[class.sn-checkbox-indeterminate]': 'effectiveIndeterminate()',
    '[class.sn-checkbox-disabled]': 'isDisabled()',
    '[class.sn-checkbox-animate]': '_animate()',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"checkbox"',
    '[attr.aria-checked]': 'effectiveIndeterminate() ? "mixed" : checked()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)',
    '(blur)': 'onHostBlur()',
  },
})
export class Checkbox implements ControlValueAccessor, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly checked = model(false);
  protected readonly _animate = snRenderGate();
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<CheckboxSize>('md');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CHECKBOX_RESERVED_ATTRS[section] ?? [];

  protected readonly iconTemplates = contentChildren(IconTemplate);

  // User interaction clears indeterminate; setting the input re-asserts it.
  protected readonly effectiveIndeterminate = linkedSignal(() => this.indeterminate());

  private readonly disabledFromForms = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly checkIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'check') ??
    this.iconTemplates().find((t) => !t.snIcon()) ??
    null,
  );

  protected readonly indeterminateIconTpl = computed(() =>
    this.iconTemplates().find((t) => t.snIcon() === 'indeterminate') ?? null,
  );

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly boxClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'box', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly iconSize = computed(() => (this.size() === 'sm' ? 12 : 16));

  protected onHostClick(): void {
    if (this.isDisabled()) return;
    this.toggle();
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  private toggle(): void {
    const next = this.effectiveIndeterminate() ? true : !this.checked();
    this.effectiveIndeterminate.set(false);
    this.checked.set(next);
    this.onChange(next);
  }

  protected onHostBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromForms.set(disabled);
  }
}
