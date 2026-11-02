import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Panel } from 'ashen-ui/panel';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { IconTemplate } from 'ashen-ui/core';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-panel-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Panel, Button, Icon, IconTemplate, DocExample, DocApi],
  templateUrl: './panel-page.html',
  styleUrl: './panel-page.scss',
})
export class PanelPage {

  protected readonly codeAnimation = `<!-- animated=true (default) - slides open/closed -->
<sn-panel header="Animated" toggleable [animated]="true">
  Content that slides in and out.
</sn-panel>

<!-- Disable animation -->
<sn-panel header="No Animation" toggleable [animated]="false">
  Content that appears/disappears instantly.
</sn-panel>`;
}
