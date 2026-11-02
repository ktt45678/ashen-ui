import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tooltip } from 'ashen-ui/tooltip';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tooltip-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Tooltip, Button, DocExample, DocApi],
  templateUrl: './tooltip-page.html',
  styleUrl: './tooltip-page.scss',
})
export class TooltipPage {

}
