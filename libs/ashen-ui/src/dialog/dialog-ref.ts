import { Subject } from 'rxjs';
import type { Observable } from 'rxjs';
import type { DialogCloseReason } from './dialog-config';

/**
 * Handle to a dialog opened via `DialogService.open`. Injected into the opened
 * component/template and returned to the caller so both sides can close the
 * dialog and observe its lifecycle.
 *
 * @typeParam R Result type delivered through {@link afterClosed}.
 * @typeParam C Type of the component rendered in the dialog (`null` for templates).
 */
export class SnDialogRef<R = unknown, C = unknown> {
  /** The rendered component instance, or `null` when a template was opened. */
  componentInstance: C | null = null;

  private readonly _afterClosed = new Subject<R | undefined>();
  private readonly _afterOpened = new Subject<void>();
  private _result: R | undefined;
  private _closeHandler: ((result: R | undefined, reason: DialogCloseReason) => void) | null = null;
  private _pendingClose = false;
  private _pendingReason: DialogCloseReason = 'programmatic';
  private _closed = false;
  private _dismissResult: (() => R | undefined) | null = null;

  /** Emits once (then completes) after the dialog content has first rendered. */
  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /** Emits the close result once (then completes) after the dialog has fully closed. */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Set what a close without a result reports (close button, backdrop, Escape,
   * navigation or a bare `close()`). Useful when the content saved something
   * while open and the opener should still hear about it.
   */
  setDismissResult(getResult: () => R | undefined): void {
    this._dismissResult = getResult;
  }

  /** Close the dialog, optionally with a result delivered to {@link afterClosed}. */
  close(
    result?: R,
    reason: DialogCloseReason = result === undefined ? 'programmatic' : 'result',
  ): void {
    if (this._closed) return;
    if (result === undefined && this._dismissResult) result = this._dismissResult();
    if (this._closeHandler) {
      this._closeHandler(result, reason);
    } else {
      // Closed before the service finished wiring, so defer to _init.
      this._pendingClose = true;
      this._result = result;
      this._pendingReason = reason;
    }
  }

  /** @internal Wire the service's teardown routine; runs any deferred close. */
  _init(closeHandler: (result: R | undefined, reason: DialogCloseReason) => void): void {
    this._closeHandler = closeHandler;
    if (this._pendingClose) {
      this._pendingClose = false;
      closeHandler(this._result, this._pendingReason);
    }
  }

  _setResult(result: R | undefined): void {
    this._result = result;
  }

  /** @internal Called by the container after first render. */
  _markOpened(): void {
    this._afterOpened.next();
    this._afterOpened.complete();
  }

  /** @internal Called by the service once the overlay is fully torn down. */
  _markClosed(): void {
    if (this._closed) return;
    this._closed = true;
    this._afterClosed.next(this._result);
    this._afterClosed.complete();
  }
}
