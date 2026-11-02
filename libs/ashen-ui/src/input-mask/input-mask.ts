import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  untracked,
  Injector,
  type OnInit,
} from '@angular/core';
import {
  type AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  type ControlValueAccessor,
  type ValidationErrors,
  type Validator,
} from '@angular/forms';
import { InputText } from 'ashen-ui/input-text';
import {
  applyMask,
  caretAfterFormat,
  isMaskComplete,
  maskPlaceholder,
  parseMask,
  unmask as stripMask,
} from './mask-core';

/**
 * A fixed-pattern input mask.
 *
 * ```html
 * <sn-form-field>
 *   <sn-label>Phone</sn-label>
 *   <input snInputText snMask="(999) 999-9999" [(ngModel)]="phone" />
 * </sn-form-field>
 * ```
 *
 * Tokens: `9` digit · `a` letter · `*` alphanumeric · `?` everything after is
 * optional · `\` escapes the next character. Anything else is a literal.
 *
 * The element's value holds only what the user typed; the mask template is
 * shown through the native `placeholder` instead. That keeps an untouched field
 * genuinely empty, so the floating label behaves and `required` validation sees
 * what it should.
 *
 * ## What this does not do
 *
 * It masks patterns whose shape is known up front: phone numbers, dates, postal
 * codes, card numbers, tax IDs. It does **not** do numeric masks with thousand
 * separators and decimals, dates that correct themselves as you type, masks
 * that change shape based on input (card-type detection), or regex masks. Those
 * are where a dedicated engine earns its weight.
 *
 * For those, bring your own: Maskito and imask both work here, and neither is
 * a dependency of this library. Drop `[snMask]`, add their directive, and tell
 * the form field what empty means so the floating label still works:
 *
 * ```ts
 * inject(InputText, { self: true }).setEmptyPredicate(
 *   () => myEngine.unmasked() === '',
 * );
 * ```
 */
@Directive({
  selector: 'input[snMask]',
  providers: [
    // Replaces DefaultValueAccessor for this element so only one handles `input`.
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMask),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputMask),
      multi: true,
    },
  ],
  host: {
    '[attr.placeholder]': 'placeholderText()',
    '[attr.data-sn-mask-complete]': 'complete() ? "" : null',
    '(input)': 'onInput()',
    '(beforeinput)': 'onBeforeInput($event)',
    '(blur)': 'onBlur()',
  },
})
export class InputMask implements ControlValueAccessor, OnInit, Validator {
  /** The mask pattern, e.g. `(999) 999-9999`. */
  readonly snMask = input.required<string>();

  /** Character standing in for an unfilled slot in the placeholder. */
  readonly placeholderChar = input('_');

  /**
   * Report the value without the mask's literals: `5551234567` rather than
   * `(555) 123-4567`. Affects the model only; the element still shows the mask.
   */
  readonly unmask = input(false, { transform: booleanAttribute });

  /**
   * The element's own placeholder. Declared here so a bound `[placeholder]`
   * wins over the mask template instead of being overwritten by it.
   */
  readonly placeholder = input<string | null | undefined>(undefined);

  /** Show the mask template as the placeholder. Ignored if the element has its own. */
  readonly showMaskPlaceholder = input(true, { transform: booleanAttribute });

  readonly autoClear = input(true, { transform: booleanAttribute });

  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly injector = inject(Injector);

  // Resolved in ngOnInit: injecting InputText in the constructor closes a NgControl cycle (NG0200).
  private host: InputText | null = null;

  private readonly slots = computed(() => parseMask(this.snMask()));

  private onChangeFn: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};
  private onValidatorChangeFn: () => void = () => {};

  /** Set when the pending edit is a deletion. See {@link onInput}. */
  private deleting = false;
  // A signal, so `complete` recomputes as the value changes.
  private readonly lastValue = signal('');
  // The user's input is the source of truth; unmasking `lastValue` with a new pattern would drop characters.
  private readonly lastUnmasked = signal('');

  protected readonly placeholderText = computed(() => {
    const own = this.placeholder();
    if (own != null) return own;
    return this.showMaskPlaceholder()
      ? maskPlaceholder(this.slots(), this.placeholderChar())
      : null;
  });

  protected readonly complete = computed(() => isMaskComplete(this.lastValue(), this.slots()));

  ngOnInit(): void {
    this.host = this.injector.get(InputText, null, { self: true, optional: true });
    // Emptiness is measured on the unmasked data, since a partial value like `(555) ` still holds literals.
    this.host?.setEmptyPredicate(() => stripMask(this.el.nativeElement.value, this.slots()) === '');
  }

  constructor() {
    // A new pattern reformats the current value.
    effect(() => {
      const slots = this.slots();
      // Only the pattern is tracked; reading the value reactively here would
      // make every keystroke re-enter this effect.
      const data = untracked(this.lastUnmasked);
      if (data) {
        const reformatted = applyMask(data, slots);
        if (reformatted !== untracked(this.lastValue)) this.write(reformatted);
      }
      this.onValidatorChangeFn();
    });
  }

  protected onBeforeInput(event: InputEvent): void {
    this.deleting = event.inputType?.startsWith('delete') ?? false;
  }

  protected onInput(): void {
    const el = this.el.nativeElement;
    const caret = el.selectionStart ?? el.value.length;
    let raw = el.value;

    // Deleting a literal would be put straight back, so remove the data character before it.
    if (this.deleting && applyMask(raw, this.slots()) === this.lastValue()) {
      const head = raw.slice(0, caret).replace(/([A-Za-z0-9])([^A-Za-z0-9]*)$/, '$2');
      raw = head + raw.slice(caret);
      this.write(applyMask(raw, this.slots()), caretAfterFormat(head, this.slots()));
      this.deleting = false;
      return;
    }
    this.deleting = false;

    this.write(
      applyMask(raw, this.slots()),
      caretAfterFormat(raw.slice(0, caret), this.slots()),
    );
  }

  protected onBlur(): void {
    if (this.autoClear() && this.lastUnmasked() !== '' && !this.complete()) {
      this.write('');
    }
    this.onTouched();
  }

  private write(value: string, caret?: number): void {
    const el = this.el.nativeElement;
    el.value = value;
    this.lastValue.set(value);
    this.lastUnmasked.set(stripMask(value, this.slots()));
    if (caret != null && el === document.activeElement) {
      el.setSelectionRange(caret, caret);
    }
    this.onChangeFn(this.unmask() ? stripMask(value, this.slots()) : value);
    // The contents changed outside the input event the form field listens to.
    this.host?.updateFilled();
  }

  writeValue(value: unknown): void {
    const masked = applyMask(value == null ? '' : String(value), this.slots());
    const el = this.el.nativeElement;
    el.value = masked;
    this.lastValue.set(masked);
    this.lastUnmasked.set(stripMask(masked, this.slots()));
    this.host?.updateFilled();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.lastUnmasked() !== '' && !this.complete() ? { maskIncomplete: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChangeFn = fn;
  }
}
