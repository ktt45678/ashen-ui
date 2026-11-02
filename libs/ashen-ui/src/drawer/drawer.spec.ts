import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Drawer } from './drawer';
import { DrawerFooter } from './drawer-footer';
import { DrawerTitle } from './drawer-title';
import { DrawerClose } from './drawer-close';
import { ScrollLock } from 'ashen-ui/core';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Test Drawer">
      <p class="body-content">Drawer body text</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'basic-host' },
})
class BasicHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="With Footer">
      <p>Body</p>
      <div snDrawerFooter class="footer-content">
        <button class="cancel-btn" (click)="open.set(false)">Cancel</button>
        <button class="ok-btn">OK</button>
      </div>
    </sn-drawer>
  `,
  imports: [Drawer, DrawerFooter],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'footer-host' },
})
class FooterHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-drawer [(open)]="open">
      <span snDrawerTitle class="custom-title">Custom Title Slot</span>
      <p>Body</p>
    </sn-drawer>
  `,
  imports: [Drawer, DrawerTitle],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'title-slot-host' },
})
class TitleSlotHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Left Drawer" position="left">
      <p>Left side</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'left-host' },
})
class LeftHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Start Drawer" position="start">
      <p>Start side</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'start-host' },
})
class StartHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Right Drawer" position="right">
      <p>Right side</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'right-host' },
})
class RightHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Pre-open">
      <p>Already open</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'preopen-host' },
})
class PreopenHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Custom Close" closeLabel="Dismiss">
      <p>Close label test</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'close-label-host' },
})
class CloseLabelHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="No Mask" [mask]="false">
      <p>No backdrop</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'no-mask-host' },
})
class NoMaskHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Custom Width" width="30rem">
      <p>Wide drawer</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'width-host' },
})
class WidthHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Top Drawer" position="top">
      <p>Top content</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'top-host' },
})
class TopHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Bottom Drawer" position="bottom">
      <p>Bottom content</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'bottom-host' },
})
class BottomHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Fullscreen Drawer" position="fullscreen">
      <p>Fullscreen content</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'fullscreen-host' },
})
class FullscreenHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Top Custom Height" position="top" height="50vh">
      <p>Tall top drawer</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'height-host' },
})
class HeightHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="No Lock Scroll" [lockScroll]="false">
      <p>Scrollable behind</p>
    </sn-drawer>
  `,
  imports: [Drawer],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'no-lock-scroll-host' },
})
class NoLockScrollHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Directive Close">
      <div snDrawerFooter>
        <button class="directive-close-btn" snDrawerClose>Done</button>
      </div>
    </sn-drawer>
  `,
  imports: [Drawer, DrawerFooter, DrawerClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'directive-close-host' },
})
class DirectiveCloseHost {
  readonly open = signal(true);
}

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Order Test">
      <div snDrawerFooter>
        <button class="order-btn" snDrawerClose (click)="recordHandler()">Save</button>
      </div>
    </sn-drawer>
  `,
  imports: [Drawer, DrawerFooter, DrawerClose],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { id: 'order-host' },
})
class DrawerOrderHost {
  readonly open = signal(true);
  readonly events: string[] = [];

  recordHandler(): void {
    this.events.push('handler');
  }
}

@Component({
  template: `
    <sn-drawer
      [(open)]="open"
      title="Part drawer"
      position="top"
      height="40vh"
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
        root: { 'data-testid': 'part-drawer', 'data-sn-open': 'invalid' },
        container: { 'data-testid': 'drawer-container' },
        mask: { 'data-testid': 'drawer-mask' },
        panel: { 'data-testid': 'drawer-panel', role: 'alert', id: 'invalid-panel' },
        header: { 'data-testid': 'drawer-header' },
        title: { 'data-testid': 'drawer-title', id: 'invalid-title' },
        close: { 'data-testid': 'drawer-close', 'aria-label': 'invalid label' },
        body: { 'data-testid': 'drawer-body' },
        footer: { 'data-testid': 'drawer-footer' }
      }"
    >
      <p>Drawer body</p>
      <div snDrawerFooter>Drawer footer</div>
    </sn-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Drawer, DrawerFooter],
})
class SnPartHost {
  readonly open = signal(true);
}

describe('Drawer component', () => {
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

  async function openDrawer(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
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
    await openDrawer(fixture);
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('renders title text in the header', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const panel = getPanel(fixture)!;
    expect(panel.querySelector('.sn-drawer-title')?.textContent?.trim()).toBe('Test Drawer');
  });

  it('renders body content', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
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
    await openDrawer(fixture);
    expect(getPanel(fixture)?.getAttribute('role')).toBe('dialog');
  });

  it('panel has aria-modal="true"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.getAttribute('aria-modal')).toBe('true');
  });

  it('panel has aria-labelledby pointing to title element id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const panel = getPanel(fixture)!;
    const labelledBy = panel.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const titleEl = panel.querySelector(`#${labelledBy}`);
    expect(titleEl).toBeTruthy();
  });

  it('panel has unique id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.getAttribute('id')).toBeTruthy();
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing drawer semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await tick(10);
    await fixture.whenStable();

    const root: HTMLElement = fixture.nativeElement.querySelector('sn-drawer');
    const container: HTMLElement = fixture.nativeElement.querySelector('.sn-drawer-container');
    const mask: HTMLElement = fixture.nativeElement.querySelector('.sn-drawer-mask');
    const panel = getPanel(fixture)!;
    const header = panel.querySelector<HTMLElement>('.sn-drawer-header')!;
    const title = panel.querySelector<HTMLElement>('.sn-drawer-title')!;
    const close = panel.querySelector<HTMLElement>('.sn-drawer-close-button')!;
    const body = panel.querySelector<HTMLElement>('.sn-drawer-body')!;
    const footer = panel.querySelector<HTMLElement>('.sn-drawer-footer')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('part-drawer');
    expect(root.getAttribute('data-sn-open')).toBe('');
    expect(container.style.outline).toContain('green');
    expect(container.getAttribute('data-testid')).toBe('drawer-container');
    expect(mask.style.opacity).toBe('0.5');
    expect(mask.getAttribute('data-testid')).toBe('drawer-mask');
    expect(panel.style.height).toBe('40vh');
    expect(panel.style.outline).toContain('blue');
    expect(panel.getAttribute('data-testid')).toBe('drawer-panel');
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('id')).not.toBe('invalid-panel');
    expect(header.style.color).toBe('rgb(1, 2, 3)');
    expect(header.getAttribute('data-testid')).toBe('drawer-header');
    expect(title.style.color).toBe('rgb(4, 5, 6)');
    expect(title.getAttribute('data-testid')).toBe('drawer-title');
    expect(title.getAttribute('id')).not.toBe('invalid-title');
    expect(close.style.outline).toContain('purple');
    expect(close.getAttribute('data-testid')).toBe('drawer-close');
    expect(close.getAttribute('aria-label')).not.toBe('invalid label');
    expect(body.style.color).toBe('rgb(7, 8, 9)');
    expect(body.getAttribute('data-testid')).toBe('drawer-body');
    expect(footer.style.color).toBe('rgb(10, 11, 12)');
    expect(footer.getAttribute('data-testid')).toBe('drawer-footer');
  });

  it('host has sn-drawer class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-drawer') as HTMLElement;
    expect(host.classList).toContain('sn-drawer');
  });

  it('close button is rendered in the header', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-drawer-close-button')).toBeTruthy();
  });

  it('close button has aria-label', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-drawer-close-button') as HTMLElement;
    expect(closeBtn?.getAttribute('aria-label')).toBeTruthy();
  });

  it('close button uses custom closeLabel input', async () => {
    const fixture = TestBed.createComponent(CloseLabelHost);
    await tick(10);
    await fixture.whenStable();
    const closeBtn = getPanel(fixture)?.querySelector('.sn-drawer-close-button') as HTMLElement;
    expect(closeBtn?.getAttribute('aria-label')).toBe('Dismiss');
  });

  it('clicking close button closes the drawer', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-drawer-close-button') as HTMLElement;
    closeBtn.click();
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('clicking close button sets open model to false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const closeBtn = getPanel(fixture)?.querySelector('.sn-drawer-close-button') as HTMLElement;
    closeBtn.click();
    await tick(250);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('closes on Escape key via CDK overlay', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)).toBeTruthy();

    const overlayEl = overlayContainer.getContainerElement();
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('stays open when a nested widget already handled the Escape', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);

    const overlayEl = overlayContainer.getContainerElement();
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    escEvent.preventDefault();
    overlayEl.dispatchEvent(escEvent);
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();
  });

  it('open model starts false', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('open model becomes true when drawer opens', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('setting open to false externally closes the drawer', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)).toBeTruthy();
    fixture.componentInstance.open.set(false);
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('applies sn-drawer-panel--right class for position="right"', async () => {
    const fixture = TestBed.createComponent(RightHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-drawer-panel--right');
  });

  it('does not apply sn-drawer-panel--left class for position="right"', async () => {
    const fixture = TestBed.createComponent(RightHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).not.toContain('sn-drawer-panel--left');
  });

  it('applies sn-drawer-panel--left class for position="left"', async () => {
    const fixture = TestBed.createComponent(LeftHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-drawer-panel--left');
  });

  it('does not apply sn-drawer-panel--right class for position="left"', async () => {
    const fixture = TestBed.createComponent(LeftHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).not.toContain('sn-drawer-panel--right');
  });

  // `start` and `end` are the logical pair: the CSS anchors them with
  // `inset-inline-*`, so the class is all the component decides.
  it('applies sn-drawer-panel--start class for position="start"', async () => {
    const fixture = TestBed.createComponent(StartHost);
    await tick(10);
    await fixture.whenStable();

    const classList = getPanel(fixture)!.classList;
    expect(classList).toContain('sn-drawer-panel--start');
    expect(classList).not.toContain('sn-drawer-panel--left');
    expect(classList).not.toContain('sn-drawer-panel--end');
  });

  it('sizes a start drawer with width, not height', async () => {
    const fixture = TestBed.createComponent(StartHost);
    await tick(10);
    await fixture.whenStable();

    const panel = getPanel(fixture) as HTMLElement;
    expect(panel.style.width).toBe('');
    expect(panel.style.height).toBe('');
  });

  it('applies custom width as inline style', async () => {
    const fixture = TestBed.createComponent(WidthHost);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture) as HTMLElement;
    expect(panel?.style.width).toBe('30rem');
  });

  it('renders footer when snDrawerFooter directive is used', async () => {
    const fixture = TestBed.createComponent(FooterHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.querySelector('.sn-drawer-footer')).toBeTruthy();
  });

  it('does not render footer element when no snDrawerFooter directive', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-drawer-footer')).toBeNull();
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
    await openDrawer(fixture);
    expect(getPanel(fixture)?.querySelector('h2.sn-drawer-title')).toBeTruthy();
  });

  it('renders custom title slot when no title input', async () => {
    const fixture = TestBed.createComponent(TitleSlotHost);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await tick(10);
    await fixture.whenStable();
    const titleEl = getPanel(fixture)?.querySelector('.sn-drawer-title');
    expect(titleEl).toBeTruthy();
  });

  it('mask is present when drawer is open (mask=true)', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const mask = fixture.nativeElement.querySelector('.sn-drawer-mask');
    expect(mask).toBeTruthy();
  });

  it('mask is absent when mask=false', async () => {
    const fixture = TestBed.createComponent(NoMaskHost);
    await tick(10);
    await fixture.whenStable();
    const mask = fixture.nativeElement.querySelector('.sn-drawer-mask');
    expect(mask).toBeNull();
  });

  it('mask click closes the drawer', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const mask = fixture.nativeElement.querySelector('.sn-drawer-mask') as HTMLElement;
    expect(mask).toBeTruthy();
    mask.click();
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('container has sn-drawer-container class when visible', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    const container = fixture.nativeElement.querySelector('.sn-drawer-container');
    expect(container).toBeTruthy();
  });

  it('container gets sn-drawer-container--hiding class during close animation', async () => {
    onTestFinished(fakeRunningAnimations(200));
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    fixture.componentInstance.open.set(false);
    await tick(5);
    await fixture.whenStable();
    const container = fixture.nativeElement.querySelector('.sn-drawer-container');
    expect(container?.classList).toContain('sn-drawer-container--hiding');
  });

  it('panel has sn-drawer-header element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-drawer-header')).toBeTruthy();
  });

  it('panel has sn-drawer-body element', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openDrawer(fixture);
    expect(getPanel(fixture)?.querySelector('.sn-drawer-body')).toBeTruthy();
  });

  it('closes on Escape even when mask=false', async () => {
    const fixture = TestBed.createComponent(NoMaskHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();

    const overlayEl = overlayContainer.getContainerElement();
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    overlayEl.dispatchEvent(escEvent);
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('applies sn-drawer-panel--top class for position="top"', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-drawer-panel--top');
  });

  it('does not apply left/right/bottom/fullscreen classes for position="top"', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await tick(10);
    await fixture.whenStable();
    const classList = getPanel(fixture)?.classList;
    expect(classList).not.toContain('sn-drawer-panel--left');
    expect(classList).not.toContain('sn-drawer-panel--right');
    expect(classList).not.toContain('sn-drawer-panel--bottom');
    expect(classList).not.toContain('sn-drawer-panel--fullscreen');
  });

  it('applies sn-drawer-panel--bottom class for position="bottom"', async () => {
    const fixture = TestBed.createComponent(BottomHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-drawer-panel--bottom');
  });

  it('does not apply left/right/top/fullscreen classes for position="bottom"', async () => {
    const fixture = TestBed.createComponent(BottomHost);
    await tick(10);
    await fixture.whenStable();
    const classList = getPanel(fixture)?.classList;
    expect(classList).not.toContain('sn-drawer-panel--left');
    expect(classList).not.toContain('sn-drawer-panel--right');
    expect(classList).not.toContain('sn-drawer-panel--top');
    expect(classList).not.toContain('sn-drawer-panel--fullscreen');
  });

  it('applies sn-drawer-panel--fullscreen class for position="fullscreen"', async () => {
    const fixture = TestBed.createComponent(FullscreenHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)?.classList).toContain('sn-drawer-panel--fullscreen');
  });

  it('does not apply left/right/top/bottom classes for position="fullscreen"', async () => {
    const fixture = TestBed.createComponent(FullscreenHost);
    await tick(10);
    await fixture.whenStable();
    const classList = getPanel(fixture)?.classList;
    expect(classList).not.toContain('sn-drawer-panel--left');
    expect(classList).not.toContain('sn-drawer-panel--right');
    expect(classList).not.toContain('sn-drawer-panel--top');
    expect(classList).not.toContain('sn-drawer-panel--bottom');
  });

  it('fullscreen panel does not have inline width style', async () => {
    const fixture = TestBed.createComponent(FullscreenHost);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture) as HTMLElement;
    expect(panel?.style.width).toBe('');
  });

  it('applies custom height as inline style for top position', async () => {
    const fixture = TestBed.createComponent(HeightHost);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture) as HTMLElement;
    expect(panel?.style.height).toBe('50vh');
  });

  it('does not apply inline width style for top position', async () => {
    const fixture = TestBed.createComponent(TopHost);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture) as HTMLElement;
    expect(panel?.style.width).toBe('');
  });

  it('applies inline width but not height for left/right positions', async () => {
    const fixture = TestBed.createComponent(WidthHost);
    await tick(10);
    await fixture.whenStable();
    const panel = getPanel(fixture) as HTMLElement;
    expect(panel?.style.width).toBe('30rem');
    expect(panel?.style.height).toBe('');
  });

  it('does not lock page scroll when lockScroll=false', async () => {
    const scrollLock = TestBed.inject(ScrollLock);
    const lockSpy = vi.spyOn(scrollLock, 'lock');
    const fixture = TestBed.createComponent(NoLockScrollHost);
    await tick(10);
    await fixture.whenStable();
    expect(lockSpy).not.toHaveBeenCalled();
    lockSpy.mockRestore();
  });

  it('locks page scroll when lockScroll=true (default) with mask=true', async () => {
    const scrollLock = TestBed.inject(ScrollLock);
    const lockSpy = vi.spyOn(scrollLock, 'lock');
    const fixture = TestBed.createComponent(PreopenHost);
    await tick(10);
    await fixture.whenStable();
    expect(lockSpy).toHaveBeenCalled();
    lockSpy.mockRestore();
  });

  it('[snDrawerClose] closes the drawer on click', async () => {
    const fixture = TestBed.createComponent(DirectiveCloseHost);
    await tick(10);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeTruthy();

    const closeBtn = fixture.nativeElement.querySelector('.directive-close-btn') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });

  it('[snDrawerClose] consumer (click) handler runs before close', async () => {
    const fixture = TestBed.createComponent(DrawerOrderHost);
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
    await tick(250);
    await fixture.whenStable();
    expect(getPanel(fixture)).toBeNull();
  });
});

@Component({
  template: `
    <sn-drawer [(open)]="open" title="Test" [animated]="false">Body</sn-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Drawer],
})
class NoAnimDrawerHost {
  readonly open = signal(false);
}

@Component({
  template: `
    <sn-drawer
      [(open)]="open"
      title="Test"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }"
    >Body</sn-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Drawer],
})
class CustomAnimDrawerHost {
  readonly open = signal(false);
}

describe('Drawer animation inputs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  function getPanel(fix: { nativeElement: HTMLElement }): HTMLElement | null {
    return fix.nativeElement.querySelector('[role="dialog"]');
  }

  function getMask(fix: { nativeElement: HTMLElement }): HTMLElement | null {
    return fix.nativeElement.querySelector('.sn-drawer-mask');
  }

  it('animated=false suppresses animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimDrawerHost);
    await fix.whenStable();
    fix.componentInstance.open.set(true);
    await fix.whenStable();
    await tick(10);
    const panel = getPanel(fix)!;
    expect(panel.style.animation).toBe('none');
    const mask = getMask(fix)!;
    expect(mask.style.animation).toBe('none');
    fix.componentInstance.open.set(false);
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(getPanel(fix)).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimDrawerHost);
    await fix.whenStable();
    fix.componentInstance.open.set(true);
    await fix.whenStable();
    await tick(10);
    expect(getPanel(fix)!.style.animation).toContain('my-in');
    fix.componentInstance.open.set(false);
    await fix.whenStable();
    await tick(5);
    await fix.whenStable();
    expect(getPanel(fix)!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel(fix)).toBeNull();
  });
});
