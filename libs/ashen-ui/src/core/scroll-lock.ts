import { Injectable, Injector, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type BlockScrollStrategy, createBlockScrollStrategy } from '@angular/cdk/overlay';

/**
 * Reference-counted page scroll lock for modal overlays (Dialog, Drawer).
 *
 * Wraps the CDK's `BlockScrollStrategy`, which freezes the page by pinning
 * `<html>` with `position: fixed` at a negative scroll offset while keeping a
 * real, native, inert scrollbar track via `overflow-y: scroll`. Because the
 * scrollbar is never removed there is no layout shift, and because it is the
 * genuine browser-drawn scrollbar there is nothing to repaint or colour-match.
 *
 * This replaces an earlier "remove the scrollbar and fake it back" approach
 * that had two failure modes inherent to the technique:
 *
 *   1. The painted gutter could not blend. It was filled with
 *      `--sn-surface-overlay`, which is semi-transparent in every shipped
 *      theme, so it composited over the page instead of matching the opaque
 *      mask, and the mask did not extend over the gutter anyway. Worse,
 *      `html.style.background` is the shorthand, so any app with a gradient or
 *      image on `<html>` lost it for as long as a dialog was open, and got a
 *      visible flash back on close.
 *   2. Reserving the space shifted fixed-position layout. `padding-right` moves
 *      anything anchored to the right edge, and `scrollbar-gutter: stable`
 *      shrinks the content box so `width: 100%` children shrink with it. A
 *      fixed or sticky sidebar gained a strip of empty space whenever a dialog
 *      opened.
 *
 * The ref-count is a deliberate addition to the CDK, not a reimplementation of
 * it. `BlockScrollStrategy` is per-overlay and its internal `_canBeEnabled()`
 * returns false once the `cdk-global-scrollblock` class is present, so a second
 * overlay's `enable()` is a silent no-op, and then the FIRST overlay's
 * `disable()` would unblock scrolling while the second is still open. Nested
 * dialogs need the counter, and this wrapper is the right place for it.
 *
 * `.cdk-global-scrollblock` ships in `@angular/cdk/overlay-prebuilt.css`, which
 * consumers already import for the existing overlay components, so this adds no
 * new stylesheet dependency.
 *
 * Trade-offs, all inherited from the CDK:
 *
 * - `position: fixed` on `<html>` breaks `position: sticky` descendants, but
 *   only while a modal is open.
 * - Scroll position is restored with `window.scroll()`, so there is one frame
 *   of possible jank on close. The CDK forces `scroll-behavior: auto` during
 *   the restore so a smooth-scroll setting does not animate it.
 * - It only engages when the document actually overflows, which is correct --
 *   it avoids applying `position: fixed` for nothing.
 * - Horizontal-only overflow gains a vertical scrollbar track. Genuine edge
 *   case, rare enough to accept.
 * - Apps that scroll an inner container rather than the document are not helped
 *   by either approach; out of scope.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLock {
  private readonly _injector = inject(Injector);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _strategy: BlockScrollStrategy | null = null;
  private _count = 0;
  private _hideCount = 0;
  private _previousOverflowY = '';

  /**
   * Block page scrolling. Safe to nest; every `lock()` needs an `unlock()` with
   * the same options. `hideScrollbar` removes the inert track too, for overlays
   * that cover the whole viewport so the shift behind them is never seen.
   */
  lock(options?: ScrollLockOptions): void {
    if (!this._isBrowser) return;
    if (options?.hideScrollbar && this._hideCount++ === 0) {
      const html = document.documentElement;
      this._previousOverflowY = html.style.overflowY;
      html.style.overflowY = 'hidden';
    }
    if (this._count++ > 0) return;
    this._strategy = createBlockScrollStrategy(this._injector);
    this._strategy.enable();
  }

  /** Release one hold. Scrolling resumes once every holder has released. */
  unlock(options?: ScrollLockOptions): void {
    if (!this._isBrowser) return;
    if (options?.hideScrollbar && this._hideCount > 0 && --this._hideCount === 0) {
      document.documentElement.style.overflowY = this._previousOverflowY;
    }
    if (this._count === 0 || --this._count > 0) return;
    this._strategy?.disable();
    this._strategy = null;
  }
}

export interface ScrollLockOptions {
  /** Also hide the page scrollbar while held. Defaults to `false`. */
  hideScrollbar?: boolean;
}
