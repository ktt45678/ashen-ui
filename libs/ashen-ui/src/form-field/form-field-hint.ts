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

// The hint's own tag renders display:contents, so 'root' here names the
// inner div, the only element with real layout, not the host tag.
const FORM_FIELD_HINT_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['id'],
};

@Component({
  selector: 'sn-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => FormFieldHint) }],
  templateUrl: './form-field-hint.html',
  host: {
    style: 'display: contents',
  },
})
export class FormFieldHint implements OnInit, OnDestroy, SnPartSource {
  /** The hint's `id`, which the control's `aria-describedby` points at. */
  readonly id = input<string>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    FORM_FIELD_HINT_RESERVED_ATTRS[section] ?? [];

  protected readonly fieldContext = inject(SN_FORM_FIELD, { optional: true });
  private readonly generatedId = snNextId('sn-ff-hint');
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  private registeredId: string | null = null;

  constructor() {
    effect(() => this.register(this.resolvedId()));
  }

  ngOnInit(): void {
    this.register(this.resolvedId());
  }

  ngOnDestroy(): void {
    if (this.registeredId !== null) this.fieldContext?.unregisterDescribedBy(this.registeredId);
    this.registeredId = null;
  }

  private register(id: string): void {
    if (this.registeredId === id) return;
    if (this.registeredId !== null) this.fieldContext?.unregisterDescribedBy(this.registeredId);
    this.fieldContext?.registerDescribedBy(id, 'hint');
    this.registeredId = id;
  }

  protected readonly hintClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', false),
  );
}
