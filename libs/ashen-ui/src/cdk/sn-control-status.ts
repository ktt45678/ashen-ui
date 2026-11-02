import {
  DestroyRef,
  Directive,
  InjectionToken,
  Injector,
  computed,
  effect,
  inject,
  signal,
  type DoCheck,
  type Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroupDirective,
  NgControl,
  NgForm,
  ValueChangeEvent,
  type AbstractControl,
} from '@angular/forms';
import type { Subscription } from 'rxjs';
import { SN_FORM_FIELD, SnErrorStateMatcher } from 'ashen-ui/core';

export interface SnControlStatusConfig {
  /**
   * An explicit override, normally the component's own `invalid` input. When it
   * reports `true` the matcher is not consulted at all.
   */
  invalid?: Signal<boolean>;
  /**
   * Called with the control's value whenever forms writes one. Components use
   * this to re-report emptiness, which is the one part of status tracking that
   * differs between them: a text input reads its DOM value, a tags input counts
   * its array.
   */
  onValueChange?: (value: unknown) => void;
}

export interface SnControlStatusRef {
  /** Whether the control should render as errored. */
  readonly invalid: Signal<boolean>;
  /** The bound control, or `null` outside a forms directive. */
  readonly control: NgControl | null;
  /**
   * Resolve the bound control and start tracking it. Call from `ngOnInit`, see
   * {@link snControlStatus} for why it cannot happen on construction.
   */
  connect(): void;
  /**
   * Compare the tracked control against `ngControl.control` and re-subscribe
   * if forms swapped it out from under `connect()`, which is what a
   * `[formGroup]` re-binding does. Idempotent and cheap; safe to call on
   * every change-detection cycle.
   */
  sync(): void;
  /** Mark the control touched, which is what a blur means to forms. */
  markTouched(): void;
}

/**
 * DI handle a host directive uses to reach a component's `snControlStatus()`
 * without the composable's return value becoming that component's public
 * API. Provide it with `useExisting: forwardRef(() => YourComponent)` and
 * implement `sync()` by delegating to the composable's own `sync()`. See
 * {@link SnControlStatusSync}.
 */
export const SN_CONTROL_STATUS = new InjectionToken<{ sync(): void }>('SN_CONTROL_STATUS');

/**
 * Runs `sync()` every change-detection cycle, for the two consumers that
 * cannot run it from `writeValue` because they do not own their value
 * accessor: `input[snInputText]` and `textarea[snTextarea]` are directives on
 * native elements, so Angular's `DefaultValueAccessor` is already their
 * accessor and `setUpControl` calls its `writeValue`, not theirs. Attach
 * through `hostDirectives` rather than hand-writing `ngDoCheck` into each
 * component, which keeps the composable itself lifecycle-free.
 */
@Directive({})
export class SnControlStatusSync implements DoCheck {
  private readonly status = inject(SN_CONTROL_STATUS);

  ngDoCheck(): void {
    this.status.sync();
  }
}

/**
 * Error-state tracking for a form control, with no opinion about its value.
 *
 * `snFormControl()` owns the value accessor. This owns the other half: whether
 * the control counts as errored right now, and telling the enclosing form field
 * so `autoDisplayErrors` can reveal messages at the right moment. They compose,
 * but they are deliberately separate, because the components that need status
 * tracking most are the ones that must NOT have a custom value accessor.
 * `input[snInputText]` and `textarea[snTextarea]` are directives on native
 * elements, so Angular's own `DefaultValueAccessor` is already their accessor,
 * and adding a second `NG_VALUE_ACCESSOR` breaks subsequent `ngModel` writes.
 *
 * ```ts
 * private readonly status = snControlStatus({
 *   invalid: this.invalid,
 *   onValueChange: () => this.updateFilled(),
 * });
 *
 * protected readonly effectiveInvalid = this.status.invalid;
 *
 * ngOnInit(): void {
 *   this.status.connect();
 * }
 * ```
 *
 * `connect()` is separate from construction because a component that provides
 * `NG_VALUE_ACCESSOR` itself cannot inject `NgControl` while it is being
 * constructed: the directive that would supply it is still waiting on this one.
 * Resolving in `ngOnInit` is how the four consumers already did it, and it is
 * the same shape Material's error-state tracker uses for the same reason.
 *
 * Two cases are not tracked, both by the caller's explicit request:
 * `setValidators()` or `setErrors()` followed by
 * `updateValueAndValidity({ emitEvent: false })`, and `resetForm(value, {
 * emitEvent: false })`. Both are reflected on the next change detection that
 * reads `invalid` for any other reason. Material has the same hole.
 */
export function snControlStatus(config: SnControlStatusConfig = {}): SnControlStatusRef {
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);
  const field = inject(SN_FORM_FIELD, { optional: true });
  const matcher = inject(SnErrorStateMatcher);
  const parentForm = inject(NgForm, { optional: true });
  const parentFormGroup = inject(FormGroupDirective, { optional: true });

  let ngControl: NgControl | null = null;
  let trackedControl: AbstractControl | null | undefined;
  let controlSub: Subscription | null = null;

  /**
   * Bumped whenever forms reports anything that could change the answer.
   *
   * An `AbstractControl` is not signal-based, so nothing about reading
   * `touched`, `dirty` or `invalid` is reactive. One counter is enough: the old
   * shape mirrored each flag into its own signal and then read all of them
   * purely to register a dependency, never for the values themselves.
   */
  const revision = signal(0);
  const bump = (): void => revision.update((n) => n + 1);

  const invalid = computed(() => {
    if (config.invalid?.() === true) return true;
    revision();
    return matcher.isErrorState(
      ngControl?.control ?? null,
      parentFormGroup ?? parentForm,
    );
  });

  // Sync once before the first render so the hidden error does not flash, then keep it live.
  field?.setErrorState(invalid());
  effect(() => field?.setErrorState(invalid()));

  function sync(): void {
    const ctrl = ngControl?.control ?? null;
    if (ctrl === trackedControl) return;

    controlSub?.unsubscribe();
    trackedControl = ctrl;
    controlSub = ctrl
      ? ctrl.events.pipe(takeUntilDestroyed(destroyRef)).subscribe((event) => {
          bump();
          if (event instanceof ValueChangeEvent) config.onValueChange?.(ctrl.value);
        })
      : null;

    // The control changed identity, so its current touched, dirty and value state is news.
    bump();
  }

  return {
    invalid,
    get control() {
      return ngControl;
    },
    connect() {
      ngControl = injector.get(NgControl, null, { self: true, optional: true });

      // Bound to the directive, so a `[formGroup]` swap needs no re-subscribe.
      const form = parentFormGroup ?? parentForm;
      form?.ngSubmit.pipe(takeUntilDestroyed(destroyRef)).subscribe(bump);

      sync();
    },
    sync,
    markTouched() {
      ngControl?.control?.markAsTouched();
      bump();
    },
  };
}
