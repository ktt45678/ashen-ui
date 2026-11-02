import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Menubar, MenubarItem } from 'ashen-ui/menubar';
import { Menu, MenuItem, MenuSeparator } from 'ashen-ui/menu';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-menubar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Menubar, MenubarItem, Menu, MenuItem, MenuSeparator, DocExample, DocApi],
  templateUrl: './menubar-page.html',
  styleUrl: './menubar-page.scss',
})
export class MenubarPage {
  protected readonly lastAction = signal('');

}
