import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  SN_FORM_FIELD,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnFormFieldContext,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snAfterFrames,
  snNextId,
} from 'ashen-ui/core';
import { FormFieldPrefix, FormFieldSuffix } from './form-field-affix';

export type SnFloatLabel =
  /** Label rests over the control and floats into the outline on focus or once the control has a value. */
  | 'auto'
  /** Label stays floated in the outline, so the placeholder is visible from the start. */
  | 'always';

export type SnSubscriptSizing =
  /** Always reserves one line under the control, so a row of fields keeps its height when an error appears. */
  | 'fixed'
  /** Takes no space until there is a hint or error to show, and the layout shifts when one appears. */
  | 'dynamic';

export type FormFieldContext = SnFormFieldContext;
export { SN_FORM_FIELD } from 'ashen-ui/core';

const FORM_FIELD_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: [],
  control: [],
  subscript: [],
  prefix: [],
  suffix: [],
};

@Component({
  selector: 'sn-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SN_FORM_FIELD,
      useFactory: (self: FormField) => self.context,
      deps: [FormField],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => FormField) },
  ],
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './form-field.html',
  host: {
    class: 'sn-form-field-wrapper',
    // Until the first render, the label transition is dropped (via CSS) so it does not slide in on load.
    '[attr.data-sn-boot]': "booted() ? null : ''",
    '[class.sn-form-field-auto-errors]': 'autoActive()',
    '[class.sn-form-field-invalid]': 'computedInvalid()',
    '[class.sn-form-field-focused]': 'focused()',
    '[class.sn-form-field-floating]': '!!floatLabel()',
    '[class.sn-form-field-should-float]': '!!floatLabel() && shouldFloat()',
    '[class.sn-form-field-subscript-reserve]': 'subscriptSizing() === "fixed"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-invalid]': 'computedInvalid() ? "" : null',
    '[attr.data-sn-focused]': 'focused() ? "" : null',
    '[attr.data-sn-float-label]': 'floatLabel() || null',
    '[attr.data-sn-floated]': '!!floatLabel() && shouldFloat() ? "" : null',
    // Affix rules are gated on these, so a field without one keeps its layout.
    '[class.sn-form-field-has-prefix]': 'hasPrefix()',
    '[class.sn-form-field-has-suffix]': 'hasSuffix()',
    '[attr.data-sn-has-prefix]': 'hasPrefix() ? "" : null',
    '[attr.data-sn-has-suffix]': 'hasSuffix() ? "" : null',
    // Measured room for each affix; the control padding reads it.
    '[style.--sn-form-field-prefix-width.px]': 'prefixWidth() || null',
    '[style.--sn-form-field-suffix-width.px]': 'suffixWidth() || null',
  },
})
export class FormField implements OnDestroy, SnPartSource {
  private readonly prefix = contentChild(FormFieldPrefix);
  private readonly suffix = contentChild(FormFieldSuffix);

  protected readonly hasPrefix = computed(() => !!this.prefix());
  protected readonly hasSuffix = computed(() => !!this.suffix());

  private readonly prefixSlot = viewChild.required<ElementRef<HTMLElement>>('prefixSlot');
  private readonly suffixSlot = viewChild.required<ElementRef<HTMLElement>>('suffixSlot');

  protected readonly prefixWidth = signal(0);
  protected readonly suffixWidth = signal(0);
  private affixObserver?: ResizeObserver;
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    FORM_FIELD_RESERVED_ATTRS[section] ?? [];
  readonly floatLabel = input<SnFloatLabel>();
  readonly subscriptSizing = input<SnSubscriptSizing>('fixed');
  /**
   * Controls when projected `sn-error` messages are shown. Default (`true`):
   * errors stay hidden until the control enters its error state (invalid AND
   * touched/dirty, or the form submitted). Set `[autoDisplayErrors]="false"` to
   * manage visibility yourself (render `sn-error` only when you want it, e.g. inside `@if`).
   *
   * Auto mode only engages for controls that report their state (`snInputText`,
   * `sn-input-password`, `sn-textarea`); with any other control the field falls
   * back to showing every rendered `sn-error`.
   */
  readonly autoDisplayErrors = input(true, { transform: booleanAttribute });

  protected readonly focused = signal(false);
  private readonly externalInvalid = signal(false);
  private readonly requiredState = signal(false);
  private readonly filledState = signal(false);
  private readonly labelWidthPx = signal(0);
  private readonly registeredIds = signal<Array<{ id: string; kind: 'hint' | 'error' }>>([]);
  private readonly generatedControlId = snNextId('sn-ff-ctrl');
  private readonly authoredControlId = signal<string | null>(null);
  protected readonly ready = signal(false);
  // Stays on one frame longer than `ready` so the affix measurement paints before the label transition returns.
  protected readonly booted = signal(false);
  private readonly controlErrorState = signal(false);
  // True once a control reports its error state; auto mode only engages then, so
  // fields with a non-reporting control keep showing every rendered sn-error.
  private readonly hasReportingControl = signal(false);

  constructor() {
    // Enabled after the first render, so an already invalid field shows its error without animating.
    afterNextRender(() => {
      this.ready.set(true);
      // Measure while the boot guard is on, so the label shift applies without a transition.
      this.measureAffixes();
      if (typeof ResizeObserver !== 'undefined') {
        // Content-driven; --sn-form-field-affix-width is only the fallback for an unmeasured slot (SSR, no ResizeObserver).
        this.affixObserver = new ResizeObserver(() => this.measureAffixes());
        this.affixObserver.observe(this.prefixSlot().nativeElement);
        this.affixObserver.observe(this.suffixSlot().nativeElement);
      }
      // Lift the guard a frame later, once the measured position is painted.
      snAfterFrames(1, () => this.booted.set(true));
    });
  }

  ngOnDestroy(): void {
    this.affixObserver?.disconnect();
  }

  private measureAffixes(): void {
    this.prefixWidth.set(this.prefixSlot().nativeElement.offsetWidth);
    this.suffixWidth.set(this.suffixSlot().nativeElement.offsetWidth);
  }

  /** Auto error display is active (enabled AND the control reports its state). */
  protected readonly autoActive = computed(
    () => this.autoDisplayErrors() && this.hasReportingControl(),
  );

  protected readonly computedInvalid = computed(() => {
    if (this.externalInvalid()) return true;
    // In auto mode the field is invalid only while the control is in its error
    // state; otherwise any rendered sn-error marks it invalid (manual model).
    return this.autoActive()
      ? this.controlErrorState()
      : this.registeredIds().some((r) => r.kind === 'error');
  });

  /** Whether projected sn-error messages should be rendered right now. */
  protected readonly errorsVisible = computed(
    () => !this.autoActive() || this.controlErrorState(),
  );

  private readonly computedHasError = computed(() =>
    this.registeredIds().some((r) => r.kind === 'error'),
  );

  private readonly computedDescribedBy = computed(() => {
    // Projected sn-error is detached without ngOnDestroy, so hidden ids are filtered here to keep aria-describedby valid.
    const errorsShown = this.errorsVisible();
    const ids = this.registeredIds()
      .filter((r) => r.kind !== 'error' || errorsShown)
      .map((r) => r.id);
    return ids.length ? ids.join(' ') : null;
  });

  protected readonly shouldFloat = computed(
    () => this.floatLabel() === 'always' || this.focused() || this.filledState(),
  );

  // Notch width tracks the floated (scaled 0.75) label so the border gap fits it.
  protected readonly notchWidth = computed(() =>
    !!this.floatLabel() && this.shouldFloat() ? this.labelWidthPx() * 0.75 + 2 : 0,
  );

  // The label's `for` follows the control's own id.
  private readonly resolvedControlId = computed(
    () => this.authoredControlId() ?? this.generatedControlId,
  );

  readonly context: SnFormFieldContext = {
    controlId: this.resolvedControlId,
    setControlId: (id) => this.authoredControlId.set(id),
    invalid: this.computedInvalid,
    required: this.requiredState,
    hasError: this.computedHasError,
    filled: this.filledState,
    getDescribedBy: this.computedDescribedBy,
    registerFocus: (focused) => this.focused.set(focused),
    setInvalid: (invalid) => this.externalInvalid.set(invalid),
    setRequired: (required) => this.requiredState.set(required),
    setFilled: (filled) => this.filledState.set(filled),
    setLabelWidth: (px) => this.labelWidthPx.set(px),
    registerDescribedBy: (id, kind) => {
      this.registeredIds.update((list) =>
        list.some((r) => r.id === id) ? list : [...list, { id, kind }],
      );
    },
    unregisterDescribedBy: (id) => {
      this.registeredIds.update((list) => list.filter((r) => r.id !== id));
    },
    isReady: this.ready,
    setErrorState: (state) => {
      this.hasReportingControl.set(true);
      this.controlErrorState.set(state);
    },
  };

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly controlClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'control', false),
  );

  protected readonly subscriptClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'subscript', false),
  );

  protected readonly prefixClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'prefix', false),
  );

  protected readonly suffixClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'suffix', false),
  );
}
