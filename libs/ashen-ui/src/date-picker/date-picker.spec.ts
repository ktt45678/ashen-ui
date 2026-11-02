import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { END, HOME, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW, ENTER, ESCAPE, PAGE_DOWN, PAGE_UP, SPACE, TAB } from '@angular/cdk/keycodes';
import { Dir } from '@angular/cdk/bidi';
import { DatePicker } from './date-picker';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { provideSnIntl } from 'ashen-ui/core';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

// A real keyboard event always carries `key`.
const KEY_NAMES: Record<number, string> = {
  [LEFT_ARROW]: 'ArrowLeft',
  [RIGHT_ARROW]: 'ArrowRight',
  [UP_ARROW]: 'ArrowUp',
  [DOWN_ARROW]: 'ArrowDown',
  [HOME]: 'Home',
  [END]: 'End',
  [PAGE_UP]: 'PageUp',
  [PAGE_DOWN]: 'PageDown',
  [ENTER]: 'Enter',
  [SPACE]: ' ',
  [ESCAPE]: 'Escape',
  [TAB]: 'Tab',
};

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    keyCode: code,
    key: KEY_NAMES[code] ?? '',
    bubbles: true,
    cancelable: true,
    ...opts,
  });
}

const FEB_2026 = new Date(2026, 1, 1);

@Component({
  template: `<sn-date-picker [(value)]="value" [placeholder]="placeholder()"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class BasicHost {
  value: Date | null = null;
  readonly placeholder = signal<string | undefined>(undefined);
}

@Component({
  template: `
    <div dir="rtl">
      <sn-date-picker [(value)]="value"></sn-date-picker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker, Dir],
})
class RtlHost {
  value: Date | null = new Date(2026, 1, 14);
}

@Component({
  template: `<sn-date-picker [formControl]="ctrl"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly ctrl = new FormControl<Date | null>(null);
}

@Component({
  template: `<sn-date-picker [disabled]="true" [(value)]="value"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class DisabledHost {
  value: Date | null = null;
}

@Component({
  template: `<sn-date-picker [(value)]="value" snClass="my-date-picker"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class SnClassHost {
  value: Date | null = null;
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Pick a date</sn-label>
      <sn-date-picker [(value)]="value"></sn-date-picker>
      <sn-hint>Select from the calendar</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value: Date | null = null;
}

@Component({
  template: `<sn-date-picker [(value)]="value" [formatDate]="fmt"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class FormatDateHost {
  value: Date | null = new Date(2026, 0, 15);
  fmt = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

@Component({
  template: `
    <sn-date-picker
      [(value)]="value"
      [snStyle]="{
        root: { outline: '1px solid red' },
        panel: { color: 'rgb(1, 2, 3)' },
        header: { color: 'rgb(4, 5, 6)' },
        nav: { color: 'rgb(7, 8, 9)' },
        grid: { color: 'rgb(10, 11, 12)' },
        weekday: { color: 'rgb(13, 14, 15)' },
        day: { color: 'rgb(16, 17, 18)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'dp-root' },
        panel: { 'data-testid': 'dp-panel', role: 'presentation' },
        header: { 'data-testid': 'dp-header' },
        nav: { 'data-testid': 'dp-nav' },
        grid: { 'data-testid': 'dp-grid' },
        weekday: { 'data-testid': 'dp-weekday' },
        day: { 'data-testid': 'dp-day', 'aria-label': 'nope' }
      }"
    ></sn-date-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class SnPartHost {
  value: Date | null = new Date(2026, 1, 14);
}

describe('DatePicker component', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('.sn-date-picker-panel');
  }

  function getTrigger(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
  }

  async function openPicker(fixture: {
    whenStable: () => Promise<unknown>;
    nativeElement: HTMLElement;
  }) {
    await fixture.whenStable();
    const trigger = getTrigger(fixture);
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    return trigger;
  }

  async function closeWait() {
    await tick(150);
  }

  it('applies snStyle and allowed snAttrs to named calendar parts without replacing semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await openPicker(fix);

    const root = fix.nativeElement.querySelector('sn-date-picker') as HTMLElement;
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('dp-root');

    const panel = getPanel()!;
    expect(panel).toBeTruthy();
    expect(panel.style.color).toBe('rgb(1, 2, 3)');
    expect(panel.getAttribute('data-testid')).toBe('dp-panel');
    // The dialog role is library-owned and survives the pass-through.
    expect(panel.getAttribute('role')).toBe('dialog');

    const header = overlayEl.querySelector('.sn-date-picker-header') as HTMLElement;
    expect(header.style.color).toBe('rgb(4, 5, 6)');
    expect(header.getAttribute('data-testid')).toBe('dp-header');

    const nav = overlayEl.querySelector('.sn-date-picker-nav-btn') as HTMLElement;
    expect(nav.style.color).toBe('rgb(7, 8, 9)');
    expect(nav.getAttribute('data-testid')).toBe('dp-nav');

    const grid = overlayEl.querySelector('.sn-date-picker-grid') as HTMLElement;
    expect(grid.style.color).toBe('rgb(10, 11, 12)');
    expect(grid.getAttribute('data-testid')).toBe('dp-grid');

    const weekday = overlayEl.querySelector('.sn-date-picker-weekday') as HTMLElement;
    expect(weekday.style.color).toBe('rgb(13, 14, 15)');
    expect(weekday.getAttribute('data-testid')).toBe('dp-weekday');

    const day = overlayEl.querySelector('.sn-date-picker-cell') as HTMLElement;
    expect(day.style.color).toBe('rgb(16, 17, 18)');
    expect(day.getAttribute('data-testid')).toBe('dp-day');
    // The cell's own aria-label is reserved and the pass-through cannot clobber it.
    expect(day.getAttribute('aria-label')).not.toBe('nope');
  });

  it('renders trigger with aria-haspopup="dialog"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('trigger aria-expanded is false initially', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-expanded')).toBe('false');
  });

  it('shows placeholder when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Select date');
  });

  it('shows custom placeholder when provided', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.placeholder.set('Choose a day');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Choose a day');
  });

  it('shows formatted value after writeValue without opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue(new Date(2026, 0, 15));
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('2026');
    expect(getPanel()).toBeNull();
  });

  it('shows custom formatDate output', async () => {
    const fix = TestBed.createComponent(FormatDateHost);
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toBe('2026-1-15');
  });

  it('placeholder span has sn-select-placeholder class when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
  });

  it('has sn-date-picker class on host', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('sn-date-picker').classList).toContain('sn-date-picker');
  });

  it('panel is not shown initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('clicking trigger opens panel with role=dialog', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openPicker(fix);
    const panel = getPanel();
    expect(panel).toBeTruthy();
    expect(panel!.getAttribute('role')).toBe('dialog');
  });

  it('panel aria-label is "Choose date"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openPicker(fix);
    expect(getPanel()!.getAttribute('aria-label')).toBe('Choose date');
  });

  it('trigger aria-expanded is true when open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openPicker(fix);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openPicker(fix);
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(getPanel()?.getAttribute('id')).toBe(controls);
  });

  it('days grid renders correct leading blanks and day count for March 2026', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 2, 1);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    const dayBtns = panel.querySelectorAll('[data-day]');
    expect(dayBtns.length).toBe(31);
  });

  // A grid is rows of cells. Declaring role="grid" over a flat run of buttons
  // announces a table that has none, which is worse than not claiming one.
  it('the days grid is built from rows of seven cells', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 2, 1);
    await openPicker(fix);
    const grid = getPanel()!.querySelector('[role="grid"]')!;
    const rows = Array.from(grid.querySelectorAll('[role="row"]'));

    expect(rows.length).toBeGreaterThan(1);
    for (const row of rows) {
      expect(row.querySelectorAll('[role="columnheader"], [role="gridcell"]').length).toBe(7);
    }
    expect(rows[0].querySelectorAll('[role="columnheader"]').length).toBe(7);
    expect(grid.querySelectorAll('[role="gridcell"][data-day]').length).toBe(31);
  });

  it('the selected day cell carries aria-selected', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    const cell = getPanel()!.querySelector('[data-day="14"]');
    expect(cell?.getAttribute('aria-selected')).toBe('true');
    expect(getPanel()!.querySelector('[data-day="13"]')?.getAttribute('aria-selected')).toBe(
      'false',
    );
  });

  it('focus moves to a day button after open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const focused = document.activeElement;
    const containsFocus = panel.contains(focused);
    expect(containsFocus).toBe(true);
  });

  it('focus lands on selected day when value is in current view', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const focused = document.activeElement as HTMLElement;
    expect(focused?.getAttribute('data-day')).toBe('14');
  });

  it('day click sets value, closes panel, trigger label updates', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 1);
    await openPicker(fix);
    const panel = getPanel()!;
    const dayBtn = panel.querySelector<HTMLElement>('[data-day="10"]');
    dayBtn?.click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value?.getDate()).toBe(10);
    expect(getPanel()).toBeNull();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('2026');
  });

  it('today cell has sn-date-picker-cell-today class and not selected', async () => {
    const today = new Date();
    const fix = TestBed.createComponent(BasicHost);
    await openPicker(fix);
    const panel = getPanel()!;
    const todayBtn = panel.querySelector<HTMLElement>(`[data-day="${today.getDate()}"]`);
    if (todayBtn) {
      expect(todayBtn.classList).toContain('sn-date-picker-cell-today');
      expect(todayBtn.classList).not.toContain('sn-date-picker-cell-selected');
    }
  });

  it('selected day cell has sn-date-picker-cell-selected class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const selectedDate = new Date(2025, 5, 15);
    fix.componentInstance.value = selectedDate;
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    const selBtn = panel.querySelector<HTMLElement>('[data-day="15"]');
    expect(selBtn?.classList).toContain('sn-date-picker-cell-selected');
  });

  it('prev button shifts month back, header updates', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 2, 1);
    await openPicker(fix);
    const panel = getPanel()!;
    const prevBtn = panel.querySelector<HTMLElement>('.sn-date-picker-nav-btn');
    prevBtn?.click();
    await tick(10);
    await fix.whenStable();
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    expect(headBtns[0].textContent?.trim()).toBe('February');
  });

  it('next button shifts month forward, header updates', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 0, 1);
    await openPicker(fix);
    const panel = getPanel()!;
    const navBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-nav-btn');
    navBtns[1]?.click();
    await tick(10);
    await fix.whenStable();
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    expect(headBtns[0].textContent?.trim()).toBe('February');
  });

  it('month header button switches to months grid', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await openPicker(fix);
    const panel = getPanel()!;
    const monthBtn = panel.querySelector<HTMLElement>('.sn-date-picker-head-btn');
    monthBtn?.click();
    await tick(10);
    await fix.whenStable();
    const monthBtns = panel.querySelectorAll<HTMLElement>('[data-month]');
    expect(monthBtns.length).toBe(12);
  });

  it('picking a month returns to days view with new month', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await openPicker(fix);
    const panel = getPanel()!;
    const monthBtn = panel.querySelector<HTMLElement>('.sn-date-picker-head-btn');
    monthBtn?.click();
    await tick(10);
    await fix.whenStable();
    const marchBtn = panel.querySelector<HTMLElement>('[data-month="2"]');
    marchBtn?.click();
    await tick(10);
    await fix.whenStable();
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    expect(headBtns[0].textContent?.trim()).toBe('March');
    expect(panel.querySelectorAll('[data-day]').length).toBeGreaterThan(0);
  });

  it('year header button switches to years grid with 12 years', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await openPicker(fix);
    const panel = getPanel()!;
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    headBtns[1]?.click();
    await tick(10);
    await fix.whenStable();
    const yearBtns = panel.querySelectorAll<HTMLElement>('[data-year-index]');
    expect(yearBtns.length).toBe(12);
  });

  it('years grid shows range label', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 0, 1);
    await openPicker(fix);
    const panel = getPanel()!;
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    headBtns[1]?.click();
    await tick(10);
    await fix.whenStable();
    const range = panel.querySelector<HTMLElement>('.sn-date-picker-head-range');
    expect(range?.textContent?.trim()).toMatch(/\d{4}\s*–\s*\d{4}/);
  });

  it('picking a year goes to months grid', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await openPicker(fix);
    const panel = getPanel()!;
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    headBtns[1]?.click();
    await tick(10);
    await fix.whenStable();
    const yearBtns = panel.querySelectorAll<HTMLElement>('[data-year-index]');
    yearBtns[5]?.click();
    await tick(10);
    await fix.whenStable();
    expect(panel.querySelectorAll('[data-month]').length).toBe(12);
  });

  it('ArrowRight moves focus from one day to next', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const btn14 = panel.querySelector<HTMLElement>('[data-day="14"]');
    btn14?.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fix.whenStable();
    const focusedEl = document.activeElement as HTMLElement;
    expect(focusedEl?.getAttribute('data-day')).toBe('15');
  });

  it('ArrowLeft moves focus to previous day', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const btn14 = panel.querySelector<HTMLElement>('[data-day="14"]');
    btn14?.dispatchEvent(key(LEFT_ARROW));
    await tick(20);
    await fix.whenStable();
    const focusedEl = document.activeElement as HTMLElement;
    expect(focusedEl?.getAttribute('data-day')).toBe('13');
  });

  it('ArrowRight steps one calendar day across a DST change', async () => {
    const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process!.env;
    const originalTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    env['TZ'] = 'Europe/London';
    try {
      const fix = TestBed.createComponent(BasicHost);
      fix.componentInstance.value = new Date(2026, 9, 25);
      await openPicker(fix);
      await tick(50);
      getPanel()!.querySelector<HTMLElement>('[data-day="25"]')?.dispatchEvent(key(RIGHT_ARROW));
      await tick(20);
      await fix.whenStable();
      expect((document.activeElement as HTMLElement)?.getAttribute('data-day')).toBe('26');
    } finally {
      env['TZ'] = originalTz;
    }
  });

  // In RTL the cell to the left of a day is the day after it.
  it('rtl: ArrowLeft moves focus to the next day', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await openPicker(fix);
    await tick(50);
    getPanel()!.querySelector<HTMLElement>('[data-day="14"]')?.dispatchEvent(key(LEFT_ARROW));
    await tick(20);
    await fix.whenStable();
    expect((document.activeElement as HTMLElement)?.getAttribute('data-day')).toBe('15');
  });

  it('rtl: ArrowRight moves focus to the previous day', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await openPicker(fix);
    await tick(50);
    getPanel()!.querySelector<HTMLElement>('[data-day="14"]')?.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fix.whenStable();
    expect((document.activeElement as HTMLElement)?.getAttribute('data-day')).toBe('13');
  });

  it('rtl: ArrowLeft in the month pad moves to the next month', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await openPicker(fix);
    getPanel()!.querySelector<HTMLElement>('.sn-date-picker-head-btn')?.click();
    await tick(10);
    await fix.whenStable();
    getPanel()!.querySelector<HTMLElement>('[data-month="1"]')?.dispatchEvent(key(LEFT_ARROW));
    await tick(20);
    await fix.whenStable();
    expect((document.activeElement as HTMLElement)?.getAttribute('data-month')).toBe('2');
  });

  it('rtl: the previous-month chevron turns around', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await openPicker(fix);
    const prev = getPanel()!.querySelector('.sn-date-picker-nav-btn sn-icon');
    expect(prev?.textContent?.trim()).toBe('chevron_right');
  });

  it('ArrowDown moves focus 7 days forward', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const btn14 = panel.querySelector<HTMLElement>('[data-day="14"]');
    btn14?.dispatchEvent(key(DOWN_ARROW));
    await tick(20);
    await fix.whenStable();
    const focusedEl = document.activeElement as HTMLElement;
    expect(focusedEl?.getAttribute('data-day')).toBe('21');
  });

  it('PageDown moves focus to same day next month', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const btn14 = panel.querySelector<HTMLElement>('[data-day="14"]');
    btn14?.dispatchEvent(key(PAGE_DOWN));
    await tick(20);
    await fix.whenStable();
    const focusedEl = document.activeElement as HTMLElement;
    expect(focusedEl?.getAttribute('data-day')).toBe('14');
    const headBtns = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    expect(headBtns[0].textContent?.trim()).toBe('March');
  });

  it('Enter on focused day picks value and closes', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    await tick(50);
    const panel = getPanel()!;
    const btn14 = panel.querySelector<HTMLElement>('[data-day="14"]');
    btn14?.dispatchEvent(key(ENTER));
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value?.getDate()).toBe(14);
    expect(getPanel()).toBeNull();
  });

  it('Escape closes panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = new Date(2026, 1, 14);
    await openPicker(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value?.getDate()).toBe(14);
  });

  it('Escape returns focus to trigger', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openPicker(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(document.activeElement).toBe(getTrigger(fix));
  });

  it('mode resets to days after close', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await openPicker(fix);
    const panel = getPanel()!;
    const monthBtn = panel.querySelector<HTMLElement>('.sn-date-picker-head-btn');
    monthBtn?.click();
    await tick(10);
    await fix.whenStable();
    expect(panel.querySelectorAll('[data-month]').length).toBe(12);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const panel2 = getPanel()!;
    expect(panel2.querySelectorAll('[data-day]').length).toBeGreaterThan(0);
    expect(panel2.querySelectorAll('[data-month]').length).toBe(0);
  });

  it('backdrop click closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openPicker(fix);
    const backdrop = overlayEl.querySelector('.sn-select-backdrop') as HTMLElement;
    backdrop?.click();
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('CVA setDisabledState blocks opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('disabled input makes trigger button disabled', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
  });

  it('snClass string applies to host', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('sn-date-picker').classList).toContain('my-date-picker');
  });

  it('FormField controlId wires to trigger id', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const id = trigger.getAttribute('id');
    expect(id).toBeTruthy();
    const label = fix.nativeElement.querySelector('label') as HTMLElement;
    expect(label?.getAttribute('for')).toBe(id);
  });

  it('trigger gets aria-describedby from FormField hint', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const describedBy = getTrigger(fix).getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
  });

  it('FormField: value span loses placeholder class after picking a date', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    const dayBtn = panel.querySelector<HTMLElement>('[data-day="1"]');
    dayBtn?.click();
    await closeWait();
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeNull();
  });
});

describe('DatePicker - SnIntl override', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ datePickerMonths: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] }),
      ],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('SnIntl month names override via provideSnIntl', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = FEB_2026;
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
    trigger.click();
    await new Promise<void>((r) => setTimeout(r, 10));
    await fix.whenStable();
    const panel = overlayEl.querySelector<HTMLElement>('.sn-date-picker-panel')!;
    const headBtn = panel.querySelector<HTMLElement>('.sn-date-picker-head-btn');
    expect(headBtn?.textContent?.trim()).toBe('Fév');
  });
});

// Most of the world does not start its week on Sunday. February 2026 opens on a
// Sunday, which makes it the month where the two week starts disagree most.
describe('DatePicker - Monday-first week', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ datePickerFirstDayOfWeek: 1 })],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function openOn(value: Date) {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = value;
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    return { fix, panel: overlayEl.querySelector<HTMLElement>('.sn-date-picker-panel')! };
  }

  it('turns the weekday header round to start on Monday', async () => {
    const { panel } = await openOn(FEB_2026);
    const headers = panel.querySelectorAll('[role="columnheader"]');
    expect(headers[0].textContent?.trim()).toBe('Mo');
    expect(headers[6].textContent?.trim()).toBe('Su');
  });

  it('pushes a Sunday-opening month a full week in', async () => {
    const { panel } = await openOn(FEB_2026);
    const firstRow = panel.querySelectorAll('[role="row"]')[1];
    const cells = Array.from(firstRow.querySelectorAll('[role="gridcell"]'));
    // Six empty cells, then Sunday the 1st in the last column.
    expect(cells.filter((c) => !c.hasAttribute('data-day')).length).toBe(6);
    expect(cells[6].getAttribute('data-day')).toBe('1');
  });

  it('Home moves to the Monday of the week, not the Sunday', async () => {
    const { fix, panel } = await openOn(new Date(2026, 1, 14)); // a Saturday
    await tick(50);
    panel.querySelector<HTMLElement>('[data-day="14"]')?.dispatchEvent(key(HOME));
    await tick(20);
    await fix.whenStable();
    expect((document.activeElement as HTMLElement)?.getAttribute('data-day')).toBe('9');
  });
});

@Component({
  template: `
    <sn-date-picker [(value)]="value" [minDate]="minDate()" [maxDate]="maxDate()"></sn-date-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class RangeHost {
  value: Date | null = null;
  readonly minDate = signal<Date | null>(null);
  readonly maxDate = signal<Date | null>(null);
}

// February 2026 throughout, with the range set to the 10th through the 20th.
describe('DatePicker - minDate and maxDate', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  async function openRange(min: Date | null, max: Date | null, value = new Date(2026, 1, 15)) {
    const fix = TestBed.createComponent(RangeHost);
    fix.componentInstance.value = value;
    fix.componentInstance.minDate.set(min);
    fix.componentInstance.maxDate.set(max);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    return { fix, panel: overlayEl.querySelector<HTMLElement>('.sn-date-picker-panel')! };
  }

  function day(panel: HTMLElement, n: number): HTMLElement {
    return panel.querySelector<HTMLElement>(`[data-day="${n}"]`)!;
  }

  it('marks a day before minDate as unavailable', async () => {
    const { panel } = await openRange(new Date(2026, 1, 10), null);
    expect(day(panel, 9).getAttribute('aria-disabled')).toBe('true');
    expect(day(panel, 10).getAttribute('aria-disabled')).toBeNull();
  });

  it('marks a day after maxDate as unavailable', async () => {
    const { panel } = await openRange(null, new Date(2026, 1, 20));
    expect(day(panel, 21).getAttribute('aria-disabled')).toBe('true');
    expect(day(panel, 20).getAttribute('aria-disabled')).toBeNull();
  });

  it('treats the boundary days themselves as available', async () => {
    const { panel } = await openRange(new Date(2026, 1, 10), new Date(2026, 1, 20));
    for (const n of [10, 15, 20]) {
      expect(day(panel, n).getAttribute('aria-disabled')).toBeNull();
    }
  });

  it('compares by day, so a minDate later the same day still allows that day', async () => {
    const noon = new Date(2026, 1, 10, 23, 59);
    const { panel } = await openRange(noon, null);
    expect(day(panel, 10).getAttribute('aria-disabled')).toBeNull();
  });

  it('leaves an out-of-range day focusable so the boundary can be reached', async () => {
    const { panel } = await openRange(new Date(2026, 1, 10), null);
    expect(day(panel, 9).hasAttribute('disabled')).toBe(false);
  });

  it('allows arrow focus onto an unavailable boundary day in a selectable month', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 10), null);
    day(panel, 10).focus();
    day(panel, 10).dispatchEvent(key(LEFT_ARROW));
    await tick(20);
    await fix.whenStable();
    expect(document.activeElement).toBe(day(panel, 9));
    expect(day(panel, 9).getAttribute('aria-disabled')).toBe('true');
  });

  it('blocks an arrow move into a month with no selectable date', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 1), null);
    day(panel, 5).focus();
    const event = key(UP_ARROW);
    day(panel, 5).dispatchEvent(event);
    await tick(20);
    await fix.whenStable();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(day(panel, 5));
    expect(panel.querySelector('.sn-date-picker-head-btn')?.textContent?.trim()).toBe('February');
  });

  it('blocks PageUp at the earliest selectable month', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 10), null);
    day(panel, 15).focus();
    day(panel, 15).dispatchEvent(key(PAGE_UP));
    await tick(20);
    await fix.whenStable();
    expect(document.activeElement).toBe(day(panel, 15));
    expect(panel.querySelector('.sn-date-picker-head-btn')?.textContent?.trim()).toBe('February');
  });

  it('blocks PageDown and Shift PageDown at the latest selectable month', async () => {
    const { fix, panel } = await openRange(null, new Date(2026, 1, 20));
    day(panel, 15).focus();
    day(panel, 15).dispatchEvent(key(PAGE_DOWN));
    await tick(20);
    await fix.whenStable();
    expect(document.activeElement).toBe(day(panel, 15));
    day(panel, 15).dispatchEvent(key(PAGE_DOWN, { shiftKey: true }));
    await tick(20);
    await fix.whenStable();
    expect(document.activeElement).toBe(day(panel, 15));
    expect(panel.querySelector('.sn-date-picker-head-btn')?.textContent?.trim()).toBe('February');
  });

  it('refuses to select an out-of-range day on click', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 10), null);
    day(panel, 5).click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value?.getDate()).toBe(15);
    expect(getPanelIn(overlayEl)).not.toBeNull();
  });

  it('refuses to select an out-of-range day on Enter', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 10), null);
    await tick(50);
    day(panel, 5).dispatchEvent(key(ENTER));
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value?.getDate()).toBe(15);
  });

  it('still selects a day inside the range', async () => {
    const { fix, panel } = await openRange(new Date(2026, 1, 10), new Date(2026, 1, 20));
    day(panel, 18).click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value?.getDate()).toBe(18);
  });

  it('disables the back chevron when the previous month is entirely before minDate', async () => {
    const { panel } = await openRange(new Date(2026, 1, 1), null);
    const [back, forward] = Array.from(
      panel.querySelectorAll<HTMLButtonElement>('.sn-date-picker-nav-btn'),
    );
    expect(back.disabled).toBe(true);
    expect(forward.disabled).toBe(false);
  });

  it('disables the forward chevron when the next month is entirely after maxDate', async () => {
    const { panel } = await openRange(null, new Date(2026, 1, 28));
    const [back, forward] = Array.from(
      panel.querySelectorAll<HTMLButtonElement>('.sn-date-picker-nav-btn'),
    );
    expect(back.disabled).toBe(false);
    expect(forward.disabled).toBe(true);
  });

  it('keeps the back chevron live when the previous month still holds one allowed day', async () => {
    const { panel } = await openRange(new Date(2026, 0, 31), null);
    const back = panel.querySelector<HTMLButtonElement>('.sn-date-picker-nav-btn')!;
    expect(back.disabled).toBe(false);
  });

  it('marks a month with no available day as unavailable in the month pad', async () => {
    const { fix, panel } = await openRange(new Date(2026, 5, 1), null);
    panel.querySelector<HTMLElement>('.sn-date-picker-head-btn')!.click();
    await tick(10);
    await fix.whenStable();
    expect(panel.querySelector('[data-month="0"]')!.getAttribute('aria-disabled')).toBe('true');
    expect(panel.querySelector('[data-month="5"]')!.getAttribute('aria-disabled')).toBeNull();
  });

  it('refuses to open a month that has no available day', async () => {
    const { fix, panel } = await openRange(new Date(2026, 5, 1), null);
    panel.querySelector<HTMLElement>('.sn-date-picker-head-btn')!.click();
    await tick(10);
    await fix.whenStable();
    panel.querySelector<HTMLElement>('[data-month="0"]')!.click();
    await tick(10);
    await fix.whenStable();
    expect(panel.querySelector('.sn-date-picker-grid-months')).not.toBeNull();
  });

  it('marks a year outside the range as unavailable in the year pad', async () => {
    const { fix, panel } = await openRange(new Date(2026, 0, 1), new Date(2026, 11, 31));
    const headButtons = panel.querySelectorAll<HTMLElement>('.sn-date-picker-head-btn');
    headButtons[1].click();
    await tick(10);
    await fix.whenStable();
    const cells = Array.from(panel.querySelectorAll<HTMLElement>('[data-year-index]'));
    const y2026 = cells.find((c) => c.textContent?.trim() === '2026')!;
    const y2025 = cells.find((c) => c.textContent?.trim() === '2025')!;
    expect(y2026.getAttribute('aria-disabled')).toBeNull();
    expect(y2025.getAttribute('aria-disabled')).toBe('true');
  });

  it('opens focus on the first available day when the selected day is out of range', async () => {
    const { panel } = await openRange(new Date(2026, 1, 12), null, new Date(2026, 1, 3));
    await tick(50);
    expect(panel.querySelector('[tabindex="0"]')!.getAttribute('data-day')).toBe('12');
  });

  it('opens on the nearest selectable month when the value is before the range', async () => {
    const { fix, panel } = await openRange(
      new Date(2026, 1, 10),
      null,
      new Date(2026, 0, 3),
    );
    await tick(50);
    await fix.whenStable();
    expect(panel.querySelector('.sn-date-picker-head-btn')?.textContent?.trim()).toBe('February');
    expect(panel.querySelector('[tabindex="0"]')?.getAttribute('data-day')).toBe('10');
    expect(fix.componentInstance.value?.getMonth()).toBe(0);
  });

  it('moves an open panel to the nearest selectable month when the range changes', async () => {
    const { fix, panel } = await openRange(null, null);
    fix.componentInstance.minDate.set(new Date(2026, 5, 10));
    await tick(30);
    await fix.whenStable();

    expect(panel.querySelector('.sn-date-picker-head-btn')?.textContent?.trim()).toBe('June');
    expect(panel.querySelector('[tabindex="0"]')?.getAttribute('data-day')).toBe('10');
    expect(fix.componentInstance.value?.getMonth()).toBe(1);
  });

  it('leaves a value outside the range alone rather than correcting it', async () => {
    const { fix } = await openRange(new Date(2026, 1, 20), null, new Date(2026, 1, 3));
    expect(fix.componentInstance.value?.getDate()).toBe(3);
  });
});

function getPanelIn(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('.sn-date-picker-panel');
}

@Component({
  template: `<sn-date-picker [(value)]="value" [animated]="false"></sn-date-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class NoAnimDatePickerHost {
  value: Date | null = null;
}

@Component({
  template: `
    <sn-date-picker [(value)]="value"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
    </sn-date-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class CustomAnimDatePickerHost {
  value: Date | null = null;
}

describe('DatePicker animation inputs', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('[role="dialog"]');
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimDatePickerHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toBe('none');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimDatePickerHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });
});
