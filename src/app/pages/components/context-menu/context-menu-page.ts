import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ContextMenuTrigger, Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-context-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ContextMenuTrigger, Menu, MenuItem, MenuSeparator, DocExample, DocApi],
  templateUrl: './context-menu-page.html',
  styleUrl: './context-menu-page.scss',
})
export class ContextMenuPage {
  protected readonly lastAction = signal('');

}
