import { Directive, ElementRef, inject } from '@angular/core';
import { SN_CONFIRM_POPUP } from './confirm-popup-token';

@Directive({
  selector: '[snConfirmPopupTrigger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ConfirmPopupTrigger {
  readonly el = inject(ElementRef<HTMLElement>);
  private readonly _popup = inject(SN_CONFIRM_POPUP);

  onClick(): void {
    this._popup.toggle();
  }
}
