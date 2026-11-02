import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import { TableColumn } from './table-column';

interface Letter {
  name: string;
}

const LETTERS: Letter[] = ['A', 'B', 'C', 'D', 'E'].map((name) => ({ name }));

@Component({
  template: `
    <sn-table [value]="rows" selectionMode="multiple" [rowClickSelection]="enabled()" [(selection)]="sel">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class RowClickSelectHost {
  rows = LETTERS;
  readonly enabled = signal(true);
  readonly sel = signal<Letter[]>([]);
}

describe('Table rowClickSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  async function setup(): Promise<ComponentFixture<RowClickSelectHost>> {
    const fix = TestBed.createComponent(RowClickSelectHost);
    await fix.whenStable();
    return fix;
  }

  async function click(
    fix: ComponentFixture<RowClickSelectHost>,
    index: number,
    init: MouseEventInit = {},
  ): Promise<void> {
    const rows = fix.nativeElement.querySelectorAll('tbody tr') as NodeListOf<HTMLElement>;
    rows[index].dispatchEvent(new MouseEvent('click', { bubbles: true, ...init }));
    await fix.whenStable();
  }

  const names = (fix: ComponentFixture<RowClickSelectHost>): string[] =>
    fix.componentInstance.sel().map((row) => row.name);

  it('a plain click selects only that row', async () => {
    const fix = await setup();
    await click(fix, 1);
    await click(fix, 3);
    expect(names(fix)).toEqual(['D']);
  });

  it('Ctrl and Cmd click toggle a row without touching the others', async () => {
    const fix = await setup();
    await click(fix, 0);
    await click(fix, 2, { ctrlKey: true });
    expect(names(fix)).toEqual(['A', 'C']);
    await click(fix, 0, { metaKey: true });
    expect(names(fix)).toEqual(['C']);
  });

  it('Shift click selects the range from the anchor in either direction', async () => {
    const fix = await setup();
    await click(fix, 1);
    await click(fix, 3, { shiftKey: true });
    expect(names(fix)).toEqual(['B', 'C', 'D']);
    await click(fix, 0, { shiftKey: true });
    expect(names(fix)).toEqual(['A', 'B']);
  });

  it('Ctrl+Shift click adds the range to the current selection', async () => {
    const fix = await setup();
    await click(fix, 0);
    await click(fix, 3, { ctrlKey: true });
    await click(fix, 4, { ctrlKey: true, shiftKey: true });
    expect(names(fix)).toEqual(['A', 'D', 'E']);
  });

  it('Shift click without an anchor selects just that row', async () => {
    const fix = await setup();
    await click(fix, 2, { shiftKey: true });
    expect(names(fix)).toEqual(['C']);
  });

  it('leaves row clicks alone when rowClickSelection is off', async () => {
    const fix = await setup();
    fix.componentInstance.enabled.set(false);
    await fix.whenStable();
    await click(fix, 1);
    expect(names(fix)).toEqual([]);
  });
});
