import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ElementRef,
  Injector,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Icon } from 'ashen-ui/icon';
import {
  SN_PART_SOURCE,
  SnIconRegistry,
  SnPart,
  resolveSnClass,
  snAfterExitAnimation,
  snAnimated,
  snDefault,
  snDefaults,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  SnToastIntl,
  type SnShowHideAnimation,
} from 'ashen-ui/core';
import { SN_TOAST_DEFAULTS } from './toast-defaults';
import { ToastService, type ToastExitWaiter, type ToastItem, type ToastSeverity, type ToastPosition } from './toast.service';

// aria-live, aria-atomic, role and the close button's type and label are reserved.
const TOAST_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['aria-live', 'aria-atomic'],
  item: ['role', 'data-sn-toast-id'],
  closeButton: ['type', 'aria-label'],
};

@Component({
  selector: 'sn-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Toast) }],
  templateUrl: './toast.html',
  host: {
    class: 'sn-toast',
    '[class.sn-toast--top-right]': 'position() === "top-right"',
    '[class.sn-toast--top-left]': 'position() === "top-left"',
    '[class.sn-toast--bottom-right]': 'position() === "bottom-right"',
    '[class.sn-toast--bottom-left]': 'position() === "bottom-left"',
    '[attr.aria-live]': '"polite"',
    '[attr.aria-atomic]': '"false"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-position]': 'position()',
  },
})
export class Toast implements OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  /** Corner position for the toast stack. Defaults to `'top-right'`. */
  readonly position = input<ToastPosition>(snDefault(SN_TOAST_DEFAULTS, 'position', 'top-right'));

  /** Extra classes via the SnClass pass-through system. */
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    TOAST_RESERVED_ATTRS[section] ?? [];

  readonly animated = input(true, { transform: booleanAttribute });
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(
    snDefaults(SN_TOAST_DEFAULTS)?.animation,
  );

  protected readonly service = inject(ToastService);
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly injector = inject(Injector);
  protected readonly intl = inject(SnToastIntl);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly items = this.service.items;

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  constructor() {
    this.service._attachOutlet(this.waitForExit);
    effect(() => {
      const currentIds = new Set<string>();
      for (const item of this.items()) {
        currentIds.add(item.id);
        if (item.state !== 'hiding' && !this._scheduledItems.has(item.id)) {
          this._scheduledItems.add(item.id);
          this.startTimer(item);
        }
      }
      for (const id of this._scheduledItems) {
        if (!currentIds.has(id)) {
          this._scheduledItems.delete(id);
          this._remaining.delete(id);
          this._timerStartedAt.delete(id);
          this._clearTimer(id);
        }
      }
    });
  }

  private readonly _dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly _scheduledItems = new Set<string>();
  private readonly _remaining = new Map<string, number>();
  private readonly _timerStartedAt = new Map<string, number>();

  protected iconFor(severity: ToastSeverity): string {
    return this.icons.resolve(severity);
  }

  protected itemClass(item: ToastItem): Record<string, boolean> {
    return {
      'sn-toast-item': true,
      [`sn-toast-item--${item.severity}`]: true,
      'sn-toast-item--entering': item.state === 'entering',
      'sn-toast-item--hiding': item.state === 'hiding',
    };
  }

  protected resolveItemClass(snClass: SnClass | undefined, section: string): string {
    return resolveSnClass(snClass, section, false);
  }

  /**
   * Start (or restart) the auto-dismiss timer for a toast.
   * Called when the item becomes visible (first render) or when hover ends.
   */
  protected startTimer(item: ToastItem): void {
    if (!this._isBrowser) return;
    if (item.sticky || item.life === 0) return;
    this._clearTimer(item.id);

    const remaining = this._remaining.get(item.id) ?? item.life;
    this._remaining.set(item.id, remaining);
    this._timerStartedAt.set(item.id, Date.now());

    const timer = setTimeout(() => {
      this._remaining.delete(item.id);
      this.requestClose(item.id);
    }, remaining);
    this._dismissTimers.set(item.id, timer);
  }

  protected pauseTimer(item: ToastItem): void {
    if (!this._isBrowser) return;
    if (item.sticky || item.life === 0) return;
    const startedAt = this._timerStartedAt.get(item.id);
    if (startedAt !== undefined) {
      const remaining = this._remaining.get(item.id) ?? item.life;
      this._remaining.set(item.id, Math.max(0, remaining - (Date.now() - startedAt)));
    }
    this._clearTimer(item.id);
  }

  protected resumeTimer(item: ToastItem): void {
    if (!this._isBrowser) return;
    if (item.sticky || item.life === 0) return;

    this.startTimer(item);
  }

  /** Begin the close sequence (exit animation → remove, handled by the service). */
  protected requestClose(id: string): void {
    const item = this.items().find((i) => i.id === id);
    if (!item || item.state === 'hiding') return;

    this._clearTimer(id);
    this._remaining.delete(id);
    this.service.dismiss(id);
  }

  private _clearTimer(id: string): void {
    const t = this._dismissTimers.get(id);
    if (t != null) {
      clearTimeout(t);
      this._dismissTimers.delete(id);
    }
    this._timerStartedAt.delete(id);
  }

  private readonly waitForExit: ToastExitWaiter = (ids, done) => {
    if (!this._animated()) {
      done();
      return () => undefined;
    }
    return snAfterExitAnimation(this.injector, () => this.itemElements(ids), done);
  };

  private itemElements(ids: readonly string[]): Element[] {
    return Array.from(this.host.querySelectorAll('[data-sn-toast-id]')).filter((el) =>
      ids.includes(el.getAttribute('data-sn-toast-id') ?? ''),
    );
  }

  ngOnDestroy(): void {
    this.service._detachOutlet(this.waitForExit);
    for (const timer of this._dismissTimers.values()) {
      clearTimeout(timer);
    }
    this._dismissTimers.clear();
    this._scheduledItems.clear();
    this._remaining.clear();
    this._timerStartedAt.clear();
  }
}
