import { Directive, ElementRef, Renderer2, RendererStyleFlags2, effect, inject, input } from '@angular/core';
type SnTokenMap = Partial<Record<`--sn-${string}`, string | number>>;

@Directive({
  selector: '[snTokens]',
  standalone: true,
})
export class SnTokenOverrides {
  readonly snTokens = input<SnTokenMap>();

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly appliedTokens = new Set<string>();

  private readonly synchronize = effect(() => {
    const tokens = this.snTokens() ?? {};
    const entries = Object.entries(tokens).filter(([name]) => name.startsWith('--sn-'));
    const nextNames = new Set(entries.map(([name]) => name));

    for (const name of this.appliedTokens) {
      if (!nextNames.has(name)) {
        this.renderer.removeStyle(this.element.nativeElement, name, RendererStyleFlags2.DashCase);
      }
    }

    for (const [name, value] of entries) {
      this.renderer.setStyle(this.element.nativeElement, name, String(value), RendererStyleFlags2.DashCase);
    }

    this.appliedTokens.clear();
    for (const name of nextNames) this.appliedTokens.add(name);
  });
}
