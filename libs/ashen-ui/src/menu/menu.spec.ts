import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, END, ENTER, ESCAPE, HOME, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { Menu } from './menu';
import { MenuItem } from './menu-item';
import { MenuSeparator } from './menu-separator';
import { MenuTrigger } from './menu-trigger';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu>
      <button snMenuItem>Edit</button>
      <button snMenuItem>Duplicate</button>
      <button snMenuItem>Delete</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class BasicHost {}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu>
      <button snMenuItem>First</button>
      <sn-menu-separator />
      <button snMenuItem disabled>Disabled</button>
      <button snMenuItem>Last</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuSeparator, MenuTrigger],
})
class WithSeparatorHost {}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu>
      <button snMenuItem icon="edit">Edit</button>
      <button snMenuItem shortcut="⌘D">Duplicate</button>
      <button snMenuItem danger>Delete</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class WithIconsHost {}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu>
      <button snMenuItem (click)="events.push('edit')">Edit</button>
      <button snMenuItem (click)="events.push('copy')">Copy</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class CallbackHost {
  events: string[] = [];
}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu
      #menu
      [snClass]="{ root: 'host-extra', panel: 'panel-extra' }"
      [snStyle]="{ root: { outline: '1px solid red' }, panel: { outline: '1px solid blue' } }"
      [snAttrs]="{
        root: { 'data-testid': 'menu-root' },
        panel: { 'data-testid': 'menu-panel', role: 'listbox' }
      }"
    >
      <button snMenuItem>Item</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class SnPartHost {}

describe('Menu component', () => {
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

  async function openMenu(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    return btn;
  }

  async function closeWait() {
    await tick(150);
  }

  it('does not show menu panel initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('shows panel after trigger click', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    expect(getPanel()).toBeTruthy();
  });

  it('panel has role="menu"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    expect(getPanel()?.getAttribute('role')).toBe('menu');
  });

  it('panel has sn-menu-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    expect(getPanel()?.classList).toContain('sn-menu-panel');
  });

  it('items render inside the overlay panel', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(3);
  });

  it('items have role="menuitem"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    items.forEach((item) => {
      expect(item.getAttribute('role')).toBe('menuitem');
    });
  });

  it('items have tabindex="-1"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    items.forEach((item) => {
      expect(item.getAttribute('tabindex')).toBe('-1');
    });
  });

  it('trigger has aria-haspopup="menu"', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    expect(btn.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger has aria-expanded="false" initially', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger aria-expanded="true" when menu open', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openMenu(fixture);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-expanded returns to "false" after close', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openMenu(fixture);
    btn.click();
    await closeWait();
    await fixture.whenStable();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openMenu(fixture);
    const controls = btn.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    const panel = getPanel();
    expect(panel?.getAttribute('id')).toBe(controls);
  });

  it('second trigger click closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openMenu(fixture);
    btn.click();
    await closeWait();
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Escape closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Escape restores focus to trigger', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    const btn = await openMenu(fixture);
    btn.focus();
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fixture.whenStable();
    expect(document.activeElement).toBe(btn);
  });

  it('Tab closes the menu immediately', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    overlayEl.dispatchEvent(key(TAB));
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('ArrowDown moves focus to next item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    await tick(10); // key manager init timeout
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    overlayEl.dispatchEvent(key(DOWN_ARROW));
    await fixture.whenStable();
    // After first ArrowDown from first item, second item should be active
    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowUp moves focus to previous item with wrap', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    await tick(10);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    // First item is active, ArrowUp wraps to last
    overlayEl.dispatchEvent(key(UP_ARROW));
    await fixture.whenStable();
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('Home moves focus to first item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    await tick(10);
    // Move to last first
    overlayEl.dispatchEvent(key(DOWN_ARROW));
    overlayEl.dispatchEvent(key(DOWN_ARROW));
    overlayEl.dispatchEvent(key(HOME));
    await fixture.whenStable();
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    expect(document.activeElement).toBe(items[0]);
  });

  it('End moves focus to last item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    await tick(10);
    overlayEl.dispatchEvent(key(END));
    await fixture.whenStable();
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  // Typeahead is the one APG key that moves the active item without a call from the trigger.
  it('typing a letter moves focus to the next item with that initial', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    await tick(10);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;

    overlayEl.dispatchEvent(key(0, { key: 'd' }));
    await tick(260); // the CDK typeahead debounces for 200ms before it matches
    await fixture.whenStable();

    expect(document.activeElement).toBe(items[1]); // Duplicate, not Edit
  });

  it('ArrowDown on trigger opens menu and focuses first item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.dispatchEvent(key(DOWN_ARROW));
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('ArrowUp on trigger opens menu and focuses last item', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.dispatchEvent(key(UP_ARROW));
    await tick(10);
    await fixture.whenStable();
    await tick(10); // key manager init
    expect(getPanel()).toBeTruthy();
    const items = getPanel()!.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('Enter activates the active item and closes', async () => {
    const fixture = TestBed.createComponent(CallbackHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    await tick(10);
    overlayEl.dispatchEvent(key(ENTER));
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.events).toContain('edit');
    await closeWait();
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('Space activates the active item and closes', async () => {
    const fixture = TestBed.createComponent(CallbackHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
    await tick(10);
    overlayEl.dispatchEvent(key(SPACE));
    await tick(10);
    await fixture.whenStable();
    expect(fixture.componentInstance.events).toContain('edit');
  });

  it('clicking an item closes menu after consumer click handler runs', async () => {
    const fixture = TestBed.createComponent(CallbackHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();

    const item = getPanel()!.querySelector('[role="menuitem"]') as HTMLElement;
    const callOrder: string[] = [];
    item.addEventListener('click', () => callOrder.push('handler'), { once: true });

    item.click();
    // At tick(0), consumer handler already ran but menu still open
    await tick(0);
    callOrder.push('after-tick-0');
    await tick(150);
    await fixture.whenStable();

    expect(callOrder[0]).toBe('handler');
    expect(getPanel()).toBeNull();
  });

  it('disabled item has aria-disabled="true"', async () => {
    const fixture = TestBed.createComponent(WithSeparatorHost);
    await openMenu(fixture);
    const disabledItem = getPanel()!.querySelector('[aria-disabled="true"]') as HTMLElement;
    expect(disabledItem).toBeTruthy();
  });

  it('disabled item has disabled attribute', async () => {
    const fixture = TestBed.createComponent(WithSeparatorHost);
    await openMenu(fixture);
    const disabledItem = getPanel()!.querySelector('[disabled]') as HTMLElement;
    expect(disabledItem).toBeTruthy();
  });

  it('disabled item click does not close menu', async () => {
    const fixture = TestBed.createComponent(WithSeparatorHost);
    await openMenu(fixture);
    const disabledItem = getPanel()!.querySelector('[disabled]') as HTMLElement;
    disabledItem.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('separator has role="separator"', async () => {
    const fixture = TestBed.createComponent(WithSeparatorHost);
    await openMenu(fixture);
    const sep = getPanel()!.querySelector('[role="separator"]');
    expect(sep).toBeTruthy();
  });

  it('separator has sn-menu-separator class', async () => {
    const fixture = TestBed.createComponent(WithSeparatorHost);
    await openMenu(fixture);
    const sep = getPanel()!.querySelector('.sn-menu-separator');
    expect(sep).toBeTruthy();
  });

  it('item with icon input renders sn-icon', async () => {
    const fixture = TestBed.createComponent(WithIconsHost);
    await openMenu(fixture);
    const firstItem = getPanel()!.querySelectorAll('[role="menuitem"]')[0];
    expect(firstItem.querySelector('sn-icon')).toBeTruthy();
  });

  it('item with shortcut renders sn-menu-shortcut span', async () => {
    const fixture = TestBed.createComponent(WithIconsHost);
    await openMenu(fixture);
    const secondItem = getPanel()!.querySelectorAll('[role="menuitem"]')[1];
    const shortcut = secondItem.querySelector('.sn-menu-shortcut');
    expect(shortcut).toBeTruthy();
    expect(shortcut!.textContent?.trim()).toBe('⌘D');
  });

  it('danger item has sn-menu-item-danger class', async () => {
    const fixture = TestBed.createComponent(WithIconsHost);
    await openMenu(fixture);
    const items = getPanel()!.querySelectorAll('[role="menuitem"]');
    expect(items[2].classList).toContain('sn-menu-item-danger');
  });

  it('overlay panel has sn-menu-overlay-panel class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    expect(overlayEl.querySelector('.sn-menu-overlay-panel')).toBeTruthy();
  });

  it('overlay backdrop has sn-menu-backdrop class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    expect(overlayEl.querySelector('.sn-menu-backdrop')).toBeTruthy();
  });

  it('backdrop click closes the menu', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await openMenu(fixture);
    const backdrop = overlayEl.querySelector('.sn-menu-backdrop') as HTMLElement;
    backdrop?.click();
    await closeWait();
    await fixture.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('sn-menu host has sn-menu-host class', async () => {
    const fixture = TestBed.createComponent(BasicHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-menu') as HTMLElement;
    expect(host.classList).toContain('sn-menu-host');
  });

  describe('MenuItem standalone', () => {
    @Component({
      template: `<button snMenuItem>Label</button>`,
      imports: [MenuItem],
    })
    class ItemHost {}

    @Component({
      template: `<button snMenuItem [danger]="true">Delete</button>`,
      imports: [MenuItem],
    })
    class DangerItemHost {}

    @Component({
      template: `<button snMenuItem [disabled]="true">Disabled</button>`,
      imports: [MenuItem],
    })
    class DisabledItemHost {}

    it('has sn-menu-item class', async () => {
      const fixture = TestBed.createComponent(ItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.classList).toContain('sn-menu-item');
    });

    it('has role="menuitem"', async () => {
      const fixture = TestBed.createComponent(ItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.getAttribute('role')).toBe('menuitem');
    });

    it('has tabindex="-1"', async () => {
      const fixture = TestBed.createComponent(ItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.getAttribute('tabindex')).toBe('-1');
    });

    it('danger=true adds sn-menu-item-danger class', async () => {
      const fixture = TestBed.createComponent(DangerItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.classList).toContain('sn-menu-item-danger');
    });

    it('disabled=true sets aria-disabled="true"', async () => {
      const fixture = TestBed.createComponent(DisabledItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled=true sets disabled attribute', async () => {
      const fixture = TestBed.createComponent(DisabledItemHost);
      await fixture.whenStable();
      const btn = fixture.nativeElement.querySelector('button') as HTMLElement;
      expect(btn.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('MenuSeparator standalone', () => {
    @Component({
      template: `<sn-menu-separator />`,
      imports: [MenuSeparator],
    })
    class SepHost {}

    it('has role="separator"', async () => {
      const fixture = TestBed.createComponent(SepHost);
      await fixture.whenStable();
      const sep = fixture.nativeElement.querySelector('sn-menu-separator') as HTMLElement;
      expect(sep.getAttribute('role')).toBe('separator');
    });

    it('has sn-menu-separator class', async () => {
      const fixture = TestBed.createComponent(SepHost);
      await fixture.whenStable();
      const sep = fixture.nativeElement.querySelector('sn-menu-separator') as HTMLElement;
      expect(sep.classList).toContain('sn-menu-separator');
    });

    it('has aria-orientation="horizontal"', async () => {
      const fixture = TestBed.createComponent(SepHost);
      await fixture.whenStable();
      const sep = fixture.nativeElement.querySelector('sn-menu-separator') as HTMLElement;
      expect(sep.getAttribute('aria-orientation')).toBe('horizontal');
    });
  });

  it('applies snClass, snStyle and allowed snAttrs to the host and the overlay panel', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.trigger') as HTMLElement).click();
    await tick(10);
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement.querySelector('sn-menu');
    const panel = getPanel()!;

    expect(host.classList).toContain('host-extra');
    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('menu-root');
    expect(panel.classList).toContain('panel-extra');
    expect(panel.style.outline).toContain('blue');
    expect(panel.getAttribute('data-testid')).toBe('menu-panel');
    expect(panel.getAttribute('role')).toBe('menu');
  });
});

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu [animated]="false">
      <button snMenuItem>Item</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class NoAnimMenuHost {}

@Component({
  template: `
    <button [snMenuTriggerFor]="menu" class="trigger">Open</button>
    <sn-menu #menu [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
      <button snMenuItem>Item</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger],
})
class CustomAnimMenuHost {}

describe('Menu animation inputs', () => {
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
    const fix = TestBed.createComponent(NoAnimMenuHost);
    await fix.whenStable();
    fix.nativeElement.querySelector('.trigger').click();
    await tick(10);
    await fix.whenStable();
    const panel = overlayEl.querySelector('[role="menu"]') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.style.animation).toBe('none');
    fix.nativeElement.querySelector('.trigger').click();
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(overlayEl.querySelector('[role="menu"]')).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimMenuHost);
    await fix.whenStable();
    fix.nativeElement.querySelector('.trigger').click();
    await tick(10);
    await fix.whenStable();
    expect((overlayEl.querySelector('[role="menu"]') as HTMLElement).style.animation).toContain('my-in');
    fix.nativeElement.querySelector('.trigger').click();
    await tick(5);
    await fix.whenStable();
    expect((overlayEl.querySelector('[role="menu"]') as HTMLElement).style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(overlayEl.querySelector('[role="menu"]')).toBeNull();
  });
});
