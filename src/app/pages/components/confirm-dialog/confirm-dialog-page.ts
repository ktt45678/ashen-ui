import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConfirmDialog } from 'ashen-ui/confirm-dialog';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-confirm-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ConfirmDialog, Button, DocExample, DocApi],
  templateUrl: './confirm-dialog-page.html',
  styleUrl: './confirm-dialog-page.scss',
})
export class ConfirmDialogPage {
  protected readonly deleteOpen = signal(false);
  protected readonly primaryOpen = signal(false);
  protected readonly warningOpen = signal(false);
  protected readonly customLabelsOpen = signal(false);

  protected readonly lastAction = signal('');

  protected onAccept(action: string): void {
    this.lastAction.set(`${action} confirmed`);
  }

  protected onReject(action: string): void {
    this.lastAction.set(`${action} cancelled`);
  }
}
