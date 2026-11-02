import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  SN_PART_SOURCE,
  SnPart,
  snAnimated,
  resolveSnClass,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
} from 'ashen-ui/core';
import { snListNavigator } from 'ashen-ui/cdk';
import { SN_MENUBAR, SnMenubarContext } from './menubar-token';
import { MenubarItem } from './menubar-item';

const MENUBAR_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role'],
};

@Component({
  selector: 'sn-menubar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SN_MENUBAR,
      useFactory: (self: Menubar): SnMenubarContext => ({
        openItem: (index: number) => self._openItem(index),
        closeActive: () => self._closeActiveItem(),
        isMenuMode: () => self._isMenuMode(),
        registerItem: () => self._nextItemIndex(),
        navigatePrevious: () => self._navigatePrevious(),
        navigateNext: () => self._navigateNext(),
        animated: self._animated,
        animation: self.animation,
      }),
      deps: [Menubar],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Menubar) },
  ],
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './menubar.html',
  host: {
    class: 'sn-menubar',
    '[class]': 'snClassResolved()',
    role: 'menubar',
    '(keydown)': '_onHostKeydown($event)',
  },
})
export class Menubar implements OnDestroy, SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    MENUBAR_RESERVED_ATTRS[section] ?? [];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
  readonly animated = input(true, { transform: booleanAttribute });
  /** `animated` AND-ed with the app-wide motion setting; this is what the context publishes. */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);

  readonly _items = contentChildren(MenubarItem);

  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * The bar itself is a plain horizontal list, so the navigator owns moving
   * along it, including the RTL arrow mapping. What stays here is the menubar
   * pattern the navigator knows nothing about: menu mode, and opening the
   * submenu of whatever the move landed on.
   */
  private readonly _navigator = snListNavigator({
    items: computed(() => this._items() as MenubarItem[]),
    orientation: 'horizontal',
    wrap: true,
    homeAndEnd: true,
    skipPredicate: (item) => item.disabled,
  });
  private readonly _menuModeSignal = signal(false);
  private _itemCount = 0;
  private _openIndex = -1;

  constructor() {
    afterNextRender(() => {
      if (!this._isBrowser) return;
      this._navigator.setFirstItemActive();
    });
  }

  _isMenuMode(): boolean {
    return this._menuModeSignal();
  }

  _nextItemIndex(): number {
    return this._itemCount++;
  }

  _onHostKeydown(event: KeyboardEvent): void {
    // Only at the bar level, and only outside menu mode: with a submenu open
    // the keystroke lands on the overlay and the item handles it.
    if (this._menuModeSignal()) return;
    if (this._navigator.onKeydown(event)) {
      event.preventDefault();
      this._syncTabIndices();
    }
  }

  _openItem(index: number): void {
    if (this._openIndex >= 0 && this._openIndex !== index) {
      this._closeItemAtIndex(this._openIndex);
    }
    this._openIndex = index;
    this._menuModeSignal.set(true);

    const item = this._getItemByIndex(index);
    if (item) {
      this._navigator.setActiveItem(item._index());
      this._syncTabIndices();
      item._open(0);
    }
  }

  _closeActiveItem(): void {
    if (this._openIndex >= 0) {
      this._closeItemAtIndex(this._openIndex);
    }
    this._openIndex = -1;
    this._menuModeSignal.set(false);
  }

  _navigatePrevious(): void {
    this._navigator.setPreviousItemActive();
    this._syncTabIndices();
    const active = this._navigator.activeItem();
    if (active) {
      this._openIndex = active._index();
      this._menuModeSignal.set(true);
      if (active.menuFor()) {
        active._open(0);
      } else {
        this._openIndex = -1;
        this._menuModeSignal.set(false);
        active.focus();
      }
    }
  }

  _navigateNext(): void {
    this._navigator.setNextItemActive();
    this._syncTabIndices();
    const active = this._navigator.activeItem();
    if (active) {
      this._openIndex = active._index();
      this._menuModeSignal.set(true);
      if (active.menuFor()) {
        active._open(0);
      } else {
        this._openIndex = -1;
        this._menuModeSignal.set(false);
        active.focus();
      }
    }
  }

  private _syncTabIndices(): void {
    const activeItem = this._navigator.activeItem();
    this._items().forEach((item) => {
      item._tabIndex.set(item === activeItem ? 0 : -1);
    });
  }

  private _closeItemAtIndex(index: number): void {
    const item = this._getItemByIndex(index);
    if (item?._isOpen()) {
      item._closeImmediate();
    }
  }

  private _getItemByIndex(index: number): MenubarItem | undefined {
    return this._items().find((it) => it._index() === index);
  }

  ngOnDestroy(): void {
    this._navigator.destroy();
  }
}
