import { computed, effect, inject, type Signal } from '@angular/core';
import { SN_FORM_FIELD } from './sn-form-field-context';

/**
 * Merge `aria-describedby` values, keeping the first occurrence of each id.
 *
 * A control inside `sn-form-field` is described by the ids the field generates
 * for its hint and error. An `aria-describedby` the consumer wrote has to
 * survive that, so the two lists are joined rather than one replacing the other.
 */
export function snMergeIds(...values: Array<string | null | undefined>): string | null {
  const ids = values.flatMap((value) => (value ?? '').split(/\s+/)).filter(Boolean);
  const merged = [...new Set(ids)].join(' ');
  return merged || null;
}

export interface SnControlAttrsConfig {
  /** The control's `id` input. */
  id: Signal<string | undefined>;
  /** The control's `aria-describedby` input. */
  describedBy?: Signal<string | undefined>;
  /** Id for the control element when there is no enclosing field and no authored id. */
  fallbackId?: string;
}

export interface SnControlAttrsRef {
  /** Id for the control element: the authored one, else the field's, else the fallback. */
  readonly controlId: Signal<string | null>;
  /** `aria-describedby` for the control: the authored ids plus the field's hint and error. */
  readonly describedBy: Signal<string | null>;
}

/**
 * Resolve the two attributes a form control shares with its field.
 *
 * Both have a generated default, and both are things a consumer legitimately
 * sets: an `id` to label or target the control from outside, an
 * `aria-describedby` pointing at help text the field does not own. Authored
 * values win, and an authored `id` is reported to the field so `sn-label`'s
 * `for` follows it.
 *
 * Call from a field initializer or constructor, after the inputs it reads:
 *
 * ```ts
 * readonly id = input<string>();
 * readonly ariaDescribedby = input<string>(undefined, { alias: 'aria-describedby' });
 * private readonly attrs = snControlAttrs({ id: this.id, describedBy: this.ariaDescribedby });
 * ```
 */
export function snControlAttrs(config: SnControlAttrsConfig): SnControlAttrsRef {
  const field = inject(SN_FORM_FIELD, { optional: true });

  if (field) {
    effect(() => field.setControlId(config.id() ?? null));
  }

  return {
    controlId: computed(() => config.id() ?? field?.controlId() ?? config.fallbackId ?? null),
    describedBy: computed(() => snMergeIds(config.describedBy?.(), field?.getDescribedBy())),
  };
}
