import type { Provider } from '@angular/core';
import { SnCommonIntl } from './sn-intl-common';
import {
  SnChipIntl,
  SnInputTagsIntl,
  SnListboxIntl,
  SnPasswordIntl,
  SnSelectIntl,
} from './sn-intl-forms';
import {
  SnConfirmIntl,
  SnDialogIntl,
  SnDrawerIntl,
  SnMessageIntl,
  SnToastIntl,
} from './sn-intl-overlays';
import {
  SnBreadcrumbIntl,
  SnPaginatorIntl,
  SnPanelIntl,
  SnSplitButtonIntl,
  SnSplitterIntl,
  SnStepperIntl,
} from './sn-intl-navigation';
import { SnCarouselIntl, SnTableIntl, SnTreeIntl } from './sn-intl-data';
import { SnAvatarIntl } from './sn-intl-display';
import { SnColorPickerIntl, SnDatePickerIntl } from './sn-intl-pickers';

/**
 * Every per-component text service, keyed by the name `provideSnIntl` uses.
 *
 * They all live in `ashen-ui/core` rather than in the component entry points
 * they serve. Putting `SnPaginatorIntl` in `ashen-ui/paginator` would read
 * better, but the deprecated `SnIntl` facade has to delegate to all of them,
 * and it lives in core, which every component entry point already imports.
 * That would be a cycle. Both reasons the god object had to be split survive
 * the compromise: an app can override one component's text without touching
 * another's, and an app that uses three components ships three of these
 * classes rather than all 59 keys.
 */
export const SN_INTL_GROUPS = {
  common: SnCommonIntl,
  select: SnSelectIntl,
  listbox: SnListboxIntl,
  password: SnPasswordIntl,
  inputTags: SnInputTagsIntl,
  chip: SnChipIntl,
  dialog: SnDialogIntl,
  drawer: SnDrawerIntl,
  confirm: SnConfirmIntl,
  message: SnMessageIntl,
  toast: SnToastIntl,
  breadcrumb: SnBreadcrumbIntl,
  paginator: SnPaginatorIntl,
  splitButton: SnSplitButtonIntl,
  panel: SnPanelIntl,
  splitter: SnSplitterIntl,
  stepper: SnStepperIntl,
  tree: SnTreeIntl,
  table: SnTableIntl,
  carousel: SnCarouselIntl,
  avatar: SnAvatarIntl,
  datePicker: SnDatePickerIntl,
  colorPicker: SnColorPickerIntl,
} as const;

/** Name of one text service in {@link SN_INTL_GROUPS}. */
export type SnIntlGroupName = keyof typeof SN_INTL_GROUPS;

/** The nested override shape: `{ paginator: { first: '…' } }`. */
export type SnIntlGroupOverrides = {
  [K in SnIntlGroupName]?: Partial<InstanceType<(typeof SN_INTL_GROUPS)[K]>>;
};

/**
 * The flat key set.
 *
 * `SnIntl` implements this, so the facade cannot drift from the flat override
 * shape without a compile error.
 *
 * @deprecated Use the nested shape: `provideSnIntl({ paginator: { first } })`.
 */
export interface SnIntlFlat {
  removeChip(label: string): string;
  close: string;
  dialogClose: string;
  drawerClose: string;
  next: string;
  previous: string;
  selectPlaceholder: string;
  selectClear: string;
  emptyMessage: string;
  showPassword: string;
  hidePassword: string;
  passwordPlaceholder: string;
  passwordStrengthWeak: string;
  passwordStrengthFair: string;
  passwordStrengthGood: string;
  passwordStrengthStrong: string;
  addTag: string;
  panelExpand: string;
  panelCollapse: string;
  splitterResize: string;
  messageClose: string;
  toastClose: string;
  confirmAccept: string;
  confirmReject: string;
  breadcrumb: string;
  paginator: string;
  paginatorFirst: string;
  paginatorPrev: string;
  paginatorNext: string;
  paginatorLast: string;
  paginatorJump: string;
  paginatorRowsPerPage: string;
  paginatorReport(first: number, last: number, total: number): string;
  loading: string;
  carouselLabel: string;
  carouselPrev: string;
  carouselNext: string;
  carouselSlide(index: number, total: number): string;
  carouselGoto(index: number): string;
  treeLabel: string;
  treeExpand: string;
  treeCollapse: string;
  treeTableLabel: string;
  splitButtonMore: string;
  listboxLabel: string;
  locale: string | undefined;
  datePickerPlaceholder: string;
  datePickerLabel: string;
  datePickerPrev: string;
  datePickerNext: string;
  datePickerChooseMonth: string;
  datePickerChooseYear: string;
  datePickerMonths: readonly string[];
  datePickerMonthsShort: readonly string[];
  datePickerWeekdaysShort: readonly string[];
  datePickerFirstDayOfWeek: number;
  colorPickerOpen: string;
  colorArea: string;
  colorAreaValueText(saturation: number, brightness: number): string;
  colorSliderHue: string;
  colorSliderAlpha: string;
  colorSliderBrightness: string;
  colorSliderSaturation: string;
  colorEyeDropper: string;
  colorInputHex: string;
  colorInputRed: string;
  colorInputGreen: string;
  colorInputBlue: string;
}

/**
 * Where each flat key lives. Drives the flat half of {@link provideSnIntl}.
 */
const FLAT_TO_GROUP: Readonly<Record<keyof SnIntlFlat, readonly [SnIntlGroupName, string]>> = {
  removeChip: ['chip', 'remove'],
  close: ['common', 'close'],
  next: ['common', 'next'],
  previous: ['common', 'previous'],
  loading: ['common', 'loading'],
  emptyMessage: ['common', 'emptyMessage'],
  dialogClose: ['dialog', 'close'],
  drawerClose: ['drawer', 'close'],
  selectPlaceholder: ['select', 'placeholder'],
  selectClear: ['select', 'clear'],
  listboxLabel: ['listbox', 'label'],
  showPassword: ['password', 'show'],
  hidePassword: ['password', 'hide'],
  passwordPlaceholder: ['password', 'placeholder'],
  passwordStrengthWeak: ['password', 'strengthWeak'],
  passwordStrengthFair: ['password', 'strengthFair'],
  passwordStrengthGood: ['password', 'strengthGood'],
  passwordStrengthStrong: ['password', 'strengthStrong'],
  addTag: ['inputTags', 'addTag'],
  panelExpand: ['panel', 'expand'],
  panelCollapse: ['panel', 'collapse'],
  splitterResize: ['splitter', 'resize'],
  messageClose: ['message', 'close'],
  toastClose: ['toast', 'close'],
  confirmAccept: ['confirm', 'accept'],
  confirmReject: ['confirm', 'reject'],
  breadcrumb: ['breadcrumb', 'label'],
  paginator: ['paginator', 'label'],
  paginatorFirst: ['paginator', 'first'],
  paginatorPrev: ['paginator', 'previous'],
  paginatorNext: ['paginator', 'next'],
  paginatorLast: ['paginator', 'last'],
  paginatorJump: ['paginator', 'jump'],
  paginatorRowsPerPage: ['paginator', 'rowsPerPage'],
  paginatorReport: ['paginator', 'report'],
  carouselLabel: ['carousel', 'label'],
  carouselPrev: ['carousel', 'previous'],
  carouselNext: ['carousel', 'next'],
  carouselSlide: ['carousel', 'slide'],
  carouselGoto: ['carousel', 'goto'],
  treeLabel: ['tree', 'label'],
  treeExpand: ['tree', 'expand'],
  treeCollapse: ['tree', 'collapse'],
  treeTableLabel: ['tree', 'tableLabel'],
  splitButtonMore: ['splitButton', 'more'],
  locale: ['datePicker', 'locale'],
  datePickerPlaceholder: ['datePicker', 'placeholder'],
  datePickerLabel: ['datePicker', 'label'],
  datePickerPrev: ['datePicker', 'previous'],
  datePickerNext: ['datePicker', 'next'],
  datePickerChooseMonth: ['datePicker', 'chooseMonth'],
  datePickerChooseYear: ['datePicker', 'chooseYear'],
  datePickerMonths: ['datePicker', 'months'],
  datePickerMonthsShort: ['datePicker', 'monthsShort'],
  datePickerWeekdaysShort: ['datePicker', 'weekdaysShort'],
  datePickerFirstDayOfWeek: ['datePicker', 'firstDayOfWeek'],
  colorPickerOpen: ['colorPicker', 'open'],
  colorArea: ['colorPicker', 'area'],
  colorAreaValueText: ['colorPicker', 'areaValueText'],
  colorSliderHue: ['colorPicker', 'sliderHue'],
  colorSliderAlpha: ['colorPicker', 'sliderAlpha'],
  colorSliderBrightness: ['colorPicker', 'sliderBrightness'],
  colorSliderSaturation: ['colorPicker', 'sliderSaturation'],
  colorEyeDropper: ['colorPicker', 'eyeDropper'],
  colorInputHex: ['colorPicker', 'inputHex'],
  colorInputRed: ['colorPicker', 'inputRed'],
  colorInputGreen: ['colorPicker', 'inputGreen'],
  colorInputBlue: ['colorPicker', 'inputBlue'],
};

/**
 * What {@link provideSnIntl} accepts: the nested per-component shape, the flat
 * keys, or a mix of both.
 *
 * `paginator` and `breadcrumb` are the two names that exist in both shapes: a
 * string is the flat label, an object is the group. They are told apart
 * by value, not by key.
 */
export type SnIntlOverrides = Partial<Omit<SnIntlFlat, 'paginator' | 'breadcrumb'>> &
  Partial<Omit<SnIntlGroupOverrides, 'paginator' | 'breadcrumb'>> & {
    paginator?: string | Partial<SnPaginatorIntl>;
    breadcrumb?: string | Partial<SnBreadcrumbIntl>;
  };

type Patches = Map<SnIntlGroupName, Record<string, unknown>>;

function isGroupName(key: string): key is SnIntlGroupName {
  return Object.prototype.hasOwnProperty.call(SN_INTL_GROUPS, key);
}

/** A nested group patch, as opposed to a flat value. Arrays are flat values. */
function isGroupPatch(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function put(patches: Patches, group: SnIntlGroupName, prop: string, value: unknown): void {
  const existing = patches.get(group);
  if (existing) existing[prop] = value;
  else patches.set(group, { [prop]: value });
}

function collect(overrides: SnIntlOverrides, into: Patches = new Map()): Patches {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;

    if (isGroupName(key) && isGroupPatch(value)) {
      for (const [prop, inner] of Object.entries(value)) {
        if (inner !== undefined) put(into, key, prop, inner);
      }
      continue;
    }

    const target = FLAT_TO_GROUP[key as keyof SnIntlFlat];
    if (target) {
      put(into, target[0], target[1], value);
      continue;
    }

    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.warn(`[Ashen UI] provideSnIntl: unknown key "${key}" ignored.`);
    }
  }
  return into;
}

function toProviders(patches: Patches): Provider[] {
  const groups: Record<SnIntlGroupName, new () => object> = SN_INTL_GROUPS;
  return [...patches].map(([group, props]) => ({
    provide: SN_INTL_GROUPS[group],
    // A fresh instance, so unset keys keep their English defaults.
    useValue: Object.assign(new groups[group](), props),
  }));
}

/**
 * Override component text.
 *
 * ```ts
 * provideSnIntl({
 *   paginator: { first: 'Trang đầu', last: 'Trang cuối' },
 *   confirm: { accept: 'Đồng ý', reject: 'Huỷ' },
 * })
 * ```
 *
 * Only the services you name are provided, and inside them only the keys you
 * set change; everything else keeps its English default.
 *
 * The flat shape (`{ paginatorFirst: '…' }`) is routed to the right service.
 * It is deprecated; prefer the nested shape.
 */
export function provideSnIntl(overrides: SnIntlOverrides): Provider[] {
  return toProviders(collect(overrides));
}

/**
 * Provide date-picker month and weekday names derived from
 * `Intl.DateTimeFormat` for a BCP-47 `locale`, so calendars are localised
 * without hand-writing the arrays. Non-derivable text (button labels,
 * placeholders, …) still needs translation: pass it via `overrides`, which may
 * use either the nested or the flat shape and wins over the derived values.
 *
 * Weekday names are generated Sunday-first to match the calendar grid layout.
 */
/**
 * The locale's first day of the week as `0` (Sunday) through `6` (Saturday).
 *
 * The two spellings are the same data at different stages of standardisation,
 * and both number Monday 1 through Sunday 7, so the modulo turns Sunday into 0.
 * Runtimes with neither fall back to Sunday rather than guessing.
 */
function localeFirstDayOfWeek(locale: string): number {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    return typeof firstDay === 'number' ? firstDay % 7 : 0;
  } catch {
    return 0;
  }
}

export function provideSnIntlLocale(
  locale: string,
  overrides: SnIntlOverrides = {},
): Provider[] {
  const longMonth = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
  const shortMonth = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
  const months: string[] = [];
  const monthsShort: string[] = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(Date.UTC(2021, m, 1));
    months.push(longMonth.format(d));
    monthsShort.push(shortMonth.format(d));
  }

  const shortWeekday = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const weekdaysShort: string[] = [];
  // 2021-08-01 (UTC) is a Sunday; iterate Sun…Sat to match the grid's week start.
  for (let d = 0; d < 7; d++) {
    weekdaysShort.push(shortWeekday.format(new Date(Date.UTC(2021, 7, 1 + d))));
  }

  // One patch, not two provideSnIntl() calls: a second call would build a fresh picker intl.
  const patches = collect({
    datePicker: {
      locale,
      months,
      monthsShort,
      weekdaysShort,
      firstDayOfWeek: localeFirstDayOfWeek(locale),
    },
  });
  collect(overrides, patches);
  return toProviders(patches);
}
