import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FocusableOption, FocusOrigin, Highlightable } from '@angular/cdk/a11y';
import { Icon } from 'ashen-ui/icon';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snNextId,
} from 'ashen-ui/core';
import { SN_LISTBOX, snIsListboxValueSelected } from './listbox-token';

const LIST_OPTION_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'id', 'aria-selected', 'aria-disabled', 'tabindex'],
};

@Component({
  selector: 'sn-list-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  templateUrl: './list-option.html',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ListOption) }],
  host: {
    class: 'sn-listbox-option',
    '[class.sn-listbox-option-selected]': 'selected()',
    '[class.sn-listbox-option-disabled]': 'isDisabled()',
    '[class.sn-listbox-option-active]': 'active()',
    '[class]': 'snClassResolved()',
    '[attr.id]': 'id()',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.data-sn-active]': 'active() ? "" : null',
    '(click)': 'onHostClick()',
    '(keydown)': 'onHostKeydown($event)',
    '(focus)': 'onHostFocus()',
    '(blur)': 'onHostBlur()',
  },
})
export class ListOption implements FocusableOption, Highlightable, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly value = input<unknown>();
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    LIST_OPTION_RESERVED_ATTRS[section] ?? [];

  protected readonly context = inject(SN_LISTBOX);
  readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly elementRef = this._el;

  readonly id = signal(snNextId('sn-list-option'));
  readonly active = signal(false);

  get disabled(): boolean {
    return this.isDisabled();
  }

  readonly isDisabled = computed(() => this.context.isDisabled() || this.disabledInput());

  readonly selected = computed(() =>
    this.context.isSelected
      ? this.context.isSelected(this.value())
      : snIsListboxValueSelected(this.context.value(), this.context.multiple(), this.value()),
  );

  readonly tabIndex = computed(() => this.context.getTabIndex(this));

  readonly showCheckbox = computed(() => this.context.checkbox?.() === true);

  readonly showCheckmark = computed(
    () => !this.showCheckbox() && this.context.checkmark?.() === true,
  );

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly checkClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'check', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  protected onHostClick(): void {
    if (this.isDisabled()) return;
    this.context.toggle(this.value());
  }

  protected onHostKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.isDisabled()) {
        this.context.toggle(this.value());
      }
    }
  }

  protected onHostFocus(): void {
    this.context.onTouched();
  }

  protected onHostBlur(): void {
    this.context.onTouched();
  }

  setActiveStyles(): void {
    this.active.set(true);
  }

  setInactiveStyles(): void {
    this.active.set(false);
  }

  /**
   * The option's label: its projected text, without the icons drawn around it.
   *
   * A plain `textContent` reads the check mark too, and Material Symbols draws
   * from a LIGATURE, so the mark's text is the literal word "check". That is
   * what a MultiSelect chip showed: "checkClock" instead of "Clock". Consumer
   * icons inside the option are skipped for the same reason; a label is the
   * words, not the decoration.
   */
  getLabel(): string {
    const children = Array.from(this.elementRef.nativeElement.childNodes) as ChildNode[];
    return children
      .filter((node) =>
        node instanceof Element
          ? !node.matches('.sn-icon, .sn-listbox-option-box')
          : // Angular leaves a comment node per control-flow block, and a
            // comment's textContent is its data ("container").
            node.nodeType === Node.TEXT_NODE,
      )
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();
  }

  focus(_origin?: FocusOrigin): void {
    this.elementRef.nativeElement.focus();
  }
}
