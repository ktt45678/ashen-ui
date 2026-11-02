import {
  Directive,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type SnClass, resolveSnClass, IconTemplate, snRenderGate } from 'ashen-ui/core';

export type ToggleButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[snToggleButton]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButton),
      multi: true,
    },
  ],
  host: {
    class: 'sn-toggle-button',
    type: 'button',
    '[class.sn-toggle-button-sm]': 'size() === "sm"',
    '[class.sn-toggle-button-lg]': 'size() === "lg"',
    '[class.sn-toggle-button-selected]': 'selected()',
    '[class.sn-toggle-button-animate]': '_animate()',
    '[class]': 'snClassResolved()',
    '[attr.aria-pressed]': 'selected()',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.data-sn-size]': 'size()',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)',
    '(blur)': 'onHostBlur()',
  },
})
export class ToggleButton implements ControlValueAccessor {
  readonly selected = model(false);
  protected readonly _animate = snRenderGate();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<ToggleButtonSize>('md');
  readonly snClass = input<SnClass>();

  protected readonly iconTemplates = contentChildren(IconTemplate);

  private readonly disabledFromForms = signal(false);

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected onHostClick(): void {
    if (this.isDisabled()) return;
    const next = !this.selected();
    this.selected.set(next);
    this.onChange(next);
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const next = !this.selected();
      this.selected.set(next);
      this.onChange(next);
    }
  }

  protected onHostBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.selected.set(!!value);
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
