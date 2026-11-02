import { Injectable } from '@angular/core';

/**
 * The open declarative modals (`sn-dialog`, `sn-drawer`), newest last.
 *
 * Each one listens for Escape on the document, and document listeners run in
 * the order they were added, so the modal opened FIRST would see the key
 * first. With two open, one Escape would close the one underneath. Only the
 * topmost modal may act on it.
 */
@Injectable({ providedIn: 'root' })
export class ModalStack {
  private readonly open: object[] = [];

  push(modal: object): void {
    this.remove(modal);
    this.open.push(modal);
  }

  remove(modal: object): void {
    const index = this.open.indexOf(modal);
    if (index !== -1) this.open.splice(index, 1);
  }

  isTop(modal: object): boolean {
    return this.open[this.open.length - 1] === modal;
  }
}
