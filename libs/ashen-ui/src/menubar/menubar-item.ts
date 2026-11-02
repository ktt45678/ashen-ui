import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { Icon } from 'ashen-ui/icon';
import {
  SN_PART_SOURCE,
  SnIconRegistry,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snIsRtl,
  snNextId,
} from 'ashen-ui/core';
import { snListNavigator, snOverlayPanel } from 'ashen-ui/cdk';
import type { Menu } from 'ashen-ui/menu';
import type { MenuItem } from 'ashen-ui/menu';
import { SN_MENUBAR } from './menubar-token';

const MENUBAR_ITEM_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: [],
  trigger: [
    'role',
    'tabindex',
    'aria-haspopup',
    'aria-expanded',
    'aria-controls',
    'disabled',
    'aria-disabled',
  ],
  icon: [],
  label: [],
  arrow: [],
};

@Component({
  selector: 'sn-menubar-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './menubar-item.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => MenubarItem) }],
  host: {
    class: 'sn-menubar-item-host',
  },
})
export class MenubarItem implements FocusableOption, OnInit, OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly label = input.required<string>();
  readonly icon = input<string>();
  readonly menuFor = input<Menu>();
  readonly isDisabled = input(false, { alias: 'disabled' });
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    MENUBAR_ITEM_RESERVED_ATTRS[section] ?? [];

  readonly activated = output<void>();

  readonly _isOpen = signal(false);
  readonly _index = signal(-1);
  readonly _tabIndex = signal(-1);

  get disabled(): boolean {
    return this.isDisabled();
  }

  readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _rtl = snIsRtl();
  private readonly _menubar = inject(SN_MENUBAR, { optional: true });

  readonly _panelId = snNextId('sn-menubar-panel');

  private _isClosing = false;
  private _subs = new Subscription();

  // Inside the panel: APG vertical list keys. Escape, Tab and the bar arrows stay in the handlers below.
  private readonly _navigator = snListNavigator({
    items: computed(() => (this.menuFor()?._items() ?? []) as MenuItem[]),
    orientation: 'vertical',
    wrap: true,
    homeAndEnd: true,
    typeahead: true,
    skipPredicate: (item) => item.isDisabled(),
  });

  private readonly _panel = snOverlayPanel(() => {
    const menu = this.menuFor();
    return {
      origin: this._triggerElement(),
      template: menu?._contentTpl(),
      viewContainerRef: menu!.vcr,
      positions: 'bottom-start' as const,
      offsetY: 1,
      panelClass: 'sn-menubar-overlay-panel',
      hasBackdrop: true,
      backdropClass: 'sn-menubar-backdrop',
      closeOnEscape: false,
      closeOnBackdrop: false,
      restoreFocus: false,
      animated: this._menubar?.animated(),
      animation: this._menubar?.animation(),
    };
  });

  ngOnInit(): void {
    const idx = this._menubar?.registerItem() ?? 0;
    this._index.set(idx);
    this._tabIndex.set(idx === 0 ? 0 : -1);
  }

  focus(_origin?: FocusOrigin): void {
    this._triggerElement().focus();
  }

  getLabel(): string {
    return this.label();
  }

  _onClick(): void {
    if (this.isDisabled()) return;
    const menu = this.menuFor();
    if (menu) {
      if (this._isOpen()) {
        this._startClose();
        this._menubar?.closeActive();
      } else {
        this._menubar?.openItem(this._index());
      }
    } else {
      this.activated.emit();
    }
  }

  _onMouseEnter(): void {
    if (this.isDisabled()) return;
    if (this._menubar?.isMenuMode() && !this._isOpen() && this.menuFor()) {
      this._menubar.openItem(this._index());
    }
  }

  _onKeydown(event: KeyboardEvent): void {
    const key = event.keyCode;
    if (key === ENTER || key === SPACE || key === DOWN_ARROW) {
      event.preventDefault();
      const menu = this.menuFor();
      if (menu && !this._isOpen()) {
        this._menubar?.openItem(this._index());
      } else if (!menu) {
        this.activated.emit();
      }
    } else if (key === UP_ARROW) {
      event.preventDefault();
      if (this.menuFor() && !this._isOpen()) {
        this._openFromBar(-1);
      }
    }
  }

  _open(focusIndex: number): void {
    const menu = this.menuFor();
    if (!menu || (this._panel.isOpen() && !this._panel.isClosing())) return;
    if (!this._panel.open()) return;

    const panelEl = this._panel.panelElement()?.querySelector('.sn-menu-panel') as HTMLElement | null;
    if (panelEl) {
      panelEl.id = this._panelId;
    }

    if (this._menubar) {
      menu._hostAnimated.set(this._menubar.animated());
      menu._hostAnimation.set(this._menubar.animation());
    }
    menu._isClosing.set(false);
    this._isOpen.set(true);
    this._isClosing = false;

    menu._requestClose = () => {
      this._startClose();
      this._menubar?.closeActive();
    };

    this._subs.add(
      this._panel.backdropClick.subscribe(() => {
        this._startClose();
        this._menubar?.closeActive();
      }),
    );
    this._subs.add(this._panel.keydown.subscribe((event) => this._onOverlayKeydown(event)));
    this._subs.add(this._panel.afterClosed.subscribe(() => this._finalizeDetach()));

    setTimeout(() => this._focusInitialItem(focusIndex), 0);
  }

  _openFromBar(focusIndex: number): void {
    this._open(focusIndex);
  }

  _closeImmediate(): void {
    this._panel.detach();
  }

  private _focusInitialItem(focusIndex: number): void {
    if (!this._panel.isOpen()) return;
    if (!this.menuFor()) return;

    if (focusIndex === -1) {
      this._navigator.setLastItemActive();
    } else {
      this._navigator.setFirstItemActive();
    }

    this._subs.add(
      this._navigator.tabOut.subscribe(() => {
        this._panel.detach('tab');
        this._menubar?.closeActive();
      }),
    );
  }

  private _onOverlayKeydown(event: KeyboardEvent): void {
    const key = event.keyCode;
    if (key === ESCAPE) {
      event.preventDefault();
      this._closeImmediate();
      this._menubar?.closeActive();
      return;
    }

    if (key === TAB) {
      this._panel.detach('tab');
      this._menubar?.closeActive();
      return;
    }

    if (key === LEFT_ARROW || key === RIGHT_ARROW) {
      event.preventDefault();
      this._closeImmediate();
      const forwards = this._rtl() ? key === LEFT_ARROW : key === RIGHT_ARROW;
      if (forwards) this._menubar?.navigateNext();
      else this._menubar?.navigatePrevious();
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

    if (this._navigator.onKeydown(event)) {
      event.preventDefault();
    }
  }

  private _startClose(): void {
    if (!this._isOpen() || this._isClosing) return;
    this._isClosing = true;
    this.menuFor()?._isClosing.set(true);
    this._panel.close();
    this._isClosing = this._panel.isClosing();
  }

  private _finalizeDetach(): void {
    this._navigator.clearActiveItem();
    this._subs.unsubscribe();
    this._subs = new Subscription();
    this.menuFor()?._isClosing.set(false);
    this._isOpen.set(false);
    this._isClosing = false;
    this._restoreFocus();
  }

  private _triggerElement(): HTMLElement {
    return (
      (this._el.nativeElement.querySelector('.sn-menubar-item-btn') as HTMLElement | null) ??
      this._el.nativeElement
    );
  }

  private _restoreFocus(): void {
    const btn = this._triggerElement();
    if (typeof btn.focus === 'function') {
      btn.focus();
    }
  }

  ngOnDestroy(): void {
    this._navigator.destroy();
    this._subs.unsubscribe();
    this._panel.dispose();
  }

  protected readonly triggerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'trigger', false),
  );

  protected readonly iconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'icon', false),
  );

  protected readonly labelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'label', false),
  );

  protected readonly arrowClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'arrow', false),
  );
}
