import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { snOverlayPanel } from 'ashen-ui/cdk';
import { resolveSnClass, snAfterExitAnimation, snAnimated, type SnClass, SnColorPickerIntl, type SnShowHideAnimation } from 'ashen-ui/core';
import { SN_COLOR_PICKER } from './color-picker-token';
import { ColorArea } from './color-area';
import { ColorSlider } from './color-slider';
import { ColorInput } from './color-input';
import { ColorEyeDropper } from './color-eye-dropper';

export function hexToHsv(hex: string): { h: number; s: number; v: number; alpha: number } {
  const m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex || '');
  if (!m) return { h: 210, s: 1, v: 0.95, alpha: 1 };
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? d / max : 0, v: max, alpha: m[2] ? parseInt(m[2], 16) / 255 : 1 };
}

export function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number): string => {
    const k = (n + h / 60) % 6;
    const c = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return '#' + f(5) + f(3) + f(1);
}

export function normalizeHex(hex: string): string {
  return hex.toLowerCase().replace(/^#/, '#');
}

const DEFAULT_HEX = '#000000';

@Component({
  selector: 'sn-color-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorArea, ColorSlider, ColorInput, ColorEyeDropper],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPicker),
      multi: true,
    },
    {
      provide: SN_COLOR_PICKER,
      useFactory: (self: ColorPicker) => self.context,
      deps: [ColorPicker],
    },
  ],
  host: {
    class: 'sn-color-picker',
    '[class.sn-color-picker-popover-mode]': 'popover()',
    '[class.sn-color-picker-disabled]': 'isDisabled()',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-mode]': 'popover() ? "popover" : "inline"',
    '[attr.data-sn-disabled]': 'isDisabled() ? "" : null',
  },
})
export class ColorPicker implements ControlValueAccessor, OnDestroy {
  readonly value = model<string>(DEFAULT_HEX);
  readonly popover = input(false, { transform: booleanAttribute });
  readonly showAlpha = input(false, { transform: booleanAttribute });
  readonly showEyeDropper = input(false, { transform: booleanAttribute });
  readonly showPreview = input(true, { transform: booleanAttribute });
  /** Popover mode only: show the hex field next to the swatch. Set false for a swatch-only trigger. */
  readonly showInput = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly snClass = input<SnClass>();
  readonly animated = input(true, { transform: booleanAttribute });
  /**
   * `animated` AND-ed with the app-wide motion setting. Read this, never
   * `animated()` directly, or SN_ANIMATIONS_DISABLED and prefers-reduced-motion
   * cannot skip the exit animation.
   */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);

  protected readonly panelTpl = viewChild<TemplateRef<unknown>>('panelTpl');
  protected readonly swatchBtn = viewChild<ElementRef<HTMLButtonElement>>('swatchBtn');

  protected readonly customChildren = contentChildren(ColorArea, { descendants: true });
  protected readonly customSliders = contentChildren(ColorSlider, { descendants: true });
  protected readonly customInputs = contentChildren(ColorInput, { descendants: true });
  protected readonly customEyeDroppers = contentChildren(ColorEyeDropper, { descendants: true });

  private readonly vcr = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly intl = inject(SnColorPickerIntl);

  private readonly disabledFromForms = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.disabledFromForms());

  private readonly _hue = signal(210);
  private readonly _saturation = signal(100);
  private readonly _brightness = signal(95);
  private readonly _alpha = signal(1);

  private lastEmittedHex = '';

  readonly context = {
    hue: this._hue.asReadonly(),
    saturation: this._saturation.asReadonly(),
    brightness: this._brightness.asReadonly(),
    alpha: this._alpha.asReadonly(),
    hex: computed(() => hsvToHex(this._hue(), this._saturation() / 100, this._brightness() / 100)),
    rgb: computed(() => {
      const h6 = hsvToHex(this._hue(), this._saturation() / 100, this._brightness() / 100);
      const n = parseInt(h6.slice(1), 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }),
    setHue: (n: number) => this._commit(n, null, null, null),
    setSaturation: (n: number) => this._commit(null, n, null, null),
    setBrightness: (n: number) => this._commit(null, null, n, null),
    setAlpha: (n: number) => this._commit(null, null, null, Math.min(1, Math.max(0, n))),
    setHex: (hex: string): boolean => {
      const parsed = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(hex);
      if (!parsed) return false;
      const { h, s, v, alpha } = hexToHsv(hex);
      this._commit(h, s * 100, v * 100, alpha);
      return true;
    },
    setRgb: (r: number, g: number, b: number) => {
      const hex =
        '#' +
        [r, g, b]
          .map((x) =>
            Math.min(255, Math.max(0, Math.round(x)))
              .toString(16)
              .padStart(2, '0'),
          )
          .join('');
      const { h, s, v } = hexToHsv(hex);
      this._commit(h, s * 100, v * 100, null);
    },
    isDisabled: this.isDisabled,
  };

  protected readonly hasCustomLayout = computed(
    () =>
      this.customChildren().length > 0 ||
      this.customSliders().length > 0 ||
      this.customInputs().length > 0 ||
      this.customEyeDroppers().length > 0,
  );

  protected readonly previewBg = computed(() => {
    const hex = this.context.hex();
    const a = this._alpha();
    if (a >= 1) return hex;
    const n = parseInt(hex.slice(1), 16);
    const rgba = `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    return `linear-gradient(${rgba}, ${rgba}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 12px 12px`;
  });

  protected readonly isOpen = signal(false);
  protected readonly isClosing = signal(false);

  protected readonly panelAnimation = computed(() => {
    if (!this._animated()) return 'none';
    const custom = this.animation();
    return (this.isClosing() ? custom?.exit : custom?.enter) ?? null;
  });

  protected readonly rootClassExtra = computed(() => resolveSnClass(this.snClass(), 'root', true));
  protected readonly swatchClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'swatch', false),
  );
  protected readonly panelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'panel', false),
  );
  protected readonly previewClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'preview', false),
  );

  protected readonly openLabel = computed(() => this.intl.open);

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private readonly overlayPanel = snOverlayPanel(() => ({
    origin: this.swatchBtn()?.nativeElement,
    template: this.panelTpl(),
    viewContainerRef: this.vcr,
    positions: 'bottom-start' as const,
    panelClass: 'sn-color-picker-overlay-panel',
    hasBackdrop: true,
    backdropClass: 'sn-color-picker-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    scrollStrategy: 'reposition' as const,
  }));
  private subs = new Subscription();
  private cancelExit: (() => void) | null = null;

  constructor() {
    effect(() => {
      const incoming = this.value() || DEFAULT_HEX;
      if (normalizeHex(incoming) === this.lastEmittedHex) return;
      this._applyHex(incoming);
    });
    this.subs.add(this.overlayPanel.backdropClick.subscribe(() => this.requestClose()));
    this.subs.add(
      this.overlayPanel.keydown.subscribe((event) => {
        if (event.keyCode === ESCAPE) {
          event.preventDefault();
          this.requestClose();
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.cancelClose();
    this.subs.unsubscribe();
    this.overlayPanel.dispose();
  }

  private _commit(
    hue: number | null,
    sat: number | null,
    bright: number | null,
    alpha: number | null,
  ): void {
    if (hue !== null) this._hue.set(hue);
    if (sat !== null) this._saturation.set(sat);
    if (bright !== null) this._brightness.set(bright);
    if (alpha !== null) this._alpha.set(alpha);

    const h6 = hsvToHex(
      hue ?? this._hue(),
      (sat ?? this._saturation()) / 100,
      (bright ?? this._brightness()) / 100,
    );
    const a = alpha ?? this._alpha();
    const emitted =
      a < 1
        ? h6 + Math.round(a * 255).toString(16).padStart(2, '0')
        : h6;

    this.lastEmittedHex = normalizeHex(emitted);
    this.value.set(emitted);
    this.onChangeFn(emitted);
  }

  protected openPanel(): void {
    if (!this.isBrowser || this.isOpen()) return;
    if (this.isClosing()) this.cancelClose();

    if (!this.overlayPanel.open()) return;

    this.isOpen.set(true);
    this.isClosing.set(false);
  }

  protected requestClose(): void {
    if (!this.isOpen() || this.isClosing()) return;
    this.isClosing.set(true);
    this.cancelExit = snAfterExitAnimation(this.injector, () => this.overlayPanel.panelElement(), () => this.detach());
  }

  private cancelClose(): void {
    this.cancelExit?.();
    this.cancelExit = null;
    this.isClosing.set(false);
  }

  private detach(): void {
    this.overlayPanel.detach();
    this.isOpen.set(false);
    this.isClosing.set(false);
    this.onTouchedFn();
    this.swatchBtn()?.nativeElement.focus();
  }

  writeValue(value: string | null): void {
    if (!value) {
      // A reset: forget the last emitted colour so writing it back repaints.
      this.lastEmittedHex = '';
      this._applyHex(DEFAULT_HEX);
      this.value.set(DEFAULT_HEX);
      return;
    }
    if (normalizeHex(value) !== this.lastEmittedHex) {
      this._applyHex(value);
    }
    this.value.set(value);
  }

  private _applyHex(hex: string): void {
    const { h, s, v, alpha } = hexToHsv(hex);
    this._hue.set(h);
    this._saturation.set(s * 100);
    this._brightness.set(v * 100);
    this._alpha.set(alpha);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabledFromForms.set(disabled);
  }
}
