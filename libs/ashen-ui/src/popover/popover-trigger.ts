import { Directive, ElementRef, inject } from '@angular/core';
import { SN_POPOVER } from './popover-token';

@Directive({
  selector: '[snPopoverTrigger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class PopoverTrigger {
  readonly el = inject(ElementRef<HTMLElement>);
  private readonly _popover = inject(SN_POPOVER);

  onClick(): void {
    this._popover.toggle();
  }
}
