import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  input,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  type SnClass,
  resolveSnClass,
  SnTokenOverrides,
  snDefault,
  snRenderGate,
} from 'ashen-ui/core';
import { IconTemplate } from 'ashen-ui/core';
import { SN_BUTTON_DEFAULTS } from './button-defaults';

const SPINNER_VIEWBOX_SIZE = 24;
// Material draws the stroke at a tenth of the diameter.
const SPINNER_STROKE_WIDTH = 2.4;

export type ButtonVariant =
  /** Filled, the default call to action. */
  | 'base'
  /** Filled with an elevation shadow. */
  | 'raised'
  /** Transparent with a coloured border, for a secondary action beside a base button. */
  | 'outlined'
  /** No border or fill until hovered, for the lowest-emphasis action in a group. */
  | 'text'
  /** Square, icon-only, transparent. */
  | 'icon'
  /** Square, icon-only, filled. */
  | 'icon-filled'
  /** Square, icon-only, with a border. */
  | 'icon-outlined'
  /** Square, icon-only, no fill until hovered. */
  | 'icon-text';

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  /** Paints nothing of its own, so the surrounding theme or a `--sn-button-*` override supplies the colour. */
  | 'none';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
/**
 * The corner treatment. `pill` is fully rounded whatever `--sn-button-border-radius`
 * says, which is what a filter chip or a toolbar toggle wants without having to
 * override the token per instance.
 */
export type ButtonShape = 'default' | 'pill';
export type ButtonLoadingVariant =
  /** The library spinner. */
  | 'default'
  /** The Material-style spinner, matching `ProgressSpinner` in `material` variant. */
  | 'material';

@Component({
  selector: 'button[snButton], a[snButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  hostDirectives: [{ directive: SnTokenOverrides, inputs: ['snTokens'] }],
  templateUrl: './button.html',
  host: {
    class: 'sn-button',
    '[class.sn-raised-button]': 'variant() === "raised"',
    '[class.sn-icon-button]': 'isIconVariant()',
    '[class.sn-icon-filled-button]': 'variant() === "icon-filled"',
    '[class.sn-outlined-button]': 'variant() === "outlined" || variant() === "icon-outlined"',
    '[class.sn-text-button]': 'variant() === "text" || variant() === "icon-text"',
    '[class.sn-color-secondary]': 'color() === "secondary"',
    '[class.sn-color-success]': 'color() === "success"',
    '[class.sn-color-error]': 'color() === "error"',
    '[class.sn-color-warning]': 'color() === "warning"',
    '[class.sn-color-info]': 'color() === "info"',
    '[class.sn-color-none]': 'color() === "none"',
    '[class.sn-button-xs]': 'size() === "xs"',
    '[class.sn-button-sm]': 'size() === "sm"',
    '[class.sn-button-lg]': 'size() === "lg"',
    '[class.sn-button-pill]': 'shape() === "pill"',
    '[class.sn-button-icon-only]': 'iconOnly() && !isIconVariant()',
    '[attr.disabled]': 'disabled() || loading() ? "" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[class]': 'snClassResolved()',
    '[class.sn-button-animate]': '_animate()',
    '[attr.data-sn-variant]': 'variant()',
    '[attr.data-sn-color]': 'color()',
    '[attr.data-sn-size]': 'size()',
    '[attr.data-sn-shape]': 'shape()',
  },
})
export class Button {
  protected readonly _animate = snRenderGate();

  readonly variant = input<ButtonVariant>(snDefault(SN_BUTTON_DEFAULTS, 'variant', 'base'));
  readonly color = input<ButtonColor>(snDefault(SN_BUTTON_DEFAULTS, 'color', 'primary'));
  readonly size = input<ButtonSize>(snDefault(SN_BUTTON_DEFAULTS, 'size', 'md'));
  readonly shape = input<ButtonShape>(snDefault(SN_BUTTON_DEFAULTS, 'shape', 'default'));
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingVariant = input<ButtonLoadingVariant>(
    snDefault(SN_BUTTON_DEFAULTS, 'loadingVariant', 'default'),
  );
  readonly icon = input('');
  /**
   * Sizes a non-icon variant as a square (a circle with `shape="pill"`) around a
   * lone icon, so an outlined or text button can carry just an icon. Give the
   * button an `aria-label`. The icon variants are already square.
   */
  readonly iconOnly = input(false, { transform: booleanAttribute });
  readonly iconPosition = input<'start' | 'end'>(
    snDefault(SN_BUTTON_DEFAULTS, 'iconPosition', 'start'),
  );
  readonly snClass = input<SnClass>();

  protected readonly iconTemplates = contentChildren(IconTemplate);

  protected readonly customIconTpl = computed(() =>
    this.iconTemplates().find((t) => !t.snIcon() || t.snIcon() === 'icon') ??
    this.iconTemplates()[0] ??
    null,
  );

  protected readonly effectiveIcon = computed(() =>
    this.loading() ? 'progress_activity' : this.icon(),
  );

  protected readonly isIconVariant = computed(() => this.variant().startsWith('icon'));

  protected readonly showMaterialSpinner = computed(
    () => this.loading() && this.loadingVariant() === 'material',
  );

  protected readonly materialSegments = ['clipper-start', 'gap-patch', 'clipper-end'] as const;
  protected readonly spinnerStrokeWidth = SPINNER_STROKE_WIDTH;
  protected readonly spinnerRadius = (SPINNER_VIEWBOX_SIZE - SPINNER_STROKE_WIDTH) / 2;
  protected readonly spinnerCircumference = 2 * Math.PI * this.spinnerRadius;

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
