import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectButton } from './select-button';
import { SelectOption } from './select-option';

@Component({
  template: `
    <sn-select-button [(value)]="value" [multiple]="multiple()" [disabled]="disabled()">
      <button snSelectOption value="a">A</button>
      <button snSelectOption value="b">B</button>
      <button snSelectOption value="c" [disabled]="optionCDisabled()">C</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption],
})
class TestHostComponent {
  value: unknown = undefined;
  readonly multiple = signal(false);
  readonly disabled = signal(false);
  readonly optionCDisabled = signal(false);
}

@Component({
  template: `
    <sn-select-button [formControl]="ctrl">
      <button snSelectOption value="x">X</button>
      <button snSelectOption value="y">Y</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption, ReactiveFormsModule],
})
class ReactiveFormSingleHost {
  readonly ctrl = new FormControl<unknown>('x');
}

@Component({
  template: `
    <sn-select-button [(ngModel)]="val">
      <button snSelectOption value="p">P</button>
      <button snSelectOption value="q">Q</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption, FormsModule],
})
class NgModelSingleHost {
  readonly val = signal<unknown>('p');
}

@Component({
  template: `
    <sn-select-button [(value)]="value" [multiple]="true">
      <button snSelectOption value="a">A</button>
      <button snSelectOption value="b">B</button>
      <button snSelectOption value="c">C</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption],
})
class MultipleHostComponent {
  value: unknown = [];
}

@Component({
  template: `
    <sn-select-button [formControl]="ctrl" [multiple]="true">
      <button snSelectOption value="x">X</button>
      <button snSelectOption value="y">Y</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption, ReactiveFormsModule],
})
class ReactiveFormMultipleHost {
  readonly ctrl = new FormControl<unknown[]>([]);
}

@Component({
  template: `
    <sn-select-button [(ngModel)]="val" [multiple]="true">
      <button snSelectOption value="p">P</button>
      <button snSelectOption value="q">Q</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption, FormsModule],
})
class NgModelMultipleHost {
  readonly val = signal<unknown[]>(['p']);
}

@Component({
  template: `
    <sn-select-button
      [snStyle]="{ root: { outline: '1px solid red' } }"
      [snAttrs]="{ root: { 'data-testid': 'sb-root', role: 'toolbar', 'aria-disabled': 'true' } }"
    >
      <button snSelectOption value="a">A</button>
    </sn-select-button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SelectButton, SelectOption],
})
class SnPartHost {}

function optionButtons(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
  return Array.from(
    fixture.nativeElement.querySelectorAll('button[snSelectOption]'),
  ) as HTMLButtonElement[];
}

describe('SelectButton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders with role="group"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.getAttribute('role')).toBe('group');
  });

  it('has .sn-select-button class on host', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList).toContain('sn-select-button');
  });

  it('adds .sn-select-button-disabled and aria-disabled="true" when disabled', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList).toContain('sn-select-button-disabled');
    expect(host.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not set aria-disabled when enabled', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.getAttribute('aria-disabled')).toBeNull();
  });

  it('renders buttons with type="button"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button');
    });
  });

  it('all option buttons have .sn-select-option class', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.classList).toContain('sn-select-option');
    });
  });

  it('buttons start with aria-pressed="false"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('single: clicking option A sets value to "a"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('a');
  });

  it('single: clicking A then B switches selection to "b"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('b');
  });

  it('single: selected option has aria-pressed="true"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('single: selected option has .sn-select-option-selected', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(optionButtons(fix)[0].classList).toContain('sn-select-option-selected');
  });

  it('multiple: clicking A adds "a" to the array', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a']);
  });

  it('multiple: clicking A then B results in ["a","b"]', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a', 'b']);
  });

  it('multiple: clicking A twice removes it', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual([]);
  });

  it('multiple: selected options aria-pressed reflects correctly', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[2].getAttribute('aria-pressed')).toBe('false');
  });

  it('disabled group: all buttons have disabled attribute', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('disabled group: clicking does not change value', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeUndefined();
  });

  it('per-option disabled: option C has disabled attribute', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    expect(optionButtons(fix)[2].disabled).toBe(true);
  });

  it('per-option disabled: clicking disabled option does not change value', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    optionButtons(fix)[2].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeUndefined();
  });

  it('CVA single: initial FormControl value "x" reflects in aria-pressed', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('CVA single: clicking Y updates FormControl value to "y"', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toBe('y');
  });

  it('CVA single: FormControl.setValue("y") selects Y', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.setValue('y');
    await fix.whenStable();
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('CVA single: FormControl.disable() disables all buttons', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('CVA ngModel single: initial value "p" reflects in aria-pressed', async () => {
    const fix = TestBed.createComponent(NgModelSingleHost);
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('CVA ngModel single: clicking Q updates value to "q"', async () => {
    const fix = TestBed.createComponent(NgModelSingleHost);
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.val()).toBe('q');
  });

  it('CVA multiple: initial empty array reflects no selected options', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
  });

  it('CVA multiple: clicking X sets FormControl value to ["x"]', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    optionButtons(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toEqual(['x']);
  });

  it('CVA multiple: FormControl.setValue(["x","y"]) selects both', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.setValue(['x', 'y']);
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('CVA multiple: FormControl.disable() disables all buttons', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    optionButtons(fix).forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('CVA ngModel multiple: initial value ["p"] shows P selected', async () => {
    const fix = TestBed.createComponent(NgModelMultipleHost);
    await fix.whenStable();
    expect(optionButtons(fix)[0].getAttribute('aria-pressed')).toBe('true');
    expect(optionButtons(fix)[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('CVA ngModel multiple: clicking Q adds "q" to the array', async () => {
    const fix = TestBed.createComponent(NgModelMultipleHost);
    await fix.whenStable();
    optionButtons(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.val()).toEqual(['p', 'q']);
  });

  it('snClass string applies to group root', async () => {
    @Component({
      template: `<sn-select-button snClass="custom-cls"><button snSelectOption value="a">A</button></sn-select-button>`,
      imports: [SelectButton, SelectOption],
    })
    class SnClassHost {}

    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList).toContain('custom-cls');
  });

  it('snClass object root section applies to group host', async () => {
    @Component({
      template: `<sn-select-button [snClass]="cls"><button snSelectOption value="a">A</button></sn-select-button>`,
      imports: [SelectButton, SelectOption],
    })
    class SnClassObjHost {
      cls = { root: 'obj-root-cls' };
    }

    const fix = TestBed.createComponent(SnClassObjHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList).toContain('obj-root-cls');
  });

  it('snClass string applies to SelectOption root', async () => {
    @Component({
      template: `<sn-select-button><button snSelectOption value="a" snClass="opt-cls">A</button></sn-select-button>`,
      imports: [SelectButton, SelectOption],
    })
    class SnClassOptHost {}

    const fix = TestBed.createComponent(SnClassOptHost);
    await fix.whenStable();
    const btn = fix.nativeElement.querySelector('button[snSelectOption]') as HTMLElement;
    expect(btn.classList).toContain('opt-cls');
  });

  it('By.css("button[snSelectOption]") finds option buttons', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const found = fix.debugElement.queryAll(By.css('button[snSelectOption]'));
    expect(found.length).toBe(3);
  });

  it('does not have sn-select-button-animate immediately after first render', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.detectChanges();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList.contains('sn-select-button-animate')).toBe(false);
  });

  it('adds sn-select-button-animate after two animation frames', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;
    expect(host.classList.contains('sn-select-button-animate')).toBe(true);
  });

  it('applies snStyle and allowed snAttrs to the root without changing group semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select-button') as HTMLElement;

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('sb-root');
    // role and aria-disabled are library-owned; the hostile overrides never land.
    expect(host.getAttribute('role')).toBe('group');
    expect(host.getAttribute('aria-disabled')).toBeNull();
  });
});
