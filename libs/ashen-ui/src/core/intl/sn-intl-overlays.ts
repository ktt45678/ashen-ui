import { Injectable } from '@angular/core';

/** Text for `sn-dialog` and the `DialogService` container. */
@Injectable({ providedIn: 'root' })
export class SnDialogIntl {
  /** `aria-label` of the header close button. */
  close = 'Close';
}

/** Text for `sn-drawer`. */
@Injectable({ providedIn: 'root' })
export class SnDrawerIntl {
  /** `aria-label` of the header close button. */
  close = 'Close';
}

/**
 * Button text for the confirmation surfaces: `sn-confirm-dialog`,
 * `sn-confirm-popup`, and `DialogService.confirm()`.
 */
@Injectable({ providedIn: 'root' })
export class SnConfirmIntl {
  /** Dialog title of `sn-confirm-dialog` and `DialogService.confirm()`. */
  header = 'Confirm';
  accept = 'Yes';
  reject = 'Cancel';
}

/** Text for `sn-message`. */
@Injectable({ providedIn: 'root' })
export class SnMessageIntl {
  close = 'Close message';
}

/** Text for `sn-toast`. */
@Injectable({ providedIn: 'root' })
export class SnToastIntl {
  close = 'Close notification';
}
