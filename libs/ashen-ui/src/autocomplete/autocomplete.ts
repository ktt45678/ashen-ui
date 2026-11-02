import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { snListNavigator, snOverlayPanel, snOverlaySelect } from 'ashen-ui/cdk';
import {
  IconTemplate,
  SN_PART_SOURCE,
  SnChipIntl,
  SnCommonIntl,
  SnIconRegistry,
  SnPart,
  resolveSnClass,
  snAnimated,
  snDefault,
  snNextId,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
  snControlAttrs,
} from 'ashen-ui/core';
import { SN_FORM_FIELD } from 'ashen-ui/form-field';
import { Icon } from 'ashen-ui/icon';
import { InputText } from 'ashen-ui/input-text';
import {
  AutoCompleteOptionTemplate,
  AutoCompleteSelectedValueTemplate,
  AutoCompleteSummaryTemplate,
  type AutoCompleteOptionContext,
  type AutoCompleteSelectedValueContext,
  type AutoCompleteSummaryContext,
} from './autocomplete-templates';
import { SN_AUTOCOMPLETE_DEFAULTS } from './autocomplete-defaults';

const DEFAULT_PANEL_HEIGHT = 240;

const AUTOCOMPLETE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  input: [
    'type',
    'role',
    'aria-expanded',
    'aria-autocomplete',
    'aria-controls',
    'aria-activedescendant',
    'aria-label',
    'aria-describedby',
    'id',
    'placeholder',
    'value',
    'disabled',
  ],
  panel: ['role', 'id', 'aria-label'],
  option: ['role', 'id', 'aria-selected'],
  check: ['aria-hidden'],
  remove: ['type', 'aria-label'],
};

export type AutoCompleteCompleteReason = 'input' | 'focus';

export interface AutoCompleteCompleteEvent {
  query: string;
  reason: AutoCompleteCompleteReason;
}

export interface AutoCompleteLoadMoreEvent {
  query: string;
  lastIndex: number;
}

function objectIs<T>(left: T, right: T): boolean {
  return Object.is(left, right);
}

@Component({
  selector: 'sn-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, InputText, NgTemplateOutlet, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './autocomplete.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoComplete),
      multi: true,
    },
    {
      provide: SN_PART_SOURCE,
      useExisting: forwardRef(() => AutoComplete),
    },
  ],
  host: {
    class: 'sn-autocomplete',
    // The authored id belongs on the inner control, so the document never holds it twice.
    '[attr.id]': 'null',
    '[class]': 'snClassResolved()',
    '[class.sn-autocomplete-open]': 'showPanel()',
    '[class.sn-autocomplete-multiple]': 'multiple()',
    '[attr.data-sn-open]': 'showPanel() ? "" : null',
    '[attr.data-sn-multiple]': 'multiple() ? "" : null',
  },
})
export class AutoComplete<T = string> implements ControlValueAccessor, OnDestroy, SnPartSource {
  readonly value = model<T | string>('');
  readonly values = model<readonly T[]>([]);
  readonly suggestions = input<readonly T[]>([]);
  readonly optionLabel = input<string | ((option: T) => string) | undefined>(undefined);
  readonly compareWith = input<(left: T, right: T) => boolean>(objectIs);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly unique = input(true, { transform: booleanAttribute });
  /**
   * Drop already-selected suggestions from the panel instead of showing them as
   * selected rows that toggle off when picked again.
   */
  readonly hideSelected = input(false, { transform: booleanAttribute });
  /** Mark selected suggestions with a trailing check icon. */
  readonly checkmark = input(true, { transform: booleanAttribute });
  /** Give each selected-value chip a remove button. */
  readonly removable = input(true, { transform: booleanAttribute });
  /** Hide the selected-value chips while the field has focus, to free typing room. */
  readonly hideValuesOnFocus = input(false, { transform: booleanAttribute });
  /** Keep showing the placeholder after the selected values, instead of clearing it once there are any. */
  readonly keepPlaceholder = input(false, { transform: booleanAttribute });
  readonly filter = input(true, { transform: booleanAttribute });
  readonly completeOnFocus = input(false, { transform: booleanAttribute });
  /**
   * Show a row with `emptyMessage` when a typed search has no suggestions,
   * instead of keeping the panel closed. After a `complete` event it waits for
   * `suggestions` to change, so a pending server search does not flash it.
   */
  readonly showEmptyMessage = input(
    snDefault(SN_AUTOCOMPLETE_DEFAULTS, 'showEmptyMessage', false),
    { transform: booleanAttribute },
  );
  /** Text of the empty row. Defaults to `SnCommonIntl.emptyMessage`. */
  readonly emptyMessage = input<string | undefined>(undefined);
  readonly maxSelectedLabels = input<number | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly removeAriaLabel = input<string | ((label: string) => string) | undefined>(undefined);
  /**
   * The control's `id`. Defaults to one generated by the enclosing
   * `sn-form-field`, whose `sn-label` points at it; set it to use your own and
   * the label follows.
   */
  readonly id = input<string>();
  /** Extra ids describing the control, merged with the field's hint and error ids. */
  readonly ariaDescribedby = input<string>(undefined, { alias: 'aria-describedby' });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();
  readonly animated = input(true, { transform: booleanAttribute });
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);
  readonly virtual = input(false, { transform: booleanAttribute });
  readonly optionHeight = input<number>(36);
  readonly overscan = input<number>(4);
  readonly hasMore = input(false, { transform: booleanAttribute });
  readonly loadMoreThreshold = input<number>(10);

  readonly selected = output<T>();
  readonly removed = output<T>();
  readonly complete = output<AutoCompleteCompleteEvent>();
  readonly loadMore = output<AutoCompleteLoadMoreEvent>();

  protected readonly panelTpl = viewChild<TemplateRef<unknown>>('panelTpl');
  protected readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  protected readonly wrapperEl = viewChild<ElementRef<HTMLElement>>('wrapperEl');
  protected readonly optionTemplate = contentChild(AutoCompleteOptionTemplate);
  protected readonly selectedValueTemplate = contentChild(AutoCompleteSelectedValueTemplate);
  protected readonly summaryTemplate = contentChild(AutoCompleteSummaryTemplate);
  protected readonly iconTemplates = contentChildren(IconTemplate);

  private readonly vcr = inject(ViewContainerRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly intl = inject(SnChipIntl);
  private readonly commonIntl = inject(SnCommonIntl);
  protected readonly icons = inject(SnIconRegistry);
  protected readonly fieldContext = inject(SN_FORM_FIELD, { optional: true });

  private readonly disabledFromForms = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  readonly panelId = snNextId('sn-autocomplete-panel');
  private readonly generatedInputId = snNextId('sn-autocomplete-input');
  private readonly attrs = snControlAttrs({
    id: this.id,
    describedBy: this.ariaDescribedby,
    fallbackId: this.generatedInputId,
  });

  protected readonly inputId = this.attrs.controlId;
  protected readonly ariaDescribedBy = this.attrs.describedBy;

  protected readonly snClassResolved = computed(() => resolveSnClass(this.snClass(), 'root', true));
  protected readonly inputClassExtra = computed(() => resolveSnClass(this.snClass(), 'input', false));
  protected readonly panelClassExtra = computed(() => resolveSnClass(this.snClass(), 'panel', false));
  protected readonly optionClassBase = computed(() => resolveSnClass(this.snClass(), 'option', false));
  protected readonly selectedValuesClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'selectedValues', false),
  );
  protected readonly chipClassExtra = computed(() => resolveSnClass(this.snClass(), 'chip', false));
  protected readonly chipLabelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'chipLabel', false),
  );
  protected readonly removeClassExtra = computed(() => resolveSnClass(this.snClass(), 'remove', false));
  protected readonly emptyClassExtra = computed(() => resolveSnClass(this.snClass(), 'empty', false));

  readonly reservedAttrs = (section: string): readonly string[] =>
    AUTOCOMPLETE_RESERVED_ATTRS[section] ?? [];

  private readonly inputText = signal('');
  protected readonly queryText = this.inputText.asReadonly();
  protected readonly query = computed(() => this.inputText().trim().toLowerCase());

  protected readonly matches = computed(() => {
    const query = this.query();
    let suggestions = [...this.suggestions()];
    if (this.filter() && query) {
      suggestions = suggestions.filter((option) => this.labelOf(option).toLowerCase().includes(query));
    }
    if (this.multiple() && this.hideSelected()) {
      suggestions = suggestions.filter((option) => !this.containsValue(this.values(), option));
    }
    return suggestions;
  });

  private readonly isFocused = signal(false);

  protected readonly showValues = computed(
    () =>
      this.multiple() &&
      this.values().length > 0 &&
      !(this.hideValuesOnFocus() && this.isFocused()),
  );

  protected readonly visibleValues = computed(() => {
    const values = this.values();
    const max = this.maxSelectedLabels();
    if (max === undefined || !this.summaryTemplate()) return values;
    return values.slice(0, Math.max(0, Math.floor(max)));
  });

  protected readonly hiddenValues = computed(() =>
    this.values().slice(this.visibleValues().length),
  );

  protected readonly removeIconTemplate = computed(() =>
    this.iconTemplates().find((template) => template.snIcon() === 'remove') ??
    this.iconTemplates().find((template) => template.snIcon() === '') ??
    null,
  );

  private readonly isOpen = signal(false);
  private readonly isClosing = signal(false);
  private readonly navigator = snListNavigator({
    mode: 'index',
    itemCount: computed(() => this.matches().length),
    getLabel: (index) => this.labelOf(this.matches()[index]),
    orientation: 'vertical',
    activeDescendant: true,
  });

  protected readonly activeIndex = computed(() => this.navigator.activeIndex() ?? -1);
  // False between a complete event and the next suggestions change.
  private readonly suggestionsSettled = signal(true);
  protected readonly effectiveEmptyMessage = computed(
    () => this.emptyMessage() ?? this.commonIntl.emptyMessage,
  );
  protected readonly showEmpty = computed(
    () =>
      this.showEmptyMessage() &&
      this.query() !== '' &&
      this.matches().length === 0 &&
      // Client-side filtering of loaded suggestions needs no reply to be sure.
      (this.suggestionsSettled() || (this.filter() && this.suggestions().length > 0)),
  );
  private readonly hasPanelContent = computed(() => this.matches().length > 0 || this.showEmpty());
  protected readonly showPanel = computed(() => this.isOpen() && this.hasPanelContent());

  private readonly panelScrollTop = signal(0);
  private readonly panelViewportHeight = signal(DEFAULT_PANEL_HEIGHT);
  private lastLoadMoreKey = '';

  protected readonly windowRange = computed(() => {
    const total = this.matches().length;
    if (!this.virtual()) return { start: 0, end: total };
    const height = this.optionHeight();
    const start = Math.max(0, Math.floor(this.panelScrollTop() / height) - this.overscan());
    const visible = Math.ceil(this.panelViewportHeight() / height);
    const end = Math.min(total, start + visible + this.overscan() * 2);
    return { start, end };
  });

  protected readonly renderedMatches = computed(() => {
    const { start, end } = this.windowRange();
    return this.matches()
      .slice(start, end)
      .map((option, offset) => ({ option, index: start + offset }));
  });

  protected readonly topSpacerHeight = computed(() =>
    this.virtual() ? this.windowRange().start * this.optionHeight() : 0,
  );
  protected readonly bottomSpacerHeight = computed(() =>
    this.virtual() ? (this.matches().length - this.windowRange().end) * this.optionHeight() : 0,
  );

  protected readonly panelAnimation = computed(() => {
    if (!this._animated()) return 'none';
    const custom = this.animation();
    return (this.isClosing() ? custom?.exit : custom?.enter) ?? null;
  });

  protected readonly activeOptionId = computed(() => {
    const index = this.activeIndex();
    return index < 0 ? null : `${this.panelId}-opt-${index}`;
  });

  private onChangeFn: (value: T | string | readonly T[]) => void = () => {};
  private onTouchedFn: () => void = () => {};
  private subs = new Subscription();
  private hasObservedMatches = false;
  private suppressFocusOpen = false;
  private preserveOpenAfterDetach = false;
  private readonly panel = snOverlayPanel(() =>
    snOverlaySelect({
      // Anchor on the wrapper: in multiple mode the input is only the slot beside the chips.
      origin: this.wrapperEl()?.nativeElement ?? this.inputEl()?.nativeElement,
      template: this.panelTpl(),
      viewContainerRef: this.vcr,
      panelClass: 'sn-autocomplete-overlay-panel',
      // A backdrop covers the field, so a second click on the input would otherwise close the panel.
      hasBackdrop: false,
      closeOnEscape: false,
      closeOnOutsidePointer: false,
      restoreFocus: false,
      animated: this._animated(),
      animation: this.animation(),
    }),
  );

  constructor() {
    effect(() => {
      const multiple = this.multiple();
      const value = this.value();
      const values = this.values();
      const text = multiple ? untracked(this.inputText) : this.valueText(value);
      if (!multiple && text !== untracked(this.inputText)) this.inputText.set(text);
      this.fieldContext?.setFilled(multiple ? values.length > 0 : text !== '');
    });

    effect(() => {
      this.suggestions();
      untracked(() => this.suggestionsSettled.set(true));
    });

    effect(() => {
      this.matches();
      const hasContent = this.hasPanelContent();
      untracked(() => {
        if (this.hasObservedMatches) this.navigator.clearActiveItem();
        this.hasObservedMatches = true;
        if (this.isOpen() && hasContent) {
          this.ensureOverlay();
          this.queueLoadMoreCheck();
        } else if (this.isOpen() && this.panel.isOpen()) {
          this.preserveOpenAfterDetach = true;
          this.panel.detach();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.panel.dispose();
  }

  protected labelOf(option: T): string {
    const resolver = this.optionLabel();
    if (typeof resolver === 'function') return resolver(option);
    if (resolver && typeof option === 'object' && option !== null) {
      const value = (option as Record<string, unknown>)[resolver];
      return value == null ? '' : String(value);
    }
    return option == null ? '' : String(option);
  }

  protected optionContext(option: T, index: number): AutoCompleteOptionContext<T> {
    return { $implicit: option, index, selected: this.isOptionSelected(option) };
  }

  protected selectedValueContext(option: T, index: number): AutoCompleteSelectedValueContext<T> {
    return {
      $implicit: option,
      index,
      values: this.values(),
      remove: () => this.removeValue(option),
    };
  }

  protected summaryContext(): AutoCompleteSummaryContext<T> {
    return {
      $implicit: this.values(),
      values: this.values(),
      hidden: this.hiddenValues(),
      count: this.hiddenValues().length,
    };
  }

  protected isOptionSelected(option: T): boolean {
    if (this.multiple()) return this.containsValue(this.values(), option);
    const value = this.value();
    if (typeof value !== typeof option) return false;
    return this.compareWith()(value as T, option);
  }

  protected optionAriaSelected(option: T, index: number): boolean {
    // Multiple mode reports real selection; single mode follows the APG combobox pattern.
    if (this.multiple()) return this.isOptionSelected(option);
    const active = this.activeIndex();
    return active >= 0 ? active === index : this.isOptionSelected(option);
  }

  protected effectiveRemoveLabel(option: T): string {
    const label = this.labelOf(option);
    const configured = this.removeAriaLabel();
    return typeof configured === 'function'
      ? configured(label)
      : configured ?? this.intl.remove(label || 'item');
  }

  protected onPanelScroll(event: Event): void {
    const element = event.currentTarget as HTMLElement;
    this.panelScrollTop.set(element.scrollTop);
    this.panelViewportHeight.set(element.clientHeight);
    this.checkLoadMore(element);
  }

  protected onFocus(): void {
    if (this.isDisabled()) return;
    this.isFocused.set(true);
    if (this.completeOnFocus()) this.emitComplete('focus');
    if (!this.suppressFocusOpen) this.openPanel();
    this.fieldContext?.registerFocus(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    this.onTouchedFn();
    this.fieldContext?.registerFocus(false);
  }

  protected onInputEvent(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.inputText.set(text);
    if (!this.multiple()) {
      this.value.set(text);
      this.onChangeFn(text);
    }
    this.fieldContext?.setFilled(this.multiple() ? this.values().length > 0 : text !== '');
    this.emitComplete('input');
    if (!this.isOpen() || this.isClosing()) this.openPanel();
    if (this.hasPanelContent()) this.ensureOverlay();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const code = event.keyCode;

    if (code === ESCAPE) {
      if (this.isOpen()) {
        event.preventDefault();
        this.detach();
      }
      return;
    }

    if (code === TAB) {
      if (this.isOpen()) this.detach();
      return;
    }

    if (code === BACKSPACE && this.multiple() && this.inputText() === '') {
      const values = this.values();
      if (values.length > 0) {
        event.preventDefault();
        this.removeValue(values[values.length - 1]);
      }
      return;
    }

    if (code === DOWN_ARROW) {
      event.preventDefault();
      if (!this.isOpen()) {
        this.openPanel();
        this.navigator.setFirstItemActive();
        this.scrollActiveIntoView();
      } else {
        this.navigate(event);
      }
      return;
    }

    if (code === UP_ARROW) {
      if (this.isOpen()) {
        event.preventDefault();
        this.navigate(event);
      }
      return;
    }

    if (code === ENTER && this.isOpen()) {
      const index = this.navigator.activeIndex() ?? -1;
      if (index >= 0 && index < this.matches().length) {
        event.preventDefault();
        this.pick(this.matches()[index]);
      }
    }
  }

  protected pick(option: T): void {
    if (this.multiple()) {
      const current = this.values();
      // A selected row stays in the panel, so picking it again takes it back out.
      if (this.unique() && this.containsValue(current, option)) {
        this.removeValue(option);
        return;
      }
      const next = [...current, option];
      this.values.set(next);
      this.onChangeFn(next);
      this.inputText.set('');
      this.selected.emit(option);
      this.navigator.clearActiveItem();
      this.inputEl()?.nativeElement.focus();
      this.queueLoadMoreCheck();
      return;
    }

    this.value.set(option);
    this.inputText.set(this.labelOf(option));
    this.onChangeFn(option);
    this.fieldContext?.setFilled(true);
    this.selected.emit(option);
    this.detach();
    this.suppressFocusOpen = true;
    this.inputEl()?.nativeElement.focus();
    this.suppressFocusOpen = false;
  }

  protected removeValue(option: T): void {
    const index = this.values().findIndex((value) => this.compareWith()(value, option));
    if (index < 0) return;
    const next = this.values().filter((_, valueIndex) => valueIndex !== index);
    this.values.set(next);
    this.onChangeFn(next);
    this.removed.emit(option);
    this.inputEl()?.nativeElement.focus();
  }

  protected isClosingPanel(): boolean {
    return this.isClosing();
  }

  private valueText(value: T | string): string {
    return typeof value === 'string' ? value : this.labelOf(value);
  }

  private containsValue(values: readonly T[], option: T): boolean {
    return values.some((value) => this.compareWith()(value, option));
  }

  private emitComplete(reason: AutoCompleteCompleteReason): void {
    this.suggestionsSettled.set(false);
    this.complete.emit({ query: this.inputText(), reason });
  }

  private checkLoadMore(element: HTMLElement): void {
    if (!this.hasMore()) return;
    const total = this.matches().length;
    if (total === 0) return;
    const key = `${this.query()}::${total}`;
    if (this.lastLoadMoreKey === key) return;
    const threshold = this.loadMoreThreshold() * this.optionHeight();
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
      this.lastLoadMoreKey = key;
      this.loadMore.emit({ query: this.query(), lastIndex: total - 1 });
    }
  }

  private queueLoadMoreCheck(): void {
    if (!this.isBrowser || !this.hasMore()) return;
    setTimeout(() => {
      if (!this.isOpen()) return;
      const element = document.getElementById(this.panelId);
      if (element) this.checkLoadMore(element);
    });
  }

  private openPanel(): void {
    if (!this.isBrowser) return;
    if (this.panel.isClosing()) {
      this.preserveOpenAfterDetach = true;
      this.panel.detach();
    }
    this.panelScrollTop.set(0);
    this.isOpen.set(true);
    if (this.hasPanelContent()) this.ensureOverlay();
    this.queueLoadMoreCheck();
  }

  private ensureOverlay(): void {
    if (this.panel.isOpen()) return;
    if (!this.panel.open()) return;
    this.bindOverlayEvents();
  }

  private detach(): void {
    this.preserveOpenAfterDetach = false;
    if (this.panel.isOpen()) this.panel.detach();
    else this.finalizeDetach();
  }

  private finalizeDetach(): void {
    const preserveOpen = this.preserveOpenAfterDetach;
    this.preserveOpenAfterDetach = false;
    this.subs.unsubscribe();
    this.subs = new Subscription();
    this.isClosing.set(false);
    this.navigator.clearActiveItem();
    if (preserveOpen) {
      if (this.isOpen() && this.hasPanelContent()) this.ensureOverlay();
      return;
    }
    this.isOpen.set(false);
  }

  private requestClose(): void {
    if (!this.isOpen() || this.isClosing()) return;
    this.preserveOpenAfterDetach = false;
    this.isClosing.set(true);
    this.panel.close();
  }

  private bindOverlayEvents(): void {
    this.subs.add(this.panel.outsidePointer.subscribe(() => this.requestClose()));
    this.subs.add(this.panel.afterClosed.subscribe(() => this.finalizeDetach()));
  }

  private scrollActiveIntoView(): void {
    const index = this.navigator.activeIndex() ?? -1;
    if (index < 0) return;
    if (this.virtual()) {
      const panel = document.getElementById(this.panelId);
      if (!panel) return;
      const height = this.optionHeight();
      const top = index * height;
      if (top < panel.scrollTop) panel.scrollTop = top;
      else if (top + height > panel.scrollTop + panel.clientHeight) {
        panel.scrollTop = top + height - panel.clientHeight;
      }
      this.panelScrollTop.set(panel.scrollTop);
      this.panelViewportHeight.set(panel.clientHeight);
      return;
    }
    const option = document.getElementById(`${this.panelId}-opt-${index}`);
    option?.scrollIntoView?.({ block: 'nearest' });
  }

  private navigate(event: KeyboardEvent): void {
    if (this.navigator.activeIndex() == null) this.navigator.setFirstItemActive();
    else this.navigator.onKeydown(event);
    this.scrollActiveIntoView();
  }

  writeValue(value: unknown): void {
    if (Array.isArray(value) || this.multiple()) {
      const values = Array.isArray(value) ? (value as readonly T[]) : [];
      this.values.set(values);
      this.inputText.set('');
      this.fieldContext?.setFilled(values.length > 0);
      return;
    }
    const next = value == null ? '' : (value as T | string);
    this.value.set(next);
    const text = this.valueText(next);
    this.inputText.set(text);
    this.fieldContext?.setFilled(text !== '');
  }

  registerOnChange(fn: (value: T | string | readonly T[]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromForms.set(disabled);
    if (disabled && this.isOpen()) this.detach();
  }
}
