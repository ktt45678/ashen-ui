import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Popover } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverContent } from './popover-content';
import { PopoverClose } from './popover-close';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-popover>
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent let-close="close">
        <div class="popover-body">
          <p>Popover content</p>
          <button class="close-btn" (click)="close()">Close</button>
        </div>
      </ng-template>
    </sn-popover>
  `,
  imports: [Popover, PopoverTrigger, PopoverContent],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'basic-host' },
})
class BasicHost {}

@Component({
  template: `
    <sn-popover [open]="open()" (openChange)="open.set($event)" position="top">
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent>
        <p>Top positioned</p>
      </ng-template>
    </sn-popover>
  `,
  imports: [Popover, PopoverTrigger, PopoverContent],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'top-host' },
})
class TopHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-popover position="right">
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent let-close="close">
        <button class="inner-close" (click)="close()">Close via context</button>
      </ng-template>
    </sn-popover>
  `,
  imports: [Popover, PopoverTrigger, PopoverContent],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'right-host' },
})
class RightHost {}

@Component({
  template: `
    <sn-popover>
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent>
        <button class="directive-close" snPopoverClose>Close via directive</button>
      </ng-template>
    </sn-popover>
  `,
  imports: [Popover, PopoverTrigger, PopoverContent, PopoverClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'directive-close-host' },
})
class DirectiveCloseHost {}

@Component({
  template: `
    <sn-popover>
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent>
        <button
          class="order-btn"
          snPopoverClose
          (click)="recordOrder()"
        >Save & close</button>
      </ng-template>
    </sn-popover>
  `,
  imports: [Popover, PopoverTrigger, PopoverContent, PopoverClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'order-host' },
})
class OrderHost {
  readonly events: string[] = [];
  popoverWasOpenWhenHandlerRan = false;

  recordOrder(): void {
    this.events.push('handler');
  }
}

describe('Popover component', () => {
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

  function getPanelEl(): HTMLElement | null {
    return overlayEl.querySelector('[role="dialog"]');
  }

  async function openPopover(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    return btn;
  }

  it('does not show panel initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanelEl()).toBeNull();
  });

  it('shows panel after trigger click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(getPanelEl()).toBeTruthy();
  });

  it('renders projected content in the panel', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(getPanelEl()!.querySelector('.popover-body')).toBeTruthy();
  });

  it('renders panel with role="dialog"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    const panel = getPanelEl();
    expect(panel?.getAttribute('role')).toBe('dialog');
  });

  it('panel has sn-popover-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(getPanelEl()?.classList).toContain('sn-popover-panel');
  });

  it('host has sn-popover class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-popover') as HTMLElement;
    expect(host.classList).toContain('sn-popover');
  });

  it('closes panel on second trigger click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopover(fixture);
    expect(getPanelEl()).toBeTruthy();
    btn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('closes on Escape keydown event', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(getPanelEl()).toBeTruthy();

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('stays closed when Escape arrives before the open effect has run', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('closes when close() callback is invoked inside panel', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    const closeBtn = overlayEl.querySelector('.close-btn') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('trigger has aria-haspopup="dialog"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('trigger has aria-expanded="false" initially', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger has aria-expanded="true" when open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopover(fixture);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-expanded returns to "false" after close', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopover(fixture);
    btn.click();
    await tick(200);
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger has aria-controls matching panel id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openPopover(fixture);
    const controls = btn.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = getPanelEl();
    expect(panel?.getAttribute('id')).toBe(controls);
  });

  it('panel has a unique id attribute', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(getPanelEl()?.getAttribute('id')).toBeTruthy();
  });

  it('template context close() closes the popover', async () => {
    const fixture = TestBed.createComponent(RightHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    const innerClose = overlayEl.querySelector('.inner-close') as HTMLElement;
    expect(innerClose).toBeTruthy();
    innerClose.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('open model is false initially', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model updates to true after trigger click', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('opens and closes when the bound open value changes from code', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await fixture.whenStable();

    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
    expect(overlayEl.parentElement!.querySelector('.sn-popover-backdrop')).toBeNull();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('CDK overlay has sn-popover-overlay-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(overlayEl.querySelector('.sn-popover-overlay-panel')).toBeTruthy();
  });

  it('overlay container has sn-popover-container class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    expect(overlayEl.querySelector('.sn-popover-container')).toBeTruthy();
  });

  it('overlay container has sn-popover-visible class when open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openPopover(fixture);
    const container = overlayEl.querySelector('.sn-popover-container') as HTMLElement;
    expect(container?.classList).toContain('sn-popover-visible');
  });

  it('opens when position=top', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();
  });

  it('opens when position=right', async () => {
    const fixture = TestBed.createComponent(RightHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();
  });

  it('[snPopoverClose] closes the popover on click', async () => {
    const fixture = TestBed.createComponent(DirectiveCloseHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();

    const closeBtn = overlayEl.querySelector('.directive-close') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });

  it('[snPopoverClose] consumer (click) handler runs before close', async () => {
    const fixture = TestBed.createComponent(OrderHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement;
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanelEl()).toBeTruthy();

    const orderBtn = overlayEl.querySelector('.order-btn') as HTMLElement;
    expect(orderBtn).toBeTruthy();

    const host = fixture.componentInstance;
    const callOrder: string[] = [];
    const originalRecord = host.recordOrder.bind(host);
    host.recordOrder = () => {
      callOrder.push('handler');
      expect(getPanelEl()).toBeTruthy();
      originalRecord();
    };

    orderBtn.click();
    await tick(0);
    await fixture.whenStable();
    expect(callOrder).toContain('handler');
    await tick(200);
    await fixture.whenStable();
    expect(getPanelEl()).toBeNull();
  });
});

@Component({
  template: `
    <sn-popover [animated]="false">
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent><p>Content</p></ng-template>
    </sn-popover>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Popover, PopoverTrigger, PopoverContent],
})
class NoAnimPopoverHost {}

@Component({
  template: `
    <sn-popover [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent><p>Content</p></ng-template>
    </sn-popover>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Popover, PopoverTrigger, PopoverContent],
})
class CustomAnimPopoverHost {}

describe('Popover animation inputs', () => {
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
    return overlayEl.querySelector('.sn-popover-panel');
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimPopoverHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.animation).toBe('none');
    trigger.click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimPopoverHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    trigger.click();
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
    <sn-popover
      [snStyle]="{ root: { outline: '1px solid red' }, panel: { outline: '1px solid blue' } }"
      [snAttrs]="{
        root: { 'data-testid': 'pop-root' },
        panel: { 'data-testid': 'pop-panel', role: 'listbox' }
      }"
    >
      <button snPopoverTrigger>Open</button>
      <ng-template snPopoverContent><p>Body</p></ng-template>
    </sn-popover>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Popover, PopoverTrigger, PopoverContent],
})
class SnPartPopoverHost {}

describe('Popover snPart pass-through', () => {
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

  it('applies snStyle and allowed snAttrs to the host and the overlay panel, keeping dialog semantics', async () => {
    const fix = TestBed.createComponent(SnPartPopoverHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-popover') as HTMLElement;
    (fix.nativeElement.querySelector('[snPopoverTrigger]') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();

    const panel = overlayEl.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel).toBeTruthy();

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('pop-root');
    expect(panel.style.outline).toContain('blue');
    expect(panel.getAttribute('data-testid')).toBe('pop-panel');
    // The panel keeps its dialog role, not the pass-through's value.
    expect(panel.getAttribute('role')).toBe('dialog');
  });
});
