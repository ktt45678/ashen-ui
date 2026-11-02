import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Dialog } from 'ashen-ui/dialog';
import { DialogFooter } from 'ashen-ui/dialog';
import { DialogTitle } from 'ashen-ui/dialog';
import { DialogClose } from 'ashen-ui/dialog';
import { DialogService, SnDialogRef, SN_DIALOG_DATA } from 'ashen-ui/dialog';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

/** Content rendered inside the imperative dialog demo. */
@Component({
  selector: 'app-dialog-demo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Button],
  template: `
    <p style="margin:0 0 1.25rem;color:var(--sn-text-muted)">
      Opened imperatively from <code>DialogService</code>. Data: <strong>{{ data?.userName }}</strong>.
    </p>
    <div style="display:flex;justify-content:flex-end;gap:0.5rem">
      <button snButton variant="text" (click)="ref.close()">Cancel</button>
      <button snButton (click)="ref.close('saved')">Save</button>
    </div>
  `,
})
export class DialogDemoContent {
  readonly ref = inject<SnDialogRef<string>>(SnDialogRef);
  readonly data = inject(SN_DIALOG_DATA) as { userName?: string } | null;
}

@Component({
  selector: 'app-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogFooter, DialogTitle, DialogClose, Button, Icon, DocExample, DocApi],
  templateUrl: './dialog-page.html',
  styleUrl: './dialog-page.scss',
})
export class DialogPage {
  protected readonly basicOpen = signal(false);
  protected readonly smOpen = signal(false);
  protected readonly lgOpen = signal(false);
  protected readonly footerOpen = signal(false);
  protected readonly deleteOpen = signal(false);
  protected readonly richTitleOpen = signal(false);
  protected readonly directiveCloseOpen = signal(false);

  private readonly dialogService = inject(DialogService);
  protected readonly lastResult = signal<string | null>(null);

  protected openDynamic(): void {
    const ref = this.dialogService.open<DialogDemoContent, string>(DialogDemoContent, {
      header: 'Imperative Dialog',
      data: { userName: 'Ada' },
    });
    ref.afterClosed().subscribe((result) => this.lastResult.set(result ?? '(dismissed)'));
  }

  protected openConfirm(): void {
    this.dialogService
      .confirm({
        header: 'Delete item',
        message: 'This action cannot be undone. Continue?',
        severity: 'error',
        acceptLabel: 'Delete',
      })
      .subscribe((ok) => this.lastResult.set(ok ? 'confirmed' : 'cancelled'));
  }

}
