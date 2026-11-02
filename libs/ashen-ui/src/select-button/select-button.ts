import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  type SnClass,
  type SnAttrs,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snRenderGate,
  SN_PART_SOURCE,
  SnPart,
} from 'ashen-ui/core';
import { SN_SELECT_BUTTON, SelectButtonContext } from './select-button-token';

const SELECT_BUTTON_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-disabled'],
};

@Component({
  selector: 'sn-select-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './select-button.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectButton),
      multi: true,
    },
    {
      provide: SN_SELECT_BUTTON,
      useFactory: (self: SelectButton) => self.context,
      deps: [SelectButton],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => SelectButton) },
  ],
  host: {
    class: 'sn-select-button',
    '[class.sn-select-button-disabled]': 'isDisabled()',
    '[class.sn-select-button-animate]': '_animate()',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"group"',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
  },
})
export class SelectButton implements ControlValueAccessor, SnPartSource {
  readonly value: ModelSignal<unknown> = model<unknown>(undefined);
  protected readonly _animate = snRenderGate();
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    SELECT_BUTTON_RESERVED_ATTRS[section] ?? [];

  private readonly disabledFromForms = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChangeFn: (value: unknown) => void = () => {};
  private onTouchedFn: () => void = () => {};

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  readonly context: SelectButtonContext = {
    isDisabled: this.isDisabled,
    isSelected: (val: unknown): boolean => {
      const current = this.value();
      if (this.multiple()) {
        return Array.isArray(current) && current.includes(val);
      }
      return current === val;
    },
    toggle: (val: unknown): void => {
      if (this.isDisabled()) return;
      let next: unknown;
      if (this.multiple()) {
        const current = Array.isArray(this.value()) ? (this.value() as unknown[]) : [];
        next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      } else {
        next = val;
      }
      this.value.set(next);
      this.onChangeFn(next);
      this.onTouchedFn();
    },
    onTouched: () => this.onTouchedFn(),
  };

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromForms.set(disabled);
  }
}
