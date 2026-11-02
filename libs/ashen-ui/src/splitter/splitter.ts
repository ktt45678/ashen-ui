import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  SnSplitterIntl,
  resolveSnClass,
  snInlineStep,
  snIsRtl,
  snNextId,
} from 'ashen-ui/core';
import { SN_SPLITTER } from './splitter-token';
import { SplitterPanel } from './splitter-panel';

const SPLITTER_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  gutter: [
    'role',
    'tabindex',
    'aria-orientation',
    'aria-valuenow',
    'aria-valuemin',
    'aria-valuemax',
    'aria-controls',
    'aria-label',
  ],
};

@Component({
  selector: 'sn-splitter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './splitter.html',
  providers: [
    {
      provide: SN_SPLITTER,
      useFactory: (self: Splitter) => self.context,
      deps: [Splitter],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Splitter) },
  ],
  host: {
    class: 'sn-splitter',
    '[class.sn-splitter-horizontal]': 'layout() === "horizontal"',
    '[class.sn-splitter-vertical]': 'layout() === "vertical"',
    '[class.sn-splitter-resizing]': 'resizing()',
    '[class]': 'rootClassExtra()',
    '[attr.data-sn-orientation]': 'layout()',
    '[attr.data-sn-resizing]': 'resizing() ? "" : null',
  },
})
export class Splitter implements OnDestroy, SnPartSource {
  readonly layout = input<'horizontal' | 'vertical'>('horizontal');
  readonly minSize = input(15);
  readonly step = input(10);
  readonly size = model(50);
  readonly resizeLabel = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    SPLITTER_RESERVED_ATTRS[section] ?? [];

  readonly firstPanelId = snNextId('sn-splitter-panel');

  protected readonly panels = contentChildren(SplitterPanel);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly intl = inject(SnSplitterIntl);
  private readonly rtl = snIsRtl();

  protected readonly resizing = signal(false);

  private unlisten: (() => void)[] = [];

  readonly context = {
    size: this.size.asReadonly(),
    layout: this.layout,
    firstPanelId: this.firstPanelId,
    isFirstPanel: (panel: SplitterPanel) => this.panels()[0] === panel,
    getPanelOrder: (panel: SplitterPanel) => {
      const idx = this.panels().indexOf(panel);
      return idx === 0 ? 0 : 2;
    },
  };

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly gutterClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'gutter', false),
  );

  protected readonly handleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'handle', false),
  );

  protected readonly resolvedLabel = computed(
    () => this.resizeLabel() ?? this.intl.resize,
  );

  protected readonly ariaOrientation = computed(() =>
    this.layout() === 'horizontal' ? 'vertical' : 'horizontal',
  );

  protected readonly ariaValueNow = computed(() => Math.round(this.size()));

  protected readonly ariaValueMin = computed(() => this.minSize());

  protected readonly ariaValueMax = computed(() => 100 - this.minSize());

  protected onGutterPointerDown(event: PointerEvent): void {
    // Only start a drag for the primary button / touch / pen contact.
    if (event.button != null && event.button > 0) return;
    event.preventDefault();
    const rect = this.hostEl.nativeElement.getBoundingClientRect();
    const isHorizontal = this.layout() === 'horizontal';
    this.resizing.set(true);

    // Route all subsequent pointer events (mouse, touch, pen) to the gutter so
    // the drag keeps tracking even if the pointer leaves the element.
    const gutter = event.currentTarget as HTMLElement | null;
    gutter?.setPointerCapture?.(event.pointerId);

    const onMove = (ev: PointerEvent) => {
      // `size` is the FIRST panel's share, and in RTL the first panel is the
      // one on the right, so the horizontal fraction is measured from there.
      const inline = this.rtl()
        ? (rect.right - ev.clientX) / rect.width
        : (ev.clientX - rect.left) / rect.width;
      const pct = isHorizontal ? inline * 100 : ((ev.clientY - rect.top) / rect.height) * 100;
      this.size.set(this.clamp(pct));
    };

    const onUp = () => {
      this.resizing.set(false);
      gutter?.releasePointerCapture?.(event.pointerId);
      this.detachListeners();
    };

    this.unlisten.push(
      this.renderer.listen('document', 'pointermove', onMove as EventListener),
      this.renderer.listen('document', 'pointerup', onUp),
      this.renderer.listen('document', 'pointercancel', onUp),
    );
  }

  protected onGutterKeydown(event: KeyboardEvent): void {
    const isHorizontal = this.layout() === 'horizontal';
    const step = this.step();
    let delta = 0;

    const inlineStep = snInlineStep(event.key, this.rtl());
    if (isHorizontal && inlineStep !== 0) {
      event.preventDefault();
      this.size.set(this.clamp(this.size() + inlineStep * step));
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        if (!isHorizontal) delta = step;
        break;
      case 'ArrowUp':
        if (!isHorizontal) delta = -step;
        break;
      case 'Home':
        this.size.set(this.minSize());
        event.preventDefault();
        return;
      case 'End':
        this.size.set(100 - this.minSize());
        event.preventDefault();
        return;
      default:
        return;
    }

    if (delta !== 0) {
      event.preventDefault();
      this.size.set(this.clamp(this.size() + delta));
    }
  }

  private clamp(value: number): number {
    return Math.min(Math.max(value, this.minSize()), 100 - this.minSize());
  }

  private detachListeners(): void {
    this.unlisten.forEach((fn) => fn());
    this.unlisten = [];
  }

  ngOnDestroy(): void {
    this.detachListeners();
  }
}
