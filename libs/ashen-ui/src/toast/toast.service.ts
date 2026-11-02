import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SN_TOAST_DEFAULTS } from './toast-defaults';

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/** Default auto-dismiss delay in milliseconds (matches reference: 3000 ms). */
const DEFAULT_LIFE = 3000;

export interface ToastConfig {
  /** Visual severity - drives icon and accent colour. Defaults to `'info'`. */
  severity?: ToastSeverity;
  /** Bold headline text shown above the detail. */
  summary: string;
  /** Optional secondary body text. */
  detail?: string;
  /**
   * Auto-dismiss after this many milliseconds.
   * Pass `0` or set `sticky: true` to keep the toast until manually dismissed.
   * Defaults to 3000 ms.
   */
  life?: number;
  /** Prevent auto-dismiss; the user must close manually. */
  sticky?: boolean;
  /** Show a close button. Defaults to `true`. */
  closable?: boolean;
  /**
   * Drop this toast if an identical one is already on screen, returning the
   * existing toast's id instead of adding a second. Defaults to `false`.
   *
   * Scoped to what is currently visible, deliberately: a toast already playing
   * its exit animation does not suppress a new one, and a retry loop that
   * outlives its own toast is allowed to say so again. It stops the stack of
   * ten identical "Save failed" toasts without ever hiding the current state.
   */
  preventDuplicates?: boolean;
  /**
   * What counts as identical, for `preventDuplicates`. Defaults to the
   * severity, summary and detail together, which is right whenever the text is
   * the message. Set it when the text varies but the event does not, an
   * attempt counter in the detail being the usual case.
   */
  key?: string;
}

/** Internal representation - adds runtime state fields. */
export interface ToastItem extends Required<Omit<ToastConfig, 'detail'>> {
  id: string;
  detail: string | undefined;
  /** Animation state: entering → visible → hiding → (removed). */
  state: 'entering' | 'visible' | 'hiding';
}

/**
 * Waits for the exit animation of the given items, then calls `done`.
 * Returns a function that cancels the wait.
 */
export type ToastExitWaiter = (ids: readonly string[], done: () => void) => () => void;

let _nextId = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * App-wide toast defaults, sitting between an explicit `show()` option and
   * the library's own default. `null` when nothing is provided.
   *
   * The service is `providedIn: 'root'`, so only a root-level provider is
   * visible here: a `SN_TOAST_DEFAULTS` scoped to a route or a component
   * subtree reaches the `<sn-toast>` outlet but never this.
   */
  private readonly _defaults = inject(SN_TOAST_DEFAULTS, { optional: true });

  /** All currently active toast items (read-only for consumers). */
  readonly items = signal<ToastItem[]>([]);

  private readonly _pendingFrames = new Set<number>();
  private readonly _pendingExits = new Set<{ cancel: () => void }>();
  private _exitWaiter: ToastExitWaiter | null = null;

  constructor() {
    // Callbacks of a root service would outlive a torn-down application (tests, micro-frontends).
    inject(DestroyRef).onDestroy(() => {
      this._pendingFrames.forEach((frame) => cancelAnimationFrame(frame));
      this._pendingExits.forEach((exit) => exit.cancel());
      this._pendingFrames.clear();
      this._pendingExits.clear();
      this.items.set([]);
    });
  }

  /**
   * Show a toast and return its id.
   * The returned id can be passed to `clear(id)` to dismiss it early.
   */
  show(config: ToastConfig): string {
    const severity = config.severity ?? this._defaults?.severity ?? 'info';
    const key = config.key ?? `${severity}|${config.summary}|${config.detail ?? ''}`;
    const preventDuplicates =
      config.preventDuplicates ?? this._defaults?.preventDuplicates ?? false;

    if (preventDuplicates) {
      // `state !== 'hiding'`: an item on its way out is not on screen for much
      // longer, so letting it suppress a new one would swallow the message.
      const onScreen = this.items().find((i) => i.key === key && i.state !== 'hiding');
      if (onScreen) return onScreen.id;
    }

    const id = `sn-toast-${++_nextId}`;
    const item: ToastItem = {
      id,
      key,
      preventDuplicates,
      severity,
      summary: config.summary,
      detail: config.detail,
      // `??`, not `||`: `life: 0` and `closable: false` are falsy but meaningful.
      life: config.life ?? this._defaults?.life ?? DEFAULT_LIFE,
      sticky: config.sticky ?? this._defaults?.sticky ?? false,
      closable: config.closable ?? this._defaults?.closable ?? true,
      state: 'entering',
    };
    this.items.update((list) => [...list, item]);
    // Enter becomes visible after one frame, unless the item was dismissed meanwhile.
    if (this._isBrowser) {
      const frame = requestAnimationFrame(() => {
        this._pendingFrames.delete(frame);
        this.items.update((list) =>
          list.map((i) => (i.id === id && i.state === 'entering' ? { ...i, state: 'visible' as const } : i)),
        );
      });
      this._pendingFrames.add(frame);
    } else {
      this._setState(id, 'visible');
    }
    return id;
  }

  /** Convenience shortcut: info toast. */
  info(summary: string, opts?: Omit<ToastConfig, 'severity' | 'summary'>): string {
    return this.show({ ...opts, severity: 'info', summary });
  }

  /** Convenience shortcut: success toast. */
  success(summary: string, opts?: Omit<ToastConfig, 'severity' | 'summary'>): string {
    return this.show({ ...opts, severity: 'success', summary });
  }

  /** Convenience shortcut: warning toast. */
  warn(summary: string, opts?: Omit<ToastConfig, 'severity' | 'summary'>): string {
    return this.show({ ...opts, severity: 'warning', summary });
  }

  /** Convenience shortcut: error toast. */
  error(summary: string, opts?: Omit<ToastConfig, 'severity' | 'summary'>): string {
    return this.show({ ...opts, severity: 'error', summary });
  }

  /**
   * Begin the exit animation for one toast (or all when no id given),
   * then remove the affected items once the exit animation has played.
   * Without a rendered `<sn-toast>` outlet the items are removed at once.
   */
  dismiss(id?: string): void {
    const affected = this.items()
      .filter((item) => (id === undefined || item.id === id) && item.state !== 'hiding')
      .map((item) => item.id);
    if (affected.length === 0) return;
    this.items.update((list) =>
      list.map((item) =>
        affected.includes(item.id) ? { ...item, state: 'hiding' as const } : item,
      ),
    );
    const removeAll = () => affected.forEach((itemId) => this._remove(itemId));
    if (!this._isBrowser || !this._exitWaiter) {
      removeAll();
      return;
    }
    // Registered before waiting, because the waiter may finish synchronously.
    const exit = { cancel: () => {} };
    this._pendingExits.add(exit);
    exit.cancel = this._exitWaiter(affected, () => {
      this._pendingExits.delete(exit);
      removeAll();
    });
  }

  /** @internal Called by the `<sn-toast>` outlet, which owns the rendered items. */
  _attachOutlet(waiter: ToastExitWaiter): void {
    this._exitWaiter = waiter;
  }

  /** @internal Drops the outlet and removes items whose exit can no longer be watched. */
  _detachOutlet(waiter: ToastExitWaiter): void {
    if (this._exitWaiter !== waiter) return;
    this._exitWaiter = null;
    this._pendingExits.forEach((exit) => exit.cancel());
    this._pendingExits.clear();
    this.items.update((list) => list.filter((item) => item.state !== 'hiding'));
  }

  _remove(id: string): void {
    this.items.update((list) => list.filter((item) => item.id !== id));
  }

  private _setState(id: string, state: ToastItem['state']): void {
    this.items.update((list) =>
      list.map((item) => (item.id === id ? { ...item, state } : item)),
    );
  }
}
