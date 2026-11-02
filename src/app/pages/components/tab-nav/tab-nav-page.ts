import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from 'ashen-ui/icon';
import { TabLink, TabNav } from 'ashen-ui/tab-nav';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tab-nav-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [TabNav, TabLink, Icon, RouterLink, RouterLinkActive, DocExample, DocApi],
  templateUrl: './tab-nav-page.html',
  styleUrl: './tab-nav-page.scss',
})
export class TabNavPage {
  protected readonly sections = ['General', 'Appearance', 'Notifications'];
  protected readonly selectedSection = signal('General');

  protected readonly iconTabs = [
    { label: 'Files', icon: 'folder' },
    { label: 'Shared', icon: 'group' },
    { label: 'Recent', icon: 'schedule' },
  ];
  protected readonly selectedIconTab = signal('Files');

  protected readonly manyLinks = [
    'Overview',
    'Appearance',
    'Notifications',
    'Integrations',
    'Billing',
    'Members',
    'Security',
    'Advanced',
  ];
  protected readonly selectedManyLink = signal('Overview');

  protected readonly settingsPages = ['Profile', 'Account', 'Privacy', 'Devices'];
  protected readonly selectedSettingsPage = signal('Profile');
}
