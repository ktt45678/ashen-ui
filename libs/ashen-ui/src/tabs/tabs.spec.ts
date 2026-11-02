import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { Tabs } from './tabs';
import { Tab } from './tab';

@Component({
  template: `
    <sn-tabs>
      <sn-tab label="General">General content</sn-tab>
      <sn-tab label="Appearance">Appearance content</sn-tab>
      <sn-tab label="Options">Options content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class BasicTabsHost {}

@Component({
  template: `
    <sn-tabs>
      <sn-tab label="General" icon="tune">General content</sn-tab>
      <sn-tab label="Appearance" icon="palette">Appearance content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class WithIconsHost {}

@Component({
  template: `
    <sn-tabs>
      <sn-tab label="Enabled">Enabled content</sn-tab>
      <sn-tab label="Disabled" [disabled]="true">Disabled content</sn-tab>
      <sn-tab label="Another">Another content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class WithDisabledHost {}

@Component({
  template: `
    <sn-tabs [(selectedIndex)]="idx">
      <sn-tab label="First">First content</sn-tab>
      <sn-tab label="Second">Second content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class TwoWayHost {
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-tabs [selectedIndex]="1">
      <sn-tab label="First">First</sn-tab>
      <sn-tab label="Second">Second</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class InitialIndexHost {}

@Component({
  template: `
    <sn-tabs snClass="my-tabs">
      <sn-tab label="Tab A" [snClass]="{ tab: 'my-tab-btn', icon: 'my-icon', label: 'my-label' }">Content A</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class SnClassHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-tabs>
        <sn-tab label="General">General content</sn-tab>
        <sn-tab label="Appearance">Appearance content</sn-tab>
        <sn-tab label="Options">Options content</sn-tab>
      </sn-tabs>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Tabs, Tab],
})
class RtlHost {}

@Component({
  template: `
    <sn-tabs [(value)]="picked">
      <sn-tab label="General" value="general">General content</sn-tab>
      <sn-tab label="Billing" value="billing">Billing content</sn-tab>
      <sn-tab label="Legal" value="legal" disabled>Legal content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class ValueHost {
  readonly picked = signal<unknown>(undefined);
}

@Component({
  template: `
    <sn-tabs [(value)]="picked" [(selectedIndex)]="idx">
      <sn-tab label="General" value="general">General content</sn-tab>
      <sn-tab label="Billing" value="billing">Billing content</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class ValueAndIndexHost {
  readonly picked = signal<unknown>(undefined);
  readonly idx = signal(0);
}

@Component({
  template: `
    <sn-tabs [(value)]="picked">
      @for (tab of tabs(); track tab) {
        <sn-tab [label]="tab" [value]="tab">{{ tab }} content</sn-tab>
      }
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class LateTabsHost {
  readonly picked = signal<unknown>('second');
  readonly tabs = signal<string[]>(['first']);
}

@Component({
  template: `
    <sn-tabs [scrollable]="scrollable()">
      <sn-tab label="One">One</sn-tab>
      <sn-tab label="Two">Two</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class ScrollableHost {
  readonly scrollable = signal(true);
}

@Component({
  template: `
    <sn-tabs
      [snStyle]="{
        root: { outline: '1px solid red' },
        list: { color: 'rgb(1, 2, 3)' },
        indicator: { color: 'rgb(4, 5, 6)' },
        panel: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tabs-root' },
        list: { 'data-testid': 'tabs-list', role: 'menu' },
        indicator: { 'data-testid': 'tabs-indicator' },
        panel: { 'data-testid': 'tabs-panel', role: 'group', id: 'invalid-id', tabindex: '5' }
      }"
    >
      <sn-tab label="One">Content One</sn-tab>
      <sn-tab label="Two">Content Two</sn-tab>
    </sn-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tabs, Tab],
})
class SnPartHost {}

function scrollButtons(host: HTMLElement): HTMLButtonElement[] {
  return Array.from(host.querySelectorAll<HTMLButtonElement>('.sn-tabs-scroll-btn'));
}

/** jsdom gives every element a zero layout, so overflow has to be declared. */
function fakeOverflow(list: HTMLElement, scrollLeft: number): void {
  Object.defineProperty(list, 'scrollWidth', { value: 500, configurable: true });
  Object.defineProperty(list, 'clientWidth', { value: 200, configurable: true });
  Object.defineProperty(list, 'scrollLeft', { value: scrollLeft, configurable: true });
  list.dispatchEvent(new Event('scroll'));
}

describe('Tabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders sn-tabs with sn-tabs class', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-tabs');
  });

  it('renders tablist with role=tablist', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(tablist).not.toBeNull();
    expect(tablist.classList).toContain('sn-tabs-list');
  });

  it('renders one tab button per sn-tab', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons.length).toBe(3);
  });

  it('first tab is selected by default (aria-selected=true)', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
    expect(buttons[2].getAttribute('aria-selected')).toBe('false');
  });

  it('initialIndex input selects the correct tab', async () => {
    const fixture = TestBed.createComponent(InitialIndexHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[0].getAttribute('aria-selected')).toBe('false');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('shows only the selected tab panel content', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel).not.toBeNull();
    expect(panel.textContent).toContain('General content');
    expect(fixture.nativeElement.querySelectorAll('[role="tabpanel"]').length).toBe(1);
  });

  it('clicking a tab updates selectedIndex and shown panel', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.textContent).toContain('Appearance content');
  });

  it('roving tabindex: active tab has tabindex=0, others have tabindex=-1', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
    expect(buttons[1].getAttribute('tabindex')).toBe('-1');
    expect(buttons[2].getAttribute('tabindex')).toBe('-1');
  });

  it('after clicking tab 2, tabindex updates', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[0].getAttribute('tabindex')).toBe('-1');
    expect(buttons[1].getAttribute('tabindex')).toBe('0');
  });

  it('aria-controls on tab button matches tabpanel id', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[role="tab"]');
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(button.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
  });

  it('tabpanel has aria-labelledby pointing to active tab button id', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[role="tab"]');
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.getAttribute('aria-labelledby')).toBe(button.getAttribute('id'));
  });

  it('tabpanel has tabindex=0', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.getAttribute('tabindex')).toBe('0');
  });

  it('disabled tab has native disabled attribute and is not selectable on click', async () => {
    const fixture = TestBed.createComponent(WithDisabledHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[1].disabled).toBe(true);
    buttons[1].click();
    await fixture.whenStable();
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="tabpanel"]');
    expect(panel.textContent).toContain('Enabled content');
  });

  it('two-way selectedIndex binding works', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    expect(host.idx()).toBe(0);
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[1].click();
    await fixture.whenStable();
    expect(host.idx()).toBe(1);
  });

  it('ArrowRight moves selection to next tab (automatic activation)', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowRight moves DOM focus to the next tab button', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[0].focus();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('ArrowLeft moves selection to the NEXT tab in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');

    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37, bubbles: true }));
    await fixture.whenStable();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowRight moves selection to the PREVIOUS tab in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[1].click();
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');

    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();

    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowLeft moves selection to previous tab', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[1].click();
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37, bubbles: true }));
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('Home key moves selection to first tab', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[2].click();
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 36, bubbles: true }));
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('End key moves selection to last tab', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 35, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowRight wraps from last to first tab', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    buttons[2].click();
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
  });

  it('ArrowRight skips disabled tab', async () => {
    const fixture = TestBed.createComponent(WithDisabledHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
  });

  it('renders leading icon when icon input provided', async () => {
    const fixture = TestBed.createComponent(WithIconsHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-tab-icon');
    expect(icon).not.toBeNull();
  });

  it('only active tab panel is in the DOM', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]');
    expect(panels.length).toBe(1);
  });

  it('sn-tabs-indicator element is aria-hidden', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const indicator: HTMLElement = fixture.nativeElement.querySelector('.sn-tabs-indicator');
    if (indicator) {
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('snClass string lands on tabs root', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const tabs: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    expect(tabs.classList).toContain('my-tabs');
  });

  it('snClass map section tab lands on tab button', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const btn: HTMLElement = fixture.nativeElement.querySelector('[role="tab"]');
    expect(btn.classList).toContain('my-tab-btn');
  });

  it('does not have sn-tabs-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    expect(el.classList.contains('sn-tabs-animate')).toBe(false);
  });

  it('adds sn-tabs-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-tabs');
    expect(el.classList.contains('sn-tabs-animate')).toBe(true);
  });

  it('an incoming value selects the tab that declares it', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    fixture.componentInstance.picked.set('billing');
    await fixture.whenStable();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
  });

  it('an incoming value wins over the default first tab', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    fixture.componentInstance.picked.set('billing');
    await fixture.whenStable();
    expect(fixture.componentInstance.picked()).toBe('billing');
  });

  it('clicking a tab writes its value back', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    await fixture.whenStable();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');

    tabs[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.picked()).toBe('billing');
  });

  it('reports the first tab value without being asked for one', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.picked()).toBe('general');
  });

  it('ignores a value no tab declares rather than resetting the selection', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    await fixture.whenStable();
    fixture.nativeElement.querySelectorAll('[role="tab"]')[1].click();
    await fixture.whenStable();

    fixture.componentInstance.picked.set('nonsense');
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelectorAll('[role="tab"]')[1].getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('refuses a value belonging to a disabled tab', async () => {
    const fixture = TestBed.createComponent(ValueHost);
    await fixture.whenStable();

    fixture.componentInstance.picked.set('legal');
    await fixture.whenStable();

    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('adopts a value that arrived before the tab declaring it existed', async () => {
    const fixture = TestBed.createComponent(LateTabsHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('[role="tab"]').length).toBe(1);

    fixture.componentInstance.tabs.set(['first', 'second']);
    await fixture.whenStable();

    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });

  it('writing selectedIndex updates value, and writing value updates selectedIndex', async () => {
    const fixture = TestBed.createComponent(ValueAndIndexHost);
    await fixture.whenStable();

    fixture.componentInstance.idx.set(1);
    await fixture.whenStable();
    expect(fixture.componentInstance.picked()).toBe('billing');

    fixture.componentInstance.picked.set('general');
    await fixture.whenStable();
    expect(fixture.componentInstance.idx()).toBe(0);
  });

  it('leaves selectedIndex working on its own for tabs with no value', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');

    tabs[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.idx()).toBe(1);
  });

  // Whether the list actually scrolls is a layout question and belongs in the
  // e2e suite; these cover the structure and the wiring.

  it('renders no scroll controls by default', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.sn-tabs-scroll-btn').length).toBe(0);
    expect(
      fixture.nativeElement.querySelector('.sn-tabs-list').classList,
    ).not.toContain('sn-tabs-list-scrollable');
  });

  it('scrollable adds a control at each end and marks the list', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.sn-tabs-scroll-btn').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.sn-tabs-list').classList).toContain(
      'sn-tabs-list-scrollable',
    );
  });

  it('keeps the scroll controls out of the tab order and off the a11y tree', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();

    for (const btn of fixture.nativeElement.querySelectorAll('.sn-tabs-scroll-btn')) {
      expect(btn.getAttribute('tabindex')).toBe('-1');
      expect(btn.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('disables both controls when there is nothing to scroll', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();

    const [back, forward] = scrollButtons(fixture.nativeElement);
    expect(back.disabled).toBe(true);
    expect(forward.disabled).toBe(true);
  });

  it('reports room to scroll forward once the list overflows', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('.sn-tabs-list');

    fakeOverflow(list, 0);
    await fixture.whenStable();

    const [back, forward] = scrollButtons(fixture.nativeElement);
    expect(back.disabled).toBe(true);
    expect(forward.disabled).toBe(false);
  });

  it('reports room to scroll back once the list has been scrolled', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('.sn-tabs-list');

    fakeOverflow(list, 300);
    await fixture.whenStable();

    const [back, forward] = scrollButtons(fixture.nativeElement);
    expect(back.disabled).toBe(false);
    expect(forward.disabled).toBe(true);
  });

  it('reads a negative RTL scrollLeft as distance travelled, not as no travel', async () => {
    const fixture = TestBed.createComponent(ScrollableHost);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('.sn-tabs-list');

    // RTL scrollLeft runs from -(scrollWidth - clientWidth) up to 0.
    fakeOverflow(list, -150);
    await fixture.whenStable();

    const [back, forward] = scrollButtons(fixture.nativeElement);
    expect(back.disabled).toBe(false);
    expect(forward.disabled).toBe(false);
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing tabs semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-tabs')!;
    const list: HTMLElement = el.querySelector('.sn-tabs-list')!;
    const panel: HTMLElement = el.querySelector('.sn-tabs-panel')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('tabs-root');
    expect(list.style.color).toBe('rgb(1, 2, 3)');
    expect(list.getAttribute('data-testid')).toBe('tabs-list');
    expect(list.getAttribute('role')).toBe('tablist');
    expect(panel.style.color).toBe('rgb(7, 8, 9)');
    expect(panel.getAttribute('data-testid')).toBe('tabs-panel');
    expect(panel.getAttribute('role')).toBe('tabpanel');
    expect(panel.getAttribute('id')).not.toBe('invalid-id');
    expect(panel.getAttribute('tabindex')).toBe('0');
    // The selected tab button's aria-controls still points at the real panel id.
    const selectedTab = el.querySelector('.sn-tab-button--selected')!;
    expect(selectedTab.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
  });
});

describe('Tabs indicator', () => {
  class MockResizeObserver {
    static instances: MockResizeObserver[] = [];
    readonly observed = new Set<Element>();
    constructor(readonly callback: () => void) {
      MockResizeObserver.instances.push(this);
    }
    observe(el: Element): void {
      this.observed.add(el);
    }
    unobserve(el: Element): void {
      this.observed.delete(el);
    }
    disconnect(): void {
      this.observed.clear();
    }
  }

  const globals = globalThis as unknown as Record<string, unknown>;
  let original: unknown;

  beforeEach(() => {
    original = globals['ResizeObserver'];
    MockResizeObserver.instances = [];
    globals['ResizeObserver'] = MockResizeObserver;
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  afterEach(() => {
    globals['ResizeObserver'] = original;
  });

  it('re-measures when the selected tab changes size after first render', async () => {
    const fixture = TestBed.createComponent(BasicTabsHost);
    await fixture.whenStable();
    const selected = fixture.nativeElement.querySelector('[role="tab"]') as HTMLElement;
    const observer = MockResizeObserver.instances[0];
    expect(observer.observed.has(selected)).toBe(true);

    Object.defineProperty(selected, 'offsetWidth', { configurable: true, value: 120 });
    observer.callback();
    await fixture.whenStable();

    const indicator = fixture.nativeElement.querySelector('.sn-tabs-indicator') as HTMLElement;
    expect(indicator.style.width).toBe('120px');
  });
});
