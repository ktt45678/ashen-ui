import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Accordion, ExpansionPanel } from 'ashen-ui/expansion-panel';
import { IconTemplate } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-expansion-panel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Accordion, ExpansionPanel, IconTemplate, Icon, DocExample, DocApi],
  templateUrl: './expansion-panel-page.html',
  styleUrl: './expansion-panel-page.scss',
})
export class ExpansionPanelPage {

}
