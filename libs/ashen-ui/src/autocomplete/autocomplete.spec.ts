import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, ENTER, ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { IconTemplate, provideSnIntl } from 'ashen-ui/core';
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
  type AutoCompleteLoadMoreEvent,
} from './autocomplete';
import {
  AutoCompleteOptionTemplate,
  AutoCompleteSelectedValueTemplate,
  AutoCompleteSummaryTemplate,
} from './autocomplete-templates';
import { SN_AUTOCOMPLETE_DEFAULTS } from './autocomplete-defaults';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

/** An option's own words, without the check mark's ligature text. */
function optionText(option: Element): string {
  return Array.from(option.childNodes)
    .filter((node) =>
      node instanceof Element ? !node.matches('.sn-icon') : node.nodeType === Node.TEXT_NODE,
    )
    .map((node) => node.textContent ?? '')
    .join('')
    .trim();
}

/** The panel has no backdrop, so closing it means a real click off the field. */
function clickOutside(): void {
  document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

const COUNTRIES = ['Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark'];

@Component({
  template: `
    <sn-autocomplete [(value)]="value" [suggestions]="suggestions()" [placeholder]="placeholder()"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class BasicHost {
  value = '';
  readonly suggestions = signal<string[]>(COUNTRIES);
  readonly placeholder = signal<string | undefined>(undefined);
}

@Component({
  template: `
    <sn-autocomplete [formControl]="ctrl" [suggestions]="suggestions"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, ReactiveFormsModule],
})
class ReactiveHost {
  readonly ctrl = new FormControl<string>('');
  readonly suggestions = COUNTRIES;
}

@Component({
  template: `
    <sn-autocomplete [(ngModel)]="val" [suggestions]="suggestions"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, FormsModule],
})
class NgModelHost {
  val = '';
  readonly suggestions = COUNTRIES;
}

@Component({
  template: `
    <sn-autocomplete [disabled]="true" [(value)]="value" [suggestions]="suggestions"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class DisabledHost {
  value = '';
  readonly suggestions = COUNTRIES;
}

@Component({
  template: `
    <sn-autocomplete [(value)]="value" [suggestions]="suggestions" snClass="my-ac"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class SnClassHost {
  value = '';
  readonly suggestions = COUNTRIES;
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Country</sn-label>
      <sn-autocomplete [(value)]="value" [suggestions]="suggestions"></sn-autocomplete>
      <sn-hint>Start typing</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value = '';
  readonly suggestions = COUNTRIES;
}

@Component({
  template: `
    <sn-autocomplete [(value)]="value" [suggestions]="suggestions" (selected)="onSelected($event)"></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class SelectedEventHost {
  value = '';
  readonly suggestions = COUNTRIES;
  lastSelected = '';
  onSelected(s: string): void {
    this.lastSelected = s;
  }
}

@Component({
  template: `
    <sn-autocomplete
      [(value)]="value"
      [suggestions]="suggestions()"
      [filter]="filter()"
      [emptyMessage]="emptyMessage()"
      showEmptyMessage
    ></sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class EmptyMessageHost {
  value = '';
  readonly suggestions = signal<string[]>(COUNTRIES);
  readonly filter = signal(true);
  readonly emptyMessage = signal<string | undefined>(undefined);
}

describe('AutoComplete', () => {
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

  function getInput(fixture: { nativeElement: HTMLElement }): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function getOptions(): HTMLElement[] {
    return Array.from(overlayEl.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>);
  }

  async function focusInput(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const input = getInput(fixture);
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    return input;
  }

  async function closeWait() {
    await tick(150);
  }

  it('renders input with role=combobox', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getInput(fix).getAttribute('role')).toBe('combobox');
  });

  it('input has aria-autocomplete="list"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getInput(fix).getAttribute('aria-autocomplete')).toBe('list');
  });

  it('aria-expanded is false initially', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getInput(fix).getAttribute('aria-expanded')).toBe('false');
  });

  it('focus opens panel with all suggestions when query is empty', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await focusInput(fix);
    expect(getPanel()).toBeTruthy();
    expect(getOptions().length).toBe(COUNTRIES.length);
  });

  it('aria-expanded is true when open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('panel has aria-controls matching panel id', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    const controls = input.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(getPanel()?.getAttribute('id')).toBe(controls);
  });

  it('typing filters options case-insensitively', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.value = 'au';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();
    const opts = getOptions();
    expect(opts.length).toBe(2);
    expect(opts[0].textContent?.trim()).toBe('Australia');
    expect(opts[1].textContent?.trim()).toBe('Austria');
  });

  it('detaches the empty panel and reopens it when matches return', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.value = 'zzznomatch';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(overlayEl.querySelector('.sn-autocomplete-backdrop')).toBeNull();

    input.value = 'austr';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  describe('empty message', () => {
    async function typeInto(fixture: { whenStable(): Promise<unknown> }, input: HTMLInputElement, text: string) {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await tick(10);
      await fixture.whenStable();
    }

    function emptyRow(): HTMLElement | null {
      return overlayEl.querySelector('.sn-autocomplete-empty');
    }

    async function focusEmptyHost(fixture: ReturnType<typeof TestBed.createComponent<EmptyMessageHost>>) {
      await fixture.whenStable();
      const input = getInput(fixture);
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      await tick(10);
      await fixture.whenStable();
      return input;
    }

    it('is off by default', async () => {
      const fix = TestBed.createComponent(BasicHost);
      const input = await focusInput(fix);
      await typeInto(fix, input, 'zzz');
      expect(emptyRow()).toBeNull();
      expect(getPanel()).toBeNull();
    });

    it('shows the common intl text when nothing matches', async () => {
      const fix = TestBed.createComponent(EmptyMessageHost);
      const input = await focusEmptyHost(fix);
      await typeInto(fix, input, 'zzz');
      expect(getPanel()).toBeTruthy();
      expect(emptyRow()?.textContent?.trim()).toBe('No results found.');
      expect(emptyRow()?.getAttribute('aria-disabled')).toBe('true');
    });

    it('uses a custom message and hides once matches return', async () => {
      const fix = TestBed.createComponent(EmptyMessageHost);
      fix.componentInstance.emptyMessage.set('Nothing here');
      const input = await focusEmptyHost(fix);
      await typeInto(fix, input, 'zzz');
      expect(emptyRow()?.textContent?.trim()).toBe('Nothing here');

      await typeInto(fix, input, 'aus');
      expect(emptyRow()).toBeNull();
      expect(getOptions().length).toBe(2);
    });

    it('is hidden for an empty query', async () => {
      const fix = TestBed.createComponent(EmptyMessageHost);
      fix.componentInstance.suggestions.set([]);
      await focusEmptyHost(fix);
      expect(emptyRow()).toBeNull();
    });

    it('waits for new suggestions after a search starts', async () => {
      const fix = TestBed.createComponent(EmptyMessageHost);
      fix.componentInstance.filter.set(false);
      fix.componentInstance.suggestions.set([]);
      const input = await focusEmptyHost(fix);
      await typeInto(fix, input, 'zzz');
      expect(emptyRow()).toBeNull();

      fix.componentInstance.suggestions.set([]);
      await tick(10);
      await fix.whenStable();
      expect(emptyRow()?.textContent?.trim()).toBe('No results found.');
    });

    it('can be turned on through SN_AUTOCOMPLETE_DEFAULTS', async () => {
      overlayContainer.ngOnDestroy();
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          { provide: SN_AUTOCOMPLETE_DEFAULTS, useValue: { showEmptyMessage: true } },
        ],
      });
      overlayContainer = TestBed.inject(OverlayContainer);
      overlayEl = overlayContainer.getContainerElement();
      const fix = TestBed.createComponent(BasicHost);
      const input = await focusInput(fix);
      await typeInto(fix, input, 'zzz');
      expect(emptyRow()?.textContent?.trim()).toBe('No results found.');
    });
  });

  it('option click fills input, emits selected, and closes panel', async () => {
    const fix = TestBed.createComponent(SelectedEventHost);
    await fix.whenStable();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    const opts = getOptions();
    opts[0].click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe(COUNTRIES[0]);
    expect(fix.componentInstance.lastSelected).toBe(COUNTRIES[0]);
    expect(getPanel()).toBeNull();
  });

  it('ArrowDown on closed input opens the panel with the first option active', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(key(DOWN_ARROW));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
    const activeOpt = overlayEl.querySelector('.sn-listbox-option-active');
    expect(activeOpt).toBeTruthy();
  });

  it('ArrowDown moves active option down', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    const opts = getOptions();
    const activeIdx = opts.findIndex((o) => o.classList.contains('sn-listbox-option-active'));
    expect(activeIdx).toBe(1);
  });

  // Typing first arms the effect that clears the active option on new results; the arrow alone never did.
  it('ArrowDown highlights an option after typing has filtered the list', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.value = 'au';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();

    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();

    const opts = getOptions();
    expect(opts.findIndex((o) => o.classList.contains('sn-listbox-option-active'))).toBe(0);
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
  });

  it('ArrowUp moves active option up', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    input.dispatchEvent(key(UP_ARROW));
    await fix.whenStable();
    const opts = getOptions();
    const activeIdx = opts.findIndex((o) => o.classList.contains('sn-listbox-option-active'));
    expect(activeIdx).toBe(0);
  });

  it('aria-activedescendant updates as active option changes', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
  });

  it('Enter picks active option and closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    input.dispatchEvent(key(ENTER));
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe(COUNTRIES[0]);
    expect(getPanel()).toBeNull();
  });

  it('Enter with no active option does nothing to value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(ENTER));
    await tick(10);
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('');
    expect(getPanel()).toBeTruthy();
  });

  it('Escape closes panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value).toBe('');
  });

  it('free text stays as value (notifies the form while typing)', async () => {
    const fix = TestBed.createComponent(ReactiveHost);
    await fix.whenStable();
    const input = getInput(fix);
    input.value = 'custom text';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();
    expect(fix.componentInstance.ctrl.value).toBe('custom text');
  });

  it('writeValue reflects into input', async () => {
    const fix = TestBed.createComponent(ReactiveHost);
    fix.componentInstance.ctrl.setValue('Australia');
    await fix.whenStable();
    expect(getInput(fix).value).toBe('Australia');
  });

  it('setDisabledState disables the input', async () => {
    const fix = TestBed.createComponent(ReactiveHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(getInput(fix).disabled).toBe(true);
  });

  it('disabled=true prevents panel from opening', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    const input = getInput(fix);
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('FormField controlId applied to input', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const input = getInput(fix);
    const id = input.getAttribute('id');
    expect(id).toBeTruthy();
    const label = fix.nativeElement.querySelector('label') as HTMLElement;
    expect(label?.getAttribute('for')).toBe(id);
  });

  it('FormField describedby wired', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    expect(getInput(fix).getAttribute('aria-describedby')).toBeTruthy();
  });

  it('FormField focus state toggled on input focus', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const input = getInput(fix);
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await fix.whenStable();
    const field = fix.nativeElement.querySelector('sn-form-field') as HTMLElement;
    expect(field.classList).toContain('sn-form-field-focused');
  });

  it('aria-selected on the option matching current value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.value = 'au';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();
    const opts = getOptions();
    const australiaOpt = opts.find((o) => o.textContent?.trim() === 'Australia');
    expect(australiaOpt).toBeTruthy();
    input.value = 'Australia';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();
    const selectedOpt = overlayEl.querySelector('[aria-selected="true"]') as HTMLElement;
    expect(optionText(selectedOpt)).toBe('Australia');
  });

  it('snClass string applies to host', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-autocomplete') as HTMLElement;
    expect(host.classList).toContain('my-ac');
  });

  it('clears the active option when the results change', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const input = await focusInput(fix);
    input.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    input.value = 'can';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fix.whenStable();
    const opts = getOptions();
    const activeCount = opts.filter((o) => o.classList.contains('sn-listbox-option-active')).length;
    expect(activeCount).toBe(0);
  });

  it('ngModel: picking option updates bound value', async () => {
    const fix = TestBed.createComponent(NgModelHost);
    await fix.whenStable();
    const input = getInput(fix);
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    const opts = getOptions();
    opts[0].click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.val).toBe(COUNTRIES[0]);
  });

  it('host has sn-autocomplete class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-autocomplete') as HTMLElement;
    expect(host.classList).toContain('sn-autocomplete');
  });

  it('host has sn-autocomplete-open class when panel is open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await focusInput(fix);
    const host = fix.nativeElement.querySelector('sn-autocomplete') as HTMLElement;
    expect(host.classList).toContain('sn-autocomplete-open');
  });
});

@Component({
  template: `
    <sn-autocomplete [(value)]="value" [suggestions]="['apple', 'banana', 'cherry']" [animated]="false" />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class NoAnimAutoCompleteHost {
  value = '';
}

@Component({
  template: `
    <sn-autocomplete
      [(value)]="value"
      [suggestions]="['apple', 'banana', 'cherry']"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class CustomAnimAutoCompleteHost {
  value = '';
}

describe('AutoComplete animation inputs', () => {
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
    const fix = TestBed.createComponent(NoAnimAutoCompleteHost);
    await fix.whenStable();
    const input = fix.nativeElement.querySelector('.sn-autocomplete-input') as HTMLElement;
    input.dispatchEvent(new Event('focus'));
    await tick(10);
    await fix.whenStable();
    const panel = overlayEl.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel.style.animation).toBe('none');
    clickOutside();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimAutoCompleteHost);
    await fix.whenStable();
    const input = fix.nativeElement.querySelector('.sn-autocomplete-input') as HTMLElement;
    input.dispatchEvent(new Event('focus'));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    clickOutside();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });
});

@Component({
  template: `
    <sn-autocomplete
      [(value)]="value"
      [suggestions]="suggestions()"
      virtual
      [hasMore]="hasMore()"
      (loadMore)="events.push($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class VirtualHost {
  value = '';
  readonly suggestions = signal(Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`));
  readonly hasMore = signal(true);
  events: AutoCompleteLoadMoreEvent[] = [];
}

describe('AutoComplete virtual + infinite scroll', () => {
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

  async function openPanel(fix: ReturnType<typeof TestBed.createComponent<VirtualHost>>) {
    await fix.whenStable();
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
  }

  it('virtual mode renders only a window of options with a bottom spacer preserving total height', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await openPanel(fix);
    const options = overlayEl.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(options.length).toBeLessThan(100);
    const panel = overlayEl.querySelector('[role="listbox"]') as HTMLElement;
    const spacer = panel.lastElementChild as HTMLElement;
    const spacerPx = parseFloat(spacer.style.height);
    // window end × 36 + spacer = 100 × 36 total
    expect(spacerPx).toBe((100 - options.length) * 36);
  });

  it('option ids stay absolute so aria-activedescendant is stable across the window', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await openPanel(fix);
    const first = overlayEl.querySelector('[role="option"]') as HTMLElement;
    expect(first.id.endsWith('-opt-0')).toBe(true);
  });

  it('navigates to virtual options outside the rendered window while preserving active descendant', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await openPanel(fix);
    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;

    for (let index = 0; index < 20; index += 1) {
      input.dispatchEvent(key(DOWN_ARROW));
    }
    await fix.whenStable();

    expect(input.getAttribute('aria-activedescendant')?.endsWith('-opt-19')).toBe(true);
    const panel = overlayEl.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel.scrollTop).toBeGreaterThan(0);
  });

  it('loadMore fires once per query+length (underfilled panel emits on open)', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    await openPanel(fix);
    await tick(10);
    expect(fix.componentInstance.events.length).toBe(1);
    expect(fix.componentInstance.events[0].lastIndex).toBe(99);

    // same length - guard holds even if the panel scrolls
    const panel = overlayEl.querySelector('[role="listbox"]') as HTMLElement;
    panel.dispatchEvent(new Event('scroll'));
    await tick(10);
    expect(fix.componentInstance.events.length).toBe(1);

    // appending suggestions re-arms the guard
    fix.componentInstance.suggestions.set(
      Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`),
    );
    await fix.whenStable();
    await tick(10);
    expect(fix.componentInstance.events.length).toBe(2);
  });

  it('no loadMore when hasMore=false', async () => {
    const fix = TestBed.createComponent(VirtualHost);
    fix.componentInstance.hasMore.set(false);
    await openPanel(fix);
    await tick(10);
    expect(fix.componentInstance.events.length).toBe(0);
  });

  it('applies snStyle and allowed snAttrs to the input and panel', async () => {
    const fix = TestBed.createComponent(AutoComplete);
    fix.componentRef.setInput('suggestions', COUNTRIES);
    fix.componentRef.setInput('snStyle', { input: { minWidth: '18rem' }, panel: { maxHeight: '12rem' } });
    fix.componentRef.setInput('snAttrs', { input: { 'data-testid': 'country-input' }, panel: { 'data-testid': 'country-panel' } });
    await fix.whenStable();

    const input = fix.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.style.minWidth).toBe('18rem');
    expect(input.getAttribute('data-testid')).toBe('country-input');

    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fix.whenStable();
    const panel = overlayEl.querySelector('[role="listbox"]') as HTMLElement;
    expect(panel.style.maxHeight).toBe('12rem');
    expect(panel.getAttribute('data-testid')).toBe('country-panel');
  });
});

interface CountryOption {
  id: string;
  name: string;
  code: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = [
  { id: 'au', name: 'Australia', code: 'AU' },
  { id: 'th', name: 'Thailand', code: 'TH' },
  { id: 'vn', name: 'Vietnam', code: 'VN' },
];

const compareCountry = (left: CountryOption, right: CountryOption) => left.id === right.id;

@Component({
  template: `
    <sn-autocomplete
      [(value)]="value"
      [suggestions]="suggestions"
      optionLabel="name"
      [compareWith]="compare"
      (selected)="selected = $event"
    >
      <ng-template snAutoCompleteOption let-country>
        <span class="country-option">{{ country.code }}:{{ country.name }}</span>
      </ng-template>
    </sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, AutoCompleteOptionTemplate],
})
class ObjectSingleHost {
  value: CountryOption | string = '';
  selected: CountryOption | null = null;
  readonly suggestions = COUNTRY_OPTIONS;
  readonly compare = compareCountry;
}

@Component({
  template: `
    <sn-autocomplete
      [formControl]="control"
      [suggestions]="suggestions"
      optionLabel="name"
      [compareWith]="compare"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, ReactiveFormsModule],
})
class ObjectReactiveHost {
  readonly control = new FormControl<CountryOption | string>('', { nonNullable: true });
  readonly suggestions = COUNTRY_OPTIONS;
  readonly compare = compareCountry;
}

@Component({
  template: `
    <sn-autocomplete
      multiple
      [formControl]="control"
      [suggestions]="suggestions"
      optionLabel="name"
      [compareWith]="compare"
      (removed)="removed = $event"
    >
      <ng-template snIcon="remove"><span class="custom-remove">remove</span></ng-template>
    </sn-autocomplete>
  `,
  imports: [AutoComplete, IconTemplate, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    ...provideSnIntl({ chip: { remove: (label: string) => `Delete ${label}` } }),
  ],
})
class ObjectMultipleFormHost {
  readonly control = new FormControl<readonly CountryOption[]>([], { nonNullable: true });
  readonly suggestions = COUNTRY_OPTIONS;
  readonly compare = compareCountry;
  removed: CountryOption | null = null;
}

@Component({
  template: `
    <sn-autocomplete
      multiple
      [(values)]="values"
      [suggestions]="suggestions"
      optionLabel="name"
      [maxSelectedLabels]="1"
    >
      <ng-template snAutoCompleteSelectedValue let-country>
        <span class="selected-value">{{ country.code }}</span>
      </ng-template>
      <ng-template snAutoCompleteSummary let-hidden="hidden" let-count="count">
        <span class="selected-summary">{{ count }} hidden: {{ hidden[0].code }}</span>
      </ng-template>
    </sn-autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete, AutoCompleteSelectedValueTemplate, AutoCompleteSummaryTemplate],
})
class MultipleTemplatesHost {
  values: readonly CountryOption[] = COUNTRY_OPTIONS;
  readonly suggestions = COUNTRY_OPTIONS;
}

@Component({
  template: `
    <sn-autocomplete
      [suggestions]="suggestions()"
      [filter]="false"
      completeOnFocus
      (complete)="onComplete($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class ServerCompletionHost {
  readonly suggestions = signal<readonly string[]>([]);
  readonly events: AutoCompleteCompleteEvent[] = [];

  onComplete(event: AutoCompleteCompleteEvent): void {
    this.events.push(event);
    this.suggestions.set(event.query ? [`Server ${event.query}`, 'Unrelated'] : ['Recent']);
  }
}

describe('AutoComplete generic and multiple values', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  async function focus<T>(fixture: { nativeElement: HTMLElement; whenStable(): Promise<T> }) {
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    return input;
  }

  async function enterText<T>(
    fixture: { nativeElement: HTMLElement; whenStable(): Promise<T> },
    text: string,
  ) {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick(10);
    await fixture.whenStable();
    return input;
  }

  it('filters object suggestions by optionLabel and selects the original object', async () => {
    const fixture = TestBed.createComponent(ObjectSingleHost);
    await focus(fixture);
    const input = await enterText(fixture, 'thai');
    const options = overlayEl.querySelectorAll('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent?.trim()).toBe('TH:Thailand');

    (options[0] as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value).toBe(COUNTRY_OPTIONS[1]);
    expect(fixture.componentInstance.selected).toBe(COUNTRY_OPTIONS[1]);
    expect(input.value).toBe('Thailand');
  });

  it('uses compareWith to mark an equivalent object selected', async () => {
    const fixture = TestBed.createComponent(ObjectSingleHost);
    fixture.componentInstance.value = { ...COUNTRY_OPTIONS[1] };
    fixture.detectChanges();
    await focus(fixture);
    const selected = overlayEl.querySelector('[aria-selected="true"]') as HTMLElement;
    expect(selected.textContent).toContain('Thailand');
  });

  it('writes object values through CVA and returns to free text on input', async () => {
    const fixture = TestBed.createComponent(ObjectReactiveHost);
    fixture.componentInstance.control.setValue({ ...COUNTRY_OPTIONS[1] });
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Thailand');

    await enterText(fixture, 'custom destination');
    expect(fixture.componentInstance.control.value).toBe('custom destination');
  });

  it('keeps DOM focus on the input while object options use aria-activedescendant', async () => {
    const fixture = TestBed.createComponent(ObjectSingleHost);
    const input = await focus(fixture);
    input.focus();
    input.dispatchEvent(key(DOWN_ARROW));
    await fixture.whenStable();

    const activeId = input.getAttribute('aria-activedescendant');
    expect(document.activeElement).toBe(input);
    expect(activeId).toBeTruthy();
    expect(overlayEl.querySelector(`#${activeId}`)?.getAttribute('aria-selected')).toBe('true');

    input.dispatchEvent(key(ESCAPE));
    await fixture.whenStable();
    expect(document.activeElement).toBe(input);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('writes object arrays through CVA and keeps the picked suggestion marked selected', async () => {
    const fixture = TestBed.createComponent(ObjectMultipleFormHost);
    await focus(fixture);
    const first = overlayEl.querySelector('[role="option"]') as HTMLElement;
    first.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.control.value).toEqual([COUNTRY_OPTIONS[0]]);
    const australia = Array.from(overlayEl.querySelectorAll('[role="option"]')).find(
      (option) => optionText(option) === 'Australia',
    ) as HTMLElement;
    expect(australia).toBeTruthy();
    expect(australia.getAttribute('aria-selected')).toBe('true');
    expect(australia.classList).toContain('sn-listbox-option-selected');
  });

  it('picking a selected suggestion again deselects it', async () => {
    const fixture = TestBed.createComponent(ObjectMultipleFormHost);
    await focus(fixture);
    const first = overlayEl.querySelector('[role="option"]') as HTMLElement;
    first.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toEqual([COUNTRY_OPTIONS[0]]);

    (overlayEl.querySelector('[role="option"]') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toEqual([]);
  });

  it('renders removable multiple values with localized labels and a custom remove icon', async () => {
    const fixture = TestBed.createComponent(ObjectMultipleFormHost);
    fixture.componentInstance.control.setValue([COUNTRY_OPTIONS[0], COUNTRY_OPTIONS[1]]);
    await fixture.whenStable();

    const remove = fixture.nativeElement.querySelector('.sn-autocomplete-chip-remove') as HTMLButtonElement;
    expect(remove.getAttribute('aria-label')).toBe('Delete Australia');
    expect(remove.querySelector('.custom-remove')).toBeTruthy();
    remove.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toEqual([COUNTRY_OPTIONS[1]]);
    expect(fixture.componentInstance.removed).toBe(COUNTRY_OPTIONS[0]);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
  });

  it('removes the last multiple value with Backspace only when the query is empty', async () => {
    const fixture = TestBed.createComponent(ObjectMultipleFormHost);
    fixture.componentInstance.control.setValue([COUNTRY_OPTIONS[0], COUNTRY_OPTIONS[1]]);
    const input = await focus(fixture);
    input.dispatchEvent(key(8));
    await fixture.whenStable();
    expect(fixture.componentInstance.control.value).toEqual([COUNTRY_OPTIONS[0]]);
  });

  it('renders selected-value and overflow summary templates', async () => {
    const fixture = TestBed.createComponent(MultipleTemplatesHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.selected-value')?.textContent?.trim()).toBe('AU');
    expect(fixture.nativeElement.querySelector('.selected-summary')?.textContent?.trim()).toBe(
      '2 hidden: TH',
    );
  });

  it('emits server completion on focus and input without applying local filtering', async () => {
    const fixture = TestBed.createComponent(ServerCompletionHost);
    await focus(fixture);
    expect(fixture.componentInstance.events[0]).toEqual({ query: '', reason: 'focus' });
    expect(overlayEl.querySelector('[role="option"]')?.textContent?.trim()).toBe('Recent');

    await enterText(fixture, 'zz');
    expect(fixture.componentInstance.events.at(-1)).toEqual({ query: 'zz', reason: 'input' });
    expect(overlayEl.querySelectorAll('[role="option"]')).toHaveLength(2);
    expect(overlayEl.textContent).toContain('Unrelated');
  });
});

@Component({
  template: `
    <sn-autocomplete
      multiple
      [(values)]="values"
      [suggestions]="suggestions"
      [hideSelected]="hideSelected()"
      [checkmark]="checkmark()"
      [removable]="removable()"
      [hideValuesOnFocus]="hideValuesOnFocus()"
      [keepPlaceholder]="keepPlaceholder()"
      placeholder="Countries"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AutoComplete],
})
class SelectionPanelHost {
  values: readonly string[] = [];
  readonly suggestions = COUNTRIES;
  readonly hideSelected = signal(false);
  readonly checkmark = signal(true);
  readonly removable = signal(true);
  readonly hideValuesOnFocus = signal(false);
  readonly keepPlaceholder = signal(false);
}

describe('AutoComplete selection panel', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => overlayContainer.ngOnDestroy());

  async function open(fixture: ReturnType<typeof TestBed.createComponent<SelectionPanelHost>>) {
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus', { bubbles: true }));
    await fixture.whenStable();
    return input;
  }

  function options(): HTMLElement[] {
    return Array.from(overlayEl.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>);
  }

  it('keeps a selected suggestion in the panel with a check mark', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    await open(fixture);
    const before = options().length;
    options()[0].click();
    await fixture.whenStable();

    expect(options().length).toBe(before);
    expect(options()[0].classList).toContain('sn-listbox-option-selected');
    expect(options()[0].querySelector('.sn-listbox-option-check')).toBeTruthy();
  });

  it('checkmark=false leaves the selected row unmarked', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    fixture.componentInstance.checkmark.set(false);
    await open(fixture);
    options()[0].click();
    await fixture.whenStable();

    expect(options()[0].classList).toContain('sn-listbox-option-selected');
    expect(options()[0].querySelector('.sn-listbox-option-check')).toBeNull();
  });

  it('hideSelected=true drops the picked suggestion from the panel', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    fixture.componentInstance.hideSelected.set(true);
    await open(fixture);
    const before = options().length;
    options()[0].click();
    await fixture.whenStable();

    expect(options().length).toBe(before - 1);
  });

  it('removable=false drops the chip remove button', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    fixture.componentInstance.values = [COUNTRIES[0]];
    await open(fixture);

    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip-remove')).toBeTruthy();

    fixture.componentInstance.removable.set(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip-remove')).toBeNull();
  });

  it('hideValuesOnFocus hides the chips while typing and restores them on blur', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    fixture.componentInstance.values = [COUNTRIES[0]];
    fixture.componentInstance.hideValuesOnFocus.set(true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip')).toBeTruthy();

    const input = await open(fixture);
    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip')).toBeNull();

    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-autocomplete-chip')).toBeTruthy();
  });

  it('clears the placeholder once values are shown unless keepPlaceholder is set', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    fixture.componentInstance.values = [COUNTRIES[0]];
    await fixture.whenStable();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('');

    fixture.componentInstance.keepPlaceholder.set(true);
    await fixture.whenStable();
    expect(input.placeholder).toBe('Countries');
  });

  it('opens without a backdrop so a second click on the input keeps the panel', async () => {
    const fixture = TestBed.createComponent(SelectionPanelHost);
    const input = await open(fixture);
    expect(overlayEl.querySelector('.cdk-overlay-backdrop')).toBeNull();

    input.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(overlayEl.querySelector('[role="listbox"]')).toBeTruthy();

    clickOutside();
    await tick(200);
    await fixture.whenStable();
    expect(overlayEl.querySelector('[role="listbox"]')).toBeNull();
  });
});
