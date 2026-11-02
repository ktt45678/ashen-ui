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
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { snOverlayPanel } from 'ashen-ui/cdk';
import { SnIconRegistry, snAfterExitAnimation, snAnimated, snNextId, type SnShowHideAnimation } from 'ashen-ui/core';
import { SnConfirmIntl, type SnAttrs, type SnStyle } from 'ashen-ui/core';
import { ConfirmPopupTrigger } from './confirm-popup-trigger';
import { ConfirmPopupPanel } from './confirm-popup-panel';
import { SN_CONFIRM_POPUP } from './confirm-popup-token';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import type { ConfirmPopupSeverity } from './confirm-popup-panel';

export type ConfirmPopupPosition = 'bottom' | 'top' | 'left' | 'right';

@Component({
  selector: 'sn-confirm-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './confirm-popup.html',
  providers: [
    {
      provide: SN_CONFIRM_POPUP,
      useFactory: (self: ConfirmPopup) => ({ toggle: () => self.toggle(), close: () => self.requestClose() }),
      deps: [ConfirmPopup],
    },
  ],
  host: {
    class: 'sn-confirm-popup',
  },
})
export class ConfirmPopup implements OnDestroy {
  protected readonly icons = inject(SnIconRegistry);

  readonly open = model(false);
  readonly message = input('');
  readonly icon = input<string>();
  protected readonly effectiveIcon = computed(() => this.icon() ?? this.icons.resolve('help'));
  readonly severity = input<ConfirmPopupSeverity>('primary');
  readonly acceptLabel = input('');
  readonly rejectLabel = input('');
  readonly position = input<ConfirmPopupPosition>('bottom');
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

  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly accept = output<void>();
  readonly reject = output<void>();

  private readonly _triggerDir = contentChild(ConfirmPopupTrigger);
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _injector = inject(Injector);
  private readonly _intl = inject(SnConfirmIntl);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _panelRef: ComponentRef<ConfirmPopupPanel> | null = null;
  private readonly _panelId = snNextId('sn-confirm-popup');
  private readonly _messageId = snNextId('sn-confirm-popup-msg');
  private _subs = new Subscription();
  private _cancelExit: (() => void) | null = null;
  private _isClosing = false;
  private _ownedOpen = false;
  private readonly _rendered = signal(false);

  private readonly _panel = snOverlayPanel(() => ({
    origin: this._triggerDir()?.el ?? this._el,
    template: undefined,
    portal: new ComponentPortal(ConfirmPopupPanel, this._vcr),
    viewContainerRef: this._vcr,
    positions: this._positions(),
    panelClass: 'sn-confirm-popup-overlay-panel',
    hasBackdrop: true,
    backdropClass: 'sn-confirm-popup-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    scrollStrategy: 'reposition' as const,
  }));

  protected readonly _effectiveAcceptLabel = computed(
    () => this.acceptLabel() || this._intl.accept,
  );

  protected readonly _effectiveRejectLabel = computed(
    () => this.rejectLabel() || this._intl.reject,
  );

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
      panel.panelAnimation.set(!this._animated() ? 'none' : (this.animation()?.exit ?? null));
    }

    this._cancelExit = snAfterExitAnimation(this._injector, () => this._panel.panelElement(), () => {
      this._cancelExit = null;
      this._detach();
      this._isClosing = false;
      this._restoreFocus();
    });
  }

  private _onAccept(): void {
    this.accept.emit();
    this.requestClose();
  }

  private _onReject(): void {
    this.reject.emit();
    this.requestClose();
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
    if (this._panel.isOpen() || !this._panel.open()) return;

    const attachment = this._panel.attachment();
    if (!attachment || !('instance' in attachment)) {
      this._panel.detach();
      return;
    }
    this._panelRef = attachment as ComponentRef<ConfirmPopupPanel>;

    const panel = this._panelRef.instance;
    panel.panelId.set(this._panelId);
    panel.messageId.set(this._messageId);
    panel.message.set(this.message());
    panel.icon.set(this.effectiveIcon());
    panel.severity.set(this.severity());
    panel.effectiveAcceptLabel.set(this._effectiveAcceptLabel());
    panel.effectiveRejectLabel.set(this._effectiveRejectLabel());
    panel.snStyle.set(this.snStyle());
    panel.snAttrs.set(this.snAttrs());
    panel.visibility.set('visible');
    panel.panelAnimation.set(this._getEnterAnimation());

    this._subs.add(
      this._panelRef.instance.acceptClicked.subscribe(() => this._onAccept()),
    );
    this._subs.add(
      this._panelRef.instance.rejectClicked.subscribe(() => this._onReject()),
    );

    this._setOwnedOpen(true);
    this._updateTriggerAria(true);

    setTimeout(() => {
      this._panelRef?.instance.focusRejectButton();
    }, 0);
  }

  private _cancelClose(): void {
    this._cancelExit?.();
    this._cancelExit = null;
    this._isClosing = false;
    const panel = this._panelRef?.instance;
    if (panel) {
      panel.visibility.set('visible');
      panel.panelAnimation.set(this._getEnterAnimation());
    }
  }

  private _getEnterAnimation(): string | null {
    if (!this._animated()) return 'none';
    return this.animation()?.enter ?? null;
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
      case 'bottom': { const gap = oy ?? 6; const shift = ox ?? 0; return [
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: gap, offsetX: shift },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -gap, offsetX: shift }]; }
      case 'top': { const gap = oy ?? 6; const shift = ox ?? 0; return [
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -gap, offsetX: shift },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: gap, offsetX: shift }]; }
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
