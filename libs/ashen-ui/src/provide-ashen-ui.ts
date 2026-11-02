import {
  type EnvironmentProviders,
  type Provider,
  type Type,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  SN_ICON_OVERRIDES,
  SN_ICON_LOADING_FALLBACK,
  SN_INPUT_DEFAULTS,
  SnErrorStateMatcher,
  provideSnAnimations,
  type SnAnimationMode,
  type SnIconConfig,
  type SnInputDefaults,
} from 'ashen-ui/core';
import { SN_AUTOCOMPLETE_DEFAULTS, type SnAutoCompleteDefaults } from 'ashen-ui/autocomplete';
import { SN_BUTTON_DEFAULTS, type SnButtonDefaults } from 'ashen-ui/button';
import { SN_DIALOG_DEFAULTS, type SnDialogDefaults } from 'ashen-ui/dialog';
import { SN_DRAWER_DEFAULTS, type SnDrawerDefaults } from 'ashen-ui/drawer';
import { SN_PAGINATOR_DEFAULTS, type SnPaginatorDefaults } from 'ashen-ui/paginator';
import {
  SN_PROGRESS_SPINNER_DEFAULTS,
  type SnProgressSpinnerDefaults,
} from 'ashen-ui/progress-spinner';
import { SN_TABLE_DEFAULTS, type SnTableDefaults } from 'ashen-ui/table';
import { SN_TOAST_DEFAULTS, type SnToastDefaults } from 'ashen-ui/toast';
import { SN_TOOLTIP_DEFAULTS, type SnTooltipDefaults } from 'ashen-ui/tooltip';

/**
 * Application-wide component defaults, keyed by component.
 *
 * Every key is optional and every field inside it is optional: what you leave
 * out keeps the library's own default.
 */
export interface AshenUIDefaults {
  /** `[snButton]`, and `sn-split-button`'s `variant` / `color` / `size`. */
  button?: SnButtonDefaults;
  /** `sn-input-text`, `sn-textarea`, `sn-input-password`, `sn-input-tags`. */
  input?: SnInputDefaults;
  dialog?: SnDialogDefaults;
  drawer?: SnDrawerDefaults;
  /** `<sn-toast>` and `ToastService`. */
  toast?: SnToastDefaults;
  tooltip?: SnTooltipDefaults;
  paginator?: SnPaginatorDefaults;
  table?: SnTableDefaults;
  autocomplete?: SnAutoCompleteDefaults;
  progressSpinner?: SnProgressSpinnerDefaults;
}

/** Everything {@link provideAshenUI} can configure. */
export interface AshenUIConfig {
  /** Per-component defaults. */
  defaults?: AshenUIDefaults;
  /**
   * Motion policy. Omitted means `'reduced-motion'`: follow the user's
   * `prefers-reduced-motion` setting, which is the behaviour with no
   * configuration at all.
   */
  animations?: SnAnimationMode;
  /**
   * When a form control is shown as errored. Omitted keeps the Material-style
   * default (invalid AND (touched OR dirty OR submitted)).
   *
   * ```ts
   * errorStateMatcher: SnTouchedErrorStateMatcher
   * ```
   */
  errorStateMatcher?: Type<SnErrorStateMatcher>;
  /**
   * Remap the glyphs the library draws for itself: chevrons, close buttons,
   * sort arrows, severity icons. Keys you omit keep the Material Symbols
   * default.
   *
   * ```ts
   * icons: { close: 'cancel', 'chevron-down': 'expand_more' }
   * ```
   *
   * This does not touch component `icon` inputs or `IconTemplate`; those name
   * your icons, and you already control them.
   */
  icons?: SnIconConfig;
}

/**
 * Configure Ashen UI for the whole application in one call.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [
 *     provideAshenUI({
 *       defaults: {
 *         button: { size: 'sm' },
 *         input: { size: 'sm' },
 *         toast: { life: 5000 },
 *       },
 *       animations: 'reduced-motion',
 *       errorStateMatcher: SnTouchedErrorStateMatcher,
 *     }),
 *   ],
 * });
 * ```
 *
 * This is sugar. It expands to the individual `SN_*_DEFAULTS` tokens, which
 * are the real API; provide those directly when you want a default scoped to
 * a route or a component subtree rather than to the whole application:
 *
 * ```ts
 * // Compact toolbar: buttons here are small, everywhere else unaffected.
 * @Component({
 *   providers: [{ provide: SN_BUTTON_DEFAULTS, useValue: { size: 'sm' } }],
 * })
 * ```
 *
 * Because this returns `EnvironmentProviders` it belongs in
 * `bootstrapApplication` or a route's `providers`, and cannot be used in a
 * component's `providers`, deliberately, since scoping is what the raw tokens
 * are for.
 *
 * Only the keys you pass are provided. Nothing is registered for a key you
 * leave out, so an unconfigured component resolves its own default and an
 * outer-injector default is not shadowed by an empty object.
 */
export function provideAshenUI(config: AshenUIConfig = {}): EnvironmentProviders {
  const providers: Provider[] = [];
  const defaults = config.defaults ?? {};

  // `!= null`, so `{}` still counts as provided.
  if (defaults.button != null) {
    providers.push({ provide: SN_BUTTON_DEFAULTS, useValue: defaults.button });
  }
  if (defaults.input != null) {
    providers.push({ provide: SN_INPUT_DEFAULTS, useValue: defaults.input });
  }
  if (defaults.dialog != null) {
    providers.push({ provide: SN_DIALOG_DEFAULTS, useValue: defaults.dialog });
  }
  if (defaults.drawer != null) {
    providers.push({ provide: SN_DRAWER_DEFAULTS, useValue: defaults.drawer });
  }
  if (defaults.toast != null) {
    providers.push({ provide: SN_TOAST_DEFAULTS, useValue: defaults.toast });
  }
  if (defaults.tooltip != null) {
    providers.push({ provide: SN_TOOLTIP_DEFAULTS, useValue: defaults.tooltip });
  }
  if (defaults.paginator != null) {
    providers.push({ provide: SN_PAGINATOR_DEFAULTS, useValue: defaults.paginator });
  }
  if (defaults.table != null) {
    providers.push({ provide: SN_TABLE_DEFAULTS, useValue: defaults.table });
  }
  if (defaults.autocomplete != null) {
    providers.push({ provide: SN_AUTOCOMPLETE_DEFAULTS, useValue: defaults.autocomplete });
  }
  if (defaults.progressSpinner != null) {
    providers.push({ provide: SN_PROGRESS_SPINNER_DEFAULTS, useValue: defaults.progressSpinner });
  }

  if (config.animations != null) {
    providers.push(provideSnAnimations(config.animations));
  }
  if (config.errorStateMatcher != null) {
    providers.push({ provide: SnErrorStateMatcher, useClass: config.errorStateMatcher });
  }
  if (config.icons != null) {
    const { loadingFallback, ...iconOverrides } = config.icons;
    providers.push({ provide: SN_ICON_OVERRIDES, useValue: iconOverrides });
    if (loadingFallback != null) {
      providers.push({ provide: SN_ICON_LOADING_FALLBACK, useValue: loadingFallback });
    }
  }

  return makeEnvironmentProviders(providers);
}
