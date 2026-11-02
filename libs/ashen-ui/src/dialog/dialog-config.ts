import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { DialogSize } from './dialog';

export type DialogCloseReason =
  | 'result'
  | 'close-button'
  | 'backdrop'
  | 'escape'
  | 'navigation'
  | 'programmatic';

export type DialogCloseGuard<R = unknown> = (
  result: R | undefined,
  reason: DialogCloseReason,
) => boolean | Promise<boolean> | Observable<boolean>;

/**
 * Configuration for an imperatively-opened dialog (`DialogService.open`).
 *
 * Mirrors the declarative `<sn-dialog>` inputs where they overlap (size, close
 * label, backdrop) and adds imperative-only options (data, disableClose,
 * panelClass, …). All fields are optional; sensible defaults are applied by the
 * service.
 */
export interface SnDialogConfig<D = unknown, R = unknown> {
  /** Arbitrary data injected into the opened component/template via {@link SN_DIALOG_DATA}. */
  data?: D;
  /** Panel width preset, matching the declarative `<sn-dialog size>`. Defaults to `'md'`. */
  size?: DialogSize;
  /** Header title text. When omitted (and `closable` is false) the header row is hidden. */
  header?: string;
  /** Render the header close (×) button. Defaults to `true`. */
  closable?: boolean;
  /** When `true`, backdrop click and Escape do NOT close the dialog. Defaults to `false`. */
  disableClose?: boolean;
  /** Render the dimming backdrop/mask. Defaults to `true`. */
  hasBackdrop?: boolean;
  /** Extra class(es) applied to the dialog panel element. */
  panelClass?: string | string[];
  /** Extra class(es) applied to the dialog header element. */
  headerClass?: string | string[];
  /** Extra class(es) applied to the dialog title element. */
  titleClass?: string | string[];
  /** Extra class(es) applied to the dialog body element. */
  bodyClass?: string | string[];
  /** `aria-label` for the panel when there is no visible header title. */
  ariaLabel?: string;
  /** Explicit panel width (any CSS length). Overrides the size preset. */
  width?: string;
  /** Explicit panel max-width (any CSS length). */
  maxWidth?: string;
  /** Explicit panel height (any CSS length). Independent of `maxHeight`. */
  height?: string;
  /** Explicit panel max-height (any CSS length). Independent of `height`. */
  maxHeight?: string;
  /**
   * Edge-to-edge dialog: removes the container gutter, fills the viewport, and
   * drops the panel radius and border. Also hides the page scrollbar while open.
   * Defaults to `false`.
   */
  fullscreen?: boolean;
  /**
   * Chrome density. `'compact'` tightens the header, body, and footer padding.
   * Defaults to `'comfortable'`.
   */
  density?: 'comfortable' | 'compact';
  /** Override the close button's `aria-label` (defaults to `SnIntl.dialogClose`). */
  closeLabel?: string;
  /**
   * Close when the URL changes: router navigations, `Location.go`/`replaceState`
   * and back/forward. Defaults to `true`.
   */
  closeOnNavigation?: boolean;
  /** Move focus to the first tabbable element on open. Defaults to `true`. */
  autoFocus?: boolean;
  canClose?: DialogCloseGuard<R>;
}

/** Injection token for the data passed to a dynamically-opened dialog. */
export const SN_DIALOG_DATA = new InjectionToken<unknown>('SN_DIALOG_DATA');

/** @internal Resolved config provided to the dialog container component. */
export const SN_DIALOG_CONFIG = new InjectionToken<SnDialogConfig>('SN_DIALOG_CONFIG');
