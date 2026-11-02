import { type Page, type Locator } from '@playwright/test';

export const ROUTES = {
  home: '/',
  gettingStarted: '/guides/getting-started',
  theming: '/guides/theming',
  configuration: '/guides/configuration',
  testing: '/guides/testing',
  icon: '/components/icon',
  button: '/components/button',
  splitButton: '/components/split-button',
  formField: '/components/form-field',
  inputText: '/components/input-text',
  inputMask: '/components/input-mask',
  textarea: '/components/textarea',
  checkbox: '/components/checkbox',
  toggle: '/components/toggle',
  toggleButton: '/components/toggle-button',
  radioGroup: '/components/radio-group',
  selectButton: '/components/select-button',
  inputNumber: '/components/input-number',
  inputPassword: '/components/input-password',
  inputGroup: '/components/input-group',
  inputTags: '/components/input-tags',
  slider: '/components/slider',
  listbox: '/components/listbox',
  select: '/components/select',
  multiSelect: '/components/multi-select',
  autocomplete: '/components/autocomplete',
  treeSelect: '/components/tree-select',
  cascadeSelect: '/components/cascade-select',
  datePicker: '/components/date-picker',
  colorPicker: '/components/color-picker',
  card: '/components/card',
  panel: '/components/panel',
  expansionPanel: '/components/expansion-panel',
  tabs: '/components/tabs',
  splitter: '/components/splitter',
  tooltip: '/components/tooltip',
  popover: '/components/popover',
  dialog: '/components/dialog',
  drawer: '/components/drawer',
  confirmDialog: '/components/confirm-dialog',
  confirmPopup: '/components/confirm-popup',
  carousel: '/components/carousel',
  timeline: '/components/timeline',
  divider: '/components/divider',
  badge: '/components/badge',
  tag: '/components/tag',
  chip: '/components/chip',
  avatar: '/components/avatar',
  skeleton: '/components/skeleton',
  menu: '/components/menu',
  contextMenu: '/components/context-menu',
  breadcrumb: '/components/breadcrumb',
  tabNav: '/components/tab-nav',
  paginator: '/components/paginator',
  stepper: '/components/stepper',
  menubar: '/components/menubar',
  progressBar: '/components/progress-bar',
  progressSpinner: '/components/progress-spinner',
  message: '/components/message',
  meterGroup: '/components/meter-group',
  toast: '/components/toast',
  table: '/components/table',
  tree: '/components/tree',
  treeTable: '/components/tree-table',
  infiniteScroll: '/components/infinite-scroll',
  virtualScroller: '/components/virtual-scroller',
} as const;

export function demo(page: Page, heading: string): Locator {
  return page
    .locator('.doc-example', {
      has: page.getByRole('heading', { level: 3, name: heading, exact: true }),
    })
    .locator('.doc-example-demo');
}

export async function describedbyIds(locator: Locator): Promise<string[]> {
  const ariaDescribedby = await locator.getAttribute('aria-describedby');
  if (!ariaDescribedby) {
    return [];
  }
  return ariaDescribedby.split(/\s+/);
}
