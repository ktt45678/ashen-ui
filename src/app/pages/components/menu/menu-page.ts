import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Menu, MenuItem, MenuSeparator, MenuTrigger, SubmenuTrigger } from 'ashen-ui/menu';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-menu-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Menu, MenuItem, MenuSeparator, MenuTrigger, SubmenuTrigger, DocExample, DocApi],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.scss',
})
export class MenuPage {
  protected readonly lastAction = signal('');

}
