import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snNextId,
} from 'ashen-ui/core';
import { SN_FORM_FIELD } from './form-field';

// The error's own tag renders display:contents, so 'root' here names the
// inner div, the only element with real layout, not the host tag.
const FORM_FIELD_ERROR_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['id', 'role'],
};

@Component({
  selector: 'sn-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => FormFieldError) }],
  templateUrl: './form-field-error.html',
  host: {
    style: 'display: contents',
  },
})
export class FormFieldError implements OnInit, OnDestroy, SnPartSource {
  /** The message's `id`, which the control's `aria-describedby` points at. */
  readonly id = input<string>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    FORM_FIELD_ERROR_RESERVED_ATTRS[section] ?? [];

  protected readonly fieldContext = inject(SN_FORM_FIELD, { optional: true });
  private readonly generatedId = snNextId('sn-ff-err');
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  /** Animate the entry only when this error appears after the field's first render. */
  protected readonly animate = signal(false);
  private registeredId: string | null = null;

  constructor() {
    effect(() => this.register(this.resolvedId()));
  }

  ngOnInit(): void {
    this.register(this.resolvedId());
    this.animate.set(this.fieldContext?.isReady() ?? false);
  }

  ngOnDestroy(): void {
    if (this.registeredId !== null) this.fieldContext?.unregisterDescribedBy(this.registeredId);
    this.registeredId = null;
  }

  private register(id: string): void {
    if (this.registeredId === id) return;
    if (this.registeredId !== null) this.fieldContext?.unregisterDescribedBy(this.registeredId);
    this.fieldContext?.registerDescribedBy(id, 'error');
    this.registeredId = id;
  }

  protected readonly errorClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', false),
  );
}
