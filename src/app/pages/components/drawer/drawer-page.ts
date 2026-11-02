import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Drawer } from 'ashen-ui/drawer';
import { DrawerFooter } from 'ashen-ui/drawer';
import { DrawerTitle } from 'ashen-ui/drawer';
import { DrawerClose } from 'ashen-ui/drawer';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-drawer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Drawer, DrawerFooter, DrawerTitle, DrawerClose, Button, Icon, DocExample, DocApi],
  templateUrl: './drawer-page.html',
  styleUrl: './drawer-page.scss',
})
export class DrawerPage {
  protected readonly basicOpen = signal(false);
  protected readonly leftOpen = signal(false);
  protected readonly startOpen = signal(false);
  protected readonly endOpen = signal(false);
  protected readonly footerOpen = signal(false);
  protected readonly noMaskOpen = signal(false);
  protected readonly richTitleOpen = signal(false);
  protected readonly topOpen = signal(false);
  protected readonly bottomOpen = signal(false);
  protected readonly fullscreenOpen = signal(false);
  protected readonly noLockScrollOpen = signal(false);
  protected readonly directiveCloseOpen = signal(false);

}
