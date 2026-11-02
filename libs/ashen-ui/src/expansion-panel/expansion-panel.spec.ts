import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Accordion } from './accordion';
import { ExpansionPanel } from './expansion-panel';
import { IconTemplate } from 'ashen-ui/core';

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="Section 1">Content 1</sn-expansion-panel>
      <sn-expansion-panel header="Section 2">Content 2</sn-expansion-panel>
      <sn-expansion-panel header="Section 3">Content 3</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class BasicAccordionHost {}

@Component({
  template: `
    <sn-accordion [multiple]="false">
      <sn-expansion-panel header="Section 1" [expanded]="true">Content 1</sn-expansion-panel>
      <sn-expansion-panel header="Section 2" [expanded]="true">Content 2</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class SingleModeHost {}

@Component({
  template: `
    <sn-accordion [multiple]="true">
      <sn-expansion-panel header="Section 1" [expanded]="true">Content 1</sn-expansion-panel>
      <sn-expansion-panel header="Section 2" [expanded]="true">Content 2</sn-expansion-panel>
      <sn-expansion-panel header="Section 3">Content 3</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class MultipleModeHost {}

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="Section 1" [(expanded)]="expanded">Content 1</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class TwoWayModelHost {
  readonly expanded = signal(false);
}

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="Enabled">Content</sn-expansion-panel>
      <sn-expansion-panel header="Disabled" [disabled]="true">Content</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class DisabledPanelHost {}

@Component({
  template: `
    <sn-expansion-panel header="Standalone">Standalone content</sn-expansion-panel>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ExpansionPanel],
})
class StandalonePanelHost {}

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="With Icon" icon="info">Content</sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class WithIconHost {}

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="Custom Chevron">
        <ng-template snIcon="toggle"><span class="custom-chevron">▶</span></ng-template>
        Content
      </sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel, IconTemplate],
})
class CustomChevronHost {}

@Component({
  template: `
    <sn-accordion snClass="acc-root">
      <sn-expansion-panel header="Panel" [snClass]="{ root: 'ep-root', button: 'ep-btn', content: 'ep-content' }">
        Content
      </sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class SnClassHost {}

@Component({
  template: `
    <sn-accordion>
      <sn-expansion-panel header="Custom Header">
        <span snExpansionPanelHeader>Custom projected header</span>
        Content
      </sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class CustomHeaderHost {}

@Component({
  template: `
    <sn-accordion
      [snStyle]="{ root: { outline: '1px solid teal' } }"
      [snAttrs]="{ root: { 'data-testid': 'acc-root' } }"
    >
      <sn-expansion-panel
        header="Parts"
        icon="folder"
        [snStyle]="{
          root: { outline: '1px solid red' },
          header: { color: 'rgb(1, 2, 3)' },
          button: { color: 'rgb(4, 5, 6)' },
          icon: { color: 'rgb(7, 8, 9)' },
          title: { color: 'rgb(10, 11, 12)' },
          toggle: { color: 'rgb(13, 14, 15)' },
          content: { color: 'rgb(16, 17, 18)' }
        }"
        [snAttrs]="{
          root: { 'data-testid': 'ep-root', 'data-sn-expanded': 'invalid' },
          header: { 'data-testid': 'ep-header' },
          button: { 'data-testid': 'ep-button', 'aria-expanded': 'invalid', id: 'invalid-id' },
          icon: { 'data-testid': 'ep-icon' },
          title: { 'data-testid': 'ep-title' },
          toggle: { 'data-testid': 'ep-toggle' },
          content: { 'data-testid': 'ep-content', role: 'presentation', id: 'invalid-content-id' }
        }"
      >
        Content
      </sn-expansion-panel>
    </sn-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Accordion, ExpansionPanel],
})
class SnPartHost {}

describe('Accordion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders sn-accordion with sn-accordion class', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-accordion');
  });

  it('renders sn-expansion-panel elements', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const panels = fixture.nativeElement.querySelectorAll('sn-expansion-panel');
    expect(panels.length).toBe(3);
    panels.forEach((p: HTMLElement) => expect(p.classList).toContain('sn-expansion-panel'));
  });

  it('all panels start collapsed by default', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const expanded = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded');
    expect(expanded.length).toBe(0);
  });

  it('single mode: opening one panel closes others', async () => {
    const fixture = TestBed.createComponent(SingleModeHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    expect(buttons.length).toBe(2);
    const expanded = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded');
    expect(expanded.length).toBe(1);
  });

  it('multiple mode: several panels can be open simultaneously', async () => {
    const fixture = TestBed.createComponent(MultipleModeHost);
    await fixture.whenStable();
    const expanded = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded');
    expect(expanded.length).toBe(2);
  });

  it('single mode: clicking second panel closes first', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    buttons[0].click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded').length).toBe(1);
    buttons[1].click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded').length).toBe(1);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('multiple mode: expanding third panel does not close already-open panels', async () => {
    const fixture = TestBed.createComponent(MultipleModeHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    buttons[2].click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded').length).toBe(3);
  });
});

describe('ExpansionPanel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders heading with button', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const heading = fixture.nativeElement.querySelector('.sn-expansion-panel-heading');
    expect(heading).not.toBeNull();
    const button = heading.querySelector('.sn-expansion-panel-button');
    expect(button).not.toBeNull();
  });

  it('button has aria-expanded=false when collapsed', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('button has aria-expanded=true when expanded', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('clicking header toggles content visibility', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-content-wrapper');
    expect(wrapper.classList).not.toContain('sn-expansion-panel-content-wrapper--expanded');
    button.click();
    await fixture.whenStable();
    expect(wrapper.classList).toContain('sn-expansion-panel-content-wrapper--expanded');
  });

  it('content region is inert (removed from a11y/tab order) when collapsed', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-content');
    expect(content.hasAttribute('inert')).toBe(true);
    button.click();
    await fixture.whenStable();
    expect(content.hasAttribute('inert')).toBe(false);
    button.click();
    await fixture.whenStable();
    expect(content.hasAttribute('inert')).toBe(true);
  });

  it('aria-controls on button matches content id', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-content');
    expect(button.getAttribute('aria-controls')).toBe(content.getAttribute('id'));
  });

  it('content region has role=region and aria-labelledby pointing to button id', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-content');
    expect(content.getAttribute('role')).toBe('region');
    expect(content.getAttribute('aria-labelledby')).toBe(button.getAttribute('id'));
  });

  it('expanded model two-way binding works', async () => {
    const fixture = TestBed.createComponent(TwoWayModelHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    expect(host.expanded()).toBe(false);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    expect(host.expanded()).toBe(true);
  });

  it('Enter key on button toggles panel', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('Space key on button toggles panel', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('disabled panel button has disabled attribute', async () => {
    const fixture = TestBed.createComponent(DisabledPanelHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });

  it('disabled panel does not toggle when clicked', async () => {
    const fixture = TestBed.createComponent(DisabledPanelHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    buttons[1].click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.sn-expansion-panel-content-wrapper--expanded').length).toBe(0);
  });

  it('standalone panel self-toggles without accordion context', async () => {
    const fixture = TestBed.createComponent(StandalonePanelHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders leading icon when icon input provided', async () => {
    const fixture = TestBed.createComponent(WithIconHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-expansion-panel-icon');
    expect(icon).not.toBeNull();
  });

  it('does not render leading icon when icon input empty', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('.sn-expansion-panel-icon');
    expect(icon).toBeNull();
  });

  it('renders custom chevron template when snIcon="toggle" provided', async () => {
    const fixture = TestBed.createComponent(CustomChevronHost);
    await fixture.whenStable();
    const custom = fixture.nativeElement.querySelector('.custom-chevron');
    expect(custom).not.toBeNull();
  });

  it('snClass string lands on accordion root', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const accordion: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    expect(accordion.classList).toContain('acc-root');
  });

  it('snClass map sections land on correct elements', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const panel: HTMLElement = fixture.nativeElement.querySelector('sn-expansion-panel');
    expect(panel.classList).toContain('ep-root');
    const button: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    expect(button.classList).toContain('ep-btn');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    btn.click();
    await fixture.whenStable();
    const content: HTMLElement = fixture.nativeElement.querySelector('.sn-expansion-panel-content');
    expect(content.classList).toContain('ep-content');
  });

  it('projects custom header via [snExpansionPanelHeader]', async () => {
    const fixture = TestBed.createComponent(CustomHeaderHost);
    await fixture.whenStable();
    const title = fixture.nativeElement.querySelector('.sn-expansion-panel-title');
    expect(title.textContent).toContain('Custom projected header');
  });

  it('Arrow Down moves focus to next header', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const accordion: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    buttons[0].focus();
    buttons[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    accordion.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40, bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('Arrow Up moves focus to previous header', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const accordion: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-expansion-panel-button');
    buttons[1].focus();
    buttons[1].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    accordion.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 38, bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('Home key moves focus to first header', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const accordion: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    accordion.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 36, bubbles: true }));
    await fixture.whenStable();
  });

  it('End key moves focus to last header', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const accordion: HTMLElement = fixture.nativeElement.querySelector('sn-accordion');
    accordion.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 35, bubbles: true }));
    await fixture.whenStable();
  });

  it('button has sn-expansion-panel-button--expanded class when expanded', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    expect(button.classList).toContain('sn-expansion-panel-button--expanded');
  });

  it('toggle chevron has sn-expansion-panel-toggle--expanded class when expanded', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-expansion-panel-button');
    button.click();
    await fixture.whenStable();
    const toggle = fixture.nativeElement.querySelector('.sn-expansion-panel-toggle');
    expect(toggle.classList).toContain('sn-expansion-panel-toggle--expanded');
  });

  it('does not have sn-expansion-panel-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-expansion-panel');
    expect(el.classList.contains('sn-expansion-panel-animate')).toBe(false);
  });

  it('adds sn-expansion-panel-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(BasicAccordionHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-expansion-panel');
    expect(el.classList.contains('sn-expansion-panel-animate')).toBe(true);
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing panel semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const accordion: HTMLElement = el.querySelector('sn-accordion')!;
    const root: HTMLElement = el.querySelector('sn-expansion-panel')!;
    const header: HTMLElement = el.querySelector('.sn-expansion-panel-heading')!;
    const button: HTMLElement = el.querySelector('.sn-expansion-panel-button')!;
    const icon: HTMLElement = el.querySelector('.sn-expansion-panel-icon')!;
    const title: HTMLElement = el.querySelector('.sn-expansion-panel-title')!;
    const toggle: HTMLElement = el.querySelector('.sn-expansion-panel-toggle')!;
    const content: HTMLElement = el.querySelector('.sn-expansion-panel-content')!;

    expect(accordion.style.outline).toContain('teal');
    expect(accordion.getAttribute('data-testid')).toBe('acc-root');

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('ep-root');
    // Collapsed by default, so the reserved state attribute stays absent.
    expect(root.getAttribute('data-sn-expanded')).toBeNull();
    expect(header.style.color).toBe('rgb(1, 2, 3)');
    expect(header.getAttribute('data-testid')).toBe('ep-header');
    expect(button.style.color).toBe('rgb(4, 5, 6)');
    expect(button.getAttribute('data-testid')).toBe('ep-button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('id')).not.toBe('invalid-id');
    expect(icon.style.color).toBe('rgb(7, 8, 9)');
    expect(icon.getAttribute('data-testid')).toBe('ep-icon');
    expect(title.style.color).toBe('rgb(10, 11, 12)');
    expect(title.getAttribute('data-testid')).toBe('ep-title');
    expect(toggle.style.color).toBe('rgb(13, 14, 15)');
    expect(toggle.getAttribute('data-testid')).toBe('ep-toggle');
    expect(content.style.color).toBe('rgb(16, 17, 18)');
    expect(content.getAttribute('data-testid')).toBe('ep-content');
    expect(content.getAttribute('role')).toBe('region');
    expect(content.getAttribute('id')).not.toBe('invalid-content-id');
    // The button's aria-controls still points at the real content id.
    expect(button.getAttribute('aria-controls')).toBe(content.getAttribute('id'));
  });
});
