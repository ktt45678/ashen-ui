import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-sidenav' },
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavComponent {
  protected readonly groups: NavGroup[] = [
    {
      label: 'Core',
      items: [
        { label: 'Icon', path: 'icon' },
        { label: 'Button', path: 'button' },
        { label: 'Split Button', path: 'split-button' },
      ],
    },
    {
      label: 'Forms',
      items: [
        { label: 'Form Field', path: 'form-field' },
        { label: 'Input Text', path: 'input-text' },
        { label: 'Input Mask', path: 'input-mask' },
        { label: 'Textarea', path: 'textarea' },
        { label: 'Checkbox', path: 'checkbox' },
        { label: 'Toggle', path: 'toggle' },
        { label: 'Toggle Button', path: 'toggle-button' },
        { label: 'Radio Group', path: 'radio-group' },
        { label: 'Select Button', path: 'select-button' },
        { label: 'Input Number', path: 'input-number' },
        { label: 'Input Password', path: 'input-password' },
        { label: 'Input Group', path: 'input-group' },
        { label: 'Input Tags', path: 'input-tags' },
        { label: 'Slider', path: 'slider' },
        { label: 'Listbox', path: 'listbox' },
        { label: 'Select', path: 'select' },
        { label: 'Multi Select', path: 'multi-select' },
        { label: 'AutoComplete', path: 'autocomplete' },
        { label: 'Tree Select', path: 'tree-select' },
        { label: 'Cascade Select', path: 'cascade-select' },
        { label: 'Date Picker', path: 'date-picker' },
        { label: 'Color Picker', path: 'color-picker' },
      ],
    },
    { label: 'Containers', items: [{ label: 'Card', path: 'card' }, { label: 'Panel', path: 'panel' }, { label: 'Expansion Panel', path: 'expansion-panel' }, { label: 'Tabs', path: 'tabs' }, { label: 'Splitter', path: 'splitter' }] },
    { label: 'Overlays', items: [{ label: 'Tooltip', path: 'tooltip' }, { label: 'Popover', path: 'popover' }, { label: 'Dialog', path: 'dialog' }, { label: 'Drawer', path: 'drawer' }, { label: 'Confirm Dialog', path: 'confirm-dialog' }, { label: 'Confirm Popup', path: 'confirm-popup' }] },
    { label: 'Navigation', items: [{ label: 'Menu', path: 'menu' }, { label: 'Context Menu', path: 'context-menu' }, { label: 'Breadcrumb', path: 'breadcrumb' }, { label: 'Tab Nav', path: 'tab-nav' }, { label: 'Paginator', path: 'paginator' }, { label: 'Stepper', path: 'stepper' }, { label: 'Menubar', path: 'menubar' }] },
    {
      label: 'Display',
      items: [
        { label: 'Divider', path: 'divider' },
        { label: 'Badge', path: 'badge' },
        { label: 'Tag', path: 'tag' },
        { label: 'Chip', path: 'chip' },
        { label: 'Avatar', path: 'avatar' },
        { label: 'Skeleton', path: 'skeleton' },
        { label: 'Timeline', path: 'timeline' },
        { label: 'Carousel', path: 'carousel' },
      ],
    },
    { label: 'Feedback', items: [{ label: 'Progress Bar', path: 'progress-bar' }, { label: 'Progress Spinner', path: 'progress-spinner' }, { label: 'Message', path: 'message' }, { label: 'Meter Group', path: 'meter-group' }, { label: 'Toast', path: 'toast' }] },
    { label: 'Data', items: [{ label: 'Table', path: 'table' }, { label: 'Tree', path: 'tree' }, { label: 'Tree Table', path: 'tree-table' }, { label: 'Virtual Scroller', path: 'virtual-scroller' }, { label: 'Infinite Scroll', path: 'infinite-scroll' }] },
  ];
}
