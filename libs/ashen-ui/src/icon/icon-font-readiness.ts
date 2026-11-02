import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';

export type SnIconFontState = 'pending' | 'ready' | 'failed';

@Injectable({ providedIn: 'root' })
export class SnIconFontReadiness {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly states = signal<Record<string, SnIconFontState>>({});
  private readonly requested = new Set<string>();

  state(fontFamily: string | null): SnIconFontState {
    if (!this.isBrowser || !fontFamily) return 'pending';
    if (!this.requested.has(fontFamily)) {
      this.requested.add(fontFamily);
      runInInjectionContext(this.injector, () => {
        afterNextRender(() => this.load(fontFamily));
      });
    }
    return this.states()[fontFamily] ?? 'pending';
  }

  private load(fontFamily: string): void {
    const fonts = this.document.fonts;
    if (!fonts) {
      this.setState(fontFamily, 'failed');
      return;
    }
    const descriptor = `1em "${fontFamily.replaceAll('"', '\\"')}"`;
    if (fonts.check(descriptor)) {
      this.setState(fontFamily, 'ready');
      return;
    }
    void fonts.load(descriptor).then(
      () => this.setState(fontFamily, 'ready'),
      () => this.setState(fontFamily, 'failed'),
    );
  }

  private setState(fontFamily: string, state: SnIconFontState): void {
    this.states.update((states) => ({ ...states, [fontFamily]: state }));
  }
}
