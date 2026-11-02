import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnColorPickerIntl,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_COLOR_PICKER } from './color-picker-token';
import { hsvToHex } from './color-picker';

export type ColorSliderChannel = 'hue' | 'alpha' | 'brightness' | 'saturation';
export type ColorSliderOrientation = 'horizontal' | 'vertical';

const CHECKER = 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px';

@Component({
  selector: 'sn-color-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './color-slider.html',
  styleUrl: './color-slider.scss',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ColorSlider) }],
  host: {
    class: 'sn-color-slider',
    role: 'slider',
    tabindex: '0',
    '[class.sn-color-slider-vertical]': 'orientation() === "vertical"',
    '[class]': 'rootClassExtra()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-valuemin]': 'ariaMin()',
    '[attr.aria-valuemax]': 'ariaMax()',
    '[attr.aria-valuenow]': 'ariaValueNow()',
    '[style.--sn-color-slider-rendered-width]': 'trackWidth()',
    '[style.--sn-color-slider-rendered-height]': 'trackHeight()',
    '[style.--sn-color-slider-track]': 'trackGradient()',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class ColorSlider implements OnDestroy, SnPartSource {
  readonly channel = input<ColorSliderChannel>('hue');
  readonly orientation = input<ColorSliderOrientation>('horizontal');
  readonly length = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (): readonly string[] => [
    'role',
    'tabindex',
    'aria-label',
    'aria-orientation',
    'aria-valuemin',
    'aria-valuemax',
    'aria-valuenow',
  ];

  protected readonly ctx = inject(SN_COLOR_PICKER);
  protected readonly intl = inject(SnColorPickerIntl);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef<HTMLElement>);

  private unlisten: (() => void)[] = [];

  protected readonly fraction = computed(() => {
    const ch = this.channel();
    switch (ch) {
      case 'hue':
        return this.ctx.hue() / 360;
      case 'alpha':
        return this.ctx.alpha();
      case 'brightness':
        return this.ctx.brightness() / 100;
      case 'saturation':
        return this.ctx.saturation() / 100;
    }
  });

  protected readonly trackGradient = computed(() => {
    const ch = this.channel();
    const dir = this.orientation() === 'vertical' ? 'to top' : 'to right';
    switch (ch) {
      case 'hue':
        return `linear-gradient(${dir}, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`;
      case 'alpha': {
        const solid = hsvToHex(this.ctx.hue(), this.ctx.saturation() / 100, this.ctx.brightness() / 100);
        const n = parseInt(solid.slice(1), 16);
        const r = (n >> 16) & 255;
        const g = (n >> 8) & 255;
        const b = n & 255;
        const c0 = `rgba(${r}, ${g}, ${b}, 0)`;
        const c1 = `rgba(${r}, ${g}, ${b}, 1)`;
        return `linear-gradient(${dir}, ${c0}, ${c1}), ${CHECKER}`;
      }
      case 'brightness': {
        const solid = hsvToHex(this.ctx.hue(), this.ctx.saturation() / 100, 1);
        return `linear-gradient(${dir}, #000, ${solid})`;
      }
      case 'saturation': {
        const c0 = hsvToHex(this.ctx.hue(), 0, this.ctx.brightness() / 100);
        const c1 = hsvToHex(this.ctx.hue(), 1, this.ctx.brightness() / 100);
        return `linear-gradient(${dir}, ${c0}, ${c1})`;
      }
    }
  });

  protected readonly thumbPosition = computed(() => {
    const t = Math.min(Math.max(this.fraction(), 0), 1);
    if (this.orientation() === 'vertical') {
      return { top: `${(1 - t) * 100}%`, left: '50%' };
    }
    return { left: `${t * 100}%`, top: '50%' };
  });

  protected readonly ariaLabel = computed(() => {
    const ch = this.channel();
    switch (ch) {
      case 'hue':
        return this.intl.sliderHue;
      case 'alpha':
        return this.intl.sliderAlpha;
      case 'brightness':
        return this.intl.sliderBrightness;
      case 'saturation':
        return this.intl.sliderSaturation;
    }
  });

  protected readonly ariaMin = computed(() => 0);
  protected readonly ariaMax = computed(() => {
    const ch = this.channel();
    return ch === 'hue' ? 360 : 100;
  });

  protected readonly ariaValueNow = computed(() => {
    const ch = this.channel();
    switch (ch) {
      case 'hue':
        return Math.round(this.ctx.hue());
      case 'alpha':
        return Math.round(this.ctx.alpha() * 100);
      case 'brightness':
        return Math.round(this.ctx.brightness());
      case 'saturation':
        return Math.round(this.ctx.saturation());
    }
  });

  protected readonly trackWidth = computed(() => {
    if (this.orientation() === 'vertical') return 'var(--sn-color-picker-slider-height)';
    return this.length() ?? '100%';
  });

  protected readonly trackHeight = computed(() => {
    if (this.orientation() === 'vertical') return this.length() ?? '10rem';
    return 'var(--sn-color-picker-slider-height)';
  });

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
  protected readonly thumbClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'thumb', false),
  );

  protected onPointerDown(event: PointerEvent): void {
    if (event.button != null && event.button > 0) return;
    event.preventDefault();
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.el.nativeElement.setPointerCapture(event.pointerId);
    this.updateFromPointer(event, rect);

    const onMove = (ev: PointerEvent) => this.updateFromPointer(ev, rect);
    const onUp = () => this.detachListeners();

    this.unlisten.push(
      this.renderer.listen('document', 'pointermove', onMove as EventListener),
      this.renderer.listen('document', 'pointerup', onUp),
      this.renderer.listen('document', 'pointercancel', onUp),
    );
  }

  private updateFromPointer(ev: PointerEvent, rect: DOMRect): void {
    const vertical = this.orientation() === 'vertical';
    const raw = vertical
      ? 1 - (ev.clientY - rect.top) / rect.height
      : (ev.clientX - rect.left) / rect.width;
    const t = Math.min(Math.max(raw, 0), 1);
    this.applyFraction(t);
  }

  private applyFraction(t: number): void {
    const ch = this.channel();
    switch (ch) {
      case 'hue':
        this.ctx.setHue(t * 360);
        break;
      case 'alpha':
        this.ctx.setAlpha(t);
        break;
      case 'brightness':
        this.ctx.setBrightness(t * 100);
        break;
      case 'saturation':
        this.ctx.setSaturation(t * 100);
        break;
    }
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const isVertical = this.orientation() === 'vertical';
    const step = event.shiftKey ? 10 : 1;
    const ch = this.channel();
    const max = ch === 'hue' ? 360 : 100;

    const increment = () => {
      const cur = this.ariaValueNow();
      this.applyFraction(Math.min(cur + step, max) / max);
    };
    const decrement = () => {
      const cur = this.ariaValueNow();
      this.applyFraction(Math.max(cur - step, 0) / max);
    };

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (!isVertical) increment();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (!isVertical) decrement();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isVertical) increment();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (isVertical) decrement();
        break;
      case 'Home':
        event.preventDefault();
        this.applyFraction(0);
        break;
      case 'End':
        event.preventDefault();
        this.applyFraction(1);
        break;
    }
  }

  private detachListeners(): void {
    this.unlisten.forEach((fn) => fn());
    this.unlisten = [];
  }

  ngOnDestroy(): void {
    this.detachListeners();
  }
}
