import {
  Directive,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { ESCAPE, ENTER, SPACE, LEFT_ARROW, RIGHT_ARROW, TAB } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { snIsRtl, snNextId } from 'ashen-ui/core';
import { snListNavigator, snOverlayPanel } from 'ashen-ui/cdk';
import { SN_MENU } from './menu-token';
import { SN_SUBMENU_TRIGGER } from './menu-item';
import { snIsAimingAtSubmenu, type SnPoint } from './menu-aim';
import type { Menu } from './menu';
import type { MenuItem } from './menu-item';

const HOVER_OPEN_DELAY = 100;
const AIM_RECHECK_DELAY = 300;

/** Map: parent panel element → open submenu trigger for that panel */
const OPEN_SUBMENUS = new Map<HTMLElement, SubmenuTrigger>();

// Horizontal nudge so the submenu clears the parent's padding and border; the sign flips for left-opening positions.
const SUBMENU_GAP = 5;

@Directive({
  selector: '[snSubmenuTriggerFor]',
  providers: [{ provide: SN_SUBMENU_TRIGGER, useExisting: SubmenuTrigger }],
  host: {
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': '_isOpen()',
    '[attr.aria-controls]': '_panelId',
    '(mouseenter)': '_onMouseEnter()',
    '(click)': '_onClick($event)',
    '(keydown)': '_onItemKeydown($event)',
  },
})
export class SubmenuTrigger implements OnDestroy {
  readonly menu = input.required<Menu>({ alias: 'snSubmenuTriggerFor' });
  readonly _isOpen = signal(false);
  readonly _panelId = snNextId('sn-submenu');

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _parentCtx = inject(SN_MENU, { optional: true });
  private readonly _rtl = snIsRtl();

  private readonly _panel = snOverlayPanel(() => {
    const menu = this.menu();
    return {
      origin: this._el,
      template: menu._contentTpl(),
      viewContainerRef: menu.vcr,
      positions: 'right-start' as const,
      offsetX: SUBMENU_GAP,
      offsetY: -4,
      panelClass: 'sn-menu-overlay-panel',
      hasBackdrop: false,
      closeOnEscape: false,
      restoreFocus: false,
    };
  });

  // Built once in the injection context; opening hands it the menu.
  private readonly _openMenu = signal<Menu | null>(null);

  // Inside the panel: APG vertical list keys. Escape, Tab and the submenu arrows stay in the handlers below.
  private readonly _navigator = snListNavigator({
    items: computed(() => (this._openMenu()?._items() ?? []) as MenuItem[]),
    orientation: 'vertical',
    wrap: true,
    homeAndEnd: true,
    typeahead: true,
    skipPredicate: (item) => item.isDisabled(),
  });

  // A hover open leaves focus on the parent, so the arrows must not act on the submenu.
  private _keyboardOpen = false;
  private _subs = new Subscription();
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _aimTimer: ReturnType<typeof setTimeout> | null = null;
  private _lastPoint: SnPoint | null = null;
  private _parentPanel: HTMLElement | null = null;

  private _parentMoveListener: ((e: MouseEvent) => void) | null = null;
  private _parentOverListener: ((e: MouseEvent) => void) | null = null;

  constructor() {
    effect(() => {
      if (this._parentCtx?.isClosing?.()) {
        untracked(() => this._closeImmediate());
      }
    });
  }

  private _open(focusFirst: boolean): void {
    if (this._panel.isOpen()) return;

    this._parentPanel = this._el.nativeElement.closest('.sn-menu-panel');

    if (this._parentPanel) {
      const existing = OPEN_SUBMENUS.get(this._parentPanel);
      if (existing && existing !== this) {
        existing._closeImmediate();
      }
    }

    const menu = this.menu();
    if (!this._panel.open()) return;

    const panelEl = this._panel.panelElement()?.querySelector('.sn-menu-panel') as HTMLElement | null;
    if (panelEl) {
      panelEl.id = this._panelId;
    }

    menu._isClosing.set(false);
    this._openMenu.set(menu);
    this._isOpen.set(true);

    if (this._parentPanel) {
      OPEN_SUBMENUS.set(this._parentPanel, this);
      this._setupParentListeners();
    }

    this._subs.add(
      this._panel.keydown.subscribe((event: KeyboardEvent) => {
        this._onOverlayKeydown(event);
      }),
    );

    menu._requestClose = () => this._closeChainToRoot();

    if (focusFirst) {
      setTimeout(() => {
        if (!this._panel.isOpen()) return;
        this._keyboardOpen = true;
        this._navigator.setFirstItemActive();
      }, 0);
    }
  }

  private _setupParentListeners(): void {
    if (!this._parentPanel) return;

    this._parentMoveListener = (e: MouseEvent) => {
      this._lastPoint = { x: e.clientX, y: e.clientY };
    };

    this._parentOverListener = (e: MouseEvent) => {
      if (!this._isOpen()) return;
      const target = e.target as HTMLElement;
      const item = target.closest('.sn-menu-item') as HTMLElement | null;
      if (!item || item === this._el.nativeElement) return;

      const overlayEl = this._panel.panelElement();
      if (!overlayEl) return;

      const rect = overlayEl.getBoundingClientRect();
      const curr: SnPoint = { x: e.clientX, y: e.clientY };

      if (this._lastPoint && snIsAimingAtSubmenu(this._lastPoint, curr, rect)) {
        if (this._aimTimer !== null) clearTimeout(this._aimTimer);
        this._aimTimer = setTimeout(() => {
          this._aimTimer = null;
          if (this._isOpen() && !overlayEl.matches(':hover')) {
            this._closeImmediate();
          }
        }, AIM_RECHECK_DELAY);
      } else {
        this._closeImmediate();
      }
    };

    this._parentPanel.addEventListener('mousemove', this._parentMoveListener);
    this._parentPanel.addEventListener('mouseover', this._parentOverListener);
  }

  private _removeParentListeners(): void {
    if (this._parentPanel && this._parentMoveListener) {
      this._parentPanel.removeEventListener('mousemove', this._parentMoveListener);
    }
    if (this._parentPanel && this._parentOverListener) {
      this._parentPanel.removeEventListener('mouseover', this._parentOverListener);
    }
    this._parentMoveListener = null;
    this._parentOverListener = null;
  }

  _onMouseEnter(): void {
    const el = this._el.nativeElement as HTMLElement;
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
    if (this._isOpen()) return;
    if (this._openTimer !== null) clearTimeout(this._openTimer);
    this._openTimer = setTimeout(() => {
      this._openTimer = null;
      this._open(false);
    }, HOVER_OPEN_DELAY);
  }

  _onClick(event: MouseEvent): void {
    // Let the parent menu-item handler check _hasSubmenu; we just stop propagation
    event.stopPropagation();
    if (this._isOpen()) {
      this._closeImmediate();
    } else {
      this._open(true);
    }
  }

  _onItemKeydown(event: KeyboardEvent): void {
    const key = event.keyCode;
    const openKey = this._rtl() ? LEFT_ARROW : RIGHT_ARROW;
    if (key === openKey || key === ENTER || key === SPACE) {
      event.preventDefault();
      event.stopPropagation();
      if (!this._isOpen()) {
        this._open(true);
      }
    }
  }

  private _onOverlayKeydown(event: KeyboardEvent): void {
    const key = event.keyCode;
    const closeKey = this._rtl() ? RIGHT_ARROW : LEFT_ARROW;

    if (key === closeKey || key === ESCAPE) {
      event.preventDefault();
      this._closeImmediate();
      const el = this._el.nativeElement as HTMLElement;
      if (typeof el.focus === 'function') el.focus();
      return;
    }

    if (key === TAB) {
      this._closeChainToRoot();
      return;
    }

    if (key === ENTER || key === SPACE) {
      const active = this._navigator.activeItem();
      if (active && !active.isDisabled()) {
        event.preventDefault();
        active._el.nativeElement.click();
      }
      return;
    }

    if (this._keyboardOpen && this._navigator.onKeydown(event)) {
      event.preventDefault();
    }
  }

  private _closeChainToRoot(): void {
    this._closeImmediate();
    this._parentCtx?.close();
  }

  _closeImmediate(): void {
    if (this._openTimer !== null) {
      clearTimeout(this._openTimer);
      this._openTimer = null;
    }
    if (this._aimTimer !== null) {
      clearTimeout(this._aimTimer);
      this._aimTimer = null;
    }

    this._removeParentListeners();

    if (this._parentPanel) {
      OPEN_SUBMENUS.delete(this._parentPanel);
      this._parentPanel = null;
    }

    this._keyboardOpen = false;
    this._navigator.clearActiveItem();
    this._openMenu.set(null);

    this._subs.unsubscribe();
    this._subs = new Subscription();

    this._panel.detach();

    this._isOpen.set(false);
    this._lastPoint = null;
  }

  ngOnDestroy(): void {
    this._closeImmediate();
    this._navigator.destroy();
    this._panel.dispose();
  }
}
