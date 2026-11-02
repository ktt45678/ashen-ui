import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ENTER, ESCAPE, SPACE, TAB } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { snNextId } from 'ashen-ui/core';
import { snListNavigator, snOverlayPanel } from 'ashen-ui/cdk';
import type { Menu } from './menu';
import type { MenuItem } from './menu-item';

@Directive({
  selector: '[snContextMenuTriggerFor]',
  host: {
    '(contextmenu)': '_onContextMenu($event)',
  },
})
export class ContextMenuTrigger implements OnDestroy {
  /** The menu to open on right-click or the context menu key. */
  readonly menu = input<Menu | undefined>(undefined, { alias: 'snContextMenuTriggerFor' });
  readonly offsetX = input<number | undefined>(undefined);
  readonly offsetY = input<number | undefined>(undefined);

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _origin = signal<{ x: number; y: number } | undefined>(undefined);
  private readonly _panel = snOverlayPanel(() => ({
    origin: this._origin(),
    template: this.menu()?._contentTpl(),
    viewContainerRef: this.menu()?.vcr ?? this._vcr,
    positions: 'bottom-start' as const,
    offsetX: this.offsetX() ?? 0,
    offsetY: this.offsetY() ?? 0,
    panelClass: 'sn-menu-overlay-panel',
    hasBackdrop: true,
    backdropClass: 'sn-menu-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    animated: this.menu()?._effAnimated(),
    animation: this.menu()?._effAnimation(),
  }));

  private _isOpen = false;
  private _isClosing = false;
  private _subs = new Subscription();
  private _panelId = snNextId('sn-menu');

  // Built once in the injection context; opening hands it the menu.
  private readonly _openMenu = signal<Menu | null>(null);

  // Inside the panel: APG vertical list keys. Escape, Tab and Enter stay in the handlers below.
  private readonly _navigator = snListNavigator({
    items: computed(() => (this._openMenu()?._items() ?? []) as MenuItem[]),
    orientation: 'vertical',
    wrap: true,
    homeAndEnd: true,
    typeahead: true,
    skipPredicate: (item) => item.isDisabled(),
  });

  constructor() {
    afterNextRender(() => this._setupTriggerAria());
  }

  private _setupTriggerAria(): void {
    const el = this._el.nativeElement;
    this._renderer.setAttribute(el, 'aria-haspopup', 'menu');
    this._renderer.setAttribute(el, 'aria-expanded', 'false');
    this._renderer.setAttribute(el, 'aria-controls', this._panelId);
  }

  private _updateAria(isOpen: boolean): void {
    this._renderer.setAttribute(this._el.nativeElement, 'aria-expanded', String(isOpen));
  }

  _onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    if (this._isOpen) this._detachImmediate();
    this._origin.set({ x: event.clientX, y: event.clientY });
    this._open();
  }

  private _open(): void {
    const menu = this.menu();
    if (!menu) return;
    if (this._isClosing) this._cancelClose();
    if (!this._panel.open()) return;
    const panel = this._panel.panelElement()?.querySelector('.sn-menu-panel') as HTMLElement | null;
    if (panel) panel.id = this._panelId;
    this._isOpen = true;
    this._updateAria(true);
    this._openMenu.set(menu);
    menu._isClosing.set(false);
    menu._requestClose = () => this._startClose();
    this._subs.add(this._panel.backdropClick.subscribe(() => this._startClose()));
    this._subs.add(this._panel.keydown.subscribe((event) => this._onOverlayKeydown(event)));
    this._subs.add(this._panel.afterClosed.subscribe(() => this._finalizeDetach()));
    setTimeout(() => this._focusInitialItem(), 0);
  }

  private _focusInitialItem(): void {
    if (!this._panel.isOpen()) return;
    this._navigator.setFirstItemActive();
    this._subs.add(this._navigator.tabOut.subscribe(() => this._detachImmediate()));
  }

  private _onOverlayKeydown(event: KeyboardEvent): void {
    const key = event.keyCode;
    if (key === ESCAPE) {
      event.preventDefault();
      this._startClose();
      return;
    }
    if (key === TAB) {
      this._detachImmediate();
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
    if (this._navigator.onKeydown(event)) event.preventDefault();
  }

  private _startClose(): void {
    if (!this._isOpen || this._isClosing) return;
    this._isClosing = true;
    this._openMenu()?._isClosing.set(true);
    this._panel.close();
    this._isClosing = this._panel.isClosing();
  }

  private _cancelClose(): void {
    this._isClosing = false;
    this._openMenu()?._isClosing.set(false);
  }

  private _detachImmediate(): void {
    this._panel.detach();
  }

  private _finalizeDetach(): void {
    this._navigator.clearActiveItem();
    this._openMenu()?._isClosing.set(false);
    this._openMenu.set(null);
    this._subs.unsubscribe();
    this._subs = new Subscription();
    this._isOpen = false;
    this._isClosing = false;
    this._updateAria(false);
    this._restoreFocus();
  }

  private _restoreFocus(): void {
    const el = this._el.nativeElement;
    if (typeof el.focus !== 'function') return;
    if (el.tabIndex < 0 && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus();
  }

  ngOnDestroy(): void {
    this._cancelClose();
    this._navigator.destroy();
    this._subs.unsubscribe();
    this._panel.dispose();
  }
}
