import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({ selector: 'ng-template[snAutoCompleteOption]' })
export class AutoCompleteOptionTemplate<T = unknown> {
  readonly templateRef = inject<TemplateRef<AutoCompleteOptionContext<T>>>(TemplateRef);
}

@Directive({ selector: 'ng-template[snAutoCompleteSelectedValue]' })
export class AutoCompleteSelectedValueTemplate<T = unknown> {
  readonly templateRef = inject<TemplateRef<AutoCompleteSelectedValueContext<T>>>(TemplateRef);
}

@Directive({ selector: 'ng-template[snAutoCompleteSummary]' })
export class AutoCompleteSummaryTemplate<T = unknown> {
  readonly templateRef = inject<TemplateRef<AutoCompleteSummaryContext<T>>>(TemplateRef);
}

export interface AutoCompleteOptionContext<T> {
  $implicit: T;
  index: number;
  selected: boolean;
}

export interface AutoCompleteSelectedValueContext<T> {
  $implicit: T;
  index: number;
  /** Every selected value, for a template that renders a single combined badge. */
  values: readonly T[];
  /** Deselects this value, so a template can supply its own remove control. */
  remove: () => void;
}

export interface AutoCompleteSummaryContext<T> {
  $implicit: readonly T[];
  values: readonly T[];
  hidden: readonly T[];
  count: number;
}
