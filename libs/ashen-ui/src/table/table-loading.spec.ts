import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import { TableColumn } from './table-column';

@Component({
  template: `
    <sn-table [value]="rows" [loading]="loading()">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class LoadingHost {
  rows: { name: string }[] = [{ name: 'Al' }];
  readonly loading = signal(false);
}

describe('Table loading', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function setup(): Promise<ComponentFixture<LoadingHost>> {
    const fix = TestBed.createComponent(LoadingHost);
    await fix.whenStable();
    return fix;
  }

  const host = (fix: ComponentFixture<LoadingHost>): HTMLElement =>
    fix.nativeElement.querySelector('sn-table');

  it('renders no overlay by default', async () => {
    const fix = await setup();
    expect(host(fix).querySelector('.sn-table-loading')).toBeNull();
    expect(host(fix).getAttribute('aria-busy')).toBeNull();
    expect(host(fix).classList).not.toContain('sn-table--loading');
  });

  it('shows a spinner overlay and marks the table busy while loading', async () => {
    const fix = await setup();
    fix.componentInstance.loading.set(true);
    await fix.whenStable();
    expect(host(fix).querySelector('.sn-table-loading sn-progress-spinner')).not.toBeNull();
    expect(host(fix).getAttribute('aria-busy')).toBe('true');
    expect(host(fix).classList).toContain('sn-table--loading');
  });

  it('keeps the rows rendered under the overlay', async () => {
    const fix = await setup();
    fix.componentInstance.loading.set(true);
    await fix.whenStable();
    expect(host(fix).querySelectorAll('tbody .sn-table-row').length).toBe(1);
  });

  it('hides the empty message while loading', async () => {
    const fix = TestBed.createComponent(LoadingHost);
    fix.componentInstance.rows = [];
    fix.componentInstance.loading.set(true);
    await fix.whenStable();
    const empty = host(fix).querySelector('.sn-table-empty') as HTMLElement;
    expect(empty.classList).toContain('sn-table-empty--loading');
    expect(empty.textContent?.trim()).toBe('');

    fix.componentInstance.loading.set(false);
    await fix.whenStable();
    expect(empty.classList).not.toContain('sn-table-empty--loading');
    expect(empty.textContent?.trim()).not.toBe('');
  });

  it('starts the overlay below the header', async () => {
    const fix = await setup();
    const thead = host(fix).querySelector('thead') as HTMLElement;
    thead.getBoundingClientRect = () => ({ bottom: 48 }) as DOMRect;
    fix.componentInstance.loading.set(true);
    await fix.whenStable();
    await fix.whenStable();
    expect((host(fix).querySelector('.sn-table-loading') as HTMLElement).style.top).toBe('48px');
  });
});
