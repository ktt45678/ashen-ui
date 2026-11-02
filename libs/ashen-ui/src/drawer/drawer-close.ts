import { Directive, inject } from '@angular/core';
import { Drawer } from './drawer';

@Directive({
  selector: '[snDrawerClose]',
  host: {
    '(click)': 'onClick()',
  },
})
export class DrawerClose {
  private readonly _drawer = inject(Drawer, { optional: true });

  onClick(): void {
    this._drawer?.requestClose();
  }
}
