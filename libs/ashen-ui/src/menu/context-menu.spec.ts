import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ESCAPE, TAB } from '@angular/cdk/keycodes';
import { Menu } from './menu';
import { MenuItem } from './menu-item';
import { MenuSeparator } from './menu-separator';
import { ContextMenuTrigger } from './context-menu-trigger';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <div [snContextMenuTriggerFor]="menu" class="zone">Zone</div>
    <sn-menu #menu>
      <button snMenuItem (click)="onEdit()">Edit</button>
      <button snMenuItem>Copy</button>
      <sn-menu-separator />
      <button snMenuItem disabled>Delete</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContextMenuTrigger, Menu, MenuItem, MenuSeparator],
})
class BasicHost {
  edited = false;
  onEdit() {
    this.edited = true;
  }
}

@Component({
  template: `
    <div [snContextMenuTriggerFor]="menu" class="zone">Zone</div>
    <sn-menu #menu>
      <button snMenuItem (click)="lastAction.set('Edit')">Edit</button>
      <button snMenuItem (click)="lastAction.set('Duplicate')">Duplicate</button>
      <button snMenuItem (click)="lastAction.set('Delete')">Delete</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContextMenuTrigger, Menu, MenuItem],
})
class ActionHost {
  readonly lastAction = signal('');
}

describe('ContextMenuTrigger directive', () => {
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
    return overlayEl.querySelector('.sn-menu-panel');
  }

  async function openContextMenu<T>(
    fixture: ReturnType<typeof TestBed.createComponent<T>>,
    clientX: number = 120,
    clientY: number = 80,
  ) {
    await fixture.whenStable();
    const zoneEl = fixture.nativeElement.querySelector('.zone') as HTMLElement;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
    });
    zoneEl.dispatchEvent(event);
    await tick(10);
    await fixture.whenStable();
    return zoneEl;
  }

  it('menu panel is not rendered initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('contextmenu event opens the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);
    expect(getPanel()).toBeTruthy();
  });

  it('contextmenu event default is prevented', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const zoneEl = fixture.nativeElement.querySelector('.zone') as HTMLElement;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 80,
    });
    const notPrevented = zoneEl.dispatchEvent(event);
    expect(notPrevented).toBe(false);
  });

  it('trigger has aria-haspopup="menu"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const zoneEl = fixture.nativeElement.querySelector('.zone') as HTMLElement;
    expect(zoneEl.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger has aria-expanded="false" initially', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const zoneEl = fixture.nativeElement.querySelector('.zone') as HTMLElement;
    expect(zoneEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('aria-expanded becomes "true" while open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const zoneEl = await openContextMenu(fixture);
    expect(zoneEl.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const zoneEl = await openContextMenu(fixture);
    const controls = zoneEl.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = getPanel();
    expect(panel?.getAttribute('id')).toBe(controls);
  });

  it('menu items render inside the overlay with role="menuitem"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(3);
  });

  it('clicking an enabled item runs the consumer click handler and closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);

    const item = getPanel()!.querySelector('[role="menuitem"]') as HTMLElement;
    item.click();

    // Handler runs immediately
    expect(fixture.componentInstance.edited).toBe(true);

    // Menu closes after deferred close timer
    await tick(200);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('disabled item has the disabled attribute', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    const disabledItem = items[2] as HTMLElement;
    expect(disabledItem.hasAttribute('disabled')).toBe(true);
  });

  it('Escape closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);
    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(200);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Escape restores focus to a non-focusable trigger by making it programmatically focusable', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const zoneEl = await openContextMenu(fixture);
    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(200);
    await fixture.whenStable();
    expect(zoneEl.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(zoneEl);
  });

  it('backdrop click closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);

    const backdrop = overlayEl.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    expect(backdrop).toBeTruthy();
    backdrop.click();

    await tick(200);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Tab closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openContextMenu(fixture);
    overlayEl.dispatchEvent(key(TAB));
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('right-clicking again while open keeps exactly ONE sn-menu-panel', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const zoneEl = await openContextMenu(fixture, 100, 100);

    // Right-click again at different coordinates
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 200,
      clientY: 200,
    });
    zoneEl.dispatchEvent(event);
    await tick(10);
    await fixture.whenStable();

    const panels = overlayEl.querySelectorAll('.sn-menu-panel');
    expect(panels.length).toBe(1);
  });

  it('menu item click handler can set component state', async () => {
    const fixture = TestBed.createComponent(ActionHost);
    await openContextMenu(fixture);

    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    items[1].click(); // "Duplicate"

    expect(fixture.componentInstance.lastAction()).toBe('Duplicate');

    await tick(200);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });
});
