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

@Component({
  selector: 'sn-color-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './color-area.html',
  styleUrl: './color-area.scss',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ColorArea) }],
  host: {
    class: 'sn-color-area',
    role: 'slider',
    tabindex: '0',
    '[class]': 'rootClassExtra()',
    '[attr.aria-label]': 'intl.area',
    '[attr.aria-valuetext]': 'valueText()',
    '[style.--sn-color-area-rendered-height]': 'height() || null',
    '[style.--sn-color-area-hue]': 'hueColor()',
    '(pointerdown)': 'onPointerDown($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class ColorArea implements OnDestroy, SnPartSource {
  readonly height = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (): readonly string[] => [
    'role',
    'tabindex',
    'aria-label',
    'aria-valuetext',
  ];

  protected readonly ctx = inject(SN_COLOR_PICKER, { optional: false });
  protected readonly intl = inject(SnColorPickerIntl);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef<HTMLElement>);

  protected readonly hueColor = computed(
    () => `hsl(${this.ctx.hue()}, 100%, 50%)`,
  );

  protected readonly thumbLeft = computed(() => `${this.ctx.saturation()}%`);
  protected readonly thumbTop = computed(() => `${100 - this.ctx.brightness()}%`);

  protected readonly valueText = computed(() =>
    this.intl.areaValueText(
      Math.round(this.ctx.saturation()),
      Math.round(this.ctx.brightness()),
    ),
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
  protected readonly thumbClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'thumb', false),
  );

  private unlisten: (() => void)[] = [];

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
    const x = Math.min(Math.max((ev.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((ev.clientY - rect.top) / rect.height, 0), 1);
    this.ctx.setSaturation(x * 100);
    this.ctx.setBrightness((1 - y) * 100);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 1;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.ctx.setSaturation(Math.max(0, this.ctx.saturation() - step));
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.ctx.setSaturation(Math.min(100, this.ctx.saturation() + step));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.ctx.setBrightness(Math.min(100, this.ctx.brightness() + step));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.ctx.setBrightness(Math.max(0, this.ctx.brightness() - step));
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
