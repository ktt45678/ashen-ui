import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Popover } from 'ashen-ui/popover';
import { PopoverTrigger } from 'ashen-ui/popover';
import { PopoverContent } from 'ashen-ui/popover';
import { PopoverClose } from 'ashen-ui/popover';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-popover-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Popover, PopoverTrigger, PopoverContent, PopoverClose, Button, Icon, DocExample, DocApi],
  templateUrl: './popover-page.html',
  styleUrl: './popover-page.scss',
})
export class PopoverPage {
  protected readonly isControlledOpen = signal(false);

}
