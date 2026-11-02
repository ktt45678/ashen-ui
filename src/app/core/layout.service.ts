import { Injectable, signal } from '@angular/core';

/**
 * Small UI-state service for the docs shell. Owns whether the navigation
 * drawer is open on narrow viewports (on desktop the sidenav is always
 * visible and this flag is ignored by CSS).
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  /** Whether the mobile navigation drawer is open. */
  readonly navOpen = signal(false);

  toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }
}
