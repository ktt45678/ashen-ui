import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
} from '@angular/cdk/keycodes';
import { Dir } from '@angular/cdk/bidi';
import { Menu, MenuItem } from 'ashen-ui/menu';
import { Menubar } from './menubar';
import { MenubarItem } from './menubar-item';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <sn-menubar>
      <sn-menubar-item label="File" [menuFor]="fileMenu" />
      <sn-menubar-item label="Edit" [menuFor]="editMenu" />
      <sn-menubar-item label="Help" (activated)="events.push('help')" />
    </sn-menubar>
    <sn-menu #fileMenu>
      <button snMenuItem>New</button>
      <button snMenuItem>Open</button>
    </sn-menu>
    <sn-menu #editMenu>
      <button snMenuItem>Undo</button>
      <button snMenuItem>Redo</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem, Menu, MenuItem],
})
class BasicHost {
  events: string[] = [];
}

@Component({
  template: `
    <sn-menubar>
      <sn-menubar-item label="Alpha" [menuFor]="alphaMenu" />
      <sn-menubar-item label="Beta" [menuFor]="betaMenu" />
      <sn-menubar-item label="Gamma" />
    </sn-menubar>
    <sn-menu #alphaMenu>
      <button snMenuItem>A1</button>
    </sn-menu>
    <sn-menu #betaMenu>
      <button snMenuItem>B1</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem, Menu, MenuItem],
})
class ThreeItemHost {}

@Component({
  template: `
    <div dir="rtl">
      <sn-menubar>
        <sn-menubar-item label="File" [menuFor]="fileMenu" />
        <sn-menubar-item label="Edit" [menuFor]="editMenu" />
        <sn-menubar-item label="Help" />
      </sn-menubar>
    </div>
    <sn-menu #fileMenu>
      <button snMenuItem>New</button>
    </sn-menu>
    <sn-menu #editMenu>
      <button snMenuItem>Undo</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Menubar, MenubarItem, Menu, MenuItem],
})
class RtlHost {}

@Component({
  template: `
    <sn-menubar>
      <sn-menubar-item label="Action" (activated)="activated = true" />
    </sn-menubar>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem],
})
class NoMenuHost {
  activated = false;
}

describe('Menubar component', () => {
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
    return overlayEl.querySelector('[role="menu"]');
  }

  async function setup<T>(hostClass: new () => T) {
    const fixture = TestBed.createComponent(hostClass);
    await fixture.whenStable();
    await tick(20);
    return fixture;
  }

  function getMenubar(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('[role="menubar"]') as HTMLElement;
  }

  function getTopItems(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.sn-menubar-item-btn')) as HTMLElement[];
  }

  async function clickItem(btn: HTMLElement): Promise<void> {
    btn.click();
    await tick(20);
  }

  it('renders role="menubar"', async () => {
    const fixture = await setup(BasicHost);
    expect(getMenubar(fixture).getAttribute('role')).toBe('menubar');
  });

  it('renders three top-level item buttons', async () => {
    const fixture = await setup(BasicHost);
    expect(getTopItems(fixture).length).toBe(3);
  });

  it('top-level item buttons have role="menuitem"', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items.forEach((item) => {
      expect(item.getAttribute('role')).toBe('menuitem');
    });
  });

  it('menubar has sn-menubar class', async () => {
    const fixture = await setup(BasicHost);
    expect(getMenubar(fixture).classList).toContain('sn-menubar');
  });

  it('top-level buttons have sn-menubar-item-btn class', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items.forEach((item) => expect(item.classList).toContain('sn-menubar-item-btn'));
  });

  it('first item has tabindex=0, rest have tabindex=-1', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    expect(items[0].getAttribute('tabindex')).toBe('0');
    expect(items[1].getAttribute('tabindex')).toBe('-1');
    expect(items[2].getAttribute('tabindex')).toBe('-1');
  });

  it('ArrowRight moves tabindex to second item', async () => {
    const fixture = await setup(BasicHost);
    const bar = getMenubar(fixture);
    bar.dispatchEvent(key(RIGHT_ARROW));
    await fixture.whenStable();
    const items = getTopItems(fixture);
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[0].getAttribute('tabindex')).toBe('-1');
  });

  it('ArrowLeft moves tabindex to the second item in rtl', async () => {
    const fixture = await setup(RtlHost);
    const bar = getMenubar(fixture);

    bar.dispatchEvent(key(LEFT_ARROW));
    await fixture.whenStable();

    const items = getTopItems(fixture);
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[0].getAttribute('tabindex')).toBe('-1');
  });

  it('ArrowRight wraps from first to last in rtl', async () => {
    const fixture = await setup(RtlHost);
    const bar = getMenubar(fixture);

    bar.dispatchEvent(key(RIGHT_ARROW));
    await fixture.whenStable();

    const items = getTopItems(fixture);
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('ArrowLeft wraps from first to last', async () => {
    const fixture = await setup(BasicHost);
    const bar = getMenubar(fixture);
    bar.dispatchEvent(key(LEFT_ARROW));
    await fixture.whenStable();
    const items = getTopItems(fixture);
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('clicking item with menuFor opens its submenu panel', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(getPanel()).toBeTruthy();
  });

  it('opened submenu panel has role="menu"', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(getPanel()?.getAttribute('role')).toBe('menu');
  });

  it('item has aria-haspopup="menu" when it has a menuFor', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    expect(items[0].getAttribute('aria-haspopup')).toBe('menu');
    expect(items[1].getAttribute('aria-haspopup')).toBe('menu');
  });

  it('item without menuFor has no aria-haspopup', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    expect(items[2].getAttribute('aria-haspopup')).toBeNull();
  });

  it('aria-expanded is false initially', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('aria-expanded becomes true when submenu opens', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(items[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('item without menuFor has no aria-expanded', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    expect(items[2].getAttribute('aria-expanded')).toBeNull();
  });

  it('item has aria-controls matching panel id', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    const controls = items[0].getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = getPanel();
    expect(panel?.getAttribute('id')).toBe(controls);
  });

  it('only one submenu can be open at a time', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);

    await clickItem(items[0]);
    expect(getPanel()).toBeTruthy();
    expect(items[0].getAttribute('aria-expanded')).toBe('true');

    await clickItem(items[1]);
    await tick(150); // allow close animation
    await fixture.whenStable();

    // Only one panel visible
    const panels = overlayEl.querySelectorAll('[role="menu"]');
    expect(panels.length).toBe(1);
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
    expect(items[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('Escape closes the submenu', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(getPanel()).toBeTruthy();

    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(20);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Escape returns focus to the top-level item', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);

    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(20);
    await fixture.whenStable();
    expect(document.activeElement).toBe(items[0]);
  });

  it('aria-expanded returns to false after Escape', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(20);
    await fixture.whenStable();
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('ArrowDown on focused top-level item opens its submenu', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items[0].dispatchEvent(key(DOWN_ARROW));
    await tick(20);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Enter on focused top-level item opens its submenu', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items[0].dispatchEvent(key(ENTER));
    await tick(20);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Space on focused top-level item opens its submenu', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items[0].dispatchEvent(key(SPACE));
    await tick(20);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('clicking item without menuFor emits activated', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    items[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.events).toContain('help');
  });

  it('standalone item emits activated on click', async () => {
    const fixture = await setup(NoMenuHost);
    const btn = fixture.nativeElement.querySelector('.sn-menubar-item-btn') as HTMLElement;
    btn.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.activated).toBe(true);
  });

  it('ArrowRight in open submenu closes it and opens next item submenu', async () => {
    const fixture = await setup(ThreeItemHost);
    const items = getTopItems(fixture);

    // Open first item
    await clickItem(items[0]);
    expect(overlayEl.querySelectorAll('[role="menu"]').length).toBe(1);

    // ArrowRight in the overlay
    overlayEl.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();

    // Should have closed first and opened second
    const panels = overlayEl.querySelectorAll('[role="menu"]');
    expect(panels.length).toBe(1);
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
    expect(items[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('ArrowLeft in open submenu closes it and opens prev item submenu (wraps)', async () => {
    const fixture = await setup(ThreeItemHost);
    const items = getTopItems(fixture);

    // Open first item (index 0)
    await clickItem(items[0]);

    // ArrowLeft wraps to last item (index 2 = Gamma, no menu)
    overlayEl.dispatchEvent(key(LEFT_ARROW));
    await tick(20);
    await fixture.whenStable();

    // First item should be closed
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
    // Last item (Gamma) has no submenu, so no panel
    expect(getPanel()).toBeNull();
  });

  it('submenu panel shows correct items for the opened top-level item', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);

    await clickItem(items[0]); // File menu
    const menuItems = overlayEl.querySelectorAll('[role="menuitem"]');
    const labels = Array.from(menuItems).map((el) => el.textContent?.trim());
    expect(labels).toContain('New');
    expect(labels).toContain('Open');

    // Close and open Edit
    overlayEl.dispatchEvent(key(ESCAPE));
    await tick(20);
    await fixture.whenStable();

    await clickItem(items[1]); // Edit menu
    const editItems = overlayEl.querySelectorAll('[role="menuitem"]');
    const editLabels = Array.from(editItems).map((el) => el.textContent?.trim());
    expect(editLabels).toContain('Undo');
    expect(editLabels).toContain('Redo');
  });

  it('overlay panel has sn-menubar-overlay-panel class', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(overlayEl.querySelector('.sn-menubar-overlay-panel')).toBeTruthy();
  });

  it('backdrop has sn-menubar-backdrop class', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    expect(overlayEl.querySelector('.sn-menubar-backdrop')).toBeTruthy();
  });

  it('backdrop click closes the submenu', async () => {
    const fixture = await setup(BasicHost);
    const items = getTopItems(fixture);
    await clickItem(items[0]);
    const backdrop = overlayEl.querySelector('.sn-menubar-backdrop') as HTMLElement;
    backdrop?.click();
    await tick(150);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('item with menuFor shows chevron arrow icon', async () => {
    const fixture = await setup(BasicHost);
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.sn-menubar-item-btn'),
    ) as HTMLElement[];
    expect(items[0].querySelector('.sn-menubar-item-arrow')).toBeTruthy();
  });

  it('item without menuFor has no chevron icon', async () => {
    const fixture = await setup(BasicHost);
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.sn-menubar-item-btn'),
    ) as HTMLElement[];
    expect(items[2].querySelector('.sn-menubar-item-arrow')).toBeNull();
  });
});

@Component({
  template: `
    <sn-menubar [animated]="false">
      <sn-menubar-item label="File" [menuFor]="fileMenu" />
    </sn-menubar>
    <sn-menu #fileMenu>
      <button snMenuItem>New</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem, Menu, MenuItem],
})
class NoAnimMenubarHost {}

@Component({
  template: `
    <sn-menubar [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
      <sn-menubar-item label="File" [menuFor]="fileMenu" />
    </sn-menubar>
    <sn-menu #fileMenu>
      <button snMenuItem>New</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem, Menu, MenuItem],
})
class CustomAnimMenubarHost {}

describe('Menubar animation inputs', () => {
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

  it('animated=false suppresses panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimMenubarHost);
    await fix.whenStable();
    await tick(20);
    const items = fix.nativeElement.querySelectorAll('.sn-menubar-item-btn') as NodeListOf<HTMLElement>;
    items[0].click();
    await tick(20);
    await fix.whenStable();
    const panel = overlayEl.querySelector('[role="menu"]') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.style.animation).toBe('none');
    items[0].click();
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(overlayEl.querySelector('[role="menu"]')).toBeNull();
  });

  it('custom exit animation drives the close timer', async () => {
    const fix = TestBed.createComponent(CustomAnimMenubarHost);
    await fix.whenStable();
    await tick(20);
    const items = fix.nativeElement.querySelectorAll('.sn-menubar-item-btn') as NodeListOf<HTMLElement>;
    items[0].click();
    await tick(20);
    await fix.whenStable();
    const panel = overlayEl.querySelector('[role="menu"]') as HTMLElement;
    expect(panel.style.animation).toContain('my-in');
    items[0].click();
    await fix.whenStable();
    await tick(80);
    await fix.whenStable();
    expect(overlayEl.querySelector('[role="menu"]')).toBeNull();
  });
});

@Component({
  template: `
    <sn-menubar
      [snStyle]="{ root: { outline: '1px solid red' } }"
      [snAttrs]="{ root: { 'data-testid': 'bar-root', role: 'presentation' } }"
    >
      <sn-menubar-item
        label="File"
        icon="folder"
        [menuFor]="fileMenu"
        [snStyle]="{
          root: { outline: '1px dashed blue' },
          trigger: { color: 'rgb(1, 2, 3)' },
          icon: { color: 'rgb(4, 5, 6)' },
          label: { color: 'rgb(7, 8, 9)' },
          arrow: { color: 'rgb(10, 11, 12)' }
        }"
        [snAttrs]="{
          root: { 'data-testid': 'item-root' },
          trigger: { 'data-testid': 'item-trigger', role: 'presentation', 'aria-controls': 'hostile-id' },
          icon: { 'data-testid': 'item-icon' },
          label: { 'data-testid': 'item-label' },
          arrow: { 'data-testid': 'item-arrow' }
        }"
      />
    </sn-menubar>
    <sn-menu #fileMenu>
      <button snMenuItem>New</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menubar, MenubarItem, Menu, MenuItem],
})
class SnPartHost {}

describe('Menubar and MenubarItem snStyle/snAttrs pass-through', () => {
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

  it('applies snStyle and allowed snAttrs to the menubar and its item parts', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    await tick(20);
    const el: HTMLElement = fixture.nativeElement;

    const bar: HTMLElement = el.querySelector('sn-menubar')!;
    const itemRoot: HTMLElement = el.querySelector('sn-menubar-item')!;
    const trigger: HTMLElement = el.querySelector('.sn-menubar-item-btn')!;
    const icon: HTMLElement = el.querySelector('.sn-menubar-item-icon')!;
    const label: HTMLElement = el.querySelector('.sn-menubar-item-label')!;
    const arrow: HTMLElement = el.querySelector('.sn-menubar-item-arrow')!;

    expect(bar.style.outline).toContain('red');
    expect(bar.getAttribute('data-testid')).toBe('bar-root');
    // role stays owned by the component, not the pass-through.
    expect(bar.getAttribute('role')).toBe('menubar');

    expect(itemRoot.style.outline).toContain('blue');
    expect(itemRoot.getAttribute('data-testid')).toBe('item-root');

    expect(trigger.style.color).toBe('rgb(1, 2, 3)');
    expect(trigger.getAttribute('data-testid')).toBe('item-trigger');
    expect(trigger.getAttribute('role')).toBe('menuitem');
    // aria-controls stays wired to the real submenu panel id, not the pass-through's value.
    expect(trigger.getAttribute('aria-controls')).not.toBe('hostile-id');
    expect(trigger.getAttribute('aria-controls')).toMatch(/^sn-menubar-panel-/);

    expect(icon.style.color).toBe('rgb(4, 5, 6)');
    expect(icon.getAttribute('data-testid')).toBe('item-icon');
    expect(label.style.color).toBe('rgb(7, 8, 9)');
    expect(label.getAttribute('data-testid')).toBe('item-label');
    expect(arrow.style.color).toBe('rgb(10, 11, 12)');
    expect(arrow.getAttribute('data-testid')).toBe('item-arrow');
  });
});
