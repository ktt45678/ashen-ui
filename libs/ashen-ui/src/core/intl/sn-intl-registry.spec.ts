import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SN_INTL_GROUPS,
  SnCarouselIntl,
  SnCommonIntl,
  SnConfirmIntl,
  SnDatePickerIntl,
  SnIntl,
  SnPaginatorIntl,
  SnSelectIntl,
  provideSnIntl,
  provideSnIntlLocale,
  type SnIntlGroupName,
} from 'ashen-ui/core';

/**
 * The services that existed when `SnIntl` was split, and so the only ones the
 * deprecated flat shape can reach. Anything added later has no flat key by
 * design, which is why this list is closed rather than derived.
 */
const PRE_SPLIT_GROUPS = [
  'common', 'select', 'listbox', 'password', 'inputTags', 'chip', 'dialog', 'drawer',
  'confirm', 'message', 'toast', 'breadcrumb', 'paginator', 'splitButton', 'panel',
  'splitter', 'tree', 'carousel', 'datePicker', 'colorPicker',
] as const satisfies readonly SnIntlGroupName[];

function configure(providers: unknown[]) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...(providers as never[])],
  });
}

describe('provideSnIntl: nested shape', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('overrides only the keys it names', () => {
    configure([provideSnIntl({ paginator: { first: 'Trang đầu', last: 'Trang cuối' } })]);
    const paginator = TestBed.inject(SnPaginatorIntl);
    expect(paginator.first).toBe('Trang đầu');
    expect(paginator.last).toBe('Trang cuối');
    // Untouched keys keep their English defaults.
    expect(paginator.next).toBe('Next page');
    expect(paginator.label).toBe('Pagination');
  });

  it('leaves the services it does not name untouched', () => {
    // This is the whole point of the split: translating the paginator must not
    // require instantiating carousel, tree and colour-picker strings too.
    configure([provideSnIntl({ paginator: { first: 'Trang đầu' } })]);
    expect(TestBed.inject(SnCarouselIntl).label).toBe('Carousel');
    expect(TestBed.inject(SnCommonIntl).close).toBe('Close');
  });

  it('overrides a method as well as a field', () => {
    configure([
      provideSnIntl({ carousel: { slide: (i, t) => `Diapositive ${i} sur ${t}` } }),
    ]);
    expect(TestBed.inject(SnCarouselIntl).slide(2, 5)).toBe('Diapositive 2 sur 5');
    // The un-overridden method still works: assigning an own property shadows
    // the prototype method rather than replacing the object.
    expect(TestBed.inject(SnCarouselIntl).goto(3)).toBe('Go to slide 3');
  });

  it('accepts several groups in one call', () => {
    configure([
      provideSnIntl({
        confirm: { accept: 'Đồng ý', reject: 'Huỷ' },
        select: { placeholder: 'Chọn…' },
      }),
    ]);
    expect(TestBed.inject(SnConfirmIntl).accept).toBe('Đồng ý');
    expect(TestBed.inject(SnSelectIntl).placeholder).toBe('Chọn…');
  });
});

describe('provideSnIntl: the deprecated flat shape', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('routes flat keys to the service that now owns them', () => {
    configure([provideSnIntl({ paginatorFirst: 'Trang đầu', close: 'Đóng' })]);
    expect(TestBed.inject(SnPaginatorIntl).first).toBe('Trang đầu');
    expect(TestBed.inject(SnCommonIntl).close).toBe('Đóng');
  });

  it('routes every flat key somewhere', () => {
    // A key with no home would be silently dropped, so assert the whole map at
    // once rather than one representative key.
    const flat = {
      removeChip: (l: string) => `x${l}`,
      close: 'a', dialogClose: 'b', drawerClose: 'c', next: 'd', previous: 'e',
      selectPlaceholder: 'f', emptyMessage: 'g', showPassword: 'h', hidePassword: 'i',
      passwordPlaceholder: 'j', passwordStrengthWeak: 'k', passwordStrengthFair: 'l',
      passwordStrengthGood: 'm', passwordStrengthStrong: 'n', addTag: 'o',
      panelExpand: 'p', panelCollapse: 'q', splitterResize: 'r', messageClose: 's',
      toastClose: 't', confirmAccept: 'u', confirmReject: 'v', breadcrumb: 'w',
      paginator: 'x', paginatorFirst: 'y', paginatorPrev: 'z', paginatorNext: 'A',
      paginatorLast: 'B', paginatorJump: 'C', paginatorRowsPerPage: 'D',
      paginatorReport: () => 'E', loading: 'F',
      carouselLabel: 'F', carouselPrev: 'G', carouselNext: 'H',
      carouselSlide: () => 'I', carouselGoto: () => 'J',
      treeLabel: 'K', treeExpand: 'L', treeCollapse: 'M', treeTableLabel: 'N',
      splitButtonMore: 'O', listboxLabel: 'P', locale: 'vi-VN',
      datePickerPlaceholder: 'Q', datePickerLabel: 'R', datePickerPrev: 'S',
      datePickerNext: 'T', datePickerChooseMonth: 'U', datePickerChooseYear: 'V',
      datePickerMonths: ['W'], datePickerMonthsShort: ['X'], datePickerWeekdaysShort: ['Y'],
      colorPickerOpen: 'Z', colorArea: '1', colorAreaValueText: () => '2',
      colorSliderHue: '3', colorSliderAlpha: '4', colorSliderBrightness: '5',
      colorSliderSaturation: '6', colorEyeDropper: '7', colorInputHex: '8',
      colorInputRed: '9', colorInputGreen: '10', colorInputBlue: '11',
    };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const providers = provideSnIntl(flat);
      const provided = new Set(providers.map((p) => (p as { provide: unknown }).provide));

      // One provider per service, and every service is reached. A key
      // with no home warns instead of routing, so both halves are asserted.
      expect(provided).toEqual(new Set(PRE_SPLIT_GROUPS.map((g) => SN_INTL_GROUPS[g])));
      expect(provided.size).toBe(providers.length);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it('warns in dev about a key that belongs to nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      provideSnIntl({ nonsense: 'x' } as never);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('nonsense'));
    } finally {
      warn.mockRestore();
    }
  });

  it('tells the flat `paginator` label from the nested `paginator` group by value', () => {
    // A string is a flat label, an object is a group.
    configure([provideSnIntl({ paginator: 'Phân trang' })]);
    expect(TestBed.inject(SnPaginatorIntl).label).toBe('Phân trang');

    configure([provideSnIntl({ paginator: { label: 'Phân trang' } })]);
    expect(TestBed.inject(SnPaginatorIntl).label).toBe('Phân trang');
  });

  it('merges flat and nested keys aimed at the same service', () => {
    configure([provideSnIntl({ paginatorFirst: 'A', paginator: { last: 'B' } })]);
    const paginator = TestBed.inject(SnPaginatorIntl);
    expect(paginator.first).toBe('A');
    expect(paginator.last).toBe('B');
  });
});

describe('provideSnIntlLocale', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('derives month and weekday names', () => {
    configure([provideSnIntlLocale('fr-FR')]);
    const picker = TestBed.inject(SnDatePickerIntl);
    expect(picker.locale).toBe('fr-FR');
    expect(picker.months[0]).toBe('janvier');
    expect(picker.months).toHaveLength(12);
    expect(picker.weekdaysShort).toHaveLength(7);
    expect(picker.weekdaysShort[0].toLowerCase()).toContain('dim');
  });

  it('keeps the derived names when overrides also touch the date picker', () => {
    // Two separate providers would build a second SnDatePickerIntl and lose the localised months.
    configure([provideSnIntlLocale('de-DE', { datePickerPlaceholder: 'Datum wählen' })]);
    const picker = TestBed.inject(SnDatePickerIntl);
    expect(picker.months[0]).toBe('Januar');
    expect(picker.placeholder).toBe('Datum wählen');

    configure([provideSnIntlLocale('de-DE', { datePicker: { placeholder: 'Datum wählen' } })]);
    const nested = TestBed.inject(SnDatePickerIntl);
    expect(nested.months[0]).toBe('Januar');
    expect(nested.placeholder).toBe('Datum wählen');
  });
});

describe('the deprecated SnIntl facade', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('still reads through to whichever service now owns each key', () => {
    configure([
      provideSnIntl({
        paginator: { first: 'Trang đầu' },
        common: { close: 'Đóng' },
        carousel: { slide: (i, t) => `${i}/${t}` },
      }),
    ]);
    const intl = TestBed.inject(SnIntl);
    expect(intl.paginatorFirst).toBe('Trang đầu');
    expect(intl.close).toBe('Đóng');
    expect(intl.carouselSlide(1, 4)).toBe('1/4');
    // Untouched keys still answer with the English default.
    expect(intl.treeLabel).toBe('Tree');
  });

  it('exposes every flat key, so nothing was lost in the split', () => {
    configure([]);
    const intl = TestBed.inject(SnIntl) as unknown as Record<string, unknown>;
    const missing = FLAT_KEYS.filter((key) => intl[key] === undefined);
    expect(missing).toEqual([]);
  });
});

/**
 * Every flat `SnIntl` key except `locale`, which is
 * legitimately `undefined` until a locale is provided.
 */
const FLAT_KEYS = [
  'removeChip', 'close', 'dialogClose', 'drawerClose', 'next', 'previous',
  'selectPlaceholder', 'emptyMessage', 'showPassword', 'hidePassword',
  'passwordPlaceholder', 'passwordStrengthWeak', 'passwordStrengthFair',
  'passwordStrengthGood', 'passwordStrengthStrong', 'addTag', 'panelExpand',
  'panelCollapse', 'splitterResize', 'messageClose', 'toastClose',
  'confirmAccept', 'confirmReject', 'breadcrumb', 'paginator', 'paginatorFirst',
  'paginatorPrev', 'paginatorNext', 'paginatorLast', 'paginatorJump',
  'paginatorRowsPerPage', 'paginatorReport', 'loading', 'carouselLabel', 'carouselPrev',
  'carouselNext', 'carouselSlide', 'carouselGoto', 'treeLabel', 'treeExpand',
  'treeCollapse', 'treeTableLabel', 'splitButtonMore', 'listboxLabel',
  'datePickerPlaceholder', 'datePickerLabel', 'datePickerPrev', 'datePickerNext',
  'datePickerChooseMonth', 'datePickerChooseYear', 'datePickerMonths',
  'datePickerMonthsShort', 'datePickerWeekdaysShort', 'colorPickerOpen',
  'colorArea', 'colorAreaValueText', 'colorSliderHue', 'colorSliderAlpha',
  'colorSliderBrightness', 'colorSliderSaturation', 'colorEyeDropper',
  'colorInputHex', 'colorInputRed', 'colorInputGreen', 'colorInputBlue',
];

describe('SN_INTL_GROUPS', () => {
  it('names every service exactly once', () => {
    const names = Object.keys(SN_INTL_GROUPS) as SnIntlGroupName[];
    const classes = names.map((n) => SN_INTL_GROUPS[n]);
    expect(new Set(classes).size).toBe(classes.length);
  });
});

afterEach(() => TestBed.resetTestingModule());
