import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Paginator, PaginatorReport, PageChangeEvent } from 'ashen-ui/paginator';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-paginator-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Paginator, PaginatorReport, DocExample, DocApi],
  templateUrl: './paginator-page.html',
  styleUrl: './paginator-page.scss',
})
export class PaginatorPage {
  protected readonly page = signal(0);
  protected readonly pageMiddle = signal(5);
  protected readonly pageRows = signal(0);
  protected readonly rowsValue = signal(10);
  protected readonly pageSnClass = signal(0);

  protected onPageChange(e: PageChangeEvent) {
    this.page.set(e.page);
  }

  protected onMiddlePageChange(e: PageChangeEvent) {
    this.pageMiddle.set(e.page);
  }

  protected onRowsPageChange(e: PageChangeEvent) {
    this.pageRows.set(e.page);
    this.rowsValue.set(e.rows);
  }

}
