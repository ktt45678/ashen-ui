import { InjectionToken, type Signal } from '@angular/core';
import { type SnShowHideAnimation } from 'ashen-ui/core';

export interface SnMenubarContext {
  /** Open submenu at given item index (closes any other open submenu first). */
  openItem(index: number): void;
  /** Close the currently active submenu, exit menu mode. */
  closeActive(): void;
  /** Whether any submenu is currently open ("menu mode"). */
  isMenuMode(): boolean;
  /** Register an item and receive its sequential index. */
  registerItem(): number;
  /** Move to the previous top-level item (wrapping); if in menu mode, open its submenu. */
  navigatePrevious(): void;
  /** Move to the next top-level item (wrapping); if in menu mode, open its submenu. */
  navigateNext(): void;
  animated: Signal<boolean>;
  animation: Signal<SnShowHideAnimation | undefined>;
}

export const SN_MENUBAR = new InjectionToken<SnMenubarContext>('SN_MENUBAR');
