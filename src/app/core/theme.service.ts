import { Injectable, signal, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';

export type Theme = 'light' | 'dark' | 'glass';
export type Direction = 'ltr' | 'rtl';

const STORAGE_KEY = 'sn-theme';
const DIR_STORAGE_KEY = 'sn-dir';

// Storage throws when the browser blocks it (privacy settings, some embedded
// views). The preference is a convenience, so the site runs without it.
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not persisted; the choice still applies for this visit.
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly directionality = inject(Directionality);

  readonly theme = signal<Theme>(this.initialTheme());
  readonly dir = signal<Direction>(this.initialDir());

  constructor() {
    effect(() => {
      this.applyTheme(this.theme());
    });
    effect(() => {
      this.applyDir(this.dir());
    });
  }

  set(theme: Theme): void {
    this.theme.set(theme);
  }

  setDir(dir: Direction): void {
    this.dir.set(dir);
  }

  private initialDir(): Direction {
    if (!this.isBrowser) return 'ltr';
    return readStorage(DIR_STORAGE_KEY) === 'rtl' ? 'rtl' : 'ltr';
  }

  private applyDir(dir: Direction): void {
    if (!this.isBrowser) return;
    document.documentElement.setAttribute('dir', dir);
    // Directionality reads the attribute once, so a runtime toggle has to push the value in.
    this.directionality.valueSignal.set(dir);
    writeStorage(DIR_STORAGE_KEY, dir);
  }

  private initialTheme(): Theme {
    if (!this.isBrowser) return 'light';
    const stored = readStorage(STORAGE_KEY);
    if (stored === 'dark' || stored === 'glass') return stored;
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    const el = document.documentElement;
    if (theme === 'light') {
      el.removeAttribute('data-theme');
    } else {
      el.setAttribute('data-theme', theme);
    }
    writeStorage(STORAGE_KEY, theme);
  }
}
