import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Message } from 'ashen-ui/message';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-message-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Message, DocExample, DocApi],
  templateUrl: './message-page.html',
  styleUrl: './message-page.scss',
})
export class MessagePage {
  protected readonly showClosable = signal(true);

  protected onClosed(): void {
    this.showClosable.set(false);
    setTimeout(() => this.showClosable.set(true), 1500);
  }
}
