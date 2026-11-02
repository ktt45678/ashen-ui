import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE } from '@angular/cdk/keycodes';
import { Select } from './select';
import { ListOption } from 'ashen-ui/listbox';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { IconTemplate, SnIntl, provideSnIntl } from 'ashen-ui/core';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <sn-select [(value)]="value" [placeholder]="placeholder()">
      <sn-list-option value="apple">Apple</sn-list-option>
      <sn-list-option value="banana">Banana</sn-list-option>
      <sn-list-option value="cherry" [disabled]="optionCDisabled()">Cherry</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class BasicHost {
  value: unknown = null;
  readonly placeholder = signal<string | undefined>(undefined);
  readonly optionCDisabled = signal(false);
}

@Component({
  template: `
    <sn-select [formControl]="ctrl">
      <sn-list-option value="x">X</sn-list-option>
      <sn-list-option value="y">Y</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly ctrl = new FormControl<unknown>(null);
}

@Component({
  template: `
    <sn-select [(ngModel)]="val">
      <sn-list-option value="a">A</sn-list-option>
      <sn-list-option value="b">B</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption, FormsModule],
})
class NgModelHost {
  readonly val = signal<unknown>(null);
}

@Component({
  template: `
    <sn-select [disabled]="true" [(value)]="value">
      <sn-list-option value="one">One</sn-list-option>
      <sn-list-option value="two">Two</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class DisabledHost {
  value: unknown = null;
}

@Component({
  template: `
    <sn-select [(value)]="value" snClass="my-select">
      <sn-list-option value="p">P</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class SnClassHost {
  value: unknown = null;
}

@Component({
  template: `
    <sn-select [snStyle]="style()" [snAttrs]="attrs()">
      <sn-list-option value="one">One</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class SnPartHost {
  readonly style = signal({ root: { '--sn-select-pass-through': '1' }, panel: { minWidth: '18rem' } });
  readonly attrs = signal({
    root: { 'data-testid': 'language-select' },
    trigger: { 'aria-describedby': 'language-hint', role: 'button' },
    panel: { 'data-testid': 'language-panel', role: 'menu', 'data-sn-open': 'true' },
  });
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Pick one</sn-label>
      <sn-select [(value)]="value">
        <sn-list-option value="r">R</sn-list-option>
        <sn-list-option value="s">S</sn-list-option>
      </sn-select>
      <sn-hint>Choose wisely</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value: unknown = null;
}

@Component({
  template: `
    <sn-select [(value)]="value">
      <sn-list-option value="pre">PreSelected</sn-list-option>
      <sn-list-option value="other">Other</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class PreSelectedHost {
  value: unknown = 'pre';
}

@Component({
  template: `
    <sn-select [(value)]="value" clearable [clearLabel]="clearLabel()">
      <sn-list-option value="apple">Apple</sn-list-option>
      <sn-list-option value="banana">Banana</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class ClearableHost {
  value: unknown = 'banana';
  readonly clearLabel = signal<string | undefined>(undefined);
}

@Component({
  template: `
    <sn-select [(value)]="value" clearable>
      <sn-list-option value="apple">Apple</sn-list-option>
      <ng-template snIcon="arrow"><span data-testid="arrow-icon">A</span></ng-template>
      <ng-template snIcon="clear"><span data-testid="clear-icon">C</span></ng-template>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption, IconTemplate],
})
class ClearableIconHost {
  value: unknown = 'apple';
}

@Component({
  template: `
    <sn-select [formControl]="ctrl" clearable>
      <sn-list-option value="x">X</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption, ReactiveFormsModule],
})
class ClearableReactiveFormHost {
  readonly ctrl = new FormControl<unknown>('x');
}

describe('Select component', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('[role="listbox"]');
  }

  function getTrigger(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
  }

  async function openSelect(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const trigger = getTrigger(fixture);
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    return trigger;
  }

  async function closeWait() {
    await tick(150);
  }

  it('renders trigger with role=combobox', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('role')).toBe('combobox');
  });

  it('trigger has aria-haspopup="listbox"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('trigger aria-expanded is false initially', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger shows SnIntl selectPlaceholder when no value and no placeholder input', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('Select…');
  });

  it('trigger shows custom placeholder input when provided', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.placeholder.set('Choose…');
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('Choose…');
  });

  it('placeholder span has sn-select-placeholder class when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
  });

  it('shows selected option label when value is set (pre-selected, no panel open)', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('PreSelected');
  });

  it('has sn-select class on host', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select') as HTMLElement;
    expect(host.classList).toContain('sn-select');
  });

  it('applies snStyle and allowed snAttrs without replacing owned semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const host = fix.nativeElement.querySelector('sn-select') as HTMLElement;
    expect(host.style.getPropertyValue('--sn-select-pass-through')).toBe('1');
    expect(host.getAttribute('data-testid')).toBe('language-select');
    expect(trigger.getAttribute('aria-describedby')).toBe('language-hint');
    expect(trigger.getAttribute('role')).toBe('combobox');

    trigger.click();
    await tick(10);
    await fix.whenStable();

    const panel = overlayEl.querySelector('.sn-select-panel') as HTMLElement;
    expect(panel.style.minWidth).toBe('18rem');
    expect(panel.getAttribute('data-testid')).toBe('language-panel');
    expect(panel.getAttribute('role')).toBe('listbox');
    expect(panel.getAttribute('data-sn-open')).toBeNull();
  });

  it('panel is not shown initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('clicking trigger opens panel with role=listbox', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    expect(getPanel()?.getAttribute('role')).toBe('listbox');
  });

  it('trigger aria-expanded is true when open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(getPanel()?.getAttribute('id')).toBe(controls);
  });

  it('projected options render inside panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option');
    expect(opts.length).toBe(3);
  });

  it('clicking an option selects it, closes panel, and updates model', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[0].click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('apple');
    expect(getPanel()).toBeNull();
  });

  it('label updates after selection', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[1].click();
    await closeWait();
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('Banana');
    expect(valueSpan.classList).not.toContain('sn-select-placeholder');
  });

  it('disabled option is not selectable', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.optionCDisabled.set(true);
    await openSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[2].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
  });

  it('clearable renders an accessible clear action only when a value exists', async () => {
    const fix = TestBed.createComponent(ClearableHost);
    await fix.whenStable();
    const clear = fix.nativeElement.querySelector('.sn-select-clear') as HTMLButtonElement;
    expect(clear.getAttribute('aria-label')).toBe('Clear selection');
    clear.click();
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-clear')).toBeNull();
  });

  it('clear action updates the value model, retains trigger focus, and does not open the panel', async () => {
    const fix = TestBed.createComponent(ClearableHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    (fix.nativeElement.querySelector('.sn-select-clear') as HTMLButtonElement).click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(getPanel()).toBeNull();
  });

  it('clear action updates a bound FormControl through the CVA path', async () => {
    const fix = TestBed.createComponent(ClearableReactiveFormHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-clear') as HTMLButtonElement).click();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toBeNull();
  });

  it('clearLabel overrides the internationalized clear label', async () => {
    const fix = TestBed.createComponent(ClearableHost);
    fix.componentInstance.clearLabel.set('Reset framework');
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-clear')?.getAttribute('aria-label')).toBe(
      'Reset framework',
    );
  });

  it('renders named arrow and clear icon templates', async () => {
    const fix = TestBed.createComponent(ClearableIconHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('[data-testid="arrow-icon"]')).toBeTruthy();
    expect(fix.nativeElement.querySelector('[data-testid="clear-icon"]')).toBeTruthy();
    expect(fix.nativeElement.querySelector('.sn-select-clear sn-icon')).toBeNull();
  });

  it('clicking trigger again closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.click();
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('backdrop click closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const backdrop = overlayEl.querySelector('.sn-select-backdrop') as HTMLElement;
    backdrop?.click();
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('ArrowDown on closed trigger opens panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    getTrigger(fix).dispatchEvent(key(DOWN_ARROW));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Enter on closed trigger opens panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    getTrigger(fix).dispatchEvent(key(ENTER));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Escape closes the panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value).toBeNull();
  });

  it('ArrowDown moves aria-activedescendant to next option', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    await tick(10);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const initialId = trigger.getAttribute('aria-activedescendant');
    expect(initialId).toBeTruthy();
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    const opts = getPanel()!.querySelectorAll('sn-list-option');
    expect(initialId).toBe(opts[0].id);
    expect(trigger.getAttribute('aria-activedescendant')).toBe(opts[1].id);
  });

  it('Enter selects active option and closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    await tick(10);
    overlayEl.dispatchEvent(key(ENTER));
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).not.toBeNull();
    expect(getPanel()).toBeNull();
  });

  it('Space selects active option and closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    await tick(10);
    overlayEl.dispatchEvent(key(SPACE));
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).not.toBeNull();
    expect(getPanel()).toBeNull();
  });

  it('active option has sn-listbox-option-active class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    await tick(10);
    const opts = getPanel()!.querySelectorAll('sn-list-option');
    const activeCount = Array.from(opts).filter((o) =>
      o.classList.contains('sn-listbox-option-active'),
    ).length;
    expect(activeCount).toBeGreaterThanOrEqual(1);
  });

  it('selected option is initially active when panel opens', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(20);
    await fix.whenStable();
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    expect(opts[0].classList).toContain('sn-listbox-option-active');
  });

  it('CVA writeValue before open shows correct label', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue('x');
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('X');
  });

  it('CVA clicking option updates FormControl value', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[0].click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toBe('x');
  });

  it('CVA setDisabledState blocks opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('CVA ngModel: clicking B updates val to "b"', async () => {
    const fix = TestBed.createComponent(NgModelHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[1].click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.val()).toBe('b');
  });

  it('disabled=true makes trigger button disabled', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
  });

  it('disabled select cannot open panel', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('snClass string applies to host', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-select') as HTMLElement;
    expect(host.classList).toContain('my-select');
  });

  it('trigger gets controlId from FormField', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const id = trigger.getAttribute('id');
    expect(id).toBeTruthy();
    const label = fix.nativeElement.querySelector('label') as HTMLElement;
    expect(label?.getAttribute('for')).toBe(id);
  });

  it('trigger gets aria-describedby from FormField hint', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
  });

  it('SnIntl selectPlaceholder default is "Select…"', () => {
    const intl = TestBed.inject(SnIntl);
    expect(intl.selectPlaceholder).toBe('Select…');
  });

  it('SnIntl selectClear default is "Clear selection"', () => {
    const intl = TestBed.inject(SnIntl);
    expect(intl.selectClear).toBe('Clear selection');
  });

});

describe('Select - SnIntl override', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ selectPlaceholder: '選択…', selectClear: '選択を解除' }),
      ],
    });
  });

  it('provideSnIntl can override selectPlaceholder', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('選択…');
  });

  it('provideSnIntl can override the clear action label', async () => {
    const fix = TestBed.createComponent(ClearableHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-clear')?.getAttribute('aria-label')).toBe(
      '選択を解除',
    );
  });
});

@Component({
  template: `
    <sn-select [(value)]="value" [animated]="false">
      <sn-list-option value="a">A</sn-list-option>
      <sn-list-option value="b">B</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class NoAnimSelectHost {
  value: unknown = null;
}

@Component({
  template: `
    <sn-select
      [(value)]="value"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    >
      <sn-list-option value="a">A</sn-list-option>
      <sn-list-option value="b">B</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class CustomAnimSelectHost {
  value: unknown = null;
}

describe('Select animation inputs', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('[role="listbox"]');
  }

  function getTrigger(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimSelectHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.animation).toBe('none');
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimSelectHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    getTrigger(fix).click();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    // exit is 40ms - panel should detach well before the default 120ms
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });
});

@Component({
  template: `
    <sn-select [(value)]="value" [checkmark]="checkmark()">
      <sn-list-option value="apple">Apple</sn-list-option>
      <sn-list-option value="banana">Banana</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class CheckmarkHost {
  value: unknown = 'apple';
  readonly checkmark = signal(false);
}

describe('Select check mark', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  async function open(fixture: ReturnType<typeof TestBed.createComponent<CheckmarkHost>>) {
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();
  }

  it('is off by default', async () => {
    const fixture = TestBed.createComponent(CheckmarkHost);
    await open(fixture);
    const selected = overlayEl.querySelector('.sn-listbox-option-selected') as HTMLElement;
    expect(selected).toBeTruthy();
    expect(selected.querySelector('.sn-listbox-option-check')).toBeNull();
  });

  it('marks the selected option when asked for', async () => {
    const fixture = TestBed.createComponent(CheckmarkHost);
    fixture.componentInstance.checkmark.set(true);
    await open(fixture);
    const marks = overlayEl.querySelectorAll('.sn-listbox-option-check');
    expect(marks.length).toBe(1);
    const selected = overlayEl.querySelector('.sn-listbox-option-selected') as HTMLElement;
    expect(selected.contains(marks[0])).toBe(true);
  });
});

@Component({
  template: `
    <sn-select [panelWidth]="panelWidth()">
      <sn-list-option value="a">A</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class PanelWidthHost {
  readonly panelWidth = signal<'trigger' | 'auto'>('trigger');
}

describe('Select panelWidth', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  async function openPane(panelWidth: 'trigger' | 'auto'): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(PanelWidthHost);
    fixture.componentInstance.panelWidth.set(panelWidth);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
    // The test DOM has no layout, so give the trigger a width to copy.
    trigger.getBoundingClientRect = () => ({ width: 120 }) as DOMRect;
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    return overlayEl.querySelector('.cdk-overlay-pane') as HTMLElement;
  }

  it('sizes the pane to the trigger by default', async () => {
    const pane = await openPane('trigger');
    expect(pane.style.width).toBe('120px');
    expect(pane.style.minWidth).toBe('');
  });

  it('uses the trigger width only as the minimum with panelWidth="auto"', async () => {
    const pane = await openPane('auto');
    expect(pane.style.width).toBe('');
    expect(pane.style.minWidth).toBe('120px');
  });
});
