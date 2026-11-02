import { InjectionToken } from '@angular/core';
import type { SnShowHideAnimation } from 'ashen-ui/core';
import type { ToastPosition, ToastSeverity } from './toast.service';

/**
 * Application-wide defaults for toasts.
 *
 * `position` and `animation` are read by the `<sn-toast>` outlet; the rest are
 * read by `ToastService` and apply to every `show()` call that does not set
 * them explicitly.
 */
export interface SnToastDefaults {
  /** Outlet corner. Component default: `'top-right'`. */
  position?: ToastPosition;
  /** Replaces the built-in enter/exit keyframes. Component default: none. */
  animation?: SnShowHideAnimation;
  /** Severity used when `show()` omits one. Service default: `'info'`. */
  severity?: ToastSeverity;
  /** Auto-dismiss delay in ms; `0` means "never". Service default: `3000`. */
  life?: number;
  /** Keep the toast until dismissed manually. Service default: `false`. */
  sticky?: boolean;
  /** Render a close button. Service default: `true`. */
  closable?: boolean;
  /** Drop a toast identical to one already on screen. Service default: `false`. */
  preventDuplicates?: boolean;
}

/**
 * Defaults for `<sn-toast>` and `ToastService`.
 *
 * ```ts
 * providers: [{ provide: SN_TOAST_DEFAULTS, useValue: { life: 5000 } }]
 * ```
 *
 * Because `ToastService` is `providedIn: 'root'`, the service-side keys only
 * take effect when the token is provided at the root injector. The outlet-side
 * keys (`position`, `animation`) resolve through the `<sn-toast>` element and
 * can be scoped to a subtree.
 *
 * Usually reached through `provideAshenUI({ defaults: { toast: … } })`.
 */
export const SN_TOAST_DEFAULTS = new InjectionToken<SnToastDefaults>('SN_TOAST_DEFAULTS');
