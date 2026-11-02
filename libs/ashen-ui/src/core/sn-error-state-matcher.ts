import { Injectable } from '@angular/core';
import type { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * When a control should be shown as errored.
 *
 * The default policy: invalid AND the user has interacted
 * (touched or dirty) or the form has been submitted. It is a good default and
 * the wrong thing to hardcode, apps commonly standardise on `touched` only,
 * and some show errors eagerly. Override it at any injector level:
 *
 * ```ts
 * providers: [{ provide: SnErrorStateMatcher, useClass: SnTouchedErrorStateMatcher }]
 * ```
 *
 * Because this is a DI token, an app can scope a policy to a route or a single
 * form rather than only application-wide.
 *
 * CONCRETE, and root-provided: the base class IS the default policy. An
 * abstract base with `providedIn: 'root'` on a subclass would register the
 * subclass under its OWN token, so `inject(SnErrorStateMatcher)` would throw
 * NullInjectorError in every app that had not overridden it. This shape is
 * deliberate, and is what Material does for the same reason.
 */
@Injectable({ providedIn: 'root' })
export class SnErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!control?.invalid && (control.touched || control.dirty || !!form?.submitted);
  }
}

/**
 * Show errors only once the control has been touched, ignore `dirty` and form
 * submission. Errors therefore appear on blur rather than while typing.
 *
 * Opt in with
 * `{ provide: SnErrorStateMatcher, useClass: SnTouchedErrorStateMatcher }`.
 */
@Injectable()
export class SnTouchedErrorStateMatcher extends SnErrorStateMatcher {
  // `form` is unused but kept so the subclass stays substitutable for the base.
  override isErrorState(
    control: AbstractControl | null,
    _form?: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!control?.invalid && control.touched;
  }
}

/**
 * Show errors as soon as the control is invalid, before any interaction. Useful
 * for forms that are validated up-front, e.g. an edit form seeded with data
 * that is already out of date.
 *
 * Opt in with
 * `{ provide: SnErrorStateMatcher, useClass: SnImmediateErrorStateMatcher }`.
 */
@Injectable()
export class SnImmediateErrorStateMatcher extends SnErrorStateMatcher {
  override isErrorState(
    control: AbstractControl | null,
    _form?: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!control?.invalid;
  }
}
