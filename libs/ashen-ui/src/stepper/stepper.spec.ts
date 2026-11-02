import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { Stepper } from './stepper';
import { Step } from './step';
import { provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `
    <sn-stepper>
      <sn-step label="Account">Account content</sn-step>
      <sn-step label="Address">Address content</sn-step>
      <sn-step label="Confirm">Confirm content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class BasicStepperHost {}

@Component({
  template: `
    <sn-stepper>
      <sn-step label="First" icon="person">First content</sn-step>
      <sn-step label="Second" icon="home">Second content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class WithIconsHost {}

@Component({
  template: `
    <sn-stepper [(activeStep)]="step">
      <sn-step label="Step 1">Step 1 content</sn-step>
      <sn-step label="Step 2">Step 2 content</sn-step>
      <sn-step label="Step 3">Step 3 content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class TwoWayHost {
  readonly step = signal(0);
}

@Component({
  template: `
    <sn-stepper [activeStep]="1">
      <sn-step label="First">First</sn-step>
      <sn-step label="Second">Second</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class InitialStepHost {}

@Component({
  template: `
    <sn-stepper [linear]="true">
      <sn-step label="First">First</sn-step>
      <sn-step label="Second">Second</sn-step>
      <sn-step label="Third">Third</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class LinearHost {}

@Component({
  template: `
    <sn-stepper>
      <sn-step label="Enabled">Enabled content</sn-step>
      <sn-step label="Disabled" [disabled]="true">Disabled content</sn-step>
      <sn-step label="Another">Another content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class WithDisabledHost {}

@Component({
  template: `
    <sn-stepper orientation="vertical">
      <sn-step label="Step 1">Step 1 content</sn-step>
      <sn-step label="Step 2">Step 2 content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class VerticalHost {}

@Component({
  template: `
    <sn-stepper snClass="my-stepper">
      <sn-step label="Step A" [snClass]="{ header: 'my-header', label: 'my-label' }">Content A</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class SnClassHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-stepper [(activeStep)]="step">
        <sn-step label="Account">Account content</sn-step>
        <sn-step label="Address">Address content</sn-step>
        <sn-step label="Confirm">Confirm content</sn-step>
      </sn-stepper>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Stepper, Step],
})
class RtlHost {
  readonly step = signal(0);
}

@Component({
  template: `
    <div dir="rtl">
      <sn-stepper orientation="vertical">
        <sn-step label="Step 1">Step 1 content</sn-step>
        <sn-step label="Step 2">Step 2 content</sn-step>
        <sn-step label="Step 3">Step 3 content</sn-step>
      </sn-stepper>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Stepper, Step],
})
class RtlVerticalHost {}

@Component({
  template: `
    <sn-stepper>
      <sn-step label="Step 1" [completed]="true">Content 1</sn-step>
      <sn-step label="Step 2">Content 2</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class CompletedOverrideHost {}

@Component({
  template: `
    <sn-stepper
      [snStyle]="{
        root: { outline: '1px solid red' },
        list: { color: 'rgb(1, 2, 3)' },
        header: { color: 'rgb(4, 5, 6)' },
        marker: { color: 'rgb(7, 8, 9)' },
        label: { color: 'rgb(10, 11, 12)' },
        connector: { color: 'rgb(13, 14, 15)' },
        panel: { color: 'rgb(16, 17, 18)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'stepper-root' },
        list: { 'data-testid': 'stepper-list', 'aria-label': 'nope' },
        header: { 'data-testid': 'stepper-header', 'aria-current': 'nope', disabled: true },
        marker: { 'data-testid': 'stepper-marker', 'aria-hidden': 'false' },
        label: { 'data-testid': 'stepper-label' },
        connector: { 'data-testid': 'stepper-connector', 'aria-hidden': 'false' },
        panel: { 'data-testid': 'stepper-panel', role: 'presentation' }
      }"
    >
      <sn-step label="First">First content</sn-step>
      <sn-step label="Second">Second content</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class SnPartHost {}

@Component({
  template: `
    <sn-stepper ariaLabel="Checkout steps">
      <sn-step label="First">First</sn-step>
    </sn-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Stepper, Step],
})
class LabelledHost {}

describe('Stepper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders sn-stepper with sn-stepper class', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el).not.toBeNull();
    expect(el.classList).toContain('sn-stepper');
  });

  it('renders an ol list with sn-stepper-list class', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const list = fixture.nativeElement.querySelector('ol.sn-stepper-list');
    expect(list).not.toBeNull();
  });

  it('renders one li item per sn-step', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('li.sn-stepper-item');
    expect(items.length).toBe(3);
  });

  it('renders one step header button per sn-step', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons.length).toBe(3);
  });

  it('first step is active by default (aria-current=step)', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
    expect(buttons[1].getAttribute('aria-current')).toBeNull();
    expect(buttons[2].getAttribute('aria-current')).toBeNull();
  });

  it('initialStep input selects the correct step', async () => {
    const fixture = TestBed.createComponent(InitialStepHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBeNull();
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('active step button has tabindex=0, others have tabindex=-1', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
    expect(buttons[1].getAttribute('tabindex')).toBe('-1');
    expect(buttons[2].getAttribute('tabindex')).toBe('-1');
  });

  it('clicking a step updates activeStep', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('shows only active step panel content', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const panels = fixture.nativeElement.querySelectorAll('.sn-step-panel');
    expect(panels.length).toBe(1);
    expect(panels[0].textContent).toContain('Account content');
  });

  it('after clicking step 2, panel shows step 2 content', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[1].click();
    await fixture.whenStable();
    const panels = fixture.nativeElement.querySelectorAll('.sn-step-panel');
    expect(panels.length).toBe(1);
    expect(panels[0].textContent).toContain('Address content');
  });

  it('two-way activeStep binding works', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    expect(host.step()).toBe(0);
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[1].click();
    await fixture.whenStable();
    expect(host.step()).toBe(1);
  });

  it('step marker shows check icon for completed step', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.step.set(1);
    await fixture.whenStable();
    const markers = fixture.nativeElement.querySelectorAll('.sn-step-marker');
    const firstMarker: HTMLElement = markers[0];
    expect(firstMarker.querySelector('sn-icon')).not.toBeNull();
  });

  it('step marker shows number for upcoming step without icon', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const secondMarker: HTMLElement = fixture.nativeElement.querySelectorAll('.sn-step-marker')[1];
    expect(secondMarker.querySelector('.sn-step-number')).not.toBeNull();
    expect(secondMarker.querySelector('.sn-step-number')!.textContent?.trim()).toBe('2');
  });

  it('step marker shows icon instead of number when icon input is set', async () => {
    const fixture = TestBed.createComponent(WithIconsHost);
    await fixture.whenStable();
    const markers = fixture.nativeElement.querySelectorAll('.sn-step-marker');
    expect(markers[0].querySelector('sn-icon')).not.toBeNull();
    expect(markers[0].querySelector('.sn-step-number')).toBeNull();
  });

  it('disabled step cannot be clicked', async () => {
    const fixture = TestBed.createComponent(WithDisabledHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[1].disabled).toBe(true);
    buttons[1].click();
    await fixture.whenStable();
    const activePanel: HTMLElement = fixture.nativeElement.querySelector('.sn-step-panel');
    expect(activePanel.textContent).toContain('Enabled content');
  });

  it('linear mode prevents jumping ahead beyond next step', async () => {
    const fixture = TestBed.createComponent(LinearHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[2].click();
    await fixture.whenStable();
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });

  it('linear mode allows going to next step', async () => {
    const fixture = TestBed.createComponent(LinearHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[1].click();
    await fixture.whenStable();
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('renders connector between steps (not after last)', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const connectors = fixture.nativeElement.querySelectorAll('.sn-step-connector');
    expect(connectors.length).toBe(2);
  });

  it('connector after completed step gets completed class', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.step.set(2);
    await fixture.whenStable();
    const connectors = fixture.nativeElement.querySelectorAll('.sn-step-connector');
    expect(connectors[0].classList).toContain('sn-step-connector--completed');
    expect(connectors[1].classList).toContain('sn-step-connector--completed');
  });

  it('panel has region role and aria-labelledby pointing to header button', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const panel: HTMLElement = fixture.nativeElement.querySelector('.sn-step-panel');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.sn-step-header');
    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.getAttribute('aria-labelledby')).toBe(button.getAttribute('id'));
  });

  it('horizontal orientation adds sn-stepper--horizontal class', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el.classList).toContain('sn-stepper--horizontal');
  });

  it('vertical orientation adds sn-stepper--vertical class', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el.classList).toContain('sn-stepper--vertical');
  });

  it('completed input override marks step as completed regardless of activeStep', async () => {
    const fixture = TestBed.createComponent(CompletedOverrideHost);
    await fixture.whenStable();
    const firstHeader: HTMLElement = fixture.nativeElement.querySelector('.sn-step-header');
    expect(firstHeader.classList).toContain('sn-step-header--completed');
  });

  it('snClass string lands on stepper root', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el.classList).toContain('my-stepper');
  });

  it('snClass map header section lands on step header button', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const header: HTMLElement = fixture.nativeElement.querySelector('.sn-step-header');
    expect(header.classList).toContain('my-header');
  });

  it('ArrowRight moves to next step in horizontal mode', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('ArrowRight moves DOM focus to the next step button', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    buttons[0].focus();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('ArrowLeft moves to previous step in horizontal mode', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.step.set(1);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });

  it('ArrowLeft moves to the NEXT step in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');

    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 37, bubbles: true }));
    await fixture.whenStable();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('ArrowRight moves to the PREVIOUS step in rtl', async () => {
    const fixture = TestBed.createComponent(RtlHost);
    fixture.componentInstance.step.set(1);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');

    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });

  // Vertical arrows are rewritten to horizontal ones, so in RTL down must still mean next.
  it('ArrowDown moves to the next step in a vertical rtl stepper', async () => {
    const fixture = TestBed.createComponent(RtlVerticalHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');

    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40, bubbles: true }));
    await fixture.whenStable();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[1].getAttribute('aria-current')).toBe('step');
  });

  it('Home key moves to first step', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.step.set(2);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 36, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });

  it('End key moves to last step', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 35, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[2].getAttribute('aria-current')).toBe('step');
  });

  it('ArrowRight wraps from last to first step', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    fixture.componentInstance.step.set(2);
    await fixture.whenStable();
    const sn: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    sn.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 39, bubbles: true }));
    await fixture.whenStable();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.sn-step-header');
    expect(buttons[0].getAttribute('aria-current')).toBe('step');
  });

  it('step marker is aria-hidden', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const marker: HTMLElement = fixture.nativeElement.querySelector('.sn-step-marker');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
  });

  it('connector elements are aria-hidden', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const connectors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.sn-step-connector');
    connectors.forEach(c => {
      expect(c.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('step labels render correctly', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const labels = fixture.nativeElement.querySelectorAll('.sn-step-label');
    expect(labels[0].textContent?.trim()).toBe('Account');
    expect(labels[1].textContent?.trim()).toBe('Address');
    expect(labels[2].textContent?.trim()).toBe('Confirm');
  });

  it('does not have sn-stepper-animate immediately after first render', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el.classList.contains('sn-stepper-animate')).toBe(false);
  });

  it('adds sn-stepper-animate after two animation frames', async () => {
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-stepper');
    expect(el.classList.contains('sn-stepper-animate')).toBe(true);
  });

  it('applies snStyle and allowed snAttrs to the root and repeated named parts without breaking a11y', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-stepper')!;
    const list: HTMLElement = el.querySelector('.sn-stepper-list')!;
    const headers = el.querySelectorAll<HTMLButtonElement>('.sn-step-header');
    const markers = el.querySelectorAll<HTMLElement>('.sn-step-marker');
    const labels = el.querySelectorAll<HTMLElement>('.sn-step-label');
    const connector = el.querySelector('.sn-step-connector') as HTMLElement;
    const panel = el.querySelector('.sn-step-panel') as HTMLElement;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('stepper-root');
    expect(list.style.color).toBe('rgb(1, 2, 3)');
    expect(list.getAttribute('data-testid')).toBe('stepper-list');
    expect(headers[0].style.color).toBe('rgb(4, 5, 6)');
    expect(headers[1].style.color).toBe('rgb(4, 5, 6)');
    expect(headers[0].getAttribute('data-testid')).toBe('stepper-header');
    expect(markers[0].style.color).toBe('rgb(7, 8, 9)');
    expect(markers[0].getAttribute('data-testid')).toBe('stepper-marker');
    expect(labels[0].style.color).toBe('rgb(10, 11, 12)');
    expect(labels[0].getAttribute('data-testid')).toBe('stepper-label');
    expect(connector.style.color).toBe('rgb(13, 14, 15)');
    expect(connector.getAttribute('data-testid')).toBe('stepper-connector');
    expect(panel.style.color).toBe('rgb(16, 17, 18)');
    expect(panel.getAttribute('data-testid')).toBe('stepper-panel');

    // Reserved attrs stay under the component's own control, not the pass-through's.
    expect(list.getAttribute('aria-label')).toBe('Progress steps');
    expect(headers[0].getAttribute('aria-current')).toBe('step');
    expect(headers[0].disabled).toBe(false);
    expect(markers[0].getAttribute('aria-hidden')).toBe('true');
    expect(connector.getAttribute('aria-hidden')).toBe('true');
    expect(panel.getAttribute('role')).toBe('region');
  });

  it('takes the list label from ariaLabel', async () => {
    const fixture = TestBed.createComponent(LabelledHost);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('ol.sn-stepper-list');
    expect(list.getAttribute('aria-label')).toBe('Checkout steps');
  });

  it('takes the default list label from SnStepperIntl', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSnIntl({ stepper: { label: 'Các bước' } })],
    });
    const fixture = TestBed.createComponent(BasicStepperHost);
    await fixture.whenStable();
    const list: HTMLElement = fixture.nativeElement.querySelector('ol.sn-stepper-list');
    expect(list.getAttribute('aria-label')).toBe('Các bước');
  });
});
