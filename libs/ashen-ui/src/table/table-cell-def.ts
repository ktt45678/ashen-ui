import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[snCellDef]',
})
export class TableCellDef {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
