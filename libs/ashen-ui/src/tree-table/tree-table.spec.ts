import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { provideSnIntl } from 'ashen-ui/core';
import { TableColumn, TableCellDef } from 'ashen-ui/table';
import { TreeTable } from './tree-table';
import type { TreeTableNode } from './tree-table';

const FLAT_NODES: TreeTableNode[] = [
  { key: 'a', data: { name: 'Alpha', size: '1 KB', modified: '2026-01-01' } },
  { key: 'b', data: { name: 'Beta', size: '2 KB', modified: '2026-01-02' } },
  { key: 'c', data: { name: 'Gamma', size: '3 KB', modified: '2026-01-03' } },
];

const NESTED_NODES: TreeTableNode[] = [
  {
    key: 'root1',
    icon: 'folder',
    data: { name: 'Documents', size: '-', modified: '2026-07-01' },
    children: [
      { key: 'child1', icon: 'description', data: { name: 'notes.txt', size: '4 KB', modified: '2026-07-05' } },
      { key: 'child2', data: { name: 'resume.pdf', size: '120 KB', modified: '2026-06-20' } },
    ],
  },
  {
    key: 'root2',
    data: { name: 'Downloads', size: '-', modified: '2026-07-10' },
    children: [
      {
        key: 'child3',
        data: { name: 'software', size: '-', modified: '2026-07-08' },
        children: [
          { key: 'grandchild1', data: { name: 'setup.exe', size: '200 MB', modified: '2026-07-08' } },
        ],
      },
    ],
  },
  { key: 'root3', data: { name: 'Pictures', size: '-', modified: '2026-06-15' } },
];

@Component({
  template: `
    <sn-tree-table [nodes]="nodes">
      <sn-column field="name" header="Name" />
      <sn-column field="size" header="Size" />
      <sn-column field="modified" header="Modified" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class BasicHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes" [expandedKeys]="expanded">
      <sn-column field="name" header="Name" />
      <sn-column field="size" header="Size" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class NestedCollapsedHost {
  nodes = NESTED_NODES;
  expanded: readonly string[] = [];
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes" [(expandedKeys)]="expanded">
      <sn-column field="name" header="Name" />
      <sn-column field="size" header="Size" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class InteractiveHost {
  nodes = NESTED_NODES;
  readonly expanded = signal<readonly string[]>([]);
}

@Component({
  template: `
    <div dir="rtl">
      <sn-tree-table [nodes]="nodes" [(expandedKeys)]="expanded">
        <sn-column field="name" header="Name" />
      </sn-tree-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, TreeTable, TableColumn],
})
class RtlHost {
  nodes = NESTED_NODES;
  readonly expanded = signal<readonly string[]>([]);
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes" ariaLabel="File system" [expandedKeys]="[]">
      <sn-column field="name" header="Name" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class AriaLabelHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes" [snClass]="{ root: 'my-root', row: 'my-row', cell: 'my-cell', toggle: 'my-toggle' }">
      <sn-column field="name" header="Name" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class SnClassHost {
  nodes = NESTED_NODES;
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes">
      <sn-column field="name" header="Name">
        <ng-template snCellDef let-data let-node="node">
          <span class="custom-cell">{{ data['name'] }}-custom</span>
        </ng-template>
      </sn-column>
      <sn-column field="size" header="Size" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn, TableCellDef],
})
class CellDefHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `
    <sn-tree-table [nodes]="nodes">
      <sn-column field="name" header="Name">
        <ng-template snCellDef let-data let-node="node">
          <span class="node-ref">{{ node.key }}</span>
        </ng-template>
      </sn-column>
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn, TableCellDef],
})
class CellDefNodeContextHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `
    <sn-tree-table
      [nodes]="nodes"
      [expandedKeys]="expanded"
      [snStyle]="{
        root: { outline: '1px solid red' },
        table: { color: 'rgb(1, 2, 3)' },
        header: { color: 'rgb(4, 5, 6)' },
        row: { color: 'rgb(7, 8, 9)' },
        cell: { color: 'rgb(10, 11, 12)' },
        toggle: { color: 'rgb(13, 14, 15)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tt-root' },
        table: { 'data-testid': 'tt-table', role: 'presentation' },
        header: { 'data-testid': 'tt-header' },
        row: { 'data-testid': 'tt-row', role: 'listitem' },
        cell: { 'data-testid': 'tt-cell' },
        toggle: { 'data-testid': 'tt-toggle' }
      }"
    >
      <sn-column field="name" header="Name" />
      <sn-column field="size" header="Size" />
    </sn-tree-table>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeTable, TableColumn],
})
class SnPartHost {
  nodes = NESTED_NODES;
  expanded: readonly string[] = ['root1'];
}

describe('TreeTable', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing treegrid semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-tree-table') as HTMLElement;

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('tt-root');

    const table = host.querySelector('.sn-tree-table-inner') as HTMLElement;
    expect(table.style.color).toBe('rgb(1, 2, 3)');
    expect(table.getAttribute('data-testid')).toBe('tt-table');
    // The treegrid role is library-owned and survives the pass-through.
    expect(table.getAttribute('role')).toBe('treegrid');

    const header = host.querySelector('.sn-tree-table-header-row') as HTMLElement;
    expect(header.style.color).toBe('rgb(4, 5, 6)');
    expect(header.getAttribute('data-testid')).toBe('tt-header');

    const row = host.querySelector('.sn-tree-table-row') as HTMLElement;
    expect(row.style.color).toBe('rgb(7, 8, 9)');
    expect(row.getAttribute('data-testid')).toBe('tt-row');
    expect(row.getAttribute('role')).toBe('row');

    const cell = host.querySelector('.sn-tree-table-td') as HTMLElement;
    expect(cell.style.color).toBe('rgb(10, 11, 12)');
    expect(cell.getAttribute('data-testid')).toBe('tt-cell');

    const toggle = host.querySelector('.sn-tree-table-toggle') as HTMLElement;
    expect(toggle.style.color).toBe('rgb(13, 14, 15)');
    expect(toggle.getAttribute('data-testid')).toBe('tt-toggle');
  });

  it('renders thead with column headers from projected sn-columns', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const ths = fix.nativeElement.querySelectorAll('th[scope="col"]');
    expect(ths.length).toBe(3);
    expect(ths[0].textContent.trim()).toBe('Name');
    expect(ths[1].textContent.trim()).toBe('Size');
    expect(ths[2].textContent.trim()).toBe('Modified');
  });

  it('table element has role="treegrid"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const table = fix.nativeElement.querySelector('table');
    expect(table.getAttribute('role')).toBe('treegrid');
  });

  it('renders only root rows when nothing expanded', async () => {
    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('tr[role="row"]');
    expect(rows.length).toBe(3);
  });

  it('toggle expands parent row - child rows appear and aria-expanded flips', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const root1Row = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1Row.getAttribute('aria-expanded')).toBe('false');

    const toggle = root1Row.querySelector('.sn-tree-table-toggle');
    toggle.click();
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');
    const root1RowAfter = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1RowAfter.getAttribute('aria-expanded')).toBe('true');

    const rows = fix.nativeElement.querySelectorAll('tr[role="row"]');
    expect(rows.length).toBe(5);
  });

  it('expandedKeys model updates when toggle clicked', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toEqual([]);

    const toggle = fix.nativeElement.querySelector('.sn-tree-table-toggle');
    toggle.click();
    await fix.whenStable();

    expect(fix.componentInstance.expanded().length).toBe(1);

    toggle.click();
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toEqual([]);
  });

  it('first-column padding-left grows with depth', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1', 'root2', 'child3']);
    await fix.whenStable();

    const root1Row = fix.nativeElement.querySelector('[data-key="root1"]');
    const root1Td = root1Row.querySelectorAll('td')[0];
    expect(root1Td.style.paddingLeft).toBe('12px');

    const child1Row = fix.nativeElement.querySelector('[data-key="child1"]');
    const child1Td = child1Row.querySelectorAll('td')[0];
    expect(child1Td.style.paddingLeft).toBe('32px');

    const grandchildRow = fix.nativeElement.querySelector('[data-key="grandchild1"]');
    const grandchildTd = grandchildRow.querySelectorAll('td')[0];
    expect(grandchildTd.style.paddingLeft).toBe('52px');
  });

  it('aria-level / posinset / setsize correct on nested rows', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1', 'root2', 'child3']);
    await fix.whenStable();

    const root1Row = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1Row.getAttribute('aria-level')).toBe('1');
    expect(root1Row.getAttribute('aria-setsize')).toBe('3');
    expect(root1Row.getAttribute('aria-posinset')).toBe('1');

    const child1Row = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1Row.getAttribute('aria-level')).toBe('2');
    expect(child1Row.getAttribute('aria-setsize')).toBe('2');
    expect(child1Row.getAttribute('aria-posinset')).toBe('1');

    const grandchildRow = fix.nativeElement.querySelector('[data-key="grandchild1"]');
    expect(grandchildRow.getAttribute('aria-level')).toBe('3');
    expect(grandchildRow.getAttribute('aria-setsize')).toBe('1');
    expect(grandchildRow.getAttribute('aria-posinset')).toBe('1');
  });

  it('leaf rows have no aria-expanded', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1Row = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1Row.getAttribute('aria-expanded')).toBeNull();

    const root3Row = fix.nativeElement.querySelector('[data-key="root3"]');
    expect(root3Row.getAttribute('aria-expanded')).toBeNull();
  });

  it('uses SnIntl.treeTableLabel as default aria-label', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const table = fix.nativeElement.querySelector('table[role="treegrid"]');
    expect(table.getAttribute('aria-label')).toBe('Tree table');
  });

  it('ariaLabel input overrides SnIntl default', async () => {
    const fix = TestBed.createComponent(AriaLabelHost);
    await fix.whenStable();
    const table = fix.nativeElement.querySelector('table[role="treegrid"]');
    expect(table.getAttribute('aria-label')).toBe('File system');
  });

  it('exactly one row has tabindex=0', async () => {
    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();

    const rows: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('tr[role="row"]');
    const zeros = [...rows].filter((el) => el.getAttribute('tabindex') === '0');
    expect(zeros.length).toBe(1);
    expect(zeros[0].getAttribute('data-key')).toBe('root1');
  });

  it('ArrowDown / ArrowUp traversal', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const rows: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('tr[role="row"]');
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fix.whenStable();

    expect(rows[1].getAttribute('tabindex')).toBe('0');
    expect(rows[0].getAttribute('tabindex')).toBe('-1');

    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await fix.whenStable();

    expect(rows[0].getAttribute('tabindex')).toBe('0');
  });

  it('ArrowRight expands collapsed parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');
  });

  it('ArrowRight on expanded parent moves to first child', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    const child1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1Row.getAttribute('tabindex')).toBe('0');
  });

  it('ArrowLeft expands a collapsed parent in rtl', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');
  });

  it('ArrowRight collapses an expanded parent in rtl', async () => {
    const fix = TestBed.createComponent(RtlHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).not.toContain('root1');
  });

  it('ArrowLeft collapses expanded parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).not.toContain('root1');
  });

  it('ArrowLeft on non-expanded node moves focus to parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    child1Row.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1Row.getAttribute('tabindex')).toBe('0');
  });

  it('Home moves focus to first visible row', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const rows: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('tr[role="row"]');
    rows[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fix.whenStable();

    expect(rows[0].getAttribute('tabindex')).toBe('0');
  });

  it('End moves focus to last visible row', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const rows: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('tr[role="row"]');
    rows[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fix.whenStable();

    expect(rows[rows.length - 1].getAttribute('tabindex')).toBe('0');
  });

  it('collapse hiding active row relocates active to ancestor', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    child1Row.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await fix.whenStable();

    fix.componentInstance.expanded.set([]);
    await fix.whenStable();

    const root1Row: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1Row.getAttribute('tabindex')).toBe('0');
  });

  it('non-first-column cells have muted color class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const row = fix.nativeElement.querySelector('tr[role="row"]');
    const tds = row.querySelectorAll('td');
    expect(tds[0].classList).not.toContain('sn-tree-table-td--muted');
    expect(tds[1].classList).toContain('sn-tree-table-td--muted');
    expect(tds[2].classList).toContain('sn-tree-table-td--muted');
  });

  it('snCellDef template renders with data context', async () => {
    const fix = TestBed.createComponent(CellDefHost);
    await fix.whenStable();

    const customCells = fix.nativeElement.querySelectorAll('.custom-cell');
    expect(customCells.length).toBe(3);
    expect(customCells[0].textContent.trim()).toBe('Alpha-custom');
  });

  it('snCellDef template receives node context variable', async () => {
    const fix = TestBed.createComponent(CellDefNodeContextHost);
    await fix.whenStable();

    const nodeRefs = fix.nativeElement.querySelectorAll('.node-ref');
    expect(nodeRefs.length).toBe(3);
    expect(nodeRefs[0].textContent.trim()).toBe('a');
    expect(nodeRefs[1].textContent.trim()).toBe('b');
  });

  it('node icons render as ligature text content', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1Row = fix.nativeElement.querySelector('[data-key="root1"]');
    const icon = root1Row.querySelector('.sn-tree-table-node-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('folder');

    const child1Row = fix.nativeElement.querySelector('[data-key="child1"]');
    const childIcon = child1Row.querySelector('.sn-tree-table-node-icon');
    expect(childIcon.textContent.trim()).toBe('description');
  });

  it('SnIntl treeTableLabel override changes table aria-label', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ treeTableLabel: 'Árbol de datos' }),
      ],
    });

    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const table = fix.nativeElement.querySelector('table[role="treegrid"]');
    expect(table.getAttribute('aria-label')).toBe('Árbol de datos');
  });

  it('SnIntl treeExpand / treeCollapse used for toggle aria-label', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ treeExpand: 'Abrir', treeCollapse: 'Cerrar' }),
      ],
    });

    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();

    const toggle = fix.nativeElement.querySelector('.sn-tree-table-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Abrir');
  });

  it('snClass root string lands on host element', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-tree-table');
    expect(host.classList).toContain('my-root');
  });
});
