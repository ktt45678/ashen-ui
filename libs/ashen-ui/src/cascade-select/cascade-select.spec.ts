import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { CascadeSelect } from './cascade-select';
import type { CascadeOption } from './cascade-select';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { SnIntl } from 'ashen-ui/core';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

const MEDIA_OPTIONS: CascadeOption[] = [
  {
    label: 'Media',
    icon: 'music_note',
    children: [
      { label: 'Play / Pause', value: 'media.toggle' },
      { label: 'Next Track', value: 'media.next' },
    ],
  },
  {
    label: 'System',
    icon: 'memory',
    children: [
      { label: 'Lock Screen', value: 'sys.lock' },
      {
        label: 'Power',
        children: [
          { label: 'Shutdown', value: 'sys.shutdown' },
          { label: 'Restart', value: 'sys.restart' },
        ],
      },
    ],
  },
  { label: 'Mute', value: 'mute' },
];

@Component({
  template: `
    <sn-cascade-select [(value)]="value" [options]="options" [placeholder]="placeholder()"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class BasicHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
  readonly placeholder = signal<string | undefined>(undefined);
}

@Component({
  template: `
    <sn-cascade-select [formControl]="ctrl" [options]="options"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly ctrl = new FormControl<unknown>(null);
  options = MEDIA_OPTIONS;
}

@Component({
  template: `
    <sn-cascade-select [disabled]="true" [(value)]="value" [options]="options"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class DisabledHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
}

@Component({
  template: `
    <sn-cascade-select [(value)]="value" [options]="options" snClass="my-cascade-select"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class SnClassHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Action</sn-label>
      <sn-cascade-select [(value)]="value" [options]="options"></sn-cascade-select>
      <sn-hint>Choose an action</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
}

@Component({
  template: `
    <sn-cascade-select [(value)]="value" [options]="options"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class PreselectedHost {
  value: unknown = 'sys.shutdown';
  options = MEDIA_OPTIONS;
}

describe('CascadeSelect component', () => {
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
    return overlayEl.querySelector('.sn-cascade-select-panel');
  }

  function getTrigger(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
  }

  async function openSelect(fixture: ReturnType<typeof TestBed.createComponent<BasicHost>>) {
    await fixture.whenStable();
    const trigger = getTrigger(fixture);
    trigger.click();
    await tick(10);
    await fixture.whenStable();
    return trigger;
  }

  async function closeWait() {
    await tick(150);
  }

  it('renders trigger with role=combobox', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('role')).toBe('combobox');
  });

  it('trigger has aria-haspopup="tree"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-haspopup')).toBe('tree');
  });

  it('trigger aria-expanded is false initially', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(getTrigger(fix).getAttribute('aria-expanded')).toBe('false');
  });

  it('shows SnIntl selectPlaceholder when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Select…');
  });

  it('shows custom placeholder when provided', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.placeholder.set('Choose action…');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Choose action…');
  });

  it('placeholder span has sn-select-placeholder class when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
  });

  it('has sn-cascade-select class on host', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-cascade-select') as HTMLElement;
    expect(host.classList).toContain('sn-cascade-select');
  });

  it('panel is not shown initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('clicking trigger opens panel with role=tree', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel();
    expect(panel).toBeTruthy();
    expect(panel!.getAttribute('role')).toBe('tree');
  });

  it('trigger aria-expanded is true when open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('trigger aria-controls matches panel id', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(getPanel()?.getAttribute('id')).toBe(controls);
  });

  it('root options render with role=treeitem', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  // A treeitem owns its children through a group, and the level says how deep
  // they are. Nesting them in a plain div leaves a tree with one flat level.
  it('an opened flyout is a group of treeitems one level deeper', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const parent = Array.from(panel.querySelectorAll<HTMLElement>('[role="treeitem"]')).find((el) =>
      el.textContent?.includes('Media'),
    )!;
    expect(parent.getAttribute('aria-level')).toBe('1');

    parent.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await tick(10);
    await fix.whenStable();

    const group = parent.querySelector('[role="group"]');
    expect(group).toBeTruthy();
    const children = group!.querySelectorAll('[role="treeitem"]');
    expect(children.length).toBeGreaterThan(0);
    expect(children[0].getAttribute('aria-level')).toBe('2');
    expect(children[0].getAttribute('aria-posinset')).toBe('1');
    expect(children[0].getAttribute('aria-setsize')).toBe(String(children.length));
  });

  it('parent option shows chevron_right icon text', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const chevrons = panel.querySelectorAll('.sn-cascade-select-chevron');
    expect(chevrons.length).toBeGreaterThan(0);
    expect(Array.from(chevrons).some(el => el.textContent?.trim() === 'chevron_right')).toBe(true);
  });

  it('parent option has aria-expanded=false when flyout is closed', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    const mediaItem = Array.from(items).find(el =>
      el.textContent?.includes('Media'),
    ) as HTMLElement | undefined;
    expect(mediaItem?.getAttribute('aria-expanded')).toBe('false');
  });

  it('mouseenter on parent opens its flyout with children', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    const mediaItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'Media',
    ) as HTMLElement | undefined;
    expect(mediaItem).toBeTruthy();
    mediaItem!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fix.whenStable();
    const flyout = mediaItem!.querySelector('.sn-cascade-select-flyout');
    expect(flyout).toBeTruthy();
    expect(flyout!.textContent).toContain('Play / Pause');
    expect(flyout!.textContent).toContain('Next Track');
  });

  it('leaf click picks value and closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    const muteItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'Mute',
    ) as HTMLElement | undefined;
    expect(muteItem).toBeTruthy();
    muteItem!.click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('mute');
    expect(getPanel()).toBeNull();
  });

  it('parent click toggles flyout open/closed, value unchanged', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    const mediaItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'Media',
    ) as HTMLElement | undefined;
    expect(mediaItem).toBeTruthy();
    mediaItem!.click();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
    expect(getPanel()).toBeTruthy();
    const flyout = mediaItem!.querySelector('.sn-cascade-select-flyout');
    expect(flyout).toBeTruthy();
  });

  it('sibling flyout closes when hovering another parent', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    let items = panel.querySelectorAll('[role="treeitem"]');
    const mediaItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'Media',
    ) as HTMLElement | undefined;
    mediaItem!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fix.whenStable();
    expect(mediaItem!.querySelector('.sn-cascade-select-flyout')).toBeTruthy();

    items = panel.querySelectorAll('[role="treeitem"]');
    const systemItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'System',
    ) as HTMLElement | undefined;
    systemItem!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fix.whenStable();
    expect(mediaItem!.querySelector('.sn-cascade-select-flyout')).toBeNull();
    expect(systemItem!.querySelector('.sn-cascade-select-flyout')).toBeTruthy();
  });

  it('ArrowDown moves active to next option (aria-activedescendant)', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    const panel = getPanel()!;
    const desc = trigger.getAttribute('aria-activedescendant');
    expect(desc).toBeTruthy();
    const activeEl = panel.querySelector(`#${desc}`);
    expect(activeEl).toBeTruthy();
    expect(activeEl!.classList).toContain('sn-listbox-option-active');
  });

  it('ArrowUp from first item stays on first item', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(UP_ARROW));
    await fix.whenStable();
    const desc = trigger.getAttribute('aria-activedescendant');
    const panel = getPanel()!;
    const activeEl = panel.querySelector(`#${desc}`);
    expect(activeEl?.textContent).toContain('Media');
  });

  it('ArrowRight on parent opens flyout and moves active to first child', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(RIGHT_ARROW));
    await fix.whenStable();
    const panel = getPanel()!;
    const desc = trigger.getAttribute('aria-activedescendant');
    expect(desc).toBeTruthy();
    const activeEl = panel.querySelector(`#${desc}`);
    expect(activeEl?.textContent).toContain('Play / Pause');
  });

  it('ArrowLeft from child returns to parent and closes flyout', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(RIGHT_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(LEFT_ARROW));
    await fix.whenStable();
    const panel = getPanel()!;
    const desc = trigger.getAttribute('aria-activedescendant');
    const activeEl = panel.querySelector(`#${desc}`);
    expect(activeEl?.textContent).toContain('Media');
    expect(activeEl?.querySelector('.sn-cascade-select-flyout')).toBeNull();
  });

  it('Enter on leaf picks value and closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    const desc = trigger.getAttribute('aria-activedescendant');
    const panel = getPanel()!;
    const activeEl = panel.querySelector(`#${desc}`) as HTMLElement;
    if (activeEl?.textContent?.includes('Mute')) {
      trigger.dispatchEvent(key(ENTER));
      await closeWait();
      await fix.whenStable();
      expect(fix.componentInstance.value).toBe('mute');
      expect(getPanel()).toBeNull();
    }
  });

  it('Enter on parent opens flyout', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.dispatchEvent(key(DOWN_ARROW));
    await fix.whenStable();
    trigger.dispatchEvent(key(ENTER));
    await fix.whenStable();
    const panel = getPanel()!;
    const desc = trigger.getAttribute('aria-activedescendant');
    expect(desc).toBeTruthy();
    const items = panel.querySelectorAll('[role="treeitem"]');
    expect(Array.from(items).some(el => el.textContent?.includes('Play / Pause'))).toBe(true);
  });

  it('Escape closes panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value).toBeNull();
  });

  it('clicking trigger again closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    const trigger = await openSelect(fix);
    trigger.click();
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('backdrop click closes panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const backdrop = overlayEl.querySelector('.sn-select-backdrop') as HTMLElement;
    backdrop?.click();
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('ArrowDown on closed trigger opens panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    getTrigger(fix).dispatchEvent(key(DOWN_ARROW));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Enter on closed trigger opens panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    getTrigger(fix).dispatchEvent(key(ENTER));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('Space on closed trigger opens panel', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    getTrigger(fix).dispatchEvent(key(SPACE));
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeTruthy();
  });

  it('CVA writeValue shows deep leaf label without opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue('sys.shutdown');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Shutdown');
    expect(getPanel()).toBeNull();
  });

  it('preselected deep leaf shows label via findLabel', async () => {
    const fix = TestBed.createComponent(PreselectedHost);
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Shutdown');
  });

  it('CVA setDisabledState blocks opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    await fix.whenStable();
    fix.componentInstance.ctrl.disable();
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('disabled=true makes trigger button disabled', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    expect(getTrigger(fix).hasAttribute('disabled')).toBe(true);
  });

  it('disabled select cannot open panel', async () => {
    const fix = TestBed.createComponent(DisabledHost);
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('snClass string applies to host', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-cascade-select') as HTMLElement;
    expect(host.classList).toContain('my-cascade-select');
  });

  it('FormField controlId wires to trigger id', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const trigger = getTrigger(fix);
    const id = trigger.getAttribute('id');
    expect(id).toBeTruthy();
    const label = fix.nativeElement.querySelector('label') as HTMLElement;
    expect(label?.getAttribute('for')).toBe(id);
  });

  it('trigger gets aria-describedby from FormField hint', async () => {
    const fix = TestBed.createComponent(FormFieldHost);
    await fix.whenStable();
    const describedBy = getTrigger(fix).getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
  });

  it('SnIntl selectPlaceholder default is "Select…"', () => {
    const intl = TestBed.inject(SnIntl);
    expect(intl.selectPlaceholder).toBe('Select…');
  });

  it('selected leaf has sn-listbox-option-selected class', async () => {
    const fix = TestBed.createComponent(PreselectedHost);
    await openSelect(fix as unknown as ReturnType<typeof TestBed.createComponent<BasicHost>>);
    const panel = getPanel()!;
    const items = panel.querySelectorAll('[role="treeitem"]');
    const systemItem = Array.from(items).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'System',
    ) as HTMLElement | undefined;
    systemItem!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fix.whenStable();
    const flyoutItems = systemItem!.querySelectorAll('[role="treeitem"]');
    const powerItem = Array.from(flyoutItems).find(el =>
      el.querySelector('.sn-cascade-select-option-content span')?.textContent?.trim() === 'Power',
    ) as HTMLElement | undefined;
    powerItem?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await fix.whenStable();
    const powerFlyout = powerItem?.querySelector('.sn-cascade-select-flyout');
    if (powerFlyout) {
      const shutdownItems = powerFlyout.querySelectorAll('[role="treeitem"]');
      const shutdownItem = Array.from(shutdownItems).find(el =>
        el.textContent?.includes('Shutdown'),
      );
      expect(shutdownItem?.classList).toContain('sn-listbox-option-selected');
    }
  });
});

@Component({
  template: `
    <sn-cascade-select [(value)]="value" [options]="options" [animated]="false"></sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class NoAnimCascadeSelectHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
}

@Component({
  template: `
    <sn-cascade-select [(value)]="value" [options]="options"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
    </sn-cascade-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CascadeSelect],
})
class CustomAnimCascadeSelectHost {
  value: unknown = null;
  options = MEDIA_OPTIONS;
}

describe('CascadeSelect animation inputs', () => {
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
    return overlayEl.querySelector('.sn-select-panel');
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimCascadeSelectHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toBe('none');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimCascadeSelectHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    (fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('applies snStyle and allowed snAttrs to the trigger and panel', async () => {
    const fix = TestBed.createComponent(CascadeSelect);
    fix.componentRef.setInput('options', MEDIA_OPTIONS);
    fix.componentRef.setInput('snStyle', { trigger: { minWidth: '18rem' }, panel: { maxHeight: '12rem' } });
    fix.componentRef.setInput('snAttrs', { trigger: { 'data-testid': 'cascade-trigger' }, panel: { 'data-testid': 'cascade-panel' } });
    await fix.whenStable();

    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLButtonElement;
    expect(trigger.style.minWidth).toBe('18rem');
    expect(trigger.getAttribute('data-testid')).toBe('cascade-trigger');

    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.maxHeight).toBe('12rem');
    expect(panel.getAttribute('data-testid')).toBe('cascade-panel');
  });
});
