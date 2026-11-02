import { Directive } from '@angular/core';

@Directive({
  selector: '[snDrawerFooter]',
  host: {
    class: 'sn-drawer-footer-slot',
  },
})
export class DrawerFooter {}
