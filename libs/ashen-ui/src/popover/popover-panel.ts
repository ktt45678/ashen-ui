import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgTemplateOutlet } from '@angular/common';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { SnPart } from 'ashen-ui/core';
import type { ConfigurableFocusTrap } from '@angular/cdk/a11y';

export type PopoverPanelVisibility = 'visible' | 'hiding' | 'hidden';

@Component({
  selector: 'sn-popover-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, SnPart],
  templateUrl: './popover-panel.html',
  host: {
    class: 'sn-popover-container',
    '[class.sn-popover-visible]': 'visibility() === "visible"',
    '[class.sn-popover-hiding]': 'visibility() === "hiding"',
    '[attr.data-sn-open]': 'visibility() === "visible" ? "" : null',
    '[attr.data-sn-hiding]': 'visibility() === "hiding" ? "" : null',
  },
})
export class PopoverPanel implements OnDestroy {
  readonly panelId = signal('');
  readonly contentTemplate = signal<TemplateRef<unknown> | null>(null);
  readonly templateContext = signal<Record<string, unknown>>({});
  readonly panelClass = signal('');
  readonly visibility = signal<PopoverPanelVisibility>('hidden');
  readonly panelAnimation = signal<string | null>(null);

  onPanelClick: (event: MouseEvent) => void = () => {};

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private _focusTrap: ConfigurableFocusTrap | null = null;

  initFocusTrap(): void {
    if (!this._isBrowser) return;
    const panelEl = this._el.nativeElement.querySelector('[role="dialog"]') as HTMLElement | null;
    if (!panelEl) return;
    this._focusTrap = this._focusTrapFactory.create(panelEl);
    this._focusTrap.focusFirstTabbableElementWhenReady();
  }

  destroyFocusTrap(): void {
    this._focusTrap?.destroy();
    this._focusTrap = null;
  }

  ngOnDestroy(): void {
    this.destroyFocusTrap();
  }
}
