import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE } from '@angular/cdk/keycodes';
import { MultiSelect } from './multi-select';
import { ListOption } from 'ashen-ui/listbox';
import { Listbox } from '../listbox/listbox';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <sn-multi-select [(value)]="value" [placeholder]="placeholder()">
      <sn-list-option value="apple">Apple</sn-list-option>
      <sn-list-option value="banana">Banana</sn-list-option>
      <sn-list-option value="cherry" [disabled]="optionCDisabled()">Cherry</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class BasicHost {
  value: unknown[] = [];
  readonly placeholder = signal<string | undefined>(undefined);
  readonly optionCDisabled = signal(false);
}

@Component({
  template: `
    <sn-multi-select [(value)]="value" [maxChips]="2">
      <sn-list-option value="a">Alpha</sn-list-option>
      <sn-list-option value="b">Beta</sn-list-option>
      <sn-list-option value="c">Gamma</sn-list-option>
      <sn-list-option value="d">Delta</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class MaxChipsHost {
  value: unknown[] = ['a', 'b', 'c', 'd'];
}

@Component({
  template: `
    <sn-multi-select [formControl]="ctrl">
      <sn-list-option value="x">X</sn-list-option>
      <sn-list-option value="y">Y</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly ctrl = new FormControl<unknown[]>([]);
}

@Component({
  template: `
    <sn-multi-select [(ngModel)]="val">
      <sn-list-option value="a">A</sn-list-option>
      <sn-list-option value="b">B</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption, FormsModule],
})
class NgModelHost {
  readonly val = signal<unknown[]>([]);
}

@Component({
  template: `
    <sn-multi-select [disabled]="true" [(value)]="value">
      <sn-list-option value="one">One</sn-list-option>
      <sn-list-option value="two">Two</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class DisabledHost {
  value: unknown[] = [];
}

@Component({
  template: `
    <sn-multi-select [(value)]="value" snClass="my-multi">
      <sn-list-option value="p">P</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class SnClassHost {
  value: unknown[] = [];
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Pick many</sn-label>
      <sn-multi-select [(value)]="value">
        <sn-list-option value="r">R</sn-list-option>
        <sn-list-option value="s">S</sn-list-option>
      </sn-multi-select>
      <sn-hint>Choose multiple</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value: unknown[] = [];
}

@Component({
  template: `
    <sn-multi-select [(value)]="value">
      <sn-list-option value="apple">Apple</sn-list-option>
      <sn-list-option value="banana">Banana</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class PreSelectedHost {
  value: unknown[] = ['banana'];
}

@Component({
  template: `
    <sn-listbox [(value)]="value" [multiple]="false" checkmark>
      <sn-list-option value="x">X</sn-list-option>
      <sn-list-option value="y">Y</sn-list-option>
    </sn-listbox>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Listbox, ListOption],
})
class ListboxSingleHost {
  value: unknown = 'x';
}

describe('MultiSelect component', () => {
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

  async function openMultiSelect(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
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

  it('shows placeholder when no value selected', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.placeholder.set('Pick options…');
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toContain('Pick options…');
    expect(valueSpan.classList).toContain('sn-select-placeholder');
  });

  it('shows default SnIntl placeholder when no placeholder input', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const valueSpan = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(valueSpan.textContent?.trim()).toBe('Select…');
  });

  it('has sn-multi-select class on host', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-multi-select') as HTMLElement;
    expect(host.classList).toContain('sn-multi-select');
  });

  it('shows chips for selected values', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    const chips = fix.nativeElement.querySelectorAll('sn-chip');
    expect(chips.length).toBe(1);
  });

  it('chip label matches selected option label', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    const chip = fix.nativeElement.querySelector('sn-chip .sn-chip-label') as HTMLElement;
    expect(chip?.textContent?.trim()).toBe('Banana');
  });

  // The check mark is a ligature, so the option's textContent starts with "check".
  it('leaves the check mark out of the chip label', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await openMultiSelect(fix as never);
    const option = getPanel()?.querySelector('[aria-selected="true"]');
    const chip = fix.nativeElement.querySelector('sn-chip .sn-chip-label') as HTMLElement;

    // The mark is really in the option's DOM; the label just does not read it.
    expect(option?.textContent).toContain('check');
    expect(chip?.textContent?.trim()).toBe('Banana');
  });

  it('chips capped at maxChips with +n more span shown', async () => {
    const fix = TestBed.createComponent(MaxChipsHost);
    await fix.whenStable();
    const chips = fix.nativeElement.querySelectorAll('sn-chip');
    expect(chips.length).toBe(2);
    const more = fix.nativeElement.querySelector('.sn-multi-select-more') as HTMLElement;
    expect(more).toBeTruthy();
    expect(more.textContent?.trim()).toBe('+2 more');
  });

  it('no +n more span when selected count <= maxChips', async () => {
    const fix = TestBed.createComponent(MaxChipsHost);
    fix.componentInstance.value = ['a', 'b'];
    await fix.whenStable();
    const more = fix.nativeElement.querySelector('.sn-multi-select-more');
    expect(more).toBeNull();
  });

  it('placeholder hidden and no chips when value is empty', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = [];
    await fix.whenStable();
    const chips = fix.nativeElement.querySelectorAll('sn-chip');
    expect(chips.length).toBe(0);
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
  });

  it('chip remove toggles value without opening or closing panel', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    const removeBtn = fix.nativeElement.querySelector('.sn-chip-remove') as HTMLElement;
    removeBtn?.click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual([]);
    expect(getPanel()).toBeNull();
  });

  // A click on the empty chip row opens the panel; only clicks on a chip are swallowed.
  it('clicking the empty chip row opens the panel', async () => {
    const fix = TestBed.createComponent(PreSelectedHost);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    const chipsContainer = fix.nativeElement.querySelector('.sn-multi-select-chips') as HTMLElement;
    chipsContainer?.click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).not.toBeNull();
  });

  it('chips are not removable when disabled', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    fix.componentInstance.value = ['one'];
    await fix.whenStable();
    const removeBtn = fix.nativeElement.querySelector('.sn-chip-remove');
    expect(removeBtn).toBeNull();
  });

  it('panel is not shown initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('clicking trigger opens panel with role=listbox', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    expect(getPanel()?.getAttribute('role')).toBe('listbox');
  });

  it('panel has aria-multiselectable="true"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    expect(getPanel()?.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('trigger aria-expanded is true when open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openMultiSelect(fix);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openMultiSelect(fix);
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(getPanel()?.getAttribute('id')).toBe(controls);
  });

  it('clicking option toggles selection without closing panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[0].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['apple']);
    expect(getPanel()).toBeTruthy();
  });

  it('clicking selected option deselects it, panel stays open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = ['apple'];
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[0].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual([]);
    expect(getPanel()).toBeTruthy();
  });

  it('disabled option is not selectable', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.optionCDisabled.set(true);
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[2].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual([]);
  });

  it('values preserve options order regardless of selection order', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[2].click();
    await tick(5);
    opts[0].click();
    await tick(5);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['apple', 'cherry']);
  });

  it('normalizes duplicate and unavailable values when selection changes', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = ['banana', 'apple', 'apple', 'missing'];
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[2].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toEqual(['apple', 'banana', 'cherry']);
  });

  it('options in multi-select panel have leading checkbox box', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    const boxes = getPanel()!.querySelectorAll('.sn-listbox-option-box');
    expect(boxes.length).toBeGreaterThan(0);
  });

  it('selected option checkbox box shows check icon', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = ['apple'];
    await openMultiSelect(fix);
    const opts = getPanel()!.querySelectorAll('sn-list-option');
    const firstOpt = opts[0] as HTMLElement;
    const box = firstOpt.querySelector('.sn-listbox-option-box');
    expect(box).toBeTruthy();
    expect(box?.querySelector('sn-icon')).toBeTruthy();
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

  it('Enter toggles active option and keeps panel open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    await tick(10);
    overlayEl.dispatchEvent(key(ENTER));
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value.length).toBeGreaterThan(0);
    expect(getPanel()).toBeTruthy();
  });

  it('Space toggles active option and keeps panel open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    await tick(10);
    overlayEl.dispatchEvent(key(SPACE));
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value.length).toBeGreaterThan(0);
    expect(getPanel()).toBeTruthy();
  });

  it('Space on the focused trigger toggles the active option exactly once', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    await tick(10);
    getTrigger(fix).dispatchEvent(key(SPACE));
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value.length).toBe(1);
  });

  it('Escape closes the panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value).toEqual([]);
  });

  it('active option has sn-listbox-option-active class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openMultiSelect(fix);
    await tick(10);
    const opts = getPanel()!.querySelectorAll('sn-list-option');
    const activeCount = Array.from(opts).filter((o) =>
      o.classList.contains('sn-listbox-option-active'),
    ).length;
    expect(activeCount).toBeGreaterThanOrEqual(1);
  });

  it('CVA writeValue sets chips', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue(['x']);
    await fix.whenStable();
    const chips = fix.nativeElement.querySelectorAll('sn-chip');
    expect(chips.length).toBe(1);
  });

  it('CVA writeValue with null/undefined defaults to empty array', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue(null as unknown as unknown[]);
    await fix.whenStable();
    const chips = fix.nativeElement.querySelectorAll('sn-chip');
    expect(chips.length).toBe(0);
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

  it('CVA ngModel: clicking option updates val', async () => {
    const fix = TestBed.createComponent(NgModelHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const opts = getPanel()!.querySelectorAll('sn-list-option') as NodeListOf<HTMLElement>;
    opts[0].click();
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.val()).toEqual(['a']);
    expect(getPanel()).toBeTruthy();
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
    const host = fix.nativeElement.querySelector('sn-multi-select') as HTMLElement;
    expect(host.classList).toContain('my-multi');
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

  it('listbox WITHOUT checkbox context draws the check mark, not a box (regression)', async () => {
    const fix = TestBed.createComponent(ListboxSingleHost);
    await fix.whenStable();
    const selectedOpt = fix.nativeElement.querySelector('.sn-listbox-option-selected') as HTMLElement;
    expect(selectedOpt).toBeTruthy();
    const box = selectedOpt.querySelector('.sn-listbox-option-box');
    expect(box).toBeNull();
    const icon = selectedOpt.querySelector('sn-icon');
    expect(icon).toBeTruthy();
  });
});

@Component({
  template: `
    <sn-multi-select [(value)]="value" [animated]="false">
      <sn-list-option value="a">A</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class NoAnimMultiSelectHost {
  value: unknown[] = [];
}

@Component({
  template: `
    <sn-multi-select [(value)]="value"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
      <sn-list-option value="a">A</sn-list-option>
    </sn-multi-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MultiSelect, ListOption],
})
class CustomAnimMultiSelectHost {
  value: unknown[] = [];
}

describe('MultiSelect animation inputs', () => {
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

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimMultiSelectHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toBe('none');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimMultiSelectHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the trigger and panel', async () => {
    const fix = TestBed.createComponent(MultiSelect);
    fix.componentRef.setInput('snStyle', { trigger: { minWidth: '18rem' }, panel: { maxHeight: '12rem' } });
    fix.componentRef.setInput('snAttrs', { trigger: { 'data-testid': 'multi-trigger' }, panel: { 'data-testid': 'multi-panel' } });
    await fix.whenStable();

    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLButtonElement;
    expect(trigger.style.minWidth).toBe('18rem');
    expect(trigger.getAttribute('data-testid')).toBe('multi-trigger');

    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.maxHeight).toBe('12rem');
    expect(panel.getAttribute('data-testid')).toBe('multi-panel');
  });
});
