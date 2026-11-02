import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
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
  SnCommonIntl,
  snDefault,
  snDefaults,
} from 'ashen-ui/core';
import { SN_PROGRESS_SPINNER_DEFAULTS } from './progress-spinner-defaults';

export type ProgressSpinnerVariant =
  /** The library's own look. */
  | 'default'
  /** The Angular Material look: no track, and an arc that grows and shrinks while it spins. */
  | 'material';

const PROGRESS_SPINNER_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
  svg: ['viewBox', 'width', 'height', 'aria-hidden'],
};

const TWO_PI_R = 2 * Math.PI * 10;
const VIEWBOX_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 3.5;
const MATERIAL_STROKE_WIDTH = 2;

@Component({
  selector: 'sn-progress-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './progress-spinner.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ProgressSpinner) }],
  host: {
    class: 'sn-progress-spinner',
    '[class.sn-progress-spinner--material]': 'variant() === "material"',
    '[class.sn-progress-spinner--determinate]': 'isDeterminate()',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuenow]': 'isDeterminate() ? clampedPct() : null',
    '[attr.aria-valuemin]': '"0"',
    '[attr.aria-valuemax]': '"100"',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[style.display]': '"inline-flex"',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-variant]': 'variant()',
    '[attr.data-sn-determinate]': 'isDeterminate() ? "" : null',
  },
})
export class ProgressSpinner implements SnPartSource {
  readonly size = input(snDefault(SN_PROGRESS_SPINNER_DEFAULTS, 'size', 32), { transform: numberAttribute });
  /** Stroke width in viewBox units (the box is 24 wide). Defaults to `3.5`, or `2` for the material variant. */
  readonly strokeWidth = input<number | undefined>(snDefaults(SN_PROGRESS_SPINNER_DEFAULTS)?.strokeWidth, { transform: (v) => (v === undefined || v === null ? undefined : numberAttribute(v)) });
  readonly value = input<number | undefined>(undefined, { transform: (v) => (v === undefined || v === null ? undefined : numberAttribute(v)) });
  readonly variant = input<ProgressSpinnerVariant>(snDefault(SN_PROGRESS_SPINNER_DEFAULTS, 'variant', 'default'));
  readonly color = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    PROGRESS_SPINNER_RESERVED_ATTRS[section] ?? [];

  private readonly intl = inject(SnCommonIntl);

  protected readonly isDeterminate = computed(() => {
    const v = this.value();
    return v !== undefined && v !== null;
  });

  protected readonly clampedPct = computed(() => {
    const v = this.value();
    if (v === undefined || v === null) return 0;
    return Math.min(Math.max(v, 0), 100);
  });

  protected readonly pctFraction = computed(() => this.clampedPct() / 100);

  protected readonly materialSegments = ['clipper-start', 'gap-patch', 'clipper-end'] as const;

  protected readonly resolvedStrokeWidth = computed(() =>
    this.strokeWidth() ?? (this.variant() === 'material' ? MATERIAL_STROKE_WIDTH : DEFAULT_STROKE_WIDTH),
  );

  protected readonly materialRadius = computed(() => (VIEWBOX_SIZE - this.resolvedStrokeWidth()) / 2);

  protected readonly materialCircumference = computed(() => 2 * Math.PI * this.materialRadius());

  protected readonly materialDashOffset = computed(() =>
    this.materialCircumference() * (1 - this.pctFraction()),
  );

  protected readonly fillDash = computed(() => {
    if (!this.isDeterminate()) return `${0.25 * TWO_PI_R} ${TWO_PI_R}`;
    const frac = this.pctFraction();
    return `${frac * TWO_PI_R} ${TWO_PI_R}`;
  });

  protected readonly svgClass = computed(() => (this.isDeterminate() ? '' : 'sn-progress-spinner-svg--rotate'));

  protected readonly svgStyle = computed(() => {
    return this.isDeterminate() ? 'rotate(-90deg)' : undefined;
  });

  protected readonly fillColor = computed(() => {
    return this.color() ?? 'var(--sn-progress-spinner-color)';
  });

  protected readonly resolvedAriaLabel = computed(() => {
    if (this.isDeterminate()) return null;
    return this.ariaLabel() ?? this.intl.loading;
  });

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly svgClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'svg', false),
  );
}
