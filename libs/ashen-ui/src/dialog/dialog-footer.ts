import { Directive } from '@angular/core';

/**
 * Action row of a dialog. Inside `sn-dialog` it fills the footer part; in a
 * component opened through `DialogService` it is a right-aligned row at the end
 * of the content.
 */
@Directive({
  selector: '[snDialogFooter]',
  host: {
    class: 'sn-dialog-footer-slot',
  },
})
export class DialogFooter {}
