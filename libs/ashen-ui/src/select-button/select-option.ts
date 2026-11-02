import {
  Directive,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { type SnClass, resolveSnClass } from 'ashen-ui/core';
import { SN_SELECT_BUTTON } from './select-button-token';

@Directive({
  selector: 'button[snSelectOption]',
  host: {
    class: 'sn-select-option',
    type: 'button',
    '[class.sn-select-option-selected]': 'selected()',
    '[class]': 'snClassResolved()',
    '[attr.aria-pressed]': 'selected()',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '(click)': 'onClick()',
  },
})
export class SelectOption {
  private readonly group = inject(SN_SELECT_BUTTON);

  readonly value = input.required<unknown>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();

  readonly selected = computed(() => this.group.isSelected(this.value()));
  readonly isDisabled = computed(() => this.group.isDisabled() || this.disabled());

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected onClick(): void {
    if (this.isDisabled()) return;
    this.group.toggle(this.value());
  }
}
