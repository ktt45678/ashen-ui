import { Directive, OnDestroy, inject } from '@angular/core';
import { Dialog } from './dialog';

@Directive({
  selector: '[snDialogClose]',
  host: {
    '(click)': 'onClick()',
  },
})
export class DialogClose implements OnDestroy {
  private readonly _dialog = inject(Dialog, { optional: true });
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _destroyed = false;

  onClick(): void {
    if (!this._dialog) return;
    this._timer = setTimeout(() => {
      if (!this._destroyed) {
        this._dialog!.requestClose();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this._destroyed = true;
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}
