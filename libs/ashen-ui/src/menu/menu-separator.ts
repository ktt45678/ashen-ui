import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sn-menu-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'sn-menu-separator',
    '[attr.role]': '"separator"',
    '[attr.aria-orientation]': '"horizontal"',
  },
})
export class MenuSeparator {}
