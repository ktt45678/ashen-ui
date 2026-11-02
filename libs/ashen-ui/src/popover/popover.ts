import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewContainerRef,
  afterNextRender,
  effect,
  signal,
  untracked,
  forwardRef,
  booleanAttribute,
  contentChild,
  inject,
  input,
  model,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { snOverlayPanel } from 'ashen-ui/cdk';
import {
  SN_PART_SOURCE,
  SnPart,
  snAnimated,
  snAfterExitAnimation,
  snNextId,
  type SnAttrs,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
} from 'ashen-ui/core';
import { PopoverTrigger } from './popover-trigger';
import { PopoverContent } from './popover-content';
import { PopoverPanel } from './popover-panel';
import { SN_POPOVER } from './popover-token';
import type { ConnectedPosition } from '@angular/cdk/overlay';

export type PopoverPosition = 'bottom' | 'top' | 'left' | 'right';

// The panel is role=dialog; block pass-through that would rewrite it.
const POPOVER_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  panel: ['role', 'id', 'aria-modal', 'aria-labelledby', 'aria-describedby'],
};

@Component({
  selector: 'sn-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SnPart],
  templateUrl: './popover.html',
  providers: [
    {
      provide: SN_POPOVER,
      useFactory: (self: Popover) => ({ toggle: () => self.toggle(), close: () => self.requestClose() }),
      deps: [Popover],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Popover) },
  ],
  host: {
    class: 'sn-popover',
  },
})
export class Popover implements OnDestroy, SnPartSource {
  readonly position = input<PopoverPosition>('bottom');
  readonly open = model(false);
  readonly snClass = input('');
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    POPOVER_RESERVED_ATTRS[section] ?? [];
  readonly animated = input(true, { transform: booleanAttribute });
  /**
   * `animated` AND-ed with the app-wide motion setting. Read this, never
   * `animated()` directly, or SN_ANIMATIONS_DISABLED and prefers-reduced-motion
   * cannot skip the exit animation.
   */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);
  readonly offsetX = input<number | undefined>(undefined);
  readonly offsetY = input<number | undefined>(undefined);

  private readonly _triggerDir = contentChild(PopoverTrigger);
  private readonly _contentDir = contentChild(PopoverContent);

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _injector = inject(Injector);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _panelRef: ComponentRef<PopoverPanel> | null = null;
  private _panelId = snNextId('sn-popover');
  private _subs = new Subscription();
  private _cancelExit: (() => void) | null = null;
  private _isClosing = false;
  private _ownedOpen = false;
  private readonly _rendered = signal(false);

  private readonly _panel = snOverlayPanel(() => ({
    origin: this._triggerDir()?.el ?? this._el,
    template: undefined,
    portal: new ComponentPortal(PopoverPanel, this._vcr),
    viewContainerRef: this._vcr,
    positions: this._positions(),
    panelClass: 'sn-popover-overlay-panel',
    hasBackdrop: true,
    backdropClass: 'sn-popover-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    scrollStrategy: 'reposition' as const,
  }));

  constructor() {
    this._subs.add(this._panel.backdropClick.subscribe(() => this.requestClose()));
    this._subs.add(
      this._panel.keydown.subscribe((event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.requestClose();
        }
      }),
    );
    afterNextRender(() => {
      this._setupTriggerAria();
      this._rendered.set(true);
    });
    effect(() => {
      const open = this.open();
      if (!this._rendered() || open === this._ownedOpen) return;
      untracked(() => this._syncOpen(open));
    });
  }

  toggle(): void {
    if (this.open()) {
      this.requestClose();
    } else {
      this._openOverlay();
    }
  }

  requestClose(): void {
    if (this._isClosing || (!this.open() && !this._panel.isOpen())) return;
    this._isClosing = true;

    const panel = this._panelRef?.instance;
    if (panel) {
      panel.visibility.set('hiding');
      panel.destroyFocusTrap();
      panel.panelAnimation.set(!this._animated() ? 'none' : (this.animation()?.exit ?? null));
    }

    this._cancelExit = snAfterExitAnimation(this._injector, () => this._panel.panelElement(), () => {
      this._cancelExit = null;
      this._detach();
      this._isClosing = false;
      this._restoreFocus();
    });
  }

  private _setOwnedOpen(open: boolean): void {
    this._ownedOpen = open;
    this.open.set(open);
  }

  private _syncOpen(open: boolean): void {
    if (open && (!this._panel.isOpen() || this._isClosing)) {
      this._openOverlay();
    } else if (!open && this._panel.isOpen()) {
      this.requestClose();
    }
  }

  private _setupTriggerAria(): void {
    const trigger = this._triggerDir();
    if (!trigger) return;
    const el = trigger.el.nativeElement as HTMLElement;
    this._renderer.setAttribute(el, 'aria-haspopup', 'dialog');
    this._renderer.setAttribute(el, 'aria-expanded', String(this.open()));
    this._renderer.setAttribute(el, 'aria-controls', this._panelId);
  }

  private _updateTriggerAria(isOpen: boolean): void {
    const trigger = this._triggerDir();
    if (!trigger) return;
    const el = trigger.el.nativeElement as HTMLElement;
    this._renderer.setAttribute(el, 'aria-expanded', String(isOpen));
  }

  private _openOverlay(): void {
    if (!this._isBrowser) return;
    if (this._isClosing) {
      this._cancelClose();
    }
    const contentDir = this._contentDir();
    if (!contentDir) return;
    if (this._panel.isOpen() || !this._panel.open()) return;

    const attachment = this._panel.attachment();
    if (!attachment || !('instance' in attachment)) {
      this._panel.detach();
      return;
    }
    this._panelRef = attachment as ComponentRef<PopoverPanel>;

    const panel = this._panelRef.instance;
    panel.panelId.set(this._panelId);
    panel.contentTemplate.set(contentDir.templateRef);
    panel.panelClass.set(this.snClass());

    const closeFn = () => this.requestClose();
    panel.templateContext.set({ $implicit: closeFn, close: closeFn });
    panel.visibility.set('visible');
    panel.panelAnimation.set(!this._animated() ? 'none' : (this.animation()?.enter ?? null));

    this._setOwnedOpen(true);
    this._updateTriggerAria(true);

    setTimeout(() => {
      this._panelRef?.instance.initFocusTrap();
    }, 0);
  }

  private _cancelClose(): void {
    this._cancelExit?.();
    this._cancelExit = null;
    this._isClosing = false;
    const panel = this._panelRef?.instance;
    if (panel) {
      panel.visibility.set('visible');
      panel.panelAnimation.set(!this._animated() ? 'none' : (this.animation()?.enter ?? null));
    }
  }

  private _detach(): void {
    this._panel.detach();
    this._panelRef = null;
    this._setOwnedOpen(false);
    this._updateTriggerAria(false);
  }

  private _restoreFocus(): void {
    const trigger = this._triggerDir();
    if (!trigger) return;
    const el = trigger.el.nativeElement as HTMLElement;
    if (typeof el.focus === 'function') {
      el.focus();
    }
  }

  private _positions(): ConnectedPosition[] {
    const ox = this.offsetX();
    const oy = this.offsetY();
    switch (this.position()) {
      case 'bottom':
      case 'top': {
        const gap = oy ?? 6;
        const shift = ox ?? 0;
        // End-aligned fallbacks keep a panel opened near the inline-end edge on screen.
        const below: ConnectedPosition[] = (['start', 'end'] as const).map((x) => (
          { originX: x, originY: 'bottom', overlayX: x, overlayY: 'top', offsetY: gap, offsetX: shift }));
        const above: ConnectedPosition[] = (['start', 'end'] as const).map((x) => (
          { originX: x, originY: 'top', overlayX: x, overlayY: 'bottom', offsetY: -gap, offsetX: shift }));
        return this.position() === 'bottom' ? [...below, ...above] : [...above, ...below];
      }
      case 'left': { const gap = ox ?? 6; const shift = oy ?? 0; return [
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -gap, offsetY: shift },
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: gap, offsetY: shift }]; }
      case 'right': { const gap = ox ?? 6; const shift = oy ?? 0; return [
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: gap, offsetY: shift },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -gap, offsetY: shift }]; }
    }
  }

  ngOnDestroy(): void {
    this._cancelExit?.();
    this._subs.unsubscribe();
    this._panel.dispose();
    this._panelRef = null;
  }
}
