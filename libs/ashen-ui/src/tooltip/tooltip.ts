import {
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import { snOverlayPanel } from 'ashen-ui/cdk';
import { snAfterExitAnimation, snAnimated, snDefault, snDefaults, snMergeIds, snNextId, type SnShowHideAnimation } from 'ashen-ui/core';
import { SN_TOOLTIP_DEFAULTS } from './tooltip-defaults';
import { TooltipContainer } from './tooltip-container';
import type { ConnectedPosition } from '@angular/cdk/overlay';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
/** Tooltip content: a plain string or a projected template for rich content. */
export type TooltipContent = string | TemplateRef<unknown>;

// No CDK offset: the gap is hoverable padding on the container, so the cursor can reach the bubble.
const POSITIONS: Record<TooltipPosition, ConnectedPosition[]> = {
  top: [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  ],
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
  ],
  right: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
  ],
};

@Directive({
  selector: '[snTooltip]',
  host: {
    '(mouseenter)': 'onTriggerMouseEnter()',
    '(mouseleave)': 'onTriggerMouseLeave()',
    '(focus)': 'onTriggerFocus()',
    '(blur)': 'onTriggerBlur()',
    '(keydown.escape)': 'onEscape($event)',
  },
})
export class Tooltip implements OnDestroy {
  readonly snTooltip = input<TooltipContent>('');
  readonly snTooltipPosition = input<TooltipPosition>(
    snDefault(SN_TOOLTIP_DEFAULTS, 'position', 'top'),
  );
  readonly snTooltipShowDelay = input(snDefault(SN_TOOLTIP_DEFAULTS, 'showDelay', 300));
  readonly snTooltipHideDelay = input(snDefault(SN_TOOLTIP_DEFAULTS, 'hideDelay', 150));
  readonly snTooltipDisabled = input(false, { transform: booleanAttribute });
  readonly animated = input(true, { transform: booleanAttribute });
  /**
   * `animated` AND-ed with the app-wide motion setting. Read this, never
   * `animated()` directly, or SN_ANIMATIONS_DISABLED and prefers-reduced-motion
   * cannot skip the exit animation.
   */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(
    snDefaults(SN_TOOLTIP_DEFAULTS)?.animation,
  );

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _injector = inject(Injector);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _containerRef: ComponentRef<TooltipContainer> | null = null;
  private _tooltipId = snNextId('sn-tooltip');

  private _showTimer: ReturnType<typeof setTimeout> | null = null;
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;
  private _cancelExit: (() => void) | null = null;

  private readonly _panel = snOverlayPanel(() => ({
    origin: this._el,
    template: undefined,
    portal: new ComponentPortal(TooltipContainer, this._vcr),
    viewContainerRef: this._vcr,
    positions: POSITIONS[this.snTooltipPosition()],
    panelClass: 'sn-tooltip-panel',
    hasBackdrop: false,
    closeOnEscape: false,
    restoreFocus: false,
    scrollStrategy: 'reposition' as const,
  }));

  onTriggerMouseEnter(): void {
    this._scheduleShow();
  }

  onTriggerMouseLeave(): void {
    this._scheduleHide();
  }

  onTriggerFocus(): void {
    this._scheduleShow();
  }

  onTriggerBlur(): void {
    this._scheduleHide();
  }

  onEscape(event: Event): void {
    if (this._panel.isOpen()) {
      event.stopPropagation();
      this._clearTimers();
      this._detachImmediately();
    }
  }

  private _scheduleShow(): void {
    if (this.snTooltipDisabled() || !this._isBrowser) return;
    this._cancelHide();
    if (!this._panel.isOpen()) {
      this._clearShowTimer();
      this._showTimer = setTimeout(() => this._show(), this.snTooltipShowDelay());
    }
  }

  private _scheduleHide(): void {
    this._clearShowTimer();
    this._cancelHide();
    this._hideTimer = setTimeout(() => {
      const container = this._containerRef?.instance;
      if (container) {
        container.visibility.set('hiding');
        if (!this._animated()) {
          container.animationOverride.set('none');
        } else if (this.animation()?.exit) {
          container.animationOverride.set(this.animation()!.exit!);
        } else {
          container.animationOverride.set(null);
        }
      }
      this._cancelExit = snAfterExitAnimation(this._injector, () => this._panel.panelElement(), () => this._detachImmediately());
    }, this.snTooltipHideDelay());
  }

  private _cancelHide(): void {
    if (this._hideTimer !== null) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
    this._cancelExit?.();
    this._cancelExit = null;
    const container = this._containerRef?.instance;
    if (container && container.visibility() === 'hiding') {
      container.visibility.set('visible');
    }
  }

  private _clearShowTimer(): void {
    if (this._showTimer !== null) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
  }

  private _clearTimers(): void {
    this._clearShowTimer();
    this._cancelHide();
  }

  private _show(): void {
    const content = this.snTooltip();
    if (!content) return;

    if (!this._panel.isOpen() && !this._panel.open()) return;

    if (!this._containerRef) {
      const attachment = this._panel.attachment();
      if (!attachment || !('instance' in attachment)) {
        this._panel.detach();
        return;
      }
      this._containerRef = attachment as ComponentRef<TooltipContainer>;
    }

    const container = this._containerRef!.instance;
    container.tooltipId.set(this._tooltipId);
    container.content.set(content);
    container.position.set(this.snTooltipPosition());
    container.onMouseEnter = () => this._cancelHide();
    container.onMouseLeave = () => this._scheduleHide();
    container.visibility.set('visible');
    if (!this._animated()) {
      container.animationOverride.set('none');
    } else if (this.animation()?.enter) {
      container.animationOverride.set(this.animation()!.enter!);
    } else {
      container.animationOverride.set(null);
    }

    this._setDescribedBy(snMergeIds(this._describedBy(), this._tooltipId));
  }

  private _detachImmediately(): void {
    this._panel.detach();
    this._containerRef = null;
    const others = this._describedBy()
      ?.split(/\s+/)
      .filter((id) => id !== this._tooltipId)
      .join(' ');
    this._setDescribedBy(others || null);
  }

  private _describedBy(): string | null {
    return (this._el.nativeElement as HTMLElement).getAttribute('aria-describedby');
  }

  private _setDescribedBy(value: string | null): void {
    if (value) {
      this._renderer.setAttribute(this._el.nativeElement, 'aria-describedby', value);
    } else {
      this._renderer.removeAttribute(this._el.nativeElement, 'aria-describedby');
    }
  }

  ngOnDestroy(): void {
    this._clearTimers();
    this._panel.dispose();
    this._containerRef = null;
  }
}
