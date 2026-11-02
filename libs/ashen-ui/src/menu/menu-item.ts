import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  InjectionToken,
  OnDestroy,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { Icon } from 'ashen-ui/icon';
import { SN_MENU } from './menu-token';
import { SnIconRegistry } from 'ashen-ui/core';

/** Token used by SubmenuTrigger to register itself on the host MenuItem. */
export const SN_SUBMENU_TRIGGER = new InjectionToken<{ _isOpen: () => boolean }>('SN_SUBMENU_TRIGGER');

@Component({
  selector: 'button[snMenuItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './menu-item.html',
  host: {
    class: 'sn-menu-item',
    '[class.sn-menu-item-danger]': 'danger()',
    '[attr.role]': '"menuitem"',
    '[attr.tabindex]': '-1',
    '[attr.disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-sn-danger]': 'danger() ? "" : null',
    '(click)': '_onClick()',
  },
})
export class MenuItem implements FocusableOption, OnDestroy {
  protected readonly icons = inject(SnIconRegistry);

  readonly icon = input<string>();
  readonly shortcut = input<string>();
  readonly danger = input(false, { transform: booleanAttribute });
  readonly isDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _menu = inject(SN_MENU, { optional: true });
  private readonly _submenuTrigger = inject(SN_SUBMENU_TRIGGER, { self: true, optional: true });
  protected readonly _hasSubmenu = !!this._submenuTrigger;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _destroyed = false;

  readonly disabled: boolean = false;

  focus(_origin?: FocusOrigin): void {
    this._el.nativeElement.focus();
  }

  getLabel(): string {
    return this._el.nativeElement.textContent?.trim() ?? '';
  }

  _onClick(): void {
    if (this.isDisabled()) return;
    if (this._hasSubmenu) return; // SubmenuTrigger owns click handling
    this._closeTimer = setTimeout(() => {
      if (!this._destroyed) {
        this._menu?.close();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }
}
