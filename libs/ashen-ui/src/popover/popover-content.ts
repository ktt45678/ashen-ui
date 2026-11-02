import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[snPopoverContent]',
})
export class PopoverContent {
  readonly templateRef = inject(TemplateRef);
}
