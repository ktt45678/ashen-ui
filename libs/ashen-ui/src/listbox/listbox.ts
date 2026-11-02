import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { snListNavigator } from 'ashen-ui/cdk';
import {
  SnListboxIntl,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_LISTBOX, snIsListboxValueSelected } from './listbox-token';
import { ListOption } from './list-option';

const LISTBOX_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-multiselectable', 'aria-label', 'aria-labelledby', 'aria-disabled'],
};

@Component({
  selector: 'sn-listbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './listbox.html',
  hostDirectives: [SnPart],
  providers: [
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Listbox) },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Listbox),
      multi: true,
    },
    {
      provide: SN_LISTBOX,
      useFactory: (self: Listbox) => self.context,
      deps: [Listbox],
    },
  ],
  host: {
    class: 'sn-listbox',
    '[class.sn-listbox-disabled]': 'isDisabled()',
    '[class]': 'snClassResolved()',
    '[attr.role]': '"listbox"',
    '[attr.aria-multiselectable]': 'multiple() ? "true" : null',
    '[attr.aria-label]': 'effectiveAriaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby() || null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Listbox implements ControlValueAccessor, SnPartSource {
  readonly value: ModelSignal<unknown> = model<unknown>(null);
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Mark selected options with a trailing check icon. */
  readonly checkmark = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    LISTBOX_RESERVED_ATTRS[section] ?? [];

  protected readonly options = contentChildren(ListOption);

  private readonly intl = inject(SnListboxIntl);

  protected readonly effectiveAriaLabel = computed(() =>
    this.ariaLabel() ?? (this.ariaLabelledby() ? null : this.intl.label),
  );

  private readonly disabledFromForms = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private onChangeFn: (value: unknown) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private readonly navigator = snListNavigator({
    items: this.options,
    orientation: 'vertical',
    homeAndEnd: true,
    typeahead: true,
    skipPredicate: (option) => option.disabled,
  });

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  private readonly isValueSelected = (val: unknown): boolean =>
    snIsListboxValueSelected(this.value(), this.multiple(), val);

  readonly context = {
    value: this.value,
    multiple: this.multiple,
    checkmark: this.checkmark,
    isDisabled: this.isDisabled,
    isSelected: this.isValueSelected,
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
    getTabIndex: (option: ListOption): number => {
      if (option.isDisabled()) return -1;
      const opts = this.options();
      // The first enabled selected option is the entry point, and the first
      // enabled option is the fallback when nothing is selected yet.
      const selected = opts.find((o) => !o.isDisabled() && this.isValueSelected(o.value()));
      if (selected) return selected === option ? 0 : -1;
      const firstEnabled = opts.find((o) => !o.isDisabled());
      return firstEnabled === option ? 0 : -1;
    },
    onTouched: () => this.onTouchedFn(),
  };

  protected onKeydown(event: KeyboardEvent): void {
    // The focused ListOption toggles itself on Space and Enter.
    if (event.key === ' ' || event.key === 'Enter') return;
    if (this.navigator.onKeydown(event)) {
      event.preventDefault();
    }
  }

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
