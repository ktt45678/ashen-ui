import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_FORM_FIELD } from './form-field';

// The label's own tag renders display:contents, so 'root' here names the
// inner <label>, the only element with real layout, not the host tag.
const FORM_FIELD_LABEL_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['for'],
  requiredIndicator: [],
};

@Component({
  selector: 'sn-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => FormFieldLabel) }],
  templateUrl: './form-field-label.html',
  host: {
    style: 'display: contents',
  },
})
export class FormFieldLabel implements OnDestroy, SnPartSource {
  readonly required = input(false, { transform: booleanAttribute });
  /**
   * Id of the control this label names. Defaults to the enclosing field's
   * control id; set it to point at a control that carries its own `id`.
   */
  readonly for = input<string>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    FORM_FIELD_LABEL_RESERVED_ATTRS[section] ?? [];

  protected readonly fieldContext = inject(SN_FORM_FIELD, { optional: true });
  private readonly labelEl = viewChild.required<ElementRef<HTMLLabelElement>>('labelEl');
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      this.fieldContext?.setRequired(this.required());
    });

    afterNextRender(() => {
      this.measure();
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.measure());
        this.resizeObserver.observe(this.labelEl().nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    this.fieldContext?.setRequired(false);
    this.resizeObserver?.disconnect();
  }

  private measure(): void {
    this.fieldContext?.setLabelWidth(this.labelEl().nativeElement.offsetWidth);
  }

  protected readonly labelFor = computed(
    () => this.for() ?? this.fieldContext?.controlId() ?? null,
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', false),
  );

  protected readonly requiredIndicatorClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'requiredIndicator', false),
  );
}
