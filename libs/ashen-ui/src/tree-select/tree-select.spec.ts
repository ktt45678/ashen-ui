import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE } from '@angular/cdk/keycodes';
import { TreeSelect } from './tree-select';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { SnIntl } from 'ashen-ui/core';
import type { TreeNode } from 'ashen-ui/tree';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

function key(code: number, opts: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { keyCode: code, bubbles: true, cancelable: true, ...opts });
}

const FILE_TREE: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      { key: 'app', label: 'app', icon: 'folder', children: [
        { key: 'app.ts', label: 'app.ts', icon: 'description' },
      ]},
      { key: 'main.ts', label: 'main.ts', icon: 'description' },
    ],
  },
  { key: 'package.json', label: 'package.json', icon: 'description' },
];

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes" [placeholder]="placeholder()"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class BasicHost {
  value: string | null = null;
  nodes = FILE_TREE;
  readonly placeholder = signal<string | undefined>(undefined);
}

@Component({
  template: `
    <sn-tree-select [formControl]="ctrl" [nodes]="nodes"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly ctrl = new FormControl<string | null>(null);
  nodes = FILE_TREE;
}

@Component({
  template: `
    <sn-tree-select [disabled]="true" [(value)]="value" [nodes]="nodes"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class DisabledHost {
  value: string | null = null;
  nodes = FILE_TREE;
}

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes" snClass="my-tree-select"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class SnClassHost {
  value: string | null = null;
  nodes = FILE_TREE;
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Pick a file</sn-label>
      <sn-tree-select [(value)]="value" [nodes]="nodes"></sn-tree-select>
      <sn-hint>Choose a leaf node</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {
  value: string | null = null;
  nodes = FILE_TREE;
}

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes" [(expandedKeys)]="expandedKeys"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class PreExpandedHost {
  value: string | null = null;
  nodes = FILE_TREE;
  expandedKeys: readonly string[] = ['src'];
}

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes" (nodeSelect)="onNodeSelect($event)"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class NodeSelectHost {
  value: string | null = null;
  nodes = FILE_TREE;
  lastEvent: { key: string; node: TreeNode } | null = null;
  onNodeSelect(e: { key: string; node: TreeNode }): void {
    this.lastEvent = e;
  }
}

describe('TreeSelect component', () => {
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
    return overlayEl.querySelector('.sn-tree-select-panel');
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
    fix.componentInstance.placeholder.set('Choose a file…');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('Choose a file…');
  });

  it('placeholder span has sn-select-placeholder class when no value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
  });

  it('shows selected leaf label and icon after writeValue', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue('package.json');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('package.json');
    expect(span.querySelector('sn-icon')).toBeTruthy();
  });

  it('has sn-tree-select class on host', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-tree-select') as HTMLElement;
    expect(host.classList).toContain('sn-tree-select');
  });

  it('panel is not shown initially', async () => {
    TestBed.createComponent(BasicHost);
    await tick(10);
    expect(getPanel()).toBeNull();
  });

  it('clicking trigger opens panel with sn-tree inside', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel();
    expect(panel).toBeTruthy();
    expect(panel!.querySelector('sn-tree')).toBeTruthy();
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

  it('LEAF click sets value, emits nodeSelect, and closes panel', async () => {
    const fix = TestBed.createComponent(NodeSelectHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    const treeItems = panel.querySelectorAll('[role="treeitem"]') as NodeListOf<HTMLElement>;
    const leafItem = Array.from(treeItems).find((el) =>
      el.getAttribute('data-key') === 'package.json',
    ) as HTMLElement;
    leafItem?.click();
    await closeWait();
    await fix.whenStable();
    expect(fix.componentInstance.value).toBe('package.json');
    expect(fix.componentInstance.lastEvent?.key).toBe('package.json');
    expect(getPanel()).toBeNull();
  });

  it('PARENT row click toggles expansion, does NOT set value, panel stays open', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    const panel = getPanel()!;
    const treeItems = panel.querySelectorAll('[role="treeitem"]') as NodeListOf<HTMLElement>;
    const srcItem = Array.from(treeItems).find((el) =>
      el.getAttribute('data-key') === 'src',
    ) as HTMLElement;
    srcItem?.click();
    await tick(20);
    await fix.whenStable();
    expect(fix.componentInstance.value).toBeNull();
    expect(getPanel()).toBeTruthy();
    const childItems = panel.querySelectorAll('[role="treeitem"]');
    const hasApp = Array.from(childItems).some((el) => el.getAttribute('data-key') === 'app');
    expect(hasApp).toBe(true);
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

  it('Escape closes the panel without changing value', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    overlayEl.dispatchEvent(key(ESCAPE));
    await closeWait();
    await fix.whenStable();
    expect(getPanel()).toBeNull();
    expect(fix.componentInstance.value).toBeNull();
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

  it('focus lands in tree after open (activeElement is a treeitem or inside tree)', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await openSelect(fix);
    await tick(50);
    const panel = getPanel()!;
    const tree = panel.querySelector('sn-tree') as HTMLElement;
    const focused = document.activeElement;
    const treeContainsFocus = tree?.contains(focused) || focused?.getAttribute('role') === 'treeitem';
    expect(treeContainsFocus || focused?.closest('sn-tree') !== null).toBe(true);
  });

  it('expandedKeys two-way binding pre-expands nodes', async () => {
    const fix = TestBed.createComponent(PreExpandedHost);
    await fix.whenStable();
    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLElement;
    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    const treeItems = panel.querySelectorAll('[role="treeitem"]');
    const hasApp = Array.from(treeItems).some((el) => el.getAttribute('data-key') === 'app');
    expect(hasApp).toBe(true);
  });

  it('CVA writeValue shows correct label without opening', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue('main.ts');
    await fix.whenStable();
    const span = fix.nativeElement.querySelector('.sn-select-value') as HTMLElement;
    expect(span.textContent?.trim()).toContain('main.ts');
    expect(getPanel()).toBeNull();
  });

  it('model value updates the selected treeitem state', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.value = 'package.json';
    fix.changeDetectorRef.detectChanges();
    await fix.whenStable();
    await openSelect(fix);
    const selected = getPanel()?.querySelector('[role="treeitem"][aria-selected="true"]');
    expect(selected?.getAttribute('data-key')).toBe('package.json');
  });

  it('CVA clearing removes the selected treeitem state', async () => {
    const fix = TestBed.createComponent(ReactiveFormHost);
    fix.componentInstance.ctrl.setValue('package.json');
    await fix.whenStable();
    getTrigger(fix).click();
    await tick(10);
    await fix.whenStable();
    const selected = getPanel()?.querySelector('[role="treeitem"][aria-selected="true"]');
    expect(selected?.getAttribute('data-key')).toBe('package.json');

    fix.componentInstance.ctrl.setValue(null);
    await fix.whenStable();
    expect(getPanel()?.querySelector('[role="treeitem"][aria-selected="true"]')).toBeNull();
    expect(fix.nativeElement.querySelector('.sn-select-placeholder')).toBeTruthy();
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
    const host = fix.nativeElement.querySelector('sn-tree-select') as HTMLElement;
    expect(host.classList).toContain('my-tree-select');
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
});

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes" [animated]="false"></sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class NoAnimTreeSelectHost {
  value: string | null = null;
  nodes = FILE_TREE;
}

@Component({
  template: `
    <sn-tree-select [(value)]="value" [nodes]="nodes"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
    </sn-tree-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TreeSelect],
})
class CustomAnimTreeSelectHost {
  value: string | null = null;
  nodes = FILE_TREE;
}

describe('TreeSelect animation inputs', () => {
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
    const fix = TestBed.createComponent(NoAnimTreeSelectHost);
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
    const fix = TestBed.createComponent(CustomAnimTreeSelectHost);
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
    const fix = TestBed.createComponent(TreeSelect);
    fix.componentRef.setInput('nodes', FILE_TREE);
    fix.componentRef.setInput('snStyle', { trigger: { minWidth: '18rem' }, panel: { maxHeight: '12rem' } });
    fix.componentRef.setInput('snAttrs', { trigger: { 'data-testid': 'tree-trigger' }, panel: { 'data-testid': 'tree-panel' } });
    await fix.whenStable();

    const trigger = fix.nativeElement.querySelector('.sn-select-trigger') as HTMLButtonElement;
    expect(trigger.style.minWidth).toBe('18rem');
    expect(trigger.getAttribute('data-testid')).toBe('tree-trigger');

    trigger.click();
    await tick(10);
    await fix.whenStable();
    const panel = getPanel()!;
    expect(panel.style.maxHeight).toBe('12rem');
    expect(panel.getAttribute('data-testid')).toBe('tree-panel');
  });
});
