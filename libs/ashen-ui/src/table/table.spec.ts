import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { By } from '@angular/platform-browser';
import { provideSnIntl } from 'ashen-ui/core';
import {
  Table,
  type TableLoadEvent,
  type TableLoadMoreEvent,
  type TableSortOrder,
} from './table';
import { TableColumn } from './table-column';
import { TableCellDef } from './table-cell-def';
import { TableExpansionDef } from './table-expansion-def';
import { TableStyle, TableSort, TableSortHeader } from './table-directives';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { Paginator } from 'ashen-ui/paginator';

const PEOPLE = [
  { name: 'Alice', age: 30, role: 'Admin' },
  { name: 'Charlie', age: 25, role: 'User' },
  { name: 'Bob', age: 35, role: 'Editor' },
];

type Person = (typeof PEOPLE)[number];

@Component({
  template: `
    <sn-table [value]="rows">
      <sn-column field="name" header="Name" />
      <sn-column field="age" header="Age" align="right" width="80px" />
      <sn-column field="role" header="Role" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class BasicHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table [value]="rows">
      <sn-column field="name" header="Name" [sortable]="true" />
      <sn-column field="age" header="Age" [sortable]="true" />
      <sn-column field="role" header="Role" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SortableHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table [value]="rows" [striped]="true">
      <sn-column field="name" header="Name" />
      <sn-column field="role" header="Role">
        <ng-template snCellDef let-row let-i="index">
          <span class="cell-tpl">{{ row.role }}-{{ i }}</span>
        </ng-template>
      </sn-column>
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn, TableCellDef],
})
class StripedCellTplHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table [value]="rows" [selectable]="true" [(selectedIndex)]="sel">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SelectableHost {
  rows = PEOPLE;
  readonly sel = signal<number | null>(null);
}

@Component({
  template: `
    <sn-table [value]="[]">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class EmptyHost {}

@Component({
  template: `
    <sn-table [value]="[]" emptyMessage="Nothing here">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class EmptyCustomMsgHost {}

@Component({
  template: `
    <sn-table [value]="rows" caption="People" [snClass]="{ caption: 'table-caption' }">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class CaptionHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table [value]="rows" [snClass]="{ root: 'my-root', table: 'my-table', header: 'my-header', row: 'my-row', cell: 'my-cell' }">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SnClassHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table
      [value]="rows"
      layout="flex"
      scrollHeight="18rem"
      [snStyle]="{
        root: { outline: '1px solid red' },
        table: { color: 'rgb(1, 2, 3)' },
        header: { backgroundColor: 'rgb(4, 5, 6)' },
        row: { outline: '1px solid blue' },
        cell: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'people-table', 'data-sn-layout': 'invalid' },
        table: { 'data-testid': 'table-inner', role: 'presentation' },
        header: { 'data-testid': 'table-header', role: 'presentation' },
        row: { 'data-testid': 'table-row', role: 'presentation', 'aria-selected': 'true' },
        cell: { 'data-testid': 'table-cell', role: 'presentation' }
      }"
    >
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SnPartHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <sn-table [value]="rows" [selectable]="false" (rowClick)="clicks.push($event)">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class NonSelectableRowClickHost {
  rows = PEOPLE;
  clicks: { row: Person; index: number }[] = [];
}

@Component({
  template: `
    <sn-table [value]="rows" [selectable]="true" [(selectedIndex)]="sel" (sortChange)="sorts.push($event)">
      <sn-column field="name" header="Name" [sortable]="true" />
      <sn-column field="age" header="Age" [sortable]="true" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SortSelectHost {
  rows = PEOPLE;
  readonly sel = signal<number | null>(null);
  sorts: { field: string | null; order: TableSortOrder }[] = [];
}

@Component({
  template: `
    <sn-table [value]="rows">
      <sn-column field="score" header="Score" [sortable]="true" />
      <sn-column field="label" header="Label" [sortable]="true" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class NullSortHost {
  rows = [
    { score: null, label: 'Z' },
    { score: 5, label: null },
    { score: 1, label: 'A' },
  ];
}

describe('Table', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders thead from columns', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const ths = fix.nativeElement.querySelectorAll('th');
    expect(ths.length).toBe(3);
    expect(ths[0].textContent.trim()).toBe('Name');
    expect(ths[1].textContent.trim()).toBe('Age');
    expect(ths[2].textContent.trim()).toBe('Role');
  });

  it('renders tbody rows from value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const trs = fix.nativeElement.querySelectorAll('tbody tr');
    expect(trs.length).toBe(3);
  });

  it('renders a semantic caption with the caption snClass section', async () => {
    const fixture = TestBed.createComponent(CaptionHost);
    await fixture.whenStable();
    const caption: HTMLTableCaptionElement = fixture.nativeElement.querySelector('caption');
    expect(caption.textContent?.trim()).toBe('People');
    expect(caption.classList).toContain('table-caption');
  });

  it('applies column width and align to th and td', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const ths = fix.nativeElement.querySelectorAll('th');
    expect(ths[1].style.width).toBe('80px');
    expect(ths[1].style.textAlign).toBe('right');
    const tds = fix.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(tds[1].style.textAlign).toBe('right');
  });

  it('renders custom cell template with row and index context', async () => {
    const fix = TestBed.createComponent(StripedCellTplHost);
    await fix.whenStable();
    const cells = fix.nativeElement.querySelectorAll('.cell-tpl');
    expect(cells.length).toBe(3);
    expect(cells[0].textContent.trim()).toBe('Admin-0');
    expect(cells[1].textContent.trim()).toBe('User-1');
    expect(cells[2].textContent.trim()).toBe('Editor-2');
  });

  it('cycles sort asc → desc → off on same column', async () => {
    const fix = TestBed.createComponent(SortableHost);
    await fix.whenStable();
    const nameBtn = fix.nativeElement.querySelector('.sn-table-sort');
    const th = fix.nativeElement.querySelector('th');

    nameBtn.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('ascending');
    const names1 = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(names1).toEqual(['Alice', 'Bob', 'Charlie']);

    nameBtn.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('descending');
    const names2 = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(names2).toEqual(['Charlie', 'Bob', 'Alice']);

    nameBtn.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBeNull();
    const names3 = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(names3).toEqual(['Alice', 'Charlie', 'Bob']);
  });

  it('switching to different column resets to asc', async () => {
    const fix = TestBed.createComponent(SortableHost);
    await fix.whenStable();
    const btns = fix.nativeElement.querySelectorAll('.sn-table-sort');
    btns[0].click();
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('th')[0].getAttribute('aria-sort')).toBe('ascending');

    btns[1].click();
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('th')[1].getAttribute('aria-sort')).toBe('ascending');
    expect(fix.nativeElement.querySelectorAll('th')[0].getAttribute('aria-sort')).toBeNull();
  });

  it('emits sortChange on each cycle step', async () => {
    const fix = TestBed.createComponent(SortSelectHost);
    await fix.whenStable();
    const nameBtn = fix.nativeElement.querySelector('.sn-table-sort');
    const comp = fix.componentInstance;

    nameBtn.click(); await fix.whenStable();
    expect(comp.sorts[0]).toEqual({ field: 'name', order: 'asc' });

    nameBtn.click(); await fix.whenStable();
    expect(comp.sorts[1]).toEqual({ field: 'name', order: 'desc' });

    nameBtn.click(); await fix.whenStable();
    expect(comp.sorts[2]).toEqual({ field: null, order: null });
  });

  it('sorts numbers numerically', async () => {
    const fix = TestBed.createComponent(SortableHost);
    await fix.whenStable();
    const btns = fix.nativeElement.querySelectorAll('.sn-table-sort');
    btns[1].click();
    await fix.whenStable();
    const ages = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelectorAll('td')[1].textContent!.trim(),
    );
    expect(ages).toEqual(['25', '30', '35']);
  });

  it('sorts null values last in asc order', async () => {
    const fix = TestBed.createComponent(NullSortHost);
    await fix.whenStable();
    const btn = fix.nativeElement.querySelector('.sn-table-sort');
    btn.click();
    await fix.whenStable();
    const scores = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(scores[scores.length - 1]).toBe('');
  });

  it('keeps selection pointing at the correct row after sorting', async () => {
    const fix = TestBed.createComponent(SortSelectHost);
    await fix.whenStable();
    const comp = fix.componentInstance;

    const nameBtn = fix.nativeElement.querySelector('.sn-table-sort');
    nameBtn.click();
    await fix.whenStable();

    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    await fix.whenStable();

    expect(comp.sel()).toBe(0);
  });

  it('selectable rows have tabindex=0', async () => {
    const fix = TestBed.createComponent(SelectableHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows.forEach((r: HTMLElement) => expect(r.getAttribute('tabindex')).toBe('0'));
  });

  it('clicking a row sets selectedIndex and aria-current', async () => {
    const fix = TestBed.createComponent(SelectableHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.sel()).toBe(1);
    expect(rows[1].getAttribute('aria-current')).toBe('true');
    expect(rows[0].getAttribute('aria-current')).toBeNull();
  });

  it('Enter key on selectable row selects it', async () => {
    const fix = TestBed.createComponent(SelectableHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fix.whenStable();
    expect(fix.componentInstance.sel()).toBe(2);
    expect(rows[2].getAttribute('aria-current')).toBe('true');
  });

  it('Space key on selectable row selects it', async () => {
    const fix = TestBed.createComponent(SelectableHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fix.whenStable();
    expect(fix.componentInstance.sel()).toBe(0);
  });

  it('non-selectable rows have no tabindex', async () => {
    const fix = TestBed.createComponent(NonSelectableRowClickHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows.forEach((r: HTMLElement) => expect(r.getAttribute('tabindex')).toBeNull());
  });

  it('non-selectable rows still emit rowClick', async () => {
    const fix = TestBed.createComponent(NonSelectableRowClickHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.clicks.length).toBe(1);
    expect(fix.componentInstance.clicks[0].index).toBe(0);
  });

  it('striped: display-odd rows get sn-table-row--striped class', async () => {
    const fix = TestBed.createComponent(StripedCellTplHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    expect(rows[0].classList).not.toContain('sn-table-row--striped');
    expect(rows[1].classList).toContain('sn-table-row--striped');
    expect(rows[2].classList).not.toContain('sn-table-row--striped');
  });

  it('empty state renders SnIntl default message', async () => {
    const fix = TestBed.createComponent(EmptyHost);
    await fix.whenStable();
    const empty = fix.nativeElement.querySelector('.sn-table-empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toBe('No results found.');
  });

  it('emptyMessage input overrides SnIntl default', async () => {
    const fix = TestBed.createComponent(EmptyCustomMsgHost);
    await fix.whenStable();
    const empty = fix.nativeElement.querySelector('.sn-table-empty');
    expect(empty.textContent.trim()).toBe('Nothing here');
  });

  it('SnIntl override changes empty message', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ emptyMessage: 'Custom intl empty' }),
      ],
    });
    const fix = TestBed.createComponent(EmptyHost);
    await fix.whenStable();
    const empty = fix.nativeElement.querySelector('.sn-table-empty');
    expect(empty.textContent.trim()).toBe('Custom intl empty');
  });

  it('SnIntl override changes the selection labels', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ table: { selectAll: 'Alle auswählen', selectRow: 'Zeile auswählen' } }),
      ],
    });
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    const labels = [...fix.nativeElement.querySelectorAll('[aria-label]')].map((el: Element) =>
      el.getAttribute('aria-label'),
    );
    expect(labels).toContain('Alle auswählen');
    expect(labels).toContain('Zeile auswählen');
  });

  it('snClass string lands on host element', async () => {
    @Component({
      template: `<sn-table [value]="[]" snClass="extra-class"><sn-column field="x" header="X" /></sn-table>`,
      imports: [Table, TableColumn],
    })
    class StrSnClassHost {}

    const fix = TestBed.createComponent(StrSnClassHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-table');
    expect(host.classList).toContain('extra-class');
  });

  it('snClass object sections target correct elements', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-table');
    expect(host.classList).toContain('my-root');

    const table: HTMLElement = fix.nativeElement.querySelector('.sn-table-inner');
    expect(table.classList).toContain('my-table');

    const headerRow: HTMLElement = fix.nativeElement.querySelector('.sn-table-header-row');
    expect(headerRow.classList).toContain('my-header');

    const row: HTMLElement = fix.nativeElement.querySelector('tbody tr');
    expect(row.classList).toContain('my-row');

    const cell: HTMLElement = fix.nativeElement.querySelector('tbody td');
    expect(cell.classList).toContain('my-cell');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing table semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();

    const root: HTMLElement = fix.nativeElement.querySelector('sn-table');
    const table: HTMLElement = fix.nativeElement.querySelector('.sn-table-inner');
    const header: HTMLElement = fix.nativeElement.querySelector('.sn-table-header-row');
    const row: HTMLElement = fix.nativeElement.querySelector('tbody tr');
    const cell: HTMLElement = fix.nativeElement.querySelector('tbody td');

    expect(root.style.maxHeight).toBe('18rem');
    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('people-table');
    expect(root.getAttribute('data-sn-layout')).toBe('flex');
    expect(table.style.color).toBe('rgb(1, 2, 3)');
    expect(table.getAttribute('data-testid')).toBe('table-inner');
    expect(table.getAttribute('role')).toBe('table');
    expect(header.getAttribute('data-testid')).toBe('table-header');
    expect(header.getAttribute('role')).toBe('row');
    expect(row.style.outline).toContain('blue');
    expect(row.getAttribute('data-testid')).toBe('table-row');
    expect(row.getAttribute('role')).toBe('row');
    expect(row.getAttribute('aria-selected')).toBeNull();
    expect(cell.style.color).toBe('rgb(7, 8, 9)');
    expect(cell.getAttribute('data-testid')).toBe('table-cell');
    expect(cell.getAttribute('role')).toBe('cell');
  });
});

@Component({
  template: `
    <sn-table [value]="rows" selectionMode="multiple" [(selection)]="sel">
      <sn-column field="name" header="Name" />
      <sn-column field="age" header="Age" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class MultiSelectHost {
  rows = PEOPLE;
  readonly sel = signal<Person[]>([]);
}

describe('Multiple selection (selectionMode=multiple)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('renders a checkbox column in header and body', async () => {
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-table-th--select')).toBeTruthy();
    expect(fix.nativeElement.querySelector('.sn-table-td--select')).toBeTruthy();
  });

  it('clicking a row checkbox adds/removes row from selection', async () => {
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    const checkboxes = fix.nativeElement.querySelectorAll('.sn-table-checkbox');
    // first body checkbox (index 1 because index 0 is the header "select all")
    const rowCb = checkboxes[1] as HTMLInputElement;
    rowCb.click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(1);
    expect(fix.componentInstance.sel()[0].name).toBe('Alice');

    rowCb.click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(0);
  });

  it('header checkbox selects all / clears all', async () => {
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    const headerCb = fix.nativeElement.querySelector('.sn-table-th--select .sn-table-checkbox') as HTMLInputElement;
    headerCb.click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(3);

    headerCb.click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(0);
  });

  it('header checkbox indeterminate when some-but-not-all selected', async () => {
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    // select just one row
    const rowCb = fix.nativeElement.querySelectorAll('.sn-table-td--select .sn-table-checkbox')[0] as HTMLInputElement;
    rowCb.click();
    await fix.whenStable();
    const headerCb = fix.nativeElement.querySelector('.sn-table-th--select .sn-table-checkbox') as HTMLElement;
    expect(headerCb.getAttribute('aria-checked')).toBe('mixed');
  });

  it('selected rows have aria-selected="true"', async () => {
    const fix = TestBed.createComponent(MultiSelectHost);
    await fix.whenStable();
    const rowCb = fix.nativeElement.querySelectorAll('.sn-table-td--select .sn-table-checkbox')[0] as HTMLInputElement;
    rowCb.click();
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr:not(.sn-table-expansion-row)');
    expect(rows[0].getAttribute('aria-selected')).toBe('true');
    // In multiple-selection mode the template binds [attr.aria-selected] for all rows (false when not selected)
    expect(rows[1].getAttribute('aria-selected')).toBe('false');
  });
});

@Component({
  template: `
    <sn-table [value]="rows" selectionMode="single" [(selection)]="sel">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class SingleSelectHost {
  rows = PEOPLE;
  readonly sel = signal<Person[]>([]);
}

describe('Single selection (selectionMode=single)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('row click sets selection=[row]', async () => {
    const fix = TestBed.createComponent(SingleSelectHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(1);
    expect(fix.componentInstance.sel()[0].name).toBe('Alice');
  });

  it('second click on selected row clears selection', async () => {
    const fix = TestBed.createComponent(SingleSelectHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[0].click();
    await fix.whenStable();
    rows[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.sel().length).toBe(0);
  });

  it('selected row has sn-table-row--selected class', async () => {
    const fix = TestBed.createComponent(SingleSelectHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows[1].click();
    await fix.whenStable();
    expect(rows[1].classList).toContain('sn-table-row--selected');
    expect(rows[0].classList).not.toContain('sn-table-row--selected');
  });
});

@Component({
  template: `
    <sn-table [value]="rows" selectionMode="multiple" [(selection)]="sel" [rowKey]="keyFn">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class RowKeyHost {
  rows = PEOPLE;
  keyFn = (row: Person) => row.name;
  // Different object instance with same key (name='Alice')
  readonly sel = signal<Person[]>([{ name: 'Alice', age: 99, role: 'X' }]);
}

describe('rowKey', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('identifies row by key function - different object instance with same key shows as selected', async () => {
    const fix = TestBed.createComponent(RowKeyHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    expect(rows[0].classList).toContain('sn-table-row--selected');
    expect(rows[1].classList).not.toContain('sn-table-row--selected');
  });
});

@Component({
  template: `
    <sn-table [value]="rows" [(expandedKeys)]="expandedKeys" (rowExpand)="events.push($event)">
      <sn-column field="name" header="Name" />
      <ng-template snExpansionDef let-row>
        <span class="expansion-content">detail:{{ row.name }}</span>
      </ng-template>
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn, TableExpansionDef],
})
class ExpansionHost {
  rows = PEOPLE;
  readonly expandedKeys = signal<unknown[]>([]);
  events: { row: Person; expanded: boolean }[] = [];
}

describe('Expansion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('renders expand column when snExpansionDef present', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-table-td--expand')).toBeTruthy();
  });

  it('clicking chevron adds key to expandedKeys and renders expansion row', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(1);
    expect(fix.nativeElement.querySelector('.sn-table-expansion-row')).toBeTruthy();
  });

  it('expansion row has correct template content', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    const content = fix.nativeElement.querySelector('.expansion-content');
    expect(content).toBeTruthy();
    expect(content.textContent.trim()).toBe('detail:Alice');
  });

  it('aria-expanded true on expanded row', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    expect(expandBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking again collapses expansion row', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    expandBtn.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(0);
    expect(fix.nativeElement.querySelector('.sn-table-expansion-row')).toBeNull();
  });

  it('rowExpand output fires with {row, expanded}', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    expect(fix.componentInstance.events.length).toBe(1);
    expect(fix.componentInstance.events[0].row.name).toBe('Alice');
    expect(fix.componentInstance.events[0].expanded).toBe(true);
  });

  it('row click does NOT toggle expansion by default', async () => {
    const fix = TestBed.createComponent(ExpansionHost);
    await fix.whenStable();
    const row = fix.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    row.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(0);
  });
});

@Component({
  template: `
    <sn-table [value]="rows" [(expandedKeys)]="expandedKeys" expandRowOnClick>
      <sn-column field="name" header="Name" />
      <ng-template snExpansionDef let-row>
        <span class="expansion-content">detail:{{ row.name }}</span>
      </ng-template>
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn, TableExpansionDef],
})
class ExpandOnRowClickHost {
  rows = PEOPLE;
  readonly expandedKeys = signal<unknown[]>([]);
}

describe('Expand on row click', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('clicking the row toggles expansion', async () => {
    const fix = TestBed.createComponent(ExpandOnRowClickHost);
    await fix.whenStable();
    const row = fix.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;
    row.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(1);
    expect(fix.nativeElement.querySelector('.sn-table-expansion-row')).toBeTruthy();

    row.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(0);
  });

  it('the chevron still works without double-toggling', async () => {
    const fix = TestBed.createComponent(ExpandOnRowClickHost);
    await fix.whenStable();
    const expandBtn = fix.nativeElement.querySelector('.sn-table-td--expand button') as HTMLButtonElement;
    expandBtn.click();
    await fix.whenStable();
    expect(fix.componentInstance.expandedKeys().length).toBe(1);
  });
});

@Component({
  template: `
    <sn-table [value]="rows">
      <sn-column field="name" header="Name" />
      <sn-column type="actions" header="Actions" [sortable]="true">
        <ng-template snCellDef let-row>
          <button snButton variant="icon" size="sm"><sn-icon>delete</sn-icon></button>
        </ng-template>
      </sn-column>
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn, TableCellDef, Button, Icon],
})
class ActionsHost {
  rows = PEOPLE;
}

describe('Actions column', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('td gets sn-table-td--actions class', async () => {
    const fix = TestBed.createComponent(ActionsHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-table-td--actions')).toBeTruthy();
  });

  it('actions column not sortable even with sortable=true', async () => {
    const fix = TestBed.createComponent(ActionsHost);
    await fix.whenStable();
    const ths = fix.nativeElement.querySelectorAll('th');
    // actions column is the last th
    const actionsTh = ths[ths.length - 1];
    expect(actionsTh.querySelector('.sn-table-sort')).toBeNull();
  });
});

@Component({
  template: `
    <sn-table [value]="rows" [page]="page()" [pageSize]="pageSize">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class PaginationHost {
  rows = PEOPLE; // 3 items
  readonly page = signal(0);
  pageSize = 2;
}

@Component({
  template: `
    <sn-table
      #table
      server
      [value]="rows"
      [totalRecords]="87"
      [(page)]="page"
      [(pageSize)]="pageSize"
      (load)="events.push($event)"
    >
      <sn-column field="name" header="Name" sortable />
    </sn-table>
    <sn-paginator
      [page]="page()"
      [rows]="pageSize() ?? 2"
      [totalRecords]="87"
      [rowsPerPageOptions]="[2, 3]"
      (pageChange)="table.paginate($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn, Paginator],
})
class ServerPaginationHost {
  rows = PEOPLE;
  readonly page = signal(2);
  readonly pageSize = signal<number | undefined>(2);
  events: TableLoadEvent[] = [];
}

@Component({
  template: `
    <sn-table [value]="rows()" [(page)]="page" [pageSize]="2">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class ShrinkingPaginationHost {
  readonly rows = signal(PEOPLE);
  readonly page = signal(1);
}

describe('Pagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('moves back to the last page when the data shrinks below the current page', async () => {
    const fix = TestBed.createComponent(ShrinkingPaginationHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('tbody tr').length).toBe(1);

    fix.componentInstance.rows.set(PEOPLE.slice(0, 2));
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(fix.componentInstance.page()).toBe(0);
  });

  it('pageSize=2 renders only 2 rows', async () => {
    const fix = TestBed.createComponent(PaginationHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('page=1 renders next slice', async () => {
    const fix = TestBed.createComponent(PaginationHost);
    fix.componentInstance.page.set(1);
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    expect(fix.nativeElement.querySelector('tbody tr td').textContent.trim()).toBe('Bob');
  });

  it('changing page signal updates rendered rows', async () => {
    const fix = TestBed.createComponent(PaginationHost);
    await fix.whenStable();
    // page 0 → Alice, Charlie
    let names = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(names).toEqual(['Alice', 'Charlie']);

    fix.componentInstance.page.set(1);
    await fix.whenStable();
    names = [...fix.nativeElement.querySelectorAll('tbody tr')].map((r: Element) =>
      r.querySelector('td')!.textContent!.trim(),
    );
    expect(names).toEqual(['Bob']);
  });
});

describe('Server pagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('renders every supplied row without client sorting or slicing', async () => {
    const fix = TestBed.createComponent(ServerPaginationHost);
    await fix.whenStable();
    const names = [...fix.nativeElement.querySelectorAll('tbody tr')].map((row: Element) =>
      row.querySelector('td')!.textContent!.trim(),
    );

    expect(names).toEqual(['Alice', 'Charlie', 'Bob']);
  });

  it('emits one load event when the composed paginator changes page', async () => {
    const fix = TestBed.createComponent(ServerPaginationHost);
    await fix.whenStable();
    const next = fix.nativeElement.querySelector('.sn-paginator-next') as HTMLButtonElement;

    next.click();
    await fix.whenStable();

    expect(fix.componentInstance.events).toEqual([
      { first: 6, rows: 2, page: 3, sortField: null, sortOrder: null },
    ]);
    expect(fix.componentInstance.page()).toBe(3);
  });

  it('clamps direct pagination requests to totalRecords', async () => {
    const fix = TestBed.createComponent(ServerPaginationHost);
    await fix.whenStable();
    const table = fix.debugElement.query(By.directive(Table)).componentInstance as Table;

    table.paginate({ first: 990, rows: 10, page: 99 });
    await fix.whenStable();

    expect(fix.componentInstance.events).toEqual([
      { first: 80, rows: 10, page: 8, sortField: null, sortOrder: null },
    ]);
  });

  it('emits one load event when the composed paginator changes row count', async () => {
    const fix = TestBed.createComponent(ServerPaginationHost);
    await fix.whenStable();
    const rowsTrigger = fix.nativeElement.querySelector(
      '.sn-paginator-rows-trigger',
    ) as HTMLButtonElement;

    rowsTrigger.click();
    await fix.whenStable();
    const rowOption = [...document.querySelectorAll<HTMLButtonElement>('.sn-paginator-rows-option')]
      .find((option) => option.textContent?.trim() === '3')!;
    rowOption.click();
    await fix.whenStable();

    expect(fix.componentInstance.events).toEqual([
      { first: 0, rows: 3, page: 0, sortField: null, sortOrder: null },
    ]);
    expect(fix.componentInstance.pageSize()).toBe(3);
  });

  it('emits one load event and keeps supplied order when sorting changes', async () => {
    const fix = TestBed.createComponent(ServerPaginationHost);
    await fix.whenStable();
    const sortButton = fix.nativeElement.querySelector('.sn-table-sort') as HTMLButtonElement;

    sortButton.click();
    await fix.whenStable();
    const names = [...fix.nativeElement.querySelectorAll('tbody tr')].map((row: Element) =>
      row.querySelector('td')!.textContent!.trim(),
    );

    expect(names).toEqual(['Alice', 'Charlie', 'Bob']);
    expect(fix.componentInstance.events).toEqual([
      { first: 0, rows: 2, page: 0, sortField: 'name', sortOrder: 'asc' },
    ]);
    expect(fix.componentInstance.page()).toBe(0);
  });
});

const FIFTY_ROWS = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Row ${i}` }));

@Component({
  template: `
    <sn-table [value]="rows" virtual [rowHeight]="40" [overscan]="2" scrollHeight="300px">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class VirtualHost {
  rows = FIFTY_ROWS;
}

describe('Virtual scroll', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('renders bottom spacer when rows exceed window', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await fix.whenStable();
    // The bottom spacer <tr> is conditionally rendered when bottomSpacerHeight() > 0.
    // In jsdom: viewport=0, start=0, end=2, bottomSpacer=(50-2)*40=1920px
    const spacerRow = fix.nativeElement.querySelector('.sn-table-spacer') as HTMLElement;
    expect(spacerRow).toBeTruthy();
    // Height is applied to the inner .sn-table-spacer-cell <td>, not the <tr>
    const spacerCell = spacerRow.querySelector('.sn-table-spacer-cell') as HTMLElement;
    expect(spacerCell).toBeTruthy();
    expect(spacerCell.style.height).toBeTruthy();
  });

  it('rendered row count is capped (overscan rows only in jsdom where viewport=0)', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr:not(.sn-table-spacer):not(.sn-table-expansion-row)');
    // In jsdom: viewportHeight=0, scrollTop=0 → end = ceil(0/40)+2 = 2
    // generous upper bound to account for overscan variations
    expect(rows.length).toBeLessThanOrEqual(6);
  });
});

@Component({
  template: `
    <sn-table [value]="rows()" hasMore [loadMoreThreshold]="10" (loadMore)="events.push($event)">
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class LoadMoreHost {
  readonly rows = signal(PEOPLE);
  events: TableLoadMoreEvent[] = [];
}

describe('loadMore / infinite scroll', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('fires loadMore on initial render when hasMore=true and jsdom gives scrollHeight≈0', async () => {
    const fix = TestBed.createComponent(LoadMoreHost);
    await fix.whenStable();
    expect(fix.componentInstance.events.length).toBe(1);
  });

  it('does NOT fire twice for the same value length', async () => {
    const fix = TestBed.createComponent(LoadMoreHost);
    await fix.whenStable();
    const count = fix.componentInstance.events.length;
    fix.detectChanges();
    await fix.whenStable();
    expect(fix.componentInstance.events.length).toBe(count);
  });

  it('fires again when value grows', async () => {
    const fix = TestBed.createComponent(LoadMoreHost);
    await fix.whenStable();
    const count = fix.componentInstance.events.length;
    const newRows = [...PEOPLE, { name: 'Dave', age: 28, role: 'User' }, { name: 'Eve', age: 22, role: 'User' }];
    fix.componentInstance.rows.set(newRows);
    await fix.whenStable();
    expect(fix.componentInstance.events.length).toBeGreaterThan(count);
  });
});

@Component({
  template: `
    <sn-table [value]="rows" rowReorder>
      <sn-column field="name" header="Name" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class RowReorderHost {
  rows = PEOPLE;
}

describe('Row/column reorder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('cdk-drop-list class is on tbody when rowReorder=true', async () => {
    const fix = TestBed.createComponent(RowReorderHost);
    await fix.whenStable();
    const tbody = fix.nativeElement.querySelector('tbody');
    expect(tbody.classList).toContain('cdk-drop-list');
  });

  it('body rows have cdk-drag class when rowReorder=true', async () => {
    const fix = TestBed.createComponent(RowReorderHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr:not(.sn-table-spacer):not(.sn-table-expansion-row)');
    rows.forEach((r: Element) => expect(r.classList).toContain('cdk-drag'));
  });
});

@Component({
  template: `
    <sn-table [value]="rows" layout="flex">
      <sn-column field="name" header="Name" />
      <sn-column field="age" header="Age" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class FlexLayoutHost {
  rows = PEOPLE;
}

describe('Flex layout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('layout=flex adds sn-table--flex class on host', async () => {
    const fix = TestBed.createComponent(FlexLayoutHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-table');
    expect(host.classList).toContain('sn-table--flex');
  });

  it('role=table on inner table element when layout=flex', async () => {
    const fix = TestBed.createComponent(FlexLayoutHost);
    await fix.whenStable();
    const table = fix.nativeElement.querySelector('.sn-table-inner');
    expect(table.getAttribute('role')).toBe('table');
  });

  it('role=row on tbody tr when layout=flex', async () => {
    const fix = TestBed.createComponent(FlexLayoutHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tbody tr');
    rows.forEach((r: Element) => expect(r.getAttribute('role')).toBe('row'));
  });

  it('role=cell on tbody td when layout=flex', async () => {
    const fix = TestBed.createComponent(FlexLayoutHost);
    await fix.whenStable();
    const cells = fix.nativeElement.querySelectorAll('tbody td');
    cells.forEach((c: Element) => expect(c.getAttribute('role')).toBe('cell'));
  });
});

@Component({
  template: `
    <sn-table [value]="rows" stickyHeader scrollHeight="200px">
      <sn-column field="name" header="Name" sticky="left" width="120px" />
      <sn-column field="age" header="Age" />
      <sn-column field="role" header="Role" />
    </sn-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Table, TableColumn],
})
class StickyHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <div dir="rtl">
      <sn-table [value]="rows" stickyHeader scrollHeight="200px">
        <sn-column field="name" header="Name" sticky="left" width="120px" />
        <sn-column field="age" header="Age" />
      </sn-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Table, TableColumn],
})
class RtlStickyHost {
  rows = PEOPLE;
}

@Component({
  template: `
    <div dir="rtl">
      <sn-table [value]="rows" stickyHeader scrollHeight="200px">
        <sn-column field="name" header="Name" sticky="start" width="120px" />
        <sn-column field="age" header="Age" />
      </sn-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Table, TableColumn],
})
class RtlLogicalStickyHost {
  rows = PEOPLE;
}

describe('Sticky', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('stickyHeader adds sn-table--sticky-header on host', async () => {
    const fix = TestBed.createComponent(StickyHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-table');
    expect(host.classList).toContain('sn-table--sticky-header');
  });

  it('pins a sticky=left column to the inline start in ltr', async () => {
    const fix = TestBed.createComponent(StickyHost);
    await fix.whenStable();

    expect(fix.nativeElement.querySelector('th.sn-table-cell--sticky-start')).toBeTruthy();
    expect(fix.nativeElement.querySelector('td.sn-table-cell--sticky-start')).toBeTruthy();
  });

  // Physical `left` keeps meaning the physical left edge, which in RTL is the
  // inline END, and the offsets have to accumulate from that side too.
  it('pins a sticky=left column to the inline end in rtl', async () => {
    const fix = TestBed.createComponent(RtlStickyHost);
    await fix.whenStable();

    expect(fix.nativeElement.querySelector('th.sn-table-cell--sticky-end')).toBeTruthy();
    expect(fix.nativeElement.querySelector('th.sn-table-cell--sticky-start')).toBeNull();
  });

  it('pins a sticky=start column to the inline start in either direction', async () => {
    const fix = TestBed.createComponent(RtlLogicalStickyHost);
    await fix.whenStable();

    expect(fix.nativeElement.querySelector('th.sn-table-cell--sticky-start')).toBeTruthy();
    expect(fix.nativeElement.querySelector('th.sn-table-cell--sticky-end')).toBeNull();
  });
});

@Component({
  template: `
    <table snTable [striped]="true" [stack]="stack" snTableSort (snSortChange)="sorts.push($event)">
      <thead>
        <tr>
          <th snSortHeader="name">Name</th>
          <th>Dept</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows; track row.name) {
          <tr>
            <td>{{ row.name }}</td>
            <td>{{ row.dept }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TableStyle, TableSort, TableSortHeader],
})
class DirectiveModeHost {
  rows = [
    { name: 'Alice', dept: 'Eng' },
    { name: 'Bob', dept: 'Design' },
    { name: 'Charlie', dept: 'QA' },
  ];
  sorts: unknown[] = [];
  stack: 'sm' | 'md' | 'lg' | null = null;
}

describe('Directive mode (table[snTable])', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('applies sn-table-native class', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('table').classList).toContain('sn-table-native');
  });

  it('striped input adds sn-table-native--striped class', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('table').classList).toContain('sn-table-native--striped');
  });

  it('stack input adds the breakpoint stack class', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    const table = fix.nativeElement.querySelector('table') as HTMLElement;
    expect(table.classList).not.toContain('sn-table-native-stack-md');
    fix.componentInstance.stack = 'md';
    fix.changeDetectorRef.markForCheck();
    await fix.whenStable();
    expect(table.classList).toContain('sn-table-native-stack-md');
    expect(table.classList).toContain('sn-table-native');
  });

  it('TableSort + TableSortHeader: click cycles asc→desc→none emitting snSortChange each time', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    const th = fix.nativeElement.querySelector('th[snSortHeader]') as HTMLElement;

    th.click();
    await fix.whenStable();
    expect(fix.componentInstance.sorts[0]).toEqual({ field: 'name', order: 'asc' });

    th.click();
    await fix.whenStable();
    expect(fix.componentInstance.sorts[1]).toEqual({ field: 'name', order: 'desc' });

    th.click();
    await fix.whenStable();
    expect(fix.componentInstance.sorts[2]).toEqual({ field: null, order: null });
  });

  it('aria-sort attribute follows sort state on th[snSortHeader]', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    const th = fix.nativeElement.querySelector('th[snSortHeader]') as HTMLElement;

    expect(th.getAttribute('aria-sort')).toBeNull();

    th.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('ascending');

    th.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBe('descending');

    th.click();
    await fix.whenStable();
    expect(th.getAttribute('aria-sort')).toBeNull();
  });

  it('Enter key also cycles sort', async () => {
    const fix = TestBed.createComponent(DirectiveModeHost);
    await fix.whenStable();
    const th = fix.nativeElement.querySelector('th[snSortHeader]') as HTMLElement;
    th.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fix.whenStable();
    expect(fix.componentInstance.sorts.length).toBeGreaterThan(0);
    expect(fix.componentInstance.sorts[0]).toEqual({ field: 'name', order: 'asc' });
  });
});
