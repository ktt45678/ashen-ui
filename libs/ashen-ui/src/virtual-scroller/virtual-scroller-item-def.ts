import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[snItemDef]',
})
export class VirtualScrollerItemDef {
  readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
