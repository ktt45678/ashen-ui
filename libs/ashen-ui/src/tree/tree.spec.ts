import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { provideSnIntl } from 'ashen-ui/core';
import { Tree } from './tree';
import type { TreeNode } from './tree';

const FLAT_NODES: TreeNode[] = [
  { key: 'a', label: 'Alpha' },
  { key: 'b', label: 'Beta' },
  { key: 'c', label: 'Gamma' },
];

const NESTED_NODES: TreeNode[] = [
  {
    key: 'root1',
    label: 'Root 1',
    icon: 'folder',
    children: [
      { key: 'child1', label: 'Child 1', icon: 'description' },
      { key: 'child2', label: 'Child 2' },
    ],
  },
  {
    key: 'root2',
    label: 'Root 2',
    children: [
      {
        key: 'child3',
        label: 'Child 3',
        children: [
          { key: 'grandchild1', label: 'Grandchild 1' },
        ],
      },
    ],
  },
  { key: 'root3', label: 'Root 3' },
];

@Component({
  template: `<sn-tree [nodes]="nodes" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class PathKeyHost {
  nodes: TreeNode[] = [
    { key: 'C:\\docs', label: 'Docs' },
    { key: 'C:\\docs\\"draft"', label: 'Draft' },
  ];
}

@Component({
  template: `<sn-tree [nodes]="nodes" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class BasicHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `<sn-tree [nodes]="nodes" [expandedKeys]="expanded" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class NestedCollapsedHost {
  nodes = NESTED_NODES;
  expanded: readonly string[] = [];
}

@Component({
  template: `<sn-tree [nodes]="nodes" [(expandedKeys)]="expanded" [(selectedKey)]="sel" (nodeSelect)="events.push($event)" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class InteractiveHost {
  nodes = NESTED_NODES;
  readonly expanded = signal<readonly string[]>([]);
  readonly sel = signal<string | null>(null);
  events: { key: string; node: TreeNode }[] = [];
}

@Component({
  template: `
    <div dir="rtl">
      <sn-tree [nodes]="nodes" [(expandedKeys)]="expanded" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Tree],
})
class RtlHost {
  nodes = NESTED_NODES;
  readonly expanded = signal<readonly string[]>([]);
}

@Component({
  template: `<sn-tree [nodes]="nodes" [expandOnClick]="mode()" [(expandedKeys)]="expanded" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class ExpandOnClickHost {
  nodes = NESTED_NODES;
  readonly mode = signal<'none' | 'single' | 'double'>('single');
  readonly expanded = signal<readonly string[]>([]);
}

@Component({
  template: `<sn-tree [nodes]="nodes" [snClass]="{ root: 'my-root' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class SnClassHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `<sn-tree [nodes]="nodes" ariaLabel="File tree" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class AriaLabelHost {
  nodes = FLAT_NODES;
}

@Component({
  template: `
    <sn-tree
      [nodes]="nodes"
      [expandedKeys]="expanded"
      [snStyle]="{
        root: { outline: '1px solid red' },
        node: { color: 'rgb(1, 2, 3)' },
        toggle: { color: 'rgb(4, 5, 6)' },
        nodeIcon: { color: 'rgb(7, 8, 9)' },
        nodeLabel: { color: 'rgb(10, 11, 12)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'tree-root', role: 'presentation' },
        node: { 'data-testid': 'tree-node', role: 'listitem' },
        toggle: { 'data-testid': 'tree-toggle' },
        nodeIcon: { 'data-testid': 'tree-node-icon' },
        nodeLabel: { 'data-testid': 'tree-node-label' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class SnPartHost {
  nodes = NESTED_NODES;
  expanded: readonly string[] = ['root1'];
}

describe('Tree', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies snStyle and allowed snAttrs to named node parts without replacing tree semantics', async () => {
    const fix = TestBed.createComponent(SnPartHost);
    await fix.whenStable();
    const host = fix.nativeElement.querySelector('sn-tree') as HTMLElement;

    expect(host.style.outline).toContain('red');
    expect(host.getAttribute('data-testid')).toBe('tree-root');
    // The tree role is library-owned and survives the pass-through.
    expect(host.getAttribute('role')).toBe('tree');

    const node = host.querySelector('.sn-tree-node') as HTMLElement;
    expect(node.style.color).toBe('rgb(1, 2, 3)');
    expect(node.getAttribute('data-testid')).toBe('tree-node');
    expect(node.getAttribute('role')).toBe('treeitem');

    const toggle = host.querySelector('.sn-tree-toggle') as HTMLElement;
    expect(toggle.style.color).toBe('rgb(4, 5, 6)');
    expect(toggle.getAttribute('data-testid')).toBe('tree-toggle');

    const icon = host.querySelector('.sn-tree-node-icon') as HTMLElement;
    expect(icon.style.color).toBe('rgb(7, 8, 9)');
    expect(icon.getAttribute('data-testid')).toBe('tree-node-icon');

    const label = host.querySelector('.sn-tree-label') as HTMLElement;
    expect(label.style.color).toBe('rgb(10, 11, 12)');
    expect(label.getAttribute('data-testid')).toBe('tree-node-label');
  });

  it('renders only root nodes when nothing expanded', async () => {
    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();
    const items = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBe(3);
    expect(items[0].textContent.trim()).toContain('Root 1');
    expect(items[1].textContent.trim()).toContain('Root 2');
    expect(items[2].textContent.trim()).toContain('Root 3');
  });

  it('host has role="tree"', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-tree');
    expect(host.getAttribute('role')).toBe('tree');
  });

  it('uses SnIntl.treeLabel as default aria-label', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-tree');
    expect(host.getAttribute('aria-label')).toBe('Tree');
  });

  it('ariaLabel input overrides SnIntl default', async () => {
    const fix = TestBed.createComponent(AriaLabelHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-tree');
    expect(host.getAttribute('aria-label')).toBe('File tree');
  });

  it('expanding via chevron shows children + aria-expanded flips + expandedKeys model updates', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const toggles = fix.nativeElement.querySelectorAll('.sn-tree-toggle');
    expect(toggles.length).toBe(2);

    const root1Item = fix.nativeElement.querySelector('[role="treeitem"][data-key="root1"]');
    expect(root1Item.getAttribute('aria-expanded')).toBe('false');

    toggles[0].click();
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');

    const root1ItemAfter = fix.nativeElement.querySelector('[role="treeitem"][data-key="root1"]');
    expect(root1ItemAfter.getAttribute('aria-expanded')).toBe('true');

    const items = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBe(5);
  });

  it('chevron click does NOT select the node', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const toggles = fix.nativeElement.querySelectorAll('.sn-tree-toggle');
    toggles[0].click();
    await fix.whenStable();

    expect(fix.componentInstance.sel()).toBeNull();
    expect(fix.componentInstance.events.length).toBe(0);
  });

  it('row click selects (selectedKey model + nodeSelect emission + aria-selected)', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1 = fix.nativeElement.querySelector('[data-key="child1"]');
    child1.click();
    await fix.whenStable();

    expect(fix.componentInstance.sel()).toBe('child1');
    expect(fix.componentInstance.events.length).toBe(1);
    expect(fix.componentInstance.events[0].key).toBe('child1');
    expect(child1.getAttribute('aria-selected')).toBe('true');

    const root1 = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1.getAttribute('aria-selected')).toBe('false');
  });

  it('aria-level/setsize/posinset correct on nested nodes', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1', 'root2', 'child3']);
    await fix.whenStable();

    const root1 = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1.getAttribute('aria-level')).toBe('1');
    expect(root1.getAttribute('aria-setsize')).toBe('3');
    expect(root1.getAttribute('aria-posinset')).toBe('1');

    const child1 = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1.getAttribute('aria-level')).toBe('2');
    expect(child1.getAttribute('aria-setsize')).toBe('2');
    expect(child1.getAttribute('aria-posinset')).toBe('1');

    const grandchild = fix.nativeElement.querySelector('[data-key="grandchild1"]');
    expect(grandchild.getAttribute('aria-level')).toBe('3');
    expect(grandchild.getAttribute('aria-setsize')).toBe('1');
    expect(grandchild.getAttribute('aria-posinset')).toBe('1');
  });

  it('leaf nodes have NO aria-expanded', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1 = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1.getAttribute('aria-expanded')).toBeNull();

    const root3 = fix.nativeElement.querySelector('[data-key="root3"]');
    expect(root3.getAttribute('aria-expanded')).toBeNull();
  });

  it('exactly one treeitem has tabindex=0', async () => {
    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();

    const items: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    const zeros = [...items].filter((el) => el.getAttribute('tabindex') === '0');
    expect(zeros.length).toBe(1);
  });

  it('tabindex=0 moves to the next item after ArrowDown', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const items: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fix.whenStable();

    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[0].getAttribute('tabindex')).toBe('-1');
  });

  it('moves focus to nodes whose keys contain backslashes and quotes', async () => {
    const fix = TestBed.createComponent(PathKeyHost);
    await fix.whenStable();

    const items: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    items[0].focus();
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fix.whenStable();

    expect(document.activeElement).toBe(items[1]);
  });

  it('ArrowDown / ArrowUp traversal across expanded children', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await fix.whenStable();

    const child1: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1.getAttribute('tabindex')).toBe('0');

    child1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await fix.whenStable();

    expect(root1.getAttribute('tabindex')).toBe('0');
  });

  it('ArrowRight expands collapsed parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');
  });

  it('ArrowRight on expanded parent moves to first child', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    const child1: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    expect(child1.getAttribute('tabindex')).toBe('0');
  });

  it('ArrowLeft expands a collapsed parent in rtl', async () => {
    const fix = TestBed.createComponent(RtlHost);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).toContain('root1');
  });

  it('ArrowRight collapses an expanded parent in rtl', async () => {
    const fix = TestBed.createComponent(RtlHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).not.toContain('root1');
  });

  it('ArrowLeft collapses expanded parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.expanded()).not.toContain('root1');
  });

  it('ArrowLeft on leaf moves focus to parent', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    child1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1.getAttribute('tabindex')).toBe('0');
  });

  it('Home moves focus to first visible node', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const items: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await fix.whenStable();

    expect(items[0].getAttribute('tabindex')).toBe('0');
  });

  it('End moves focus to last visible node', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const items: NodeListOf<HTMLElement> = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await fix.whenStable();

    expect(items[items.length - 1].getAttribute('tabindex')).toBe('0');
  });

  it('Enter selects the focused node', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    root1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.sel()).toBe('root1');
    expect(fix.componentInstance.events[0].key).toBe('root1');
  });

  it('Space selects the focused node', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    await fix.whenStable();

    const root3: HTMLElement = fix.nativeElement.querySelector('[data-key="root3"]');
    root3.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await fix.whenStable();

    expect(fix.componentInstance.sel()).toBe('root3');
  });

  it('collapsing ancestor while child is active moves active to ancestor', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const child1: HTMLElement = fix.nativeElement.querySelector('[data-key="child1"]');
    child1.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await fix.whenStable();

    fix.componentInstance.expanded.set([]);
    await fix.whenStable();

    const root1: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    expect(root1.getAttribute('tabindex')).toBe('0');
  });

  it('node icons render as ligature text content', async () => {
    const fix = TestBed.createComponent(InteractiveHost);
    fix.componentInstance.expanded.set(['root1']);
    await fix.whenStable();

    const root1 = fix.nativeElement.querySelector('[data-key="root1"]');
    const icon = root1.querySelector('.sn-tree-node-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('folder');

    const child1 = fix.nativeElement.querySelector('[data-key="child1"]');
    const childIcon = child1.querySelector('.sn-tree-node-icon');
    expect(childIcon.textContent.trim()).toBe('description');
  });

  it('SnIntl override for treeExpand changes toggle aria-label', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ treeExpand: 'Abrir', treeCollapse: 'Cerrar' }),
      ],
    });

    const fix = TestBed.createComponent(NestedCollapsedHost);
    await fix.whenStable();

    const toggle: HTMLElement = fix.nativeElement.querySelector('.sn-tree-toggle');
    expect(toggle.getAttribute('aria-label')).toBe('Abrir');
  });

  it('snClass string lands on host element', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-tree');
    expect(host.classList).toContain('my-root');
  });

  it('expandOnClick="single": clicking a parent item toggles expansion', async () => {
    const fix = TestBed.createComponent(ExpandOnClickHost);
    await fix.whenStable();
    const item: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    item.click();
    await fix.whenStable();
    expect(fix.componentInstance.expanded()).toContain('root1');
    item.click();
    await fix.whenStable();
    expect(fix.componentInstance.expanded()).not.toContain('root1');
  });

  it('expandOnClick="single": clicking a leaf does not change expansion', async () => {
    const fix = TestBed.createComponent(ExpandOnClickHost);
    await fix.whenStable();
    const leaf: HTMLElement = fix.nativeElement.querySelector('[data-key="root3"]');
    leaf.click();
    await fix.whenStable();
    expect(fix.componentInstance.expanded().length).toBe(0);
  });

  it('expandOnClick="double": single click does nothing, dblclick toggles', async () => {
    const fix = TestBed.createComponent(ExpandOnClickHost);
    fix.componentInstance.mode.set('double');
    await fix.whenStable();
    const item: HTMLElement = fix.nativeElement.querySelector('[data-key="root1"]');
    item.click();
    await fix.whenStable();
    expect(fix.componentInstance.expanded()).not.toContain('root1');
    item.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await fix.whenStable();
    expect(fix.componentInstance.expanded()).toContain('root1');
  });
});
