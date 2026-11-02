import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import type { TableDefaultSort, TableSortOrder } from './table';
import { TableColumn } from './table-column';

interface Person {
  name: string;
  age: number;
}

const PEOPLE: Person[] = [
  { name: 'Bea', age: 30 },
  { name: 'Al', age: 40 },
  { name: 'Cy', age: 20 },
];

@Component({
  template: `
    <sn-table
      [value]="rows"
      [defaultSort]="defaultSort()"
      [(sortField)]="field"
      [(sortOrder)]="order"
    >
      <sn-column field="name" header="Name" sortable />
      <sn-column field="age" header="Age" sortable />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SortHost {
  rows = PEOPLE;
  readonly defaultSort = signal<TableDefaultSort | null>({ field: 'name', order: 'asc' });
  readonly field = signal<string | null>('name');
  readonly order = signal<TableSortOrder>('asc');
}

describe('Table sort model', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function setup(): Promise<ComponentFixture<SortHost>> {
    const fix = TestBed.createComponent(SortHost);
    await fix.whenStable();
    return fix;
  }

  async function clickHeader(fix: ComponentFixture<SortHost>, index: number): Promise<void> {
    const buttons = fix.nativeElement.querySelectorAll('.sn-table-sort') as NodeListOf<HTMLElement>;
    buttons[index].click();
    await fix.whenStable();
  }

  const names = (fix: ComponentFixture<SortHost>): string[] =>
    Array.from(fix.nativeElement.querySelectorAll('tbody tr td:first-child'), (td) =>
      (td as HTMLElement).textContent!.trim(),
    );

  it('applies a sort set from outside', async () => {
    const fix = await setup();
    expect(names(fix)).toEqual(['Al', 'Bea', 'Cy']);
    fix.componentInstance.field.set('age');
    fix.componentInstance.order.set('desc');
    await fix.whenStable();
    expect(names(fix)).toEqual(['Al', 'Bea', 'Cy']);
    fix.componentInstance.order.set('asc');
    await fix.whenStable();
    expect(names(fix)).toEqual(['Cy', 'Bea', 'Al']);
  });

  it('writes header clicks back to the bound signals', async () => {
    const fix = await setup();
    await clickHeader(fix, 1);
    expect(fix.componentInstance.field()).toBe('age');
    expect(fix.componentInstance.order()).toBe('asc');
  });

  it('returns to the default sort on the third click', async () => {
    const fix = await setup();
    fix.componentInstance.field.set(null);
    fix.componentInstance.order.set(null);
    await fix.whenStable();
    await clickHeader(fix, 0);
    await clickHeader(fix, 0);
    expect(fix.componentInstance.order()).toBe('desc');
    await clickHeader(fix, 0);
    expect(fix.componentInstance.field()).toBe('name');
    expect(fix.componentInstance.order()).toBe('asc');
  });

  it('clears the sort on the third click without a default', async () => {
    const fix = await setup();
    fix.componentInstance.defaultSort.set(null);
    await clickHeader(fix, 1);
    await clickHeader(fix, 1);
    await clickHeader(fix, 1);
    expect(fix.componentInstance.field()).toBeNull();
    expect(fix.componentInstance.order()).toBeNull();
  });
});
