import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Tabs, Tab } from 'ashen-ui/tabs';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tabs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Tabs, Tab, DocExample, DocApi],
  templateUrl: './tabs-page.html',
  styleUrl: './tabs-page.scss',
})
export class TabsPage {
  protected readonly controlledIndex = signal(0);
  protected readonly controlledValue = signal<unknown>('appearance');

  protected readonly manyTabs = [
    'Overview',
    'Appearance',
    'Notifications',
    'Integrations',
    'Billing',
    'Members',
    'Security',
    'Advanced',
  ];

}
