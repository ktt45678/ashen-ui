import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page').then((m) => m.HomepagePage),
    title: 'Ashen UI - Angular component library',
  },
  {
    path: 'guides/getting-started',
    loadComponent: () =>
      import('./pages/guides/getting-started/getting-started-page').then(
        (m) => m.GettingStartedPage,
      ),
    title: 'Getting started | Ashen UI',
  },
  {
    path: 'guides/theming',
    loadComponent: () =>
      import('./pages/guides/theming/theming-page').then((m) => m.ThemingPage),
    title: 'Theming | Ashen UI',
  },
  {
    path: 'guides/configuration',
    loadComponent: () =>
      import('./pages/guides/configuration/configuration-page').then(
        (m) => m.ConfigurationPage,
      ),
    title: 'Configuration | Ashen UI',
  },
  {
    path: 'guides/testing',
    loadComponent: () =>
      import('./pages/guides/testing/testing-page').then((m) => m.TestingPage),
    title: 'Testing | Ashen UI',
  },
  {
    path: 'guides/llm',
    loadComponent: () =>
      import('./pages/guides/llm/llm-page').then((m) => m.LlmPage),
    title: 'LLM documentation | Ashen UI',
  },
  {
    path: 'components/icon',
    loadComponent: () =>
      import('./pages/components/icon/icon-page').then((m) => m.IconPage),
    title: 'Icon | Ashen UI',
  },
  {
    path: 'components/button',
    loadComponent: () =>
      import('./pages/components/button/button-page').then((m) => m.ButtonPage),
    title: 'Button | Ashen UI',
  },
  {
    path: 'components/split-button',
    loadComponent: () =>
      import('./pages/components/split-button/split-button-page').then((m) => m.SplitButtonPage),
    title: 'Split Button | Ashen UI',
  },
  {
    path: 'components/form-field',
    loadComponent: () =>
      import('./pages/components/form-field/form-field-page').then((m) => m.FormFieldPage),
    title: 'Form Field | Ashen UI',
  },
  {
    path: 'components/input-text',
    loadComponent: () =>
      import('./pages/components/input-text/input-text-page').then((m) => m.InputTextPage),
    title: 'Input Text | Ashen UI',
  },
  {
    path: 'components/input-mask',
    loadComponent: () =>
      import('./pages/components/input-mask/input-mask-page').then((m) => m.InputMaskPage),
    title: 'Input Mask | Ashen UI',
  },
  {
    path: 'components/textarea',
    loadComponent: () =>
      import('./pages/components/textarea/textarea-page').then((m) => m.TextareaPage),
    title: 'Textarea | Ashen UI',
  },
  {
    path: 'components/checkbox',
    loadComponent: () =>
      import('./pages/components/checkbox/checkbox-page').then((m) => m.CheckboxPage),
    title: 'Checkbox | Ashen UI',
  },
  {
    path: 'components/toggle',
    loadComponent: () =>
      import('./pages/components/toggle/toggle-page').then((m) => m.TogglePage),
    title: 'Toggle | Ashen UI',
  },
  {
    path: 'components/toggle-button',
    loadComponent: () =>
      import('./pages/components/toggle-button/toggle-button-page').then(
        (m) => m.ToggleButtonPage,
      ),
    title: 'Toggle Button | Ashen UI',
  },
  {
    path: 'components/radio-group',
    loadComponent: () =>
      import('./pages/components/radio-group/radio-group-page').then((m) => m.RadioGroupPage),
    title: 'Radio Group | Ashen UI',
  },
  {
    path: 'components/select-button',
    loadComponent: () =>
      import('./pages/components/select-button/select-button-page').then(
        (m) => m.SelectButtonPage,
      ),
    title: 'Select Button | Ashen UI',
  },
  {
    path: 'components/input-number',
    loadComponent: () =>
      import('./pages/components/input-number/input-number-page').then((m) => m.InputNumberPage),
    title: 'Input Number | Ashen UI',
  },
  {
    path: 'components/input-password',
    loadComponent: () =>
      import('./pages/components/input-password/input-password-page').then((m) => m.InputPasswordPage),
    title: 'Input Password | Ashen UI',
  },
  {
    path: 'components/input-group',
    loadComponent: () =>
      import('./pages/components/input-group/input-group-page').then((m) => m.InputGroupPage),
    title: 'Input Group | Ashen UI',
  },
  {
    path: 'components/input-tags',
    loadComponent: () =>
      import('./pages/components/input-tags/input-tags-page').then((m) => m.InputTagsPage),
    title: 'Input Tags | Ashen UI',
  },
  {
    path: 'components/slider',
    loadComponent: () =>
      import('./pages/components/slider/slider-page').then((m) => m.SliderPage),
    title: 'Slider | Ashen UI',
  },
  {
    path: 'components/listbox',
    loadComponent: () =>
      import('./pages/components/listbox/listbox-page').then((m) => m.ListboxPage),
    title: 'Listbox | Ashen UI',
  },
  {
    path: 'components/select',
    loadComponent: () =>
      import('./pages/components/select/select-page').then((m) => m.SelectPage),
    title: 'Select | Ashen UI',
  },
  {
    path: 'components/multi-select',
    loadComponent: () =>
      import('./pages/components/multi-select/multi-select-page').then((m) => m.MultiSelectPage),
    title: 'Multi Select | Ashen UI',
  },
  {
    path: 'components/autocomplete',
    loadComponent: () =>
      import('./pages/components/autocomplete/autocomplete-page').then((m) => m.AutocompletePage),
    title: 'AutoComplete | Ashen UI',
  },
  {
    path: 'components/tree-select',
    loadComponent: () =>
      import('./pages/components/tree-select/tree-select-page').then((m) => m.TreeSelectPage),
    title: 'Tree Select | Ashen UI',
  },
  {
    path: 'components/cascade-select',
    loadComponent: () =>
      import('./pages/components/cascade-select/cascade-select-page').then((m) => m.CascadeSelectPage),
    title: 'Cascade Select | Ashen UI',
  },
  {
    path: 'components/date-picker',
    loadComponent: () =>
      import('./pages/components/date-picker/date-picker-page').then((m) => m.DatePickerPage),
    title: 'Date Picker | Ashen UI',
  },
  {
    path: 'components/color-picker',
    loadComponent: () =>
      import('./pages/components/color-picker/color-picker-page').then((m) => m.ColorPickerPage),
    title: 'Color Picker | Ashen UI',
  },
  {
    path: 'components/card',
    loadComponent: () =>
      import('./pages/components/card/card-page').then((m) => m.CardPage),
    title: 'Card | Ashen UI',
  },
  {
    path: 'components/panel',
    loadComponent: () =>
      import('./pages/components/panel/panel-page').then((m) => m.PanelPage),
    title: 'Panel | Ashen UI',
  },
  {
    path: 'components/expansion-panel',
    loadComponent: () =>
      import('./pages/components/expansion-panel/expansion-panel-page').then(
        (m) => m.ExpansionPanelPage,
      ),
    title: 'Expansion Panel | Ashen UI',
  },
  {
    path: 'components/tabs',
    loadComponent: () =>
      import('./pages/components/tabs/tabs-page').then((m) => m.TabsPage),
    title: 'Tabs | Ashen UI',
  },
  {
    path: 'components/splitter',
    loadComponent: () =>
      import('./pages/components/splitter/splitter-page').then((m) => m.SplitterPage),
    title: 'Splitter | Ashen UI',
  },
  {
    path: 'components/tooltip',
    loadComponent: () =>
      import('./pages/components/tooltip/tooltip-page').then((m) => m.TooltipPage),
    title: 'Tooltip | Ashen UI',
  },
  {
    path: 'components/popover',
    loadComponent: () =>
      import('./pages/components/popover/popover-page').then((m) => m.PopoverPage),
    title: 'Popover | Ashen UI',
  },
  {
    path: 'components/dialog',
    loadComponent: () =>
      import('./pages/components/dialog/dialog-page').then((m) => m.DialogPage),
    title: 'Dialog | Ashen UI',
  },
  {
    path: 'components/drawer',
    loadComponent: () =>
      import('./pages/components/drawer/drawer-page').then((m) => m.DrawerPage),
    title: 'Drawer | Ashen UI',
  },
  {
    path: 'components/confirm-dialog',
    loadComponent: () =>
      import('./pages/components/confirm-dialog/confirm-dialog-page').then(
        (m) => m.ConfirmDialogPage,
      ),
    title: 'Confirm Dialog | Ashen UI',
  },
  {
    path: 'components/confirm-popup',
    loadComponent: () =>
      import('./pages/components/confirm-popup/confirm-popup-page').then(
        (m) => m.ConfirmPopupPage,
      ),
    title: 'Confirm Popup | Ashen UI',
  },
  {
    path: 'components/carousel',
    loadComponent: () =>
      import('./pages/components/carousel/carousel-page').then((m) => m.CarouselPage),
    title: 'Carousel | Ashen UI',
  },
  {
    path: 'components/timeline',
    loadComponent: () =>
      import('./pages/components/timeline/timeline-page').then((m) => m.TimelinePage),
    title: 'Timeline | Ashen UI',
  },
  {
    path: 'components/divider',
    loadComponent: () =>
      import('./pages/components/divider/divider-page').then((m) => m.DividerPage),
    title: 'Divider | Ashen UI',
  },
  {
    path: 'components/badge',
    loadComponent: () =>
      import('./pages/components/badge/badge-page').then((m) => m.BadgePage),
    title: 'Badge | Ashen UI',
  },
  {
    path: 'components/tag',
    loadComponent: () =>
      import('./pages/components/tag/tag-page').then((m) => m.TagPage),
    title: 'Tag | Ashen UI',
  },
  {
    path: 'components/chip',
    loadComponent: () =>
      import('./pages/components/chip/chip-page').then((m) => m.ChipPage),
    title: 'Chip | Ashen UI',
  },
  {
    path: 'components/avatar',
    loadComponent: () =>
      import('./pages/components/avatar/avatar-page').then((m) => m.AvatarPage),
    title: 'Avatar | Ashen UI',
  },
  {
    path: 'components/skeleton',
    loadComponent: () =>
      import('./pages/components/skeleton/skeleton-page').then((m) => m.SkeletonPage),
    title: 'Skeleton | Ashen UI',
  },
  {
    path: 'components/menu',
    loadComponent: () =>
      import('./pages/components/menu/menu-page').then((m) => m.MenuPage),
    title: 'Menu | Ashen UI',
  },
  {
    path: 'components/context-menu',
    loadComponent: () =>
      import('./pages/components/context-menu/context-menu-page').then((m) => m.ContextMenuPage),
    title: 'Context Menu | Ashen UI',
  },
  {
    path: 'components/breadcrumb',
    loadComponent: () =>
      import('./pages/components/breadcrumb/breadcrumb-page').then((m) => m.BreadcrumbPage),
    title: 'Breadcrumb | Ashen UI',
  },
  {
    path: 'components/tab-nav',
    loadComponent: () =>
      import('./pages/components/tab-nav/tab-nav-page').then((m) => m.TabNavPage),
    title: 'Tab Nav | Ashen UI',
  },
  {
    path: 'components/paginator',
    loadComponent: () =>
      import('./pages/components/paginator/paginator-page').then((m) => m.PaginatorPage),
    title: 'Paginator | Ashen UI',
  },
  {
    path: 'components/stepper',
    loadComponent: () =>
      import('./pages/components/stepper/stepper-page').then((m) => m.StepperPage),
    title: 'Stepper | Ashen UI',
  },
  {
    path: 'components/menubar',
    loadComponent: () =>
      import('./pages/components/menubar/menubar-page').then((m) => m.MenubarPage),
    title: 'Menubar | Ashen UI',
  },
  {
    path: 'components/progress-bar',
    loadComponent: () =>
      import('./pages/components/progress-bar/progress-bar-page').then((m) => m.ProgressBarPage),
    title: 'Progress Bar | Ashen UI',
  },
  {
    path: 'components/progress-spinner',
    loadComponent: () =>
      import('./pages/components/progress-spinner/progress-spinner-page').then((m) => m.ProgressSpinnerPage),
    title: 'Progress Spinner | Ashen UI',
  },
  {
    path: 'components/message',
    loadComponent: () =>
      import('./pages/components/message/message-page').then((m) => m.MessagePage),
    title: 'Message | Ashen UI',
  },
  {
    path: 'components/meter-group',
    loadComponent: () =>
      import('./pages/components/meter-group/meter-group-page').then((m) => m.MeterGroupPage),
    title: 'Meter Group | Ashen UI',
  },
  {
    path: 'components/toast',
    loadComponent: () =>
      import('./pages/components/toast/toast-page').then((m) => m.ToastPage),
    title: 'Toast | Ashen UI',
  },
  {
    path: 'components/table',
    loadComponent: () =>
      import('./pages/components/table/table-page').then((m) => m.TablePage),
    title: 'Table | Ashen UI',
  },
  {
    path: 'components/tree',
    loadComponent: () =>
      import('./pages/components/tree/tree-page').then((m) => m.TreePage),
    title: 'Tree | Ashen UI',
  },
  {
    path: 'components/tree-table',
    loadComponent: () =>
      import('./pages/components/tree-table/tree-table-page').then((m) => m.TreeTablePage),
    title: 'Tree Table | Ashen UI',
  },
  {
    path: 'components/infinite-scroll',
    loadComponent: () =>
      import('./pages/components/infinite-scroll/infinite-scroll-page').then(
        (m) => m.InfiniteScrollPage,
      ),
    title: 'Infinite Scroll | Ashen UI',
  },
  {
    path: 'components/virtual-scroller',
    loadComponent: () =>
      import('./pages/components/virtual-scroller/virtual-scroller-page').then(
        (m) => m.VirtualScrollerPage,
      ),
    title: 'Virtual Scroller | Ashen UI',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
