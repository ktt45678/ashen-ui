import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  numberAttribute,
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

export type ProgressBarVariant =
  /** The library's own look. */
  | 'default'
  /** The Angular Material look: a thin square track and its two-bar indeterminate animation. */
  | 'material';

const PROGRESS_BAR_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: [],
  track: ['role', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  fill: [],
  label: ['aria-hidden'],
};

@Component({
  selector: 'sn-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './progress-bar.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ProgressBar) }],
  host: {
    class: 'sn-progress-bar',
    '[class.sn-progress-bar--indeterminate]': 'indeterminate()',
    '[class.sn-progress-bar--material]': 'variant() === "material"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-variant]': 'variant()',
    '[attr.data-sn-indeterminate]': 'indeterminate() ? "" : null',
  },
})
export class ProgressBar implements SnPartSource {
  readonly value = input<number | undefined>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : numberAttribute(v)) });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly variant = input<ProgressBarVariant>('default');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    PROGRESS_BAR_RESERVED_ATTRS[section] ?? [];

  protected readonly pct = computed(() => {
    const v = this.value();
    if (v === undefined) return 0;
    return Math.min(Math.max(v, 0), 100);
  });

  protected readonly displayValue = computed(() => {
    const v = this.value();
    return v === undefined ? 0 : Math.min(Math.max(v, 0), 100);
  });

  protected readonly showLabel = computed(() =>
    this.showValue() && !this.indeterminate() && this.value() !== undefined,
  );

  protected readonly ariaNow = computed(() =>
    this.indeterminate() ? null : this.pct(),
  );

  protected readonly materialTransform = computed(() =>
    this.indeterminate() ? null : `scaleX(${this.pct() / 100})`,
  );

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly trackClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'track', false),
  );

  protected readonly fillClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'fill', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );
}
