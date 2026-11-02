import { Directive, OnDestroy, inject } from '@angular/core';
import { SN_POPOVER } from './popover-token';

@Directive({
  selector: '[snPopoverClose]',
  host: {
    '(click)': 'onClick()',
  },
})
export class PopoverClose implements OnDestroy {
  private readonly _popover = inject(SN_POPOVER, { optional: true });
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _destroyed = false;

  onClick(): void {
    if (!this._popover) return;
    this._timer = setTimeout(() => {
      if (!this._destroyed) {
        this._popover!.close();
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
