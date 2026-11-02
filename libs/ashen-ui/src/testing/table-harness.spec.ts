import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Table, TableColumn } from 'ashen-ui/table';
import { SnTableHarness } from './table-harness';

interface File {
  name: string;
  size: number;
}

@Component({
  template: `
    <sn-table
      [value]="files()"
      aria-label="Files"
      [selectionMode]="selectable() ? 'multiple' : 'none'"
      [(selection)]="selected"
    >
      <sn-column field="name" header="Name" [sortable]="true" />
      <sn-column field="size" header="Size" [sortable]="true" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class Host {
  readonly files = signal<File[]>([
    { name: 'notes.md', size: 3 },
    { name: 'archive.zip', size: 1 },
    { name: 'photo.png', size: 2 },
  ]);
  readonly selectable = signal(false);
  readonly selected = signal<File[]>([]);
}

describe('SnTableHarness', () => {
  let loader: HarnessLoader;
  let host: Host;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  const table = () => loader.getHarness(SnTableHarness.with({ ariaLabel: 'Files' }));

  it('reads the header labels', async () => {
    expect(await (await table()).getHeaderTexts()).toEqual(['Name', 'Size']);
  });

  it('reads the body as a grid', async () => {
    expect(await (await table()).getCellTexts()).toEqual([
      ['notes.md', '3'],
      ['archive.zip', '1'],
      ['photo.png', '2'],
    ]);
  });

  it('reads one column by its header', async () => {
    expect(await (await table()).getColumnTexts('Size')).toEqual(['3', '1', '2']);
  });

  it('throws for a column that does not exist', async () => {
    const t = await table();
    await expect(t.getColumnTexts('Owner')).rejects.toThrow(/Owner/);
  });

  it('sortBy reorders the rows and reports the direction', async () => {
    const t = await table();

    await t.sortBy('Size');

    expect(await t.getColumnTexts('Size')).toEqual(['1', '2', '3']);
    expect(await t.getSortState('Size')).toBe('ascending');
  });

  it('sorting the same column again reverses it', async () => {
    const t = await table();

    await t.sortBy('Size');
    await t.sortBy('Size');

    expect(await t.getColumnTexts('Size')).toEqual(['3', '2', '1']);
    expect(await t.getSortState('Size')).toBe('descending');
  });

  it('throws for a column that is not sortable', async () => {
    const t = await table();
    await expect(t.sortBy('Owner')).rejects.toThrow(/Owner/);
  });

  it('finds a row by its text', async () => {
    const rows = await (await table()).getRows({ text: /photo/ });

    expect(rows.length).toBe(1);
    expect(await rows[0].getCellTexts()).toEqual(['photo.png', '2']);
  });

  it('sees rows added outside the harness', async () => {
    const t = await table();

    host.files.update((files) => [...files, { name: 'new.txt', size: 9 }]);

    expect((await t.getRows()).length).toBe(4);
  });

  it('reports the empty message when there are no rows', async () => {
    const t = await table();

    host.files.set([]);

    expect((await t.getRows()).length).toBe(0);
    expect(await t.getEmptyText()).toBeTruthy();
  });

  it('throws when asked to select a row in a table without selection', async () => {
    const [row] = await (await table()).getRows();
    await expect(row.toggleSelection()).rejects.toThrow(/no selection checkbox/);
  });

  it('selects rows through their checkbox', async () => {
    host.selectable.set(true);
    const t = await table();
    const [first] = await t.getRows();

    await first.toggleSelection();

    expect(await first.isSelected()).toBe(true);
    expect((await t.getSelectedRows()).length).toBe(1);
    expect(host.selected()).toEqual([{ name: 'notes.md', size: 3 }]);
  });

  it('selects every row from the header checkbox', async () => {
    host.selectable.set(true);
    const t = await table();

    await t.toggleSelectAll();

    expect((await t.getSelectedRows()).length).toBe(3);
  });
});
