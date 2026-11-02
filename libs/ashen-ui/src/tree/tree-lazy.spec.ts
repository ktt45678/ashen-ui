import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tree } from './tree';
import type { TreeNode } from './tree';

const LAZY_NODES: TreeNode[] = [
  { key: 'remote', label: 'Remote', lazy: true },
  { key: 'plain', label: 'Plain' },
];

@Component({
  template: `
    <sn-tree
      [nodes]="nodes()"
      [(expandedKeys)]="expanded"
      [loadingKeys]="loading()"
      (nodeExpand)="events.push('expand:' + $event.key)"
      (nodeCollapse)="events.push('collapse:' + $event.key)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Tree],
})
class LazyHost {
  readonly nodes = signal<TreeNode[]>(LAZY_NODES);
  readonly expanded = signal<string[]>([]);
  readonly loading = signal<string[]>([]);
  events: string[] = [];
}

describe('Tree lazy children', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  const toggle = (root: HTMLElement): HTMLElement =>
    root.querySelector('.sn-tree-toggle') as HTMLElement;

  it('shows a toggle for a lazy node before its children exist', async () => {
    const fix = TestBed.createComponent(LazyHost);
    await fix.whenStable();
    const items = fix.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(items[0].getAttribute('aria-expanded')).toBe('false');
    expect(items[0].querySelector('.sn-tree-toggle')).toBeTruthy();
    expect(items[1].querySelector('.sn-tree-toggle')).toBeNull();
  });

  it('emits nodeExpand, then renders the children the consumer supplies', async () => {
    const fix = TestBed.createComponent(LazyHost);
    await fix.whenStable();
    toggle(fix.nativeElement).click();
    await fix.whenStable();
    expect(fix.componentInstance.events).toEqual(['expand:remote']);

    fix.componentInstance.nodes.set([
      { key: 'remote', label: 'Remote', lazy: true, children: [{ key: 'loaded', label: 'Loaded' }] },
      LAZY_NODES[1],
    ]);
    await fix.whenStable();
    expect(fix.nativeElement.textContent).toContain('Loaded');
  });

  it('treats a lazy node that loads no children as a leaf', async () => {
    const fix = TestBed.createComponent(LazyHost);
    fix.componentInstance.nodes.set([{ key: 'remote', label: 'Remote', lazy: true, children: [] }]);
    await fix.whenStable();
    expect(toggle(fix.nativeElement)).toBeNull();
  });

  it('marks a loading node busy', async () => {
    const fix = TestBed.createComponent(LazyHost);
    fix.componentInstance.loading.set(['remote']);
    await fix.whenStable();
    expect(fix.nativeElement.querySelector('[role="treeitem"]').getAttribute('aria-busy')).toBe('true');
  });

  it('emits nodeCollapse when an expanded node is closed', async () => {
    const fix = TestBed.createComponent(LazyHost);
    await fix.whenStable();
    toggle(fix.nativeElement).click();
    await fix.whenStable();
    toggle(fix.nativeElement).click();
    await fix.whenStable();
    expect(fix.componentInstance.events).toEqual(['expand:remote', 'collapse:remote']);
  });
});
