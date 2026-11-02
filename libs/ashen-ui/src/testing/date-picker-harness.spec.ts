import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideSnAnimations } from 'ashen-ui/core';
import { DatePicker } from 'ashen-ui/date-picker';
import { SnDatePickerHarness } from './date-picker-harness';

@Component({
  template: `
    <sn-date-picker
      [(value)]="date"
      ariaLabel="Due date"
      placeholder="Pick a date"
      [formatDate]="format"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DatePicker],
})
class Host {
  readonly date = signal<Date | null>(null);
  readonly format = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

describe('SnDatePickerHarness', () => {
  let loader: HarnessLoader;
  let host: Host;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnAnimations('disabled')],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    // A fixed date keeps the month on view, and so every assertion, stable.
    host.date.set(new Date(2026, 2, 10));
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  const picker = () => loader.getHarness(SnDatePickerHarness.with({ ariaLabel: 'Due date' }));

  it('shows the formatted value and starts closed', async () => {
    const p = await picker();

    expect(await p.getValueText()).toBe('2026-3-10');
    expect(await p.isEmpty()).toBe(false);
    expect(await p.isOpen()).toBe(false);
  });

  it('shows the placeholder while empty', async () => {
    host.date.set(null);
    const p = await picker();

    expect(await p.isEmpty()).toBe(true);
    expect(await p.getValueText()).toBe('Pick a date');
  });

  it('opens and closes', async () => {
    const p = await picker();

    await p.open();
    expect(await p.isOpen()).toBe(true);

    await p.close();
    expect(await p.isOpen()).toBe(false);
  });

  it('reads the header of the month on view', async () => {
    expect(await (await picker()).getHeaderText()).toContain('2026');
  });

  it('reports the selected day', async () => {
    expect(await (await picker()).getSelectedDay()).toBe(10);
  });

  it('picking a day commits it and closes the panel', async () => {
    const p = await picker();

    await p.pickDay(14);

    expect(host.date()?.getDate()).toBe(14);
    expect(await p.getValueText()).toBe('2026-3-14');
    expect(await p.isOpen()).toBe(false);
  });

  it('throws for a day the month on view does not have', async () => {
    const p = await picker();
    await expect(p.pickDay(45)).rejects.toThrow(/45/);
  });

  it('next() steps to the following month, where the selection is gone', async () => {
    const p = await picker();
    const before = await p.getHeaderText();

    await p.next();

    expect(await p.getHeaderText()).not.toBe(before);
    expect(await p.getSelectedDay()).toBeNull();
  });

  it('previous() undoes next()', async () => {
    const p = await picker();
    const before = await p.getHeaderText();

    await p.next();
    await p.previous();

    expect(await p.getHeaderText()).toBe(before);
  });

  it('lists the days of the month on view', async () => {
    // March 2026 has 31 days.
    expect((await (await picker()).getDayLabels()).length).toBe(31);
  });

  it('sees a value set outside the harness', async () => {
    const p = await picker();

    host.date.set(new Date(2026, 2, 1));

    expect(await p.getValueText()).toBe('2026-3-1');
  });
});
