import { Directive, TemplateRef, inject } from '@angular/core';

export interface PaginatorReportContext {
  first: number;
  last: number;
  total: number;
  page: number;
  pageCount: number;
  rows: number;
}

export type PaginatorReportFormatter = (context: PaginatorReportContext) => string;

@Directive({
  selector: 'ng-template[snPaginatorReport]',
})
export class PaginatorReport {
  readonly templateRef = inject<TemplateRef<PaginatorReportContext>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: PaginatorReport,
    _context: unknown,
  ): _context is PaginatorReportContext {
    return true;
  }
}
