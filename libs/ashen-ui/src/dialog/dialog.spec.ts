import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dialog } from './dialog';
import { DialogFooter } from './dialog-footer';
import { DialogTitle } from './dialog-title';
import { DialogClose } from './dialog-close';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Test Dialog">
      <p class="body-content">Dialog body text</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'basic-host' },
})
class BasicHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-dialog [(open)]="outer" title="Outer">
      <p>Outer body</p>
    </sn-dialog>
    <sn-dialog [(open)]="inner" title="Inner">
      <p>Inner body</p>
    </sn-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dialog],
})
class NestedHost {
  readonly outer = signal(false);
  readonly inner = signal(false);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="With Footer">
      <p>Body</p>
      <div snDialogFooter class="footer-content">
        <button class="cancel-btn" (click)="open.set(false)">Cancel</button>
        <button class="ok-btn">OK</button>
      </div>
    </sn-dialog>
  `,
  imports: [Dialog, DialogFooter],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'footer-host' },
})
class FooterHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-dialog [(open)]="open">
      <span snDialogTitle class="custom-title">Custom Title Slot</span>
      <p>Body</p>
    </sn-dialog>
  `,
  imports: [Dialog, DialogTitle],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'title-slot-host' },
})
class TitleSlotHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Sized" size="sm">
      <p>Small dialog</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'sm-host' },
})
class SmHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Large" size="lg">
      <p>Large dialog</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'lg-host' },
})
class LgHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Pre-open">
      <p>Already open</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'preopen-host' },
})
class PreopenHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Custom Close" closeLabel="Dismiss">
      <p>Close label test</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'close-label-host' },
})
class CloseLabelHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Directive Close">
      <p>Dialog body</p>
      <div snDialogFooter>
        <button class="directive-close-btn" snDialogClose>Close</button>
      </div>
    </sn-dialog>
  `,
  imports: [Dialog, DialogFooter, DialogClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'directive-close-host' },
})
class DirectiveCloseHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-dialog [(open)]="open" title="Order Test">
      <div snDialogFooter>
        <button class="order-btn" snDialogClose (click)="recordHandler()">Save</button>
      </div>
    </sn-dialog>
  `,
  imports: [Dialog, DialogFooter, DialogClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'order-host' },
})
class OrderHost {
  readonly open = signal(true);
  readonly events: string[] = [];

  recordHandler(): void {
    this.events.push('handler');
  }
}

@Component({
  template: `
    <sn-dialog
      [(open)]="open"
      title="Part dialog"
      [snStyle]="{
        root: { outline: '1px solid red' },
        container: { outline: '1px solid green' },
        mask: { opacity: '0.5' },
        panel: { outline: '1px solid blue' },
        header: { color: 'rgb(1, 2, 3)' },
        title: { color: 'rgb(4, 5, 6)' },
        close: { outline: '1px solid purple' },
        body: { color: 'rgb(7, 8, 9)' },
        footer: { color: 'rgb(10, 11, 12)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'part-dialog', 'data-sn-open': 'invalid' },
        container: { 'data-testid': 'dialog-container' },
        mask: { 'data-testid': 'dialog-mask' },
        panel: { 'data-testid': 'dialog-panel', role: 'alert', id: 'invalid-panel' },
        header: { 'data-testid': 'dialog-header' },
        title: { 'data-testid': 'dialog-title', id: 'invalid-title' },
        close: { 'data-testid': 'dialog-close', 'aria-label': 'invalid label' },
        body: { 'data-testid': 'dialog-body' },
        footer: { 'data-testid': 'dialog-footer' }
      }"
    >
      <p>Dialog body</p>
      <div snDialogFooter>Dialog footer</div>
    </sn-dialog>
  `,
  imports: [Dialog, DialogFooter],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'part-host' },
})
class SnPartHost {
  readonly open = signal(true);
}

describe('Dialog component', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(fixture: ReturnType<typeof TestBed.createComponent<unknown>>): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="dialog"]');
  }

  async function openDialog(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
  }

  it('does not show panel when open is false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('shows panel when open is set to true', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('renders title text in the header', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel(fixture)!;
    expect(panel.querySelector('.sn-dialog-title')?.textContent?.trim()).toBe('Test Dialog');
  });

  it('renders body content', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('.body-content')).toBeTruthy();
  });

  it('shows panel when open=true initially (pre-open)', async () => {
    const fixture = TestBed.createComponent(PreopenHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('panel has role="dialog"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.getAttribute('role')).toBe('dialog');
  });

  it('panel has aria-modal="true"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.getAttribute('aria-modal')).toBe('true');
  });

  it('panel has aria-labelledby pointing to title element id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel(fixture)!;
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const titleEl = panel.querySelector(`#${labelledBy}`);
    expect(titleEl).toBeTruthy();
  });

  it('panel has unique id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.getAttribute('id')).toBeTruthy();
  });

  it('host has sn-dialog class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-dialog') as HTMLElement;
    expect(host.classList).toContain('sn-dialog');
  });

  it('close button is rendered in the header', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-dialog-close-button')).toBeTruthy();
  });

  it('close button has aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-dialog-close-button') as HTMLElement;
    expect(closeBtn?.getAttribute('aria-label')).toBeTruthy();
  });

  it('close button uses custom closeLabel input', async () => {
    const fixture = TestBed.createComponent(CloseLabelHost);
    await tick(10);
    await fixture.whenStable();
    const closeBtn = getPanel(fixture)?.querySelector('.sn-dialog-close-button') as HTMLElement;
    expect(closeBtn?.getAttribute('aria-label')).toBe('Dismiss');
  });

  it('clicking close button closes the dialog', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-dialog-close-button') as HTMLElement;
    closeBtn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('clicking close button sets open model to false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-dialog-close-button') as HTMLElement;
    closeBtn.click();
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('closes on Escape key via CDK overlay', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)).toBeTruthy();

    const overlayEl = overlayContainer.getContainerElement();
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('closes only the topmost of two open dialogs on Escape', async () => {
    const fixture = TestBed.createComponent(NestedHost);
    await fixture.whenStable();
    fixture.componentInstance.outer.set(true);
    await tick(10);
    await fixture.whenStable();
    fixture.componentInstance.inner.set(true);
    await tick(10);
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.inner()).toBe(false);
    expect(fixture.componentInstance.outer()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await tick(200);
    await fixture.whenStable();
    expect(fixture.componentInstance.outer()).toBe(false);
  });

  it('stays open when a nested widget already handled the Escape', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);

    const overlayEl = overlayContainer.getContainerElement();
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    escEvent.preventDefault();
    overlayEl.dispatchEvent(escEvent);
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('open model starts false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model becomes true when dialog opens', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('setting open to false externally closes the dialog', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)).toBeTruthy();
    fixture.componentInstance.open.set(false);
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('applies sn-dialog-panel--sm class for size="sm"', async () => {
    const fixture = TestBed.createComponent(SmHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-dialog-panel--sm');
  });

  it('does not apply size modifier class for size="md" (default)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const panel = getPanel(fixture)!;
    expect(panel.classList).not.toContain('sn-dialog-panel--sm');
    expect(panel.classList).not.toContain('sn-dialog-panel--lg');
  });

  it('applies sn-dialog-panel--lg class for size="lg"', async () => {
    const fixture = TestBed.createComponent(LgHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-dialog-panel--lg');
  });

  it('renders footer when snDialogFooter directive is used', async () => {
    const fixture = TestBed.createComponent(FooterHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.querySelector('.sn-dialog-footer')).toBeTruthy();
  });

  it('does not render footer element when no snDialogFooter directive', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-dialog-footer')).toBeNull();
  });

  it('renders footer content', async () => {
    const fixture = TestBed.createComponent(FooterHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.querySelector('.cancel-btn')).toBeTruthy();
  });

  it('renders title from input string', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('h2.sn-dialog-title')).toBeTruthy();
  });

  it('renders custom title slot when no title input', async () => {
    const fixture = TestBed.createComponent(TitleSlotHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    // Title slot renders in a div (not h2) when using snDialogTitle directive
    const titleEl = getPanel(fixture)?.querySelector('.sn-dialog-title');
    expect(titleEl).toBeTruthy();
  });

  it('mask is present when dialog is open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const mask = fixture.nativeElement.querySelector('.sn-dialog-mask');
    expect(mask).toBeTruthy();
  });

  it('mask click closes the dialog', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const mask = fixture.nativeElement.querySelector('.sn-dialog-mask') as HTMLElement;
    expect(mask).toBeTruthy();
    mask.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('container has sn-dialog-container class when visible', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    const container = fixture.nativeElement.querySelector('.sn-dialog-container');
    expect(container).toBeTruthy();
  });

  it('container gets sn-dialog-container--hiding class during close animation', async () => {
    onTestFinished(fakeRunningAnimations(150));
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    fixture.componentInstance.open.set(false);
    await tick(5);
    await fixture.whenStable();
    const container = fixture.nativeElement.querySelector('.sn-dialog-container');
    expect(container?.classList).toContain('sn-dialog-container--hiding');
  });

  it('panel has sn-dialog-header element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-dialog-header')).toBeTruthy();
  });

  it('panel has sn-dialog-body element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDialog(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-dialog-body')).toBeTruthy();
  });

  it('[snDialogClose] closes the dialog on click', async () => {
    const fixture = TestBed.createComponent(DirectiveCloseHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();

    const closeBtn = fixture.nativeElement.querySelector('.directive-close-btn') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('[snDialogClose] consumer (click) handler runs before close', async () => {
    const fixture = TestBed.createComponent(OrderHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();

    const orderBtn = fixture.nativeElement.querySelector('.order-btn') as HTMLElement;
    expect(orderBtn).toBeTruthy();

    const host = fixture.componentInstance;
    const callOrder: string[] = [];
    const originalRecord = host.recordHandler.bind(host);
    host.recordHandler = () => {
      callOrder.push('handler');
      expect(getPanel(fixture)).toBeTruthy();
      originalRecord();
    };

    orderBtn.click();
    await tick(0);
    await fixture.whenStable();
    expect(callOrder).toContain('handler');
    await tick(200);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing dialog semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await tick(10);
    await fixture.whenStable();

    const root: HTMLElement = fixture.nativeElement.querySelector('sn-dialog');
    const container: HTMLElement = fixture.nativeElement.querySelector('.sn-dialog-container');
    const mask: HTMLElement = fixture.nativeElement.querySelector('.sn-dialog-mask');
    const panel = getPanel(fixture)!;
    const header = panel.querySelector<HTMLElement>('.sn-dialog-header')!;
    const title = panel.querySelector<HTMLElement>('.sn-dialog-title')!;
    const close = panel.querySelector<HTMLElement>('.sn-dialog-close-button')!;
    const body = panel.querySelector<HTMLElement>('.sn-dialog-body')!;
    const footer = panel.querySelector<HTMLElement>('.sn-dialog-footer')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('part-dialog');
    expect(root.getAttribute('data-sn-open')).toBe('');
    expect(container.style.outline).toContain('green');
    expect(container.getAttribute('data-testid')).toBe('dialog-container');
    expect(mask.style.opacity).toBe('0.5');
    expect(mask.getAttribute('data-testid')).toBe('dialog-mask');
    expect(panel.style.outline).toContain('blue');
    expect(panel.getAttribute('data-testid')).toBe('dialog-panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('id')).not.toBe('invalid-panel');
    expect(header.style.color).toBe('rgb(1, 2, 3)');
    expect(header.getAttribute('data-testid')).toBe('dialog-header');
    expect(title.style.color).toBe('rgb(4, 5, 6)');
    expect(title.getAttribute('data-testid')).toBe('dialog-title');
    expect(title.getAttribute('id')).not.toBe('invalid-title');
    expect(close.style.outline).toContain('purple');
    expect(close.getAttribute('data-testid')).toBe('dialog-close');
    expect(close.getAttribute('aria-label')).not.toBe('invalid label');
    expect(body.style.color).toBe('rgb(7, 8, 9)');
    expect(body.getAttribute('data-testid')).toBe('dialog-body');
    expect(footer.style.color).toBe('rgb(10, 11, 12)');
    expect(footer.getAttribute('data-testid')).toBe('dialog-footer');
  });
});

@Component({
  template: `
    <sn-dialog [(open)]="open" title="No Anim" [animated]="false">
      <p>Body</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'no-anim-host' },
})
class NoAnimHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-dialog
      [(open)]="open"
      title="Custom Anim"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    >
      <p>Body</p>
    </sn-dialog>
  `,
  imports: [Dialog],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'custom-anim-host' },
})
class CustomAnimHost {
  readonly open = signal(false);
}

describe('Dialog animation inputs', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(fixture: ReturnType<typeof TestBed.createComponent<unknown>>): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="dialog"]');
  }

  it('animated=false suppresses the enter animation via inline style', async () => {
    const fixture = TestBed.createComponent(NoAnimHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture)!;
    expect(panel.style.animation).toBe('none');
    const mask = fixture.nativeElement.querySelector('.sn-dialog-mask') as HTMLElement;
    expect(mask.style.animation).toBe('none');
  });

  it('animated=false closes without waiting for the exit animation', async () => {
    const fixture = TestBed.createComponent(NoAnimHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('custom enter animation is applied inline while opening', async () => {
    const fixture = TestBed.createComponent(CustomAnimHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture)!;
    expect(panel.style.animation).toContain('my-in');
  });

  it('custom exit animation is applied inline while hiding and drives the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fixture = TestBed.createComponent(CustomAnimHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    await tick(5);
    await fixture.whenStable();
    const panel = getPanel(fixture)!;
    expect(panel.style.animation).toContain('my-out');
    // exit is 40ms - panel should be gone well before the default 150ms
    await tick(80);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });
});
