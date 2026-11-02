import {
  Component,
  Directive,
  DoCheck,
  OnInit,
  viewChild,
  input,
  provideZonelessChangeDetection,
  type Type,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SN_FORM_FIELD,
  SnImmediateErrorStateMatcher,
  SnErrorStateMatcher,
  type SnFormFieldContext,
} from 'ashen-ui/core';
import { snControlStatus } from './sn-control-status';

function makeField(): SnFormFieldContext {
  return {
    controlId: () => 'test-control',
    setControlId: () => {},
    invalid: () => false,
    required: () => false,
    hasError: () => false,
    filled: () => false,
    getDescribedBy: () => null,
    registerFocus: () => {},
    setInvalid: () => {},
    setRequired: () => {},
    setFilled: vi.fn(),
    setLabelWidth: () => {},
    registerDescribedBy: () => {},
    unregisterDescribedBy: () => {},
    isReady: () => true,
    setErrorState: vi.fn(),
  };
}

let field = makeField();

/**
 * A directive on a native input, which is the shape that made this primitive
 * necessary: `DefaultValueAccessor` is already the accessor, so the directive
 * must not provide one of its own.
 */
@Directive({
  selector: 'input[trackedInput]',
  host: {
    '[attr.aria-invalid]': 'status.invalid() ? "true" : null',
    '(blur)': 'status.markTouched()',
  },
})
class TrackedInput implements OnInit, DoCheck {
  readonly invalid = input(false);
  readonly seen: unknown[] = [];

  readonly status = snControlStatus({
    invalid: this.invalid,
    onValueChange: (value) => this.seen.push(value),
  });

  ngOnInit(): void {
    this.status.connect();
  }

  // A native input has no value accessor, so sync() runs from ngDoCheck.
  ngDoCheck(): void {
    this.status.sync();
  }
}

@Component({
  imports: [ReactiveFormsModule, TrackedInput],
  providers: [{ provide: SN_FORM_FIELD, useFactory: () => field }],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<input trackedInput [formControl]="control" [invalid]="invalid" />',
})
class ReactiveHost {
  readonly control = new FormControl('', Validators.required);
  invalid = false;
}

@Component({
  imports: [FormsModule, TrackedInput],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form>
      <input trackedInput name="name" required [(ngModel)]="name" />
    </form>
  `,
})
class SubmittedHost {
  name = '';
}

@Component({
  imports: [ReactiveFormsModule, TrackedInput],
  providers: [{ provide: SN_FORM_FIELD, useFactory: () => field }],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="form">
      <input trackedInput formControlName="name" />
    </form>
  `,
})
class ReactiveSubmitHost {
  readonly form = new FormGroup({ name: new FormControl('', Validators.required) });
  readonly directive = viewChild.required(FormGroupDirective);
}

@Component({
  imports: [ReactiveFormsModule, TrackedInput],
  providers: [{ provide: SN_FORM_FIELD, useFactory: () => field }],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="group">
      <input trackedInput formControlName="name" />
    </form>
  `,
})
class SwappableGroupHost {
  group = new FormGroup({ name: new FormControl('', Validators.required) });
}

@Component({
  imports: [TrackedInput],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<input trackedInput />',
})
class UnboundHost {}

describe('snControlStatus', () => {
  function setup<T>(host: Type<T>, providers: unknown[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...(providers as [])],
    });
    return TestBed.createComponent(host);
  }

  beforeEach(() => {
    field = makeField();
  });

  it('is not errored while the control is untouched and pristine', async () => {
    const fixture = setup(ReactiveHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(fixture.componentInstance.control.invalid).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('becomes errored once the control is touched', async () => {
    const fixture = setup(ReactiveHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(fixture.componentInstance.control.touched).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('stops being errored when the control becomes valid again', async () => {
    const fixture = setup(ReactiveHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    fixture.componentInstance.control.setValue('typed');
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('reports errored for an explicit invalid override with no control interaction', async () => {
    const fixture = setup(ReactiveHost);
    fixture.componentInstance.invalid = true;
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(fixture.componentInstance.control.touched).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('becomes errored on form submission without any interaction', async () => {
    const fixture = setup(SubmittedHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('reports errors again after a reset following a submit (F5b)', async () => {
    const fixture = setup(ReactiveSubmitHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.directive().resetForm();
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBeNull();

    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('becomes errored when markAllAsTouched is called on the group directly (F5a)', async () => {
    const fixture = setup(SwappableGroupHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();

    fixture.componentInstance.group.markAllAsTouched();
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears the error when the FormGroup is swapped for an already-valid one (F5c)', async () => {
    const fixture = setup(SwappableGroupHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    // The submitted flag lives on the directive, so it survives the control swap.
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    // A field write does not mark the view dirty under zoneless, so markForCheck is needed.
    const newGroup = new FormGroup({ name: new FormControl('valid') });
    fixture.componentInstance.group = newGroup;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('clears once the new control gets a value after swapping to an empty group (F5c)', async () => {
    const fixture = setup(SwappableGroupHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const nextGroup = new FormGroup({ name: new FormControl('', Validators.required) });
    fixture.componentInstance.group = nextGroup;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const directive = fixture.debugElement
      .query((node) => !!node.injector.get(TrackedInput, null))
      .injector.get(TrackedInput);
    expect(directive.status.control?.control).toBe(nextGroup.get('name'));

    nextGroup.get('name')?.setValue('typed');
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('reports every value forms writes, so a host can re-derive emptiness', async () => {
    const fixture = setup(ReactiveHost);
    await fixture.whenStable();
    const directive = fixture.debugElement
      .query((node) => !!node.injector.get(TrackedInput, null))
      .injector.get(TrackedInput);

    fixture.componentInstance.control.setValue('one');
    fixture.componentInstance.control.setValue('two');
    await fixture.whenStable();

    expect(directive.seen).toEqual(['one', 'two']);
  });

  it('reports the error state to the enclosing field so autoDisplayErrors can react', async () => {
    const fixture = setup(ReactiveHost);
    await fixture.whenStable();
    vi.mocked(field.setErrorState).mockClear();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(field.setErrorState).toHaveBeenCalledWith(true);
  });

  it('honours a replaced error-state matcher', async () => {
    const fixture = setup(ReactiveHost, [
      { provide: SnErrorStateMatcher, useClass: SnImmediateErrorStateMatcher },
    ]);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(fixture.componentInstance.control.touched).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('stays quiet with no forms directive on the element', async () => {
    const fixture = setup(UnboundHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(input.getAttribute('aria-invalid')).toBeNull();
  });
});
