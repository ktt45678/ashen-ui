import { Directive, ElementRef, booleanAttribute, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLinkActive } from '@angular/router';

/**
 * One link in a `nav[snTabNav]` bar. Put it on an `<a>` (usually with
 * `routerLink`) or on a `<button>`.
 *
 * The active state comes from `[active]` when it is bound. Otherwise a
 * `routerLinkActive` on the same element drives it, so a plain
 * `<a snTabLink routerLink="x" routerLinkActive>` needs nothing else.
 */
@Directive({
  selector: '[snTabLink]',
  host: {
    class: 'sn-tab-link',
    '[class.sn-tab-link-active]': 'isActive()',
    '[attr.aria-current]': 'ariaCurrent()',
  },
})
export class TabLink {
  /** Force the active state. Leave unbound to follow `routerLinkActive`. */
  readonly active = input<boolean | undefined, unknown>(undefined, {
    transform: (value: unknown) => (value == null ? undefined : booleanAttribute(value)),
  });

  readonly element: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly routerActive = signal(false);

  readonly isActive = computed(() => this.active() ?? this.routerActive());

  protected readonly ariaCurrent = computed(() => {
    if (!this.isActive()) return null;
    return this.element.tagName === 'A' ? 'page' : 'true';
  });

  constructor() {
    inject(RouterLinkActive, { optional: true, self: true })
      ?.isActiveChange.pipe(takeUntilDestroyed())
      .subscribe((active) => this.routerActive.set(active));
  }
}
