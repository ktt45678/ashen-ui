import { Directive, TemplateRef, inject } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an unbound row type must stay usable in cell templates
export interface TableExpansionContext<T = any> {
  $implicit: T;
  index: number;
}

/**
 * Row-expansion template. Project into `sn-table`:
 * `<ng-template snExpansionDef let-row>…</ng-template>`
 * Its presence enables expandable rows (a chevron column is added automatically).
 */
@Directive({
  selector: 'ng-template[snExpansionDef]',
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an unbound row type must stay usable in cell templates
export class TableExpansionDef<T = any> {
  readonly templateRef = inject<TemplateRef<TableExpansionContext<T>>>(TemplateRef);
}
