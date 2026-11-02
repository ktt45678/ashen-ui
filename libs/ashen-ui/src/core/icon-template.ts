import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: 'ng-template[snIcon]',
})
export class IconTemplate {
  readonly templateRef = inject(TemplateRef);
  readonly snIcon = input('');
}
