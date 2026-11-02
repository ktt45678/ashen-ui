import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, ESCAPE } from '@angular/cdk/keycodes';
import { Menu } from './menu';
import { MenuItem } from './menu-item';
import { MenuTrigger } from './menu-trigger';
import { SubmenuTrigger } from './submenu-trigger';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

@Component({
  template: `
    <button [snMenuTriggerFor]="parent" class="trigger">Open</button>
    <sn-menu #parent>
      <button snMenuItem [snSubmenuTriggerFor]="child" class="sub-trigger">Files</button>
      <button snMenuItem class="normal-item">Edit</button>
    </sn-menu>
    <sn-menu #child>
      <button snMenuItem class="child-item-1">New File</button>
      <button snMenuItem class="child-item-2">Open File</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger, SubmenuTrigger],
})
class BasicSubmenuHost {}

@Component({
  template: `
    <button [snMenuTriggerFor]="root" class="trigger">Open</button>
    <sn-menu #root>
      <button snMenuItem [snSubmenuTriggerFor]="level2" class="lvl2-trigger">Level 2</button>
    </sn-menu>
    <sn-menu #level2>
      <button snMenuItem [snSubmenuTriggerFor]="level3" class="lvl3-trigger">Level 3</button>
    </sn-menu>
    <sn-menu #level3>
      <button snMenuItem class="leaf-item">Leaf</button>
    </sn-menu>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Menu, MenuItem, MenuTrigger, SubmenuTrigger],
})
class ThreeLevelHost {}

describe('SubmenuTrigger directive', () => {
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

  function getPanels(): NodeListOf<HTMLElement> {
    return overlayEl.querySelectorAll('[role="menu"]');
  }

  async function openParent(fixture: ReturnType<typeof TestBed.createComponent<BasicSubmenuHost>>) {
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    btn.click();
    await tick(10);
    await fixture.whenStable();
  }

  async function openSubByKeyboard(fixture: ReturnType<typeof TestBed.createComponent<BasicSubmenuHost>>) {
    await openParent(fixture);
    const subTrigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    subTrigger.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();
  }

  it('trigger item has aria-haspopup="menu"', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const trigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('trigger item has aria-expanded=false when closed', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const trigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger item has aria-expanded=true after submenu opens', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    const trigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger item has aria-controls matching child panel id', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    const trigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panels = getPanels();
    const childPanel = Array.from(panels).find(p => p.id === panelId);
    expect(childPanel).toBeTruthy();
  });

  it('trigger item renders a submenu chevron icon', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const trigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    const icon = trigger.querySelector('.sn-menu-item-submenu-icon');
    expect(icon).toBeTruthy();
  });

  it('normal item does not render a submenu chevron icon', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const normalItem = overlayEl.querySelector('.normal-item') as HTMLElement;
    const icon = normalItem.querySelector('.sn-menu-item-submenu-icon');
    expect(icon).toBeNull();
  });

  it('RightArrow on trigger item opens the submenu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    const panels = getPanels();
    expect(panels.length).toBe(2); // parent + child
  });

  it('RightArrow focuses first item in submenu (document.activeElement)', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    await tick(20); // key manager sets focus in setTimeout(0)
    const firstChild = overlayEl.querySelector('.child-item-1') as HTMLElement;
    expect(document.activeElement).toBe(firstChild);
  });

  it('LeftArrow in child submenu closes child and restores focus to trigger', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    // CDK keydownEvents() listens on the cdk-overlay-pane; second pane = child submenu
    const panes = overlayEl.querySelectorAll('.cdk-overlay-pane');
    const childPane = panes[panes.length - 1] as HTMLElement;
    childPane.dispatchEvent(key(LEFT_ARROW));
    await tick(10);
    await fixture.whenStable();
    expect(getPanels().length).toBe(1); // only parent remains
    expect(document.activeElement).toBe(overlayEl.querySelector('.sub-trigger'));
  });

  it('Escape in child submenu closes child and restores focus to trigger', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    const panes = overlayEl.querySelectorAll('.cdk-overlay-pane');
    const childPane = panes[panes.length - 1] as HTMLElement;
    childPane.dispatchEvent(key(ESCAPE));
    await tick(10);
    await fixture.whenStable();
    expect(getPanels().length).toBe(1);
    expect(document.activeElement).toBe(overlayEl.querySelector('.sub-trigger'));
  });

  it('click on trigger item opens submenu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const subTrigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    subTrigger.click();
    await tick(20);
    await fixture.whenStable();
    expect(getPanels().length).toBe(2);
  });

  it('click on trigger does not close parent menu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const subTrigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    subTrigger.click();
    await tick(20);
    await fixture.whenStable();
    // Parent panel still present
    expect(overlayEl.querySelector('.sub-trigger')).toBeTruthy();
  });

  it('clicking a leaf item closes the entire menu chain', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    const childItem = overlayEl.querySelector('.child-item-1') as HTMLElement;
    childItem.click();
    await tick(200); // wait for close animation (~150ms)
    await fixture.whenStable();
    expect(getPanels().length).toBe(0);
  });

  // Hover opens the panel but focus stays on the parent, so the arrows belong to the parent menu.
  it('ArrowDown after a hover open does not move focus into the submenu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openParent(fixture);
    const subTrigger = overlayEl.querySelector('.sub-trigger') as HTMLElement;
    subTrigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(150);
    await fixture.whenStable();
    expect(getPanels().length).toBe(2);

    const panes = overlayEl.querySelectorAll('.cdk-overlay-pane');
    (panes[panes.length - 1] as HTMLElement).dispatchEvent(key(DOWN_ARROW));
    await tick(10);
    await fixture.whenStable();

    expect(getPanels()[1].contains(document.activeElement)).toBe(false);
  });

  it('hovering a sibling item closes the open submenu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    expect(getPanels().length).toBe(2);

    // Hover the normal sibling item in the parent panel
    const parentPanel = getPanels()[0];
    const normalItem = parentPanel.querySelector('.normal-item') as HTMLElement;
    // Simulate mouseover on sibling - the parent panel's mouseover listener checks
    // if we're moving away from the submenu
    const moveEvent = new MouseEvent('mouseover', { bubbles: true, clientX: 50, clientY: 200 });
    Object.defineProperty(moveEvent, 'target', { value: normalItem, configurable: true });
    parentPanel.dispatchEvent(moveEvent);
    await tick(10);
    await fixture.whenStable();
    // Submenu should close (only parent remains)
    expect(getPanels().length).toBe(1);
  });

  it('closing root menu also closes open submenu', async () => {
    const fixture = TestBed.createComponent(BasicSubmenuHost);
    await openSubByKeyboard(fixture);
    expect(getPanels().length).toBe(2);

    // Close parent by clicking its trigger again (toggle close)
    const triggerBtn = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    triggerBtn.click();
    await tick(200); // wait for close animation (~150ms)
    await fixture.whenStable();
    expect(getPanels().length).toBe(0);
  });

  it('3-level deep: all panels open in sequence', async () => {
    const fixture = TestBed.createComponent(ThreeLevelHost);
    await fixture.whenStable();
    // Open root
    const trigger = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    expect(getPanels().length).toBe(1);

    // Open level2 via RightArrow
    const lvl2Trigger = overlayEl.querySelector('.lvl2-trigger') as HTMLElement;
    lvl2Trigger.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();
    expect(getPanels().length).toBe(2);

    // Open level3 via RightArrow
    const lvl3Trigger = overlayEl.querySelector('.lvl3-trigger') as HTMLElement;
    lvl3Trigger.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();
    expect(getPanels().length).toBe(3);
  });

  it('3-level deep: LeftArrow on leaf closes only the deepest', async () => {
    const fixture = TestBed.createComponent(ThreeLevelHost);
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await fixture.whenStable();

    overlayEl.querySelector<HTMLElement>('.lvl2-trigger')!.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();
    overlayEl.querySelector<HTMLElement>('.lvl3-trigger')!.dispatchEvent(key(RIGHT_ARROW));
    await tick(20);
    await fixture.whenStable();
    expect(getPanels().length).toBe(3);

    // LeftArrow in leaf (level 3 pane) closes level 3
    const panes = overlayEl.querySelectorAll('.cdk-overlay-pane');
    const leafPane = panes[panes.length - 1] as HTMLElement;
    leafPane.dispatchEvent(key(LEFT_ARROW));
    await tick(10);
    await fixture.whenStable();
    expect(getPanels().length).toBe(2);
    // Focus should be on lvl3-trigger
    expect(document.activeElement).toBe(overlayEl.querySelector('.lvl3-trigger'));
  });
});
