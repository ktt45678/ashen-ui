import {
  type EnvironmentProviders,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  inject,
  signal,
  type Provider,
} from '@angular/core';

/**
 * The glyphs the library draws for itself: a select's chevron, a dialog's
 * close button, a table's sort arrow.
 *
 * These are semantic names, not glyph names. `'chevron-down'` means "whatever
 * this app uses to say a menu opens downwards", and only the registry knows it
 * is `keyboard_arrow_down` in Material Symbols, `pi-chevron-down` in PrimeIcons
 * and `fa-chevron-down` in Font Awesome.
 *
 * Component icon inputs (`<sn-button icon="save">`) and `IconTemplate` name an
 * app's own icons and are unaffected. This union covers only the icons a
 * component picks on its own behalf.
 */
export type SnSemanticIcon =
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'page-first'
  | 'page-last'
  | 'check'
  | 'indeterminate'
  | 'close'
  | 'chip-remove'
  | 'calendar'
  | 'eyedropper'
  | 'help'
  | 'user'
  | 'sort-ascending'
  | 'sort-descending'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

/**
 * Material Symbols names, the library's default set.
 *
 * `'chevron-down'` resolves to `keyboard_arrow_down` while `'chevron-up'`
 * resolves to `expand_less`: in Material Symbols those are one glyph pair under
 * two names.
 */
export const SN_DEFAULT_ICONS: Readonly<Record<SnSemanticIcon, string>> = {
  'chevron-down': 'keyboard_arrow_down',
  'chevron-up': 'expand_less',
  'chevron-left': 'chevron_left',
  'chevron-right': 'chevron_right',
  'page-first': 'first_page',
  'page-last': 'last_page',
  check: 'check',
  indeterminate: 'remove',
  close: 'close',
  'chip-remove': 'close',
  calendar: 'calendar_month',
  eyedropper: 'colorize',
  help: 'help',
  user: 'person',
  'sort-ascending': 'arrow_upward',
  'sort-descending': 'arrow_downward',
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

/** A partial remap of the library's own icons. Anything omitted keeps its default. */
export type SnIconOverrides = Partial<Record<SnSemanticIcon, string>>;

export type SnIconLoadingFallback =
  /** Render nothing until the icon font or sprite has loaded. */
  | 'empty'
  /** Hold a blank box of the icon's size, so the layout does not shift when it arrives. */
  | 'placeholder'
  /** Show the raw ligature text, which is what an unstyled page falls back to anyway. */
  | 'text';

export type SnIconConfig = SnIconOverrides & {
  loadingFallback?: SnIconLoadingFallback;
};

export const SN_DEFAULT_ICON_FONT_FAMILY = 'Material Symbols Outlined Variable';

/**
 * How an icon set turns a name into a glyph. Three mechanisms, because the
 * sets apps actually ship use all three and none of them can imitate another.
 *
 * - `ligature`: the name IS the text, and the font's `liga` feature draws it.
 *   Material Symbols and Material Icons. A name computed at runtime is
 *   safe here, which is what makes this the answer to the class-mode footgun.
 * - `class`: a class on the element whose `::before` carries a private-use
 *   codepoint. PrimeIcons (`pi pi-check`), Font Awesome (`fa-solid fa-check`),
 *   and the library's own generated `.sn-icon-*` utilities.
 * - `svg`: a reference into a same-origin sprite. Lucide and brand marks. No
 *   HTML is injected, so nothing has to be trusted or sanitised.
 */
export type SnIconSet =
  | { type: 'ligature'; fontFamily?: string }
  | { type: 'class'; classes: (name: string) => string; fontFamily?: string }
  | { type: 'svg'; url: (name: string) => string };

/** What {@link SnIconRegistry.resolveIcon} tells `<sn-icon>` to render. */
export type SnResolvedIcon =
  | { kind: 'ligature'; text: string; fontFamily: string | null }
  | { kind: 'class'; classes: string; fontFamily: string | null }
  | { kind: 'svg'; url: string };

/**
 * The set `<sn-icon icon="…">` uses when no `set` is named: the `.sn-icon-*`
 * utilities generated from the Material Symbols codepoints.
 */
export const SN_DEFAULT_ICON_SET = 'material';

const MATERIAL_SET: SnIconSet = {
  type: 'class',
  classes: (name) => `sn-icon-${name.replaceAll('_', '-')}`,
  fontFamily: SN_DEFAULT_ICON_FONT_FAMILY,
};

/**
 * App-wide overrides, read once when {@link SnIconRegistry} is created.
 *
 * Prefer {@link provideSnIcons}. Provide the token directly only when you are
 * composing providers yourself.
 */
export const SN_ICON_OVERRIDES = new InjectionToken<SnIconOverrides>('SN_ICON_OVERRIDES');

export const SN_ICON_LOADING_FALLBACK = new InjectionToken<SnIconLoadingFallback>(
  'SN_ICON_LOADING_FALLBACK',
  { providedIn: 'root', factory: () => 'empty' },
);

/**
 * Resolves the library's own icons to glyph names.
 *
 * Every internal `<sn-icon>` goes through here, so one call re-skins every
 * component that draws that icon: Dialog, Drawer, Toast and Message share a
 * close button.
 *
 * ```ts
 * provideSnIcons({ close: 'cancel', 'chevron-down': 'expand_more' })
 *
 * inject(SnIconRegistry).alias('close', 'cancel');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SnIconRegistry {
  // A signal so alias() after bootstrap repaints under OnPush.
  private readonly _glyphs = signal<Record<SnSemanticIcon, string>>({
    ...SN_DEFAULT_ICONS,
    ...(inject(SN_ICON_OVERRIDES, { optional: true }) ?? {}),
  });

  /** The glyph name to render for a semantic icon. */
  resolve(name: SnSemanticIcon): string {
    return this._glyphs()[name];
  }

  /** Point one semantic icon at a different glyph. */
  alias(name: SnSemanticIcon, glyph: string): void {
    this._glyphs.update((map) => ({ ...map, [name]: glyph }));
  }

  /** Point several at once. Keys you omit are left alone. */
  aliasAll(overrides: SnIconOverrides): void {
    this._glyphs.update((map) => ({ ...map, ...overrides }));
  }

  private readonly _sets = signal<Record<string, SnIconSet>>({
    [SN_DEFAULT_ICON_SET]: MATERIAL_SET,
  });

  /**
   * Teach `<sn-icon>` a second icon set.
   *
   * ```ts
   * // PrimeIcons, a class-and-codepoint set
   * registry.registerSet('pi', { type: 'class', classes: (n) => `pi pi-${n}` });
   *
   * // A sprite, for glyphs no font provides
   * registry.registerSet('brand', { type: 'svg', url: (n) => `/brand.svg#${n}` });
   *
   * // Material Symbols by ligature, so runtime-computed names always resolve
   * registry.registerSet('ms', { type: 'ligature' });
   * ```
   *
   * Registering under {@link SN_DEFAULT_ICON_SET} replaces what `<sn-icon>`
   * uses when no `set` is named.
   */
  registerSet(name: string, set: SnIconSet): void {
    this._sets.update((sets) => ({ ...sets, [name]: set }));
  }

  /**
   * Point the default set at a different font, which is what a subsetted
   * Material Symbols build needs: the family string in its `@font-face` will
   * not be the one the library ships.
   */
  setFontFamily(family: string): void {
    this._sets.update((sets) => ({
      ...sets,
      [SN_DEFAULT_ICON_SET]: { ...sets[SN_DEFAULT_ICON_SET], fontFamily: family } as SnIconSet,
    }));
  }

  /**
   * What to render for `<sn-icon [set]="…" [icon]="…">`. An unknown set falls
   * back to the default one, so a typo degrades to a wrong glyph rather than
   * to nothing at all.
   */
  resolveIcon(setName: string | undefined, icon: string): SnResolvedIcon {
    const sets = this._sets();
    const set = sets[setName || SN_DEFAULT_ICON_SET] ?? sets[SN_DEFAULT_ICON_SET];
    if (ngDevMode && setName && !sets[setName]) {
      console.warn(
        `[sn-icon] icon set "${setName}" is not registered; falling back to ` +
          `"${SN_DEFAULT_ICON_SET}". Register it with SnIconRegistry.registerSet().`,
      );
    }

    if (set.type === 'svg') return { kind: 'svg', url: set.url(icon) };
    const fontFamily = set.fontFamily ?? null;
    if (set.type === 'ligature') return { kind: 'ligature', text: icon, fontFamily };
    return { kind: 'class', classes: set.classes(icon), fontFamily };
  }
}

/**
 * Remap the icons the library draws for itself.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [
 *     provideSnIcons({
 *       close: 'cancel',
 *       'sort-ascending': 'arrow_drop_up',
 *       'sort-descending': 'arrow_drop_down',
 *     }),
 *   ],
 * });
 * ```
 *
 * This is app-wide: {@link SnIconRegistry} is a root singleton, so providing
 * the overrides in a route or a component is too late to be seen. Use
 * {@link SnIconRegistry.alias} for anything that changes after bootstrap.
 */
export function provideSnIcons(config: SnIconConfig): EnvironmentProviders {
  const { loadingFallback, ...overrides } = config;
  const providers: Provider[] = [{ provide: SN_ICON_OVERRIDES, useValue: overrides }];
  if (loadingFallback != null) {
    providers.push({ provide: SN_ICON_LOADING_FALLBACK, useValue: loadingFallback });
  }
  return makeEnvironmentProviders(providers);
}
