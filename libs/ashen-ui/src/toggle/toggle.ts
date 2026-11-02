import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snRenderGate,
} from 'ashen-ui/core';

export type ToggleSize = 'sm' | 'md' | 'lg';

const TOGGLE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-checked', 'aria-disabled', 'tabindex'],
  track: ['aria-hidden'],
};

@Component({
  selector: 'sn-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './toggle.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Toggle) },
  ],
  host: {
    class: 'sn-toggle-wrapper',
    '[class.sn-toggle-checked]': 'checked()',
    '[class.sn-toggle-animate]': '_animate()',
    '[class.sn-toggle-disabled]': 'isDisabled()',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"switch"',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)',
    '(blur)': 'onHostBlur()',
  },
})
export class Toggle implements ControlValueAccessor, SnPartSource {
  readonly checked = model(false);

  protected readonly _animate = snRenderGate();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<ToggleSize>('md');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    TOGGLE_RESERVED_ATTRS[section] ?? [];

  private readonly disabledFromForms = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly trackClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'track', false),
  );

  protected readonly thumbClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'thumb', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  protected onHostClick(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const next = !this.checked();
      this.checked.set(next);
      this.onChange(next);
    }
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
