import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  contentChild,
  input,
} from '@angular/core';
import { snNextId } from 'ashen-ui/core';
import { TableCellDef } from './table-cell-def';

/**
 * - `data` - regular data column (default).
 * - `actions` - trailing action buttons; never sortable, cells don't truncate.
 */
export type TableColumnType = 'data' | 'actions';

@Component({
  selector: 'sn-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an unbound row type must stay usable in cell templates
export class TableColumn<T = any> {
  readonly field = input<string>('');
  readonly header = input('');
  readonly width = input<string>();
  /** Any CSS `text-align` keyword. `start` and `end` follow the direction. */
  readonly align = input<'start' | 'center' | 'end' | 'left' | 'right'>('start');
  readonly sortable = input(false, { transform: booleanAttribute });
  readonly sortValue = input<((row: T) => unknown) | undefined>(undefined);
  readonly type = input<TableColumnType>('data');
  /**
   * Pin the column to an edge while the table scrolls horizontally.
   *
   * `start` and `end` follow the reading direction; `left` and `right` name a
   * physical edge and stay there in either direction.
   */
  readonly sticky = input<'start' | 'end' | 'left' | 'right' | undefined>(undefined);

  readonly cellDef = contentChild(TableCellDef);

  /** Stable identity for column reordering (survives field duplicates). */
  readonly columnId = snNextId('sn-table-col');
}
