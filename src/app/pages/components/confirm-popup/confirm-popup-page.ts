import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConfirmPopup } from 'ashen-ui/confirm-popup';
import { ConfirmPopupTrigger } from 'ashen-ui/confirm-popup';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-confirm-popup-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ConfirmPopup, ConfirmPopupTrigger, Button, DocExample, DocApi],
  templateUrl: './confirm-popup-page.html',
  styleUrl: './confirm-popup-page.scss',
})
export class ConfirmPopupPage {
  protected readonly lastAction = signal('');

  protected onAccept(action: string): void {
    this.lastAction.set(`${action} confirmed`);
  }

  protected onReject(action: string): void {
    this.lastAction.set(`${action} cancelled`);
  }
}
