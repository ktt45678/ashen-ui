import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Table } from 'ashen-ui/table';
import { TableColumn } from 'ashen-ui/table';
import { TableCellDef } from 'ashen-ui/table';
import { TableExpansionDef } from 'ashen-ui/table';
import { TableStyle } from 'ashen-ui/table';
import { TableSort } from 'ashen-ui/table';
import { TableSortHeader } from 'ashen-ui/table';
import type { TableLoadEvent, TableRowReorderEvent } from 'ashen-ui/table';
import { Tag } from 'ashen-ui/tag';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import { Paginator, PageChangeEvent } from 'ashen-ui/paginator';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

interface FileRow {
  name: string;
  size: number;
  type: string;
  modified: string;
}

@Component({
  selector: 'app-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Table, TableColumn, TableCellDef, TableExpansionDef, TableStyle, TableSort, TableSortHeader, Tag, Button, Icon, Paginator, DocExample, DocApi],
  templateUrl: './table-page.html',
  styleUrl: './table-page.scss',
})
export class TablePage {
  protected readonly files: FileRow[] = [
    { name: 'dashboard.ts', size: 4200, type: 'source', modified: '2026-07-10' },
    { name: 'styles.css', size: 980, type: 'style', modified: '2026-07-08' },
    { name: 'README.md', size: 1540, type: 'doc', modified: '2026-07-01' },
    { name: 'angular.json', size: 12300, type: 'config', modified: '2026-06-20' },
    { name: 'main.ts', size: 320, type: 'source', modified: '2026-07-12' },
  ];

  protected readonly selectedIndex = signal<number | null>(null);
  protected readonly sortChanges = signal<string>('');

  protected readonly multiSelection = signal<FileRow[]>([]);
  protected readonly singleSelection = signal<FileRow[]>([]);

  protected readonly expandedKeys = signal<unknown[]>([]);
  protected readonly rowExpandEvents = signal<string>('');

  protected onRowExpand(e: { row: FileRow; expanded: boolean }): void {
    this.rowExpandEvents.set(`${e.row.name}: ${e.expanded ? 'expanded' : 'collapsed'}`);
  }

  protected readonly tablePageSignal = signal(0);
  protected readonly paginatorPageSize = signal(2);

  protected readonly serverRows = signal<FileRow[]>(this.files.slice(0, 2));
  protected readonly serverPage = signal(0);
  protected readonly serverPageSize = signal<number | undefined>(2);
  protected readonly serverRequest = signal('');

  protected onPaginatorChange(e: PageChangeEvent): void {
    this.tablePageSignal.set(e.page);
    this.paginatorPageSize.set(e.rows);
  }

  protected onServerLoad(event: TableLoadEvent): void {
    const rows = [...this.files];
    if (event.sortField && event.sortOrder) {
      const direction = event.sortOrder === 'asc' ? 1 : -1;
      rows.sort((left, right) =>
        String(left[event.sortField as keyof FileRow]).localeCompare(
          String(right[event.sortField as keyof FileRow]),
          undefined,
          { numeric: true },
        ) * direction,
      );
    }
    this.serverRows.set(rows.slice(event.first, event.first + event.rows));
    this.serverRequest.set(JSON.stringify(event));
  }

  protected readonly virtualRows = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Row ${i}`,
    value: Math.round(Math.random() * 1000),
  }));

  protected readonly loadedCount = signal(50);
  protected readonly hasMore = signal(true);
  protected readonly infiniteRows = signal(
    Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Item ${i}`, score: i * 2 })),
  );

  protected onLoadMore(_e: { lastIndex: number }): void {
    const current = this.loadedCount();
    if (current >= 500) {
      this.hasMore.set(false);
      return;
    }
    const next = Math.min(current + 50, 500);
    this.infiniteRows.set(
      Array.from({ length: next }, (_, i) => ({ id: i, name: `Item ${i}`, score: i * 2 })),
    );
    this.loadedCount.set(next);
    if (next >= 500) this.hasMore.set(false);
  }

  protected readonly reorderRows = signal([
    { id: 1, name: 'Alpha', priority: 'High' },
    { id: 2, name: 'Beta', priority: 'Medium' },
    { id: 3, name: 'Gamma', priority: 'Low' },
    { id: 4, name: 'Delta', priority: 'High' },
    { id: 5, name: 'Epsilon', priority: 'Medium' },
  ]);
  protected readonly lastReorderEvent = signal<string>('');

  protected onRowReordered(e: TableRowReorderEvent<{ name: string }>): void {
    this.lastReorderEvent.set(`"${e.row.name}" moved: index ${e.previousIndex} → ${e.currentIndex}`);
  }

  protected readonly columnReorderRows = [
    { name: 'Alice', dept: 'Engineering', level: 'Senior', location: 'Remote' },
    { name: 'Bob', dept: 'Design', level: 'Mid', location: 'Office' },
    { name: 'Charlie', dept: 'QA', level: 'Junior', location: 'Remote' },
    { name: 'Diana', dept: 'Product', level: 'Lead', location: 'Office' },
  ];
  protected readonly lastColumnReorderEvent = signal<string>('');

  protected onColumnReordered(e: { previousIndex: number; currentIndex: number }): void {
    this.lastColumnReorderEvent.set(`Column moved: index ${e.previousIndex} → ${e.currentIndex}`);
  }

  protected readonly directiveRows = [
    { name: 'Alice', dept: 'Eng' },
    { name: 'Bob', dept: 'Design' },
    { name: 'Charlie', dept: 'QA' },
  ];
  protected readonly directiveSortState = signal<string>('');

  protected onDirectiveSort(e: { field: string | null; order: string | null }): void {
    this.directiveSortState.set(e.field ? `${e.field} ${e.order}` : 'none');
  }

  protected onSortChange(event: { field: string | null; order: 'asc' | 'desc' | null }): void {
    this.sortChanges.set(event.field ? `${event.field} ${event.order}` : 'none');
  }

}
