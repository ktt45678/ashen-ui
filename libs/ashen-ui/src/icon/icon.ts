import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  SN_DEFAULT_ICON_FONT_FAMILY,
  SN_ICON_LOADING_FALLBACK,
  SnIconRegistry,
  type SnClass,
  type SnIconLoadingFallback,
  resolveSnClass,
} from 'ashen-ui/core';
import { SnIconFontReadiness } from './icon-font-readiness';

export type IconSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'sn-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  host: {
    class: 'sn-icon icon-ms',
    '[class.sn-size-sm]': 'size() === "sm"',
    '[class.sn-size-lg]': 'size() === "lg"',
    '[class.sn-filled]': 'fill()',
    '[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
    '[attr.role]': 'ariaLabel() ? "img" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[style.--sn-icon-fill]': 'fill() ? 1 : 0',
    '[style.--sn-icon-weight]': 'weight()',
    '[style.--sn-icon-grad]': 'grad()',
    '[style.--sn-icon-font-family]': 'fontFamily()',
    '[class]': 'hostClass()',
    '[attr.data-sn-size]': 'size()',
    '[attr.data-sn-filled]': 'fill() ? "" : null',
    '[attr.data-sn-icon-font-state]': 'fontState()',
    '[attr.data-sn-icon-loading-fallback]': 'effectiveLoadingFallback()',
  },
})
export class Icon {
  readonly size = input<IconSize>('md');
  readonly fill = input(false, { transform: booleanAttribute });
  readonly weight = input(300, { transform: numberAttribute });
  readonly grad = input(0, { transform: numberAttribute });
  /**
   * Render the glyph by name instead of projecting a ligature. How the name
   * becomes a glyph is the {@link set}'s business: the default set applies the
   * generated `.sn-icon-<name>` codepoint class.
   */
  readonly icon = input<string>();
  /**
   * Which registered icon set resolves {@link icon}. Omit for the default set.
   * Register others with `SnIconRegistry.registerSet()`.
   */
  readonly set = input<string>();
  readonly ariaLabel = input('');
  readonly snClass = input<SnClass>();
  readonly loadingFallback = input<SnIconLoadingFallback>();

  private readonly registry = inject(SnIconRegistry);
  private readonly globalLoadingFallback = inject(SN_ICON_LOADING_FALLBACK);
  private readonly fontReadiness = inject(SnIconFontReadiness);

  protected readonly resolved = computed(() => {
    const name = this.icon();
    return name ? this.registry.resolveIcon(this.set(), name) : null;
  });

  protected readonly hostClass = computed(() => {
    const resolved = this.resolved();
    const setClasses = resolved?.kind === 'class' ? resolved.classes : '';
    return [setClasses, resolveSnClass(this.snClass(), 'root', true)].filter(Boolean).join(' ');
  });

  protected readonly fontFamily = computed(() => {
    const resolved = this.resolved();
    return resolved && resolved.kind !== 'svg' ? resolved.fontFamily : null;
  });

  private readonly observedFontFamily = signal<string | null>(null);

  private readonly fontGlyph = computed(() => this.resolved()?.kind !== 'svg');

  private readonly readinessFontFamily = computed(() => {
    const resolved = this.resolved();
    if (!this.icon()) return SN_DEFAULT_ICON_FONT_FAMILY;
    return resolved?.kind === 'svg' ? null : resolved?.fontFamily ?? this.observedFontFamily();
  });

  protected readonly fontState = computed(() =>
    this.fontGlyph() ? this.fontReadiness.state(this.readinessFontFamily()) : 'ready',
  );

  protected readonly effectiveLoadingFallback = computed(
    () => this.loadingFallback() ?? this.globalLoadingFallback,
  );

  protected readonly classTextFallback = computed(() => {
    const resolved = this.resolved();
    return resolved?.kind === 'class' && this.fontState() !== 'ready' &&
      this.effectiveLoadingFallback() === 'text'
      ? this.icon() ?? ''
      : '';
  });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    effect(() => {
      const resolved = this.resolved();
      if (!this.icon() || !resolved || resolved.kind === 'svg' || resolved.fontFamily) {
        this.observedFontFamily.set(null);
        return;
      }
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => {
          this.observedFontFamily.set(getComputedStyle(this.el.nativeElement).fontFamily || null);
        });
      });
    });

    // Class-mode only: a name composed at runtime produces no utility and renders an empty box, so warn.
    if (!ngDevMode || !this.isBrowser) return;

    let checked: string | null = null;
    effect(() => {
      const name = this.icon();
      const resolved = this.resolved();
      if (!name || resolved?.kind !== 'class' || checked === name) return;
      // Claim the name synchronously; the effect can run more than once before the frame fires.
      checked = name;
      // The class binding lands in this same change-detection cycle, so the
      // computed style is only meaningful once the frame has been painted.
      requestAnimationFrame(() => {
        if (this.icon() !== name) return;
        const content = getComputedStyle(this.el.nativeElement, '::before').content;
        // A resolved codepoint utility sets ::before content; with no matching
        // rule it stays at the initial 'none' (or an empty string).
        if (content && content !== 'none' && content !== 'normal' && content !== '""') return;
        const advice = this.set()
          ? `Check that set "${this.set()}" ships a rule for it.`
          : `Tailwind only generates the names it can see in source, so a name ` +
            `composed at runtime needs @source inline("sn-icon-{…}") in your ` +
            `Tailwind entry, or a ligature set: registerSet('ms', { type: 'ligature' }).`;
        console.warn(
          `[sn-icon] "${name}" produced no glyph. It resolved to ` +
            `.${resolved.classes.split(' ').join('.')}, which matched no rule. ${advice}`,
        );
      });
    });
  }
}
