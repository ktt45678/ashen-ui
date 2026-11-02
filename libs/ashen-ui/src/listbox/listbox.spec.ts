import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Listbox } from './listbox';
import { ListOption } from './list-option';
import { SN_LISTBOX } from './listbox-token';
import { SnIntl, provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `
    <sn-listbox
      [(value)]="value"
      [multiple]="multiple()"
      [disabled]="disabled()"
      [checkmark]="checkmark()"
    >
      <sn-list-option value="a">Apple</sn-list-option>
      <sn-list-option value="b">Banana</sn-list-option>
      <sn-list-option value="c" [disabled]="optionCDisabled()">Cherry</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption],
})
class TestHostComponent {
  value: unknown = null;
  readonly multiple = signal(false);
  readonly disabled = signal(false);
  readonly optionCDisabled = signal(false);
  readonly checkmark = signal(true);
}

@Component({
  template: `
    <sn-listbox [formControl]="ctrl">
      <sn-list-option value="x">X</sn-list-option>
      <sn-list-option value="y">Y</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption, ReactiveFormsModule],
})
class ReactiveFormSingleHost {
  readonly ctrl = new FormControl<unknown>('x');
}

@Component({
  template: `
    <sn-listbox [(ngModel)]="val">
      <sn-list-option value="p">P</sn-list-option>
      <sn-list-option value="q">Q</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption, FormsModule],
})
class NgModelSingleHost {
  readonly val = signal<unknown>('p');
}

@Component({
  template: `
    <sn-listbox [(value)]="value" [multiple]="true">
      <sn-list-option value="a">Apple</sn-list-option>
      <sn-list-option value="b">Banana</sn-list-option>
      <sn-list-option value="c">Cherry</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption],
})
class MultipleHostComponent {
  value: unknown = [];
}

@Component({
  template: `
    <sn-listbox [formControl]="ctrl" [multiple]="true">
      <sn-list-option value="x">X</sn-list-option>
      <sn-list-option value="y">Y</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption, ReactiveFormsModule],
})
class ReactiveFormMultipleHost {
  readonly ctrl = new FormControl<unknown[]>([]);
}

@Component({
  template: `
    <sn-listbox [(value)]="value">
      @for (opt of options(); track opt) {
        <sn-list-option [value]="opt">{{ opt }}</sn-list-option>
      }
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption],
})
class ForLoopHostComponent {
  value: unknown = null;
  readonly options = signal(['a', 'b', 'c']);
}

// A hand-written option host that answers only the required members, so isSelected stays optional.
@Component({
  template: `
    <div role="listbox">
      <sn-list-option value="a">Apple</sn-list-option>
      <sn-list-option value="b">Banana</sn-list-option>
    </div>
  `,
  imports: [ListOption],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: SN_LISTBOX,
      useValue: {
        value: signal<unknown>('b'),
        multiple: signal(false),
        isDisabled: signal(false),
        toggle: () => {},
        getTabIndex: () => -1,
        onTouched: () => {},
      },
    },
  ],
})
class MinimalContextHost {}

function listboxEl(fixture: { nativeElement: HTMLElement }): HTMLElement {
  return fixture.nativeElement.querySelector('sn-listbox') as HTMLElement;
}

function optionEls(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('sn-list-option')) as HTMLElement[];
}

const KEY_CODES: Record<string, number> = {
  ArrowDown: 40,
  ArrowUp: 38,
  Home: 36,
  End: 35,
  Enter: 13,
  ' ': 32,
  b: 66,
};

function dispatchKeydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      keyCode: KEY_CODES[key] ?? 0,
      bubbles: true,
      cancelable: true,
    }),
  );
}

describe('Listbox', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('host has role="listbox"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('role')).toBe('listbox');
  });

  it('options have role="option"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix).forEach((o) => expect(o.getAttribute('role')).toBe('option'));
  });

  it('does NOT set aria-multiselectable in single mode', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('aria-multiselectable')).toBeNull();
  });

  it('sets aria-multiselectable="true" when multiple=true', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.multiple.set(true);
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('aria-multiselectable')).toBe('true');
  });

  it('renders options from @for without NG0950 and gives the first option tabindex 0', async () => {
    const fix = TestBed.createComponent(ForLoopHostComponent);
    await fix.whenStable();
    const opts = optionEls(fix);
    expect(opts.length).toBe(3);
    expect(opts[0].getAttribute('tabindex')).toBe('0');
    expect(opts[1].getAttribute('tabindex')).toBe('-1');
    expect(opts[2].getAttribute('tabindex')).toBe('-1');
  });

  it('has .sn-listbox class on host', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    expect(listboxEl(fix).classList).toContain('sn-listbox');
  });

  it('single: click option A sets value to "a"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('a');
  });

  it('single: clicking A then B switches selection to "b"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('b');
  });

  it('single: re-clicking the selected option keeps it selected', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('a');
  });

  it('single: selected option has aria-selected="true"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(optionEls(fix)[0].getAttribute('aria-selected')).toBe('true');
    expect(optionEls(fix)[1].getAttribute('aria-selected')).toBe('false');
  });

  it('single: selected option has .sn-listbox-option-selected', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(optionEls(fix)[1].classList).toContain('sn-listbox-option-selected');
    expect(optionEls(fix)[0].classList).not.toContain('sn-listbox-option-selected');
  });

  it('no check icon unless checkmark is asked for', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.checkmark.set(false);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.nativeElement.querySelectorAll('sn-list-option sn-icon').length).toBe(0);
  });

  it('check icon shows only on selected option', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    const icons = fix.nativeElement.querySelectorAll('sn-list-option sn-icon');
    expect(icons.length).toBe(1);
    expect(optionEls(fix)[0].contains(icons[0])).toBe(true);
  });

  it('multiple: clicking A adds "a" to the array', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a']);
  });

  it('multiple: clicking A then B results in ["a","b"]', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a', 'b']);
  });

  it('multiple: clicking A twice removes it', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual([]);
  });

  it('disabled option is not selectable', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    optionEls(fix)[2].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
  });

  it('disabled option has aria-disabled="true"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    expect(optionEls(fix)[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('disabled option has .sn-listbox-option-disabled', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    expect(optionEls(fix)[2].classList).toContain('sn-listbox-option-disabled');
  });

  it('disabled listbox blocks all interactions', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
  });

  it('disabled listbox has aria-disabled="true"', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('aria-disabled')).toBe('true');
  });

  it('first enabled option has tabindex=0 when nothing selected', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    expect(optionEls(fix)[0].getAttribute('tabindex')).toBe('0');
    expect(optionEls(fix)[1].getAttribute('tabindex')).toBe('-1');
  });

  it('selected option gets tabindex=0', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(optionEls(fix)[1].getAttribute('tabindex')).toBe('0');
    expect(optionEls(fix)[0].getAttribute('tabindex')).toBe('-1');
  });

  it('a context that omits isSelected still marks the matching option', async () => {
    const fix = TestBed.createComponent(MinimalContextHost);
    await fix.whenStable();
    const opts = optionEls(fix);
    expect(opts[1].getAttribute('aria-selected')).toBe('true');
    expect(opts[0].getAttribute('aria-selected')).toBe('false');
  });

  // aria-selected (option) and the roving tabindex (listbox) must agree on what is selected.
  it('multiple: the roving tabindex lands on an option that reports itself selected', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();

    const entryPoint = optionEls(fix).find((el) => el.getAttribute('tabindex') === '0');
    expect(entryPoint).toBe(optionEls(fix)[1]);
    expect(entryPoint?.getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowDown moves focus to first option on first press', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    expect(document.activeElement).toBe(optionEls(fix)[0]);
  });

  it('ArrowDown twice moves focus to second option', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    expect(document.activeElement).toBe(optionEls(fix)[1]);
  });

  it('ArrowUp from second option moves focus to first', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(lb, 'ArrowUp');
    await fix.whenStable();
    expect(document.activeElement).toBe(optionEls(fix)[0]);
  });

  it('disabled option is skipped by arrow keys', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    fix.componentInstance.optionCDisabled.set(true);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    expect(document.activeElement).not.toBe(optionEls(fix)[2]);
  });

  it('Home and End move focus to the first and last enabled options', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'End');
    await fix.whenStable();
    expect(document.activeElement).toBe(optionEls(fix)[2]);
    dispatchKeydown(lb, 'Home');
    await fix.whenStable();
    expect(document.activeElement).toBe(optionEls(fix)[0]);
  });

  it('type-ahead focuses the next matching enabled option', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    vi.useFakeTimers();
    try {
      dispatchKeydown(listboxEl(fix), 'b');
      vi.advanceTimersByTime(200);
      expect(document.activeElement).toBe(optionEls(fix)[1]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('Enter activates the active option', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(document.activeElement as HTMLElement, 'Enter');
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('a');
  });

  it('Space activates the active option', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const lb = listboxEl(fix);
    dispatchKeydown(lb, 'ArrowDown');
    await fix.whenStable();
    dispatchKeydown(document.activeElement as HTMLElement, ' ');
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('a');
  });

  it('Space and Enter toggle the focused option once in a multiple listbox', async () => {
    const fix = TestBed.createComponent(MultipleHostComponent);
    await fix.whenStable();
    const [apple, banana] = optionEls(fix);
    apple.focus();
    dispatchKeydown(apple, ' ');
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a']);

    banana.focus();
    dispatchKeydown(banana, 'Enter');
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['a', 'b']);
  });

  it('CVA single: initial FormControl value "x" reflects as selected', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    expect(optionEls(fix)[0].getAttribute('aria-selected')).toBe('true');
    expect(optionEls(fix)[1].getAttribute('aria-selected')).toBe('false');
  });

  it('CVA single: clicking Y updates FormControl value to "y"', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toBe('y');
  });

  it('CVA single: FormControl.setValue("y") selects Y', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.setValue('y');
    await fix.whenStable();
    expect(optionEls(fix)[1].getAttribute('aria-selected')).toBe('true');
  });

  it('CVA single: FormControl.disable() disables the listbox', async () => {
    const fix = TestBed.createComponent(ReactiveFormSingleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('aria-disabled')).toBe('true');
  });

  it('CVA ngModel single: initial value "p" is selected', async () => {
    const fix = TestBed.createComponent(NgModelSingleHost);
    await fix.whenStable();
    expect(optionEls(fix)[0].getAttribute('aria-selected')).toBe('true');
  });

  it('CVA ngModel single: clicking Q updates val to "q"', async () => {
    const fix = TestBed.createComponent(NgModelSingleHost);
    await fix.whenStable();
    optionEls(fix)[1].click();
    await fix.whenStable();
    expect(fix.componentInstance.val()).toBe('q');
  });

  it('CVA multiple: initial empty array - no options selected', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    optionEls(fix).forEach((o) => {
      expect(o.getAttribute('aria-selected')).toBe('false');
    });
  });

  it('CVA multiple: clicking X sets FormControl value to ["x"]', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    optionEls(fix)[0].click();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toEqual(['x']);
  });

  it('CVA multiple: FormControl.setValue(["x","y"]) selects both', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.setValue(['x', 'y']);
    await fix.whenStable();
    expect(optionEls(fix)[0].getAttribute('aria-selected')).toBe('true');
    expect(optionEls(fix)[1].getAttribute('aria-selected')).toBe('true');
  });

  it('CVA multiple: FormControl.disable() disables the listbox', async () => {
    const fix = TestBed.createComponent(ReactiveFormMultipleHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(listboxEl(fix).getAttribute('aria-disabled')).toBe('true');
  });

  it('snClass string on sn-listbox applies to host', async () => {
    @Component({
      template: `<sn-listbox snClass="my-cls"><sn-list-option value="a">A</sn-list-option></sn-listbox>`,
      imports: [Listbox, ListOption],
    })
    class SnClassHost {}

    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    expect(listboxEl(fix).classList).toContain('my-cls');
  });

  it('snClass object root section applies to listbox host', async () => {
    @Component({
      template: `<sn-listbox [snClass]="cls"><sn-list-option value="a">A</sn-list-option></sn-listbox>`,
      imports: [Listbox, ListOption],
    })
    class SnClassObjHost {
      cls = { root: 'obj-root-cls' };
    }

    const fix = TestBed.createComponent(SnClassObjHost);
    await fix.whenStable();
    expect(listboxEl(fix).classList).toContain('obj-root-cls');
  });

  it('snClass string on sn-list-option applies to that option host', async () => {
    @Component({
      template: `<sn-listbox><sn-list-option value="a" snClass="opt-cls">A</sn-list-option></sn-listbox>`,
      imports: [Listbox, ListOption],
    })
    class SnClassOptHost {}

    const fix = TestBed.createComponent(SnClassOptHost);
    await fix.whenStable();
    expect(optionEls(fix)[0].classList).toContain('opt-cls');
  });

  it('applies snStyle and allowed snAttrs to listbox root, option and check parts', async () => {
    @Component({
      template: `
        <sn-listbox
          [value]="'a'"
          checkmark
          [snStyle]="{ root: { outline: '1px solid red' } }"
          [snAttrs]="{ root: { 'data-testid': 'lb-root', role: 'presentation' } }"
        >
          <sn-list-option
            value="a"
            [snStyle]="{ root: { color: 'rgb(1, 2, 3)' }, check: { color: 'rgb(4, 5, 6)' } }"
            [snAttrs]="{
              root: { 'data-testid': 'opt-root', role: 'presentation', 'aria-selected': 'false' },
              check: { 'data-testid': 'opt-check' }
            }"
          >Apple</sn-list-option>
        </sn-listbox>
      `,
      imports: [Listbox, ListOption],
    })
    class SnPartHost {}

    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();

    const lb = listboxEl(fix);
    expect(lb.style.outline).toContain('red');
    expect(lb.getAttribute('data-testid')).toBe('lb-root');
    // the listbox role is library-owned, so the pass-through cannot replace it.
    expect(lb.getAttribute('role')).toBe('listbox');

    const opt = optionEls(fix)[0];
    expect(opt.style.color).toBe('rgb(1, 2, 3)');
    expect(opt.getAttribute('data-testid')).toBe('opt-root');
    expect(opt.getAttribute('role')).toBe('option');
    // aria-selected is reserved, so the option stays reported as selected.
    expect(opt.getAttribute('aria-selected')).toBe('true');

    const check: HTMLElement = opt.querySelector('sn-icon')!;
    expect(check.style.color).toBe('rgb(4, 5, 6)');
    expect(check.getAttribute('data-testid')).toBe('opt-check');
  });

  it('SnIntl has listboxLabel default "Options"', () => {
    const intl = TestBed.inject(SnIntl);
    expect(intl.listboxLabel).toBe('Options');
  });

  it('host aria-label falls back to SnIntl listboxLabel when no ariaLabel input', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
    expect(listboxEl(fixture).getAttribute('aria-label')).toBe('Options');
  });

  it('provideSnIntl can override listboxLabel', () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ listboxLabel: 'Choose an item' }),
      ],
    });
    const intl = TestBed.inject(SnIntl);
    expect(intl.listboxLabel).toBe('Choose an item');
  });

  it('By.css("sn-list-option") finds option elements', async () => {
    const fix = TestBed.createComponent(TestHostComponent);
    await fix.whenStable();
    const found = fix.debugElement.queryAll(By.css('sn-list-option'));
    expect(found.length).toBe(3);
  });
});
