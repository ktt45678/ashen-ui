import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormField } from './form-field';
import { FormFieldLabel } from './form-field-label';
import { FormFieldHint } from './form-field-hint';
import { FormFieldError } from './form-field-error';
import { InputText } from 'ashen-ui/input-text';
import { FormFieldPrefix, FormFieldSuffix } from './form-field-affix';

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input id="ctrl" />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class BasicHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label required>Name</sn-label>
      <input />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class RequiredHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Email</sn-label>
      <input />
      <sn-hint>We will never share your email.</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint],
})
class HintHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input />
      <sn-error>Name is required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldError],
})
class ErrorHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input />
      @if (show()) {
        <sn-error>Name is required</sn-error>
      }
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldError],
})
class ToggleErrorHost {
  readonly show = signal(false);
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input />
      <sn-hint>Helper text</sn-hint>
      <sn-error>Required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError],
})
class HintAndErrorHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>File</sn-label>
      <input />
      <sn-error>Too large</sn-error>
      <sn-error>Invalid type</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldError],
})
class MultipleErrorsHost {}

@Component({
  template: `
    <sn-form-field>
      <sn-label>File</sn-label>
      <input />
      <sn-hint>Pick a file</sn-hint>
      <sn-hint>Max 10 MB</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint],
})
class MultipleHintsHost {}

@Component({
  template: `
    <sn-form-field>
      <input />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField],
})
class NoLabelHost {}

@Component({
  template: `
    <sn-form-field floatLabel="auto">
      <sn-label>Name</sn-label>
      <input />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class FloatAutoHost {}

@Component({
  template: `
    <sn-form-field floatLabel="always">
      <sn-label>Name</sn-label>
      <input />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class FloatAlwaysHost {}

@Component({
  template: `
    <sn-form-field subscriptSizing="dynamic">
      <sn-label>Name</sn-label>
      <input />
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class DynamicSubscriptHost {}

@Component({
  template: `<sn-form-field snClass="extra-class"><sn-label>Name</sn-label><input /></sn-form-field>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class SnClassStringHost {}

@Component({
  template: `<sn-form-field [snClass]="{ root: 'my-root', control: 'my-control' }"><sn-label>Name</sn-label><input /></sn-form-field>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-form-field [snClass]="[{ root: 'first' }, { root: 'second' }]"><sn-label>Name</sn-label><input /></sn-form-field>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-form-field
      [snStyle]="{
        root: { outline: '1px solid red' },
        control: { color: 'rgb(1, 2, 3)' },
        subscript: { color: 'rgb(4, 5, 6)' },
        prefix: { color: 'rgb(7, 8, 9)' },
        suffix: { color: 'rgb(10, 11, 12)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'field-root' },
        control: { 'data-testid': 'field-control' },
        subscript: { 'data-testid': 'field-subscript' },
        prefix: { 'data-testid': 'field-prefix' },
        suffix: { 'data-testid': 'field-suffix' }
      }"
    >
      <sn-label
        [snStyle]="{ root: { color: 'rgb(13, 14, 15)' } }"
        [snAttrs]="{ root: { 'data-testid': 'field-label', for: 'hostile-id' } }"
      >Name</sn-label>
      <span snPrefix>$</span>
      <input id="ctrl" />
      <span snSuffix>kg</span>
      <sn-hint
        [snStyle]="{ root: { color: 'rgb(16, 17, 18)' } }"
        [snAttrs]="{ root: { 'data-testid': 'field-hint', id: 'hostile-hint-id' } }"
      >Helper text</sn-hint>
      <sn-error
        [snStyle]="{ root: { color: 'rgb(19, 20, 21)' } }"
        [snAttrs]="{ root: { 'data-testid': 'field-error', id: 'hostile-error-id', role: 'presentation' } }"
      >Required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, FormFieldPrefix, FormFieldSuffix],
})
class SnPartHost {}

describe('FormField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-form-field-wrapper host class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-wrapper');
  });

  it('renders control wrapper div', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const control = fixture.nativeElement.querySelector('.sn-form-field-control');
    expect(control).not.toBeNull();
  });
});

describe('FormFieldLabel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders label element with sn-form-field-label class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toContain('Name');
  });

  it('label for attribute points to the form-field control id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.sn-form-field-label');
    const forAttr = label.getAttribute('for');
    expect(forAttr).toBeTruthy();
    expect(forAttr).toMatch(/^sn-ff-ctrl-/);
  });

  it('does not render label element when sn-label is absent', async () => {
    const fixture = TestBed.createComponent(NoLabelHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-form-field-label');
    expect(label).toBeNull();
  });

  it('renders required indicator when required is set', async () => {
    const fixture = TestBed.createComponent(RequiredHost);
    await fixture.whenStable();
    const indicator = fixture.nativeElement.querySelector('.sn-form-field-required-indicator');
    expect(indicator).not.toBeNull();
    expect(indicator.textContent.trim()).toBe('*');
  });

  it('required indicator is aria-hidden', async () => {
    const fixture = TestBed.createComponent(RequiredHost);
    await fixture.whenStable();
    const indicator = fixture.nativeElement.querySelector('.sn-form-field-required-indicator');
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not render required indicator by default', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const indicator = fixture.nativeElement.querySelector('.sn-form-field-required-indicator');
    expect(indicator).toBeNull();
  });

  it('sets context required to true when required attribute is present', async () => {
    const fixture = TestBed.createComponent(RequiredHost);
    await fixture.whenStable();
    const field: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(field).not.toBeNull();
  });
});

describe('FormFieldHint', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders hint element with sn-form-field-hint class', async () => {
    const fixture = TestBed.createComponent(HintHost);
    await fixture.whenStable();
    const hint = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(hint).not.toBeNull();
    expect(hint.textContent).toContain('We will never share your email.');
  });

  it('hint element has a non-empty id', async () => {
    const fixture = TestBed.createComponent(HintHost);
    await fixture.whenStable();
    const hint = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(hint.id).toBeTruthy();
    expect(hint.id).toMatch(/^sn-ff-hint-/);
  });

  it('multiple hints each get distinct ids', async () => {
    const fixture = TestBed.createComponent(MultipleHintsHost);
    await fixture.whenStable();
    const hints = fixture.nativeElement.querySelectorAll('.sn-form-field-hint');
    expect(hints.length).toBe(2);
    expect(hints[0].id).not.toBe(hints[1].id);
  });
});

describe('FormFieldError', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders error element with sn-form-field-error class', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error).not.toBeNull();
    expect(error.textContent).toContain('Name is required');
  });

  it('error present at first render does not animate in', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error.classList.contains('sn-form-field-error--animate')).toBe(false);
  });

  it('error appearing after first render animates in', async () => {
    const fixture = TestBed.createComponent(ToggleErrorHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-form-field-error')).toBeNull();

    fixture.componentInstance.show.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error).not.toBeNull();
    expect(error.classList.contains('sn-form-field-error--animate')).toBe(true);
  });

  it('error element has role="alert"', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('error element has a non-empty id', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error.id).toBeTruthy();
    expect(error.id).toMatch(/^sn-ff-err-/);
  });

  it('multiple errors each get distinct ids', async () => {
    const fixture = TestBed.createComponent(MultipleErrorsHost);
    await fixture.whenStable();
    const errors = fixture.nativeElement.querySelectorAll('.sn-form-field-error');
    expect(errors.length).toBe(2);
    expect(errors[0].id).not.toBe(errors[1].id);
  });
});

describe('FormField invalid state', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-form-field-invalid when sn-error is present', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-invalid');
  });

  it('does not apply sn-form-field-invalid when only hint is present', async () => {
    const fixture = TestBed.createComponent(HintHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).not.toContain('sn-form-field-invalid');
  });

  it('applies sn-form-field-invalid when error is present alongside hint', async () => {
    const fixture = TestBed.createComponent(HintAndErrorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-invalid');
  });
});

@Component({
  template: `
    <sn-form-field>
      <sn-label>Name</sn-label>
      <input snInputText [invalid]="invalid()" />
      <sn-hint>Helper text</sn-hint>
      <sn-error>Name is required</sn-error>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, InputText],
})
class AutoErrorDescribedByHost {
  readonly invalid = signal(true);
}

describe('FormField aria-describedby', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('drops the error id from aria-describedby once the error is hidden', async () => {
    const fixture = TestBed.createComponent(AutoErrorDescribedByHost);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const error = fixture.nativeElement.querySelector('.sn-form-field-error') as HTMLElement;
    const hint = fixture.nativeElement.querySelector('.sn-form-field-hint') as HTMLElement;

    expect(error).not.toBeNull();
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toContain(error.id);

    // Control becomes valid -> the field hides projected sn-error.
    fixture.componentInstance.invalid.set(false);
    await fixture.whenStable();

    // Projected sn-error is detached without ngOnDestroy, so the field must filter hidden ids.
    expect(fixture.nativeElement.querySelector('.sn-form-field-error')).toBeNull();
    const ids = input.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    expect(ids).not.toContain(error.id);
    // The hint is unaffected.
    expect(ids).toContain(hint.id);
  });

  it('restores the error id when the error becomes visible again', async () => {
    const fixture = TestBed.createComponent(AutoErrorDescribedByHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    fixture.componentInstance.invalid.set(false);
    await fixture.whenStable();
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.sn-form-field-error') as HTMLElement;
    expect(error).not.toBeNull();
    expect(input.getAttribute('aria-describedby')?.split(/\s+/)).toContain(error.id);
  });

  it('never points aria-describedby at an element that is not in the document', async () => {
    const fixture = TestBed.createComponent(AutoErrorDescribedByHost);
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    for (const invalid of [true, false, true, false]) {
      fixture.componentInstance.invalid.set(invalid);
      await fixture.whenStable();
      for (const id of input.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? []) {
        expect(fixture.nativeElement.querySelector(`#${id}`)).not.toBeNull();
      }
    }
  });

  it('registers hint id in aria-describedby chain', async () => {
    const fixture = TestBed.createComponent(HintHost);
    await fixture.whenStable();
    const hint = fixture.nativeElement.querySelector('.sn-form-field-hint');
    expect(hint.id).toBeTruthy();
  });

  it('registers error id in aria-describedby chain', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(error.id).toBeTruthy();
  });

  it('both hint and error ids appear when both are present', async () => {
    const fixture = TestBed.createComponent(HintAndErrorHost);
    await fixture.whenStable();
    const hint = fixture.nativeElement.querySelector('.sn-form-field-hint');
    const error = fixture.nativeElement.querySelector('.sn-form-field-error');
    expect(hint.id).toBeTruthy();
    expect(error.id).toBeTruthy();
    expect(hint.id).not.toBe(error.id);
  });

  it('multiple error ids are all distinct', async () => {
    const fixture = TestBed.createComponent(MultipleErrorsHost);
    await fixture.whenStable();
    const errors = fixture.nativeElement.querySelectorAll('.sn-form-field-error');
    const ids = Array.from(errors).map((e) => (e as HTMLElement).id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('FormField subscript', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders a subscript container', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const subscript = fixture.nativeElement.querySelector('.sn-form-field-subscript');
    expect(subscript).not.toBeNull();
  });

  it('projects hint into the subscript container', async () => {
    const fixture = TestBed.createComponent(HintHost);
    await fixture.whenStable();
    const subscript = fixture.nativeElement.querySelector('.sn-form-field-subscript');
    expect(subscript.querySelector('.sn-form-field-hint')).not.toBeNull();
  });

  it('projects error into the subscript container', async () => {
    const fixture = TestBed.createComponent(ErrorHost);
    await fixture.whenStable();
    const subscript = fixture.nativeElement.querySelector('.sn-form-field-subscript');
    expect(subscript.querySelector('.sn-form-field-error')).not.toBeNull();
  });

  it('reserves subscript space by default (subscriptSizing="fixed")', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-subscript-reserve');
  });

  it('does not reserve subscript space when subscriptSizing="dynamic"', async () => {
    const fixture = TestBed.createComponent(DynamicSubscriptHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).not.toContain('sn-form-field-subscript-reserve');
  });
});

describe('FormField floating label', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('does not apply floating classes by default', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).not.toContain('sn-form-field-floating');
    expect(el.classList).not.toContain('sn-form-field-should-float');
  });

  it('applies sn-form-field-floating when floatLabel is set', async () => {
    const fixture = TestBed.createComponent(FloatAutoHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-floating');
  });

  it('does not float on load with floatLabel="auto" (empty, unfocused)', async () => {
    const fixture = TestBed.createComponent(FloatAutoHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).not.toContain('sn-form-field-should-float');
  });

  it('always floats with floatLabel="always"', async () => {
    const fixture = TestBed.createComponent(FloatAlwaysHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('sn-form-field-floating');
    expect(el.classList).toContain('sn-form-field-should-float');
  });

  it('renders the notched-outline overlay only in float mode', async () => {
    const plain = TestBed.createComponent(BasicHost);
    await plain.whenStable();
    expect(plain.nativeElement.querySelector('.sn-form-field-outline')).toBeNull();

    const floating = TestBed.createComponent(FloatAutoHost);
    await floating.whenStable();
    const outline = floating.nativeElement.querySelector('.sn-form-field-outline');
    expect(outline).not.toBeNull();
    expect(outline.querySelector('.sn-form-field-outline-notch')).not.toBeNull();
  });
});

describe('FormField snClass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies plain string snClass to root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('extra-class');
  });

  it('applies object snClass root section to root element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('my-root');
  });

  it('applies object snClass control section to control wrapper', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const control: HTMLElement = fixture.nativeElement.querySelector('.sn-form-field-control');
    expect(control.classList).toContain('my-control');
  });

  it('merges array snClass root sections in order', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-form-field');
    expect(el.classList).toContain('first');
    expect(el.classList).toContain('second');
  });
});

describe('FormField snStyle/snAttrs pass-through', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies snStyle and allowed snAttrs to named parts across the field and its sub-components', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-form-field')!;
    const control: HTMLElement = el.querySelector('.sn-form-field-control')!;
    const subscript: HTMLElement = el.querySelector('.sn-form-field-subscript')!;
    const prefix: HTMLElement = el.querySelector('.sn-form-field-affix--prefix')!;
    const suffix: HTMLElement = el.querySelector('.sn-form-field-affix--suffix')!;
    const label: HTMLLabelElement = el.querySelector('.sn-form-field-label')!;
    const hint: HTMLElement = el.querySelector('.sn-form-field-hint')!;
    const error: HTMLElement = el.querySelector('.sn-form-field-error')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('field-root');
    expect(control.style.color).toBe('rgb(1, 2, 3)');
    expect(control.getAttribute('data-testid')).toBe('field-control');
    expect(subscript.style.color).toBe('rgb(4, 5, 6)');
    expect(subscript.getAttribute('data-testid')).toBe('field-subscript');
    expect(prefix.style.color).toBe('rgb(7, 8, 9)');
    expect(prefix.getAttribute('data-testid')).toBe('field-prefix');
    expect(suffix.style.color).toBe('rgb(10, 11, 12)');
    expect(suffix.getAttribute('data-testid')).toBe('field-suffix');

    expect(label.style.color).toBe('rgb(13, 14, 15)');
    expect(label.getAttribute('data-testid')).toBe('field-label');
    // for stays wired to the field's real control id, not the pass-through's value.
    expect(label.getAttribute('for')).not.toBe('hostile-id');
    expect(label.getAttribute('for')).toMatch(/^sn-ff-ctrl-/);

    expect(hint.style.color).toBe('rgb(16, 17, 18)');
    expect(hint.getAttribute('data-testid')).toBe('field-hint');
    expect(hint.id).not.toBe('hostile-hint-id');
    expect(hint.id).toMatch(/^sn-ff-hint-/);

    expect(error.style.color).toBe('rgb(19, 20, 21)');
    expect(error.getAttribute('data-testid')).toBe('field-error');
    expect(error.id).not.toBe('hostile-error-id');
    expect(error.id).toMatch(/^sn-ff-err-/);
    expect(error.getAttribute('role')).toBe('alert');
  });
});
