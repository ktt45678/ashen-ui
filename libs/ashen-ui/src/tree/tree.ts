import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnPartSource,
  type SnStyle,
  type SnClass,
  SnTreeIntl,
  resolveSnClass,
  snInlineStep,
  snIsRtl,
} from 'ashen-ui/core';
import { snListNavigator } from 'ashen-ui/cdk';
import { Icon } from 'ashen-ui/icon';

export type TreeExpandOnClick =
  /** Only the toggle arrow expands a node; clicking the label selects it. */
  | 'none'
  /** A single click on the node expands it. */
  | 'single'
  /** A double click on the node expands it, leaving single click for selection. */
  | 'double';

export interface TreeNode {
  key: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  /** Children are not loaded yet. The node shows a toggle and `nodeExpand` asks for them. */
  lazy?: boolean;
}

interface FlatEntry {
  node: TreeNode;
  key: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  level: number;
  setsize: number;
  posinset: number;
  parentKey: string | null;
}

const TREE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-label'],
  node: ['role', 'aria-level', 'aria-setsize', 'aria-posinset', 'aria-expanded', 'aria-busy', 'aria-selected', 'tabindex'],
  toggle: ['type', 'tabindex', 'aria-label'],
};

@Component({
  selector: 'sn-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  templateUrl: './tree.html',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Tree) }],
  host: {
    role: 'tree',
    class: 'sn-tree',
    '[class]': 'rootClassExtra()',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class Tree implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly nodes = input<readonly TreeNode[]>([]);
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Expand/collapse a parent node by clicking anywhere on the tree item:
   *  'none' (chevron only), 'single' (single click), 'double' (double click). */
  readonly expandOnClick = input<TreeExpandOnClick>('none');
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly selectedKey = model<string | null>(null);
  readonly expandedKeys = model<readonly string[]>([]);

  /** Keys whose children are being fetched. Shows a busy toggle and sets `aria-busy`. */
  readonly loadingKeys = input<readonly string[]>([]);

  readonly nodeSelect = output<{ key: string; node: TreeNode }>();
  /** Fires on every user expand. For a `lazy` node, replace `nodes` with the loaded children. */
  readonly nodeExpand = output<{ key: string; node: TreeNode }>();
  readonly nodeCollapse = output<{ key: string; node: TreeNode }>();

  protected readonly intl = inject(SnTreeIntl);
  private readonly rtl = snIsRtl();
  private readonly elRef = inject(ElementRef<HTMLElement>);

  private readonly rawActiveKey = signal<string | null>(null);

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly nodeClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'node', false),
  );

  protected readonly toggleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'toggle', false),
  );

  protected readonly nodeIconClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'nodeIcon', false),
  );

  protected readonly nodeLabelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'nodeLabel', false),
  );

  readonly reservedAttrs = (section: string): readonly string[] =>
    TREE_RESERVED_ATTRS[section] ?? [];

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.intl.label,
  );

  protected readonly allEntries = computed<FlatEntry[]>(() => {
    const result: FlatEntry[] = [];
    this.flattenAllNodes(this.nodes(), 0, null, result);
    return result;
  });

  protected readonly visibleEntries = computed<FlatEntry[]>(() => {
    const expanded = new Set(this.expandedKeys());
    const result: FlatEntry[] = [];
    this.flattenNodes(this.nodes(), 0, null, expanded, result);
    return result;
  });

  private readonly navigator = snListNavigator({
    mode: 'index',
    itemCount: computed(() => this.visibleEntries().length),
    getLabel: (index) => this.visibleEntries()[index]?.node.label ?? '',
    orientation: 'vertical',
    homeAndEnd: true,
  });

  protected readonly activeKey = computed<string | null>(() => {
    const entries = this.visibleEntries();
    if (entries.length === 0) return null;

    const raw = this.rawActiveKey();
    if (raw === null) return entries[0].key;

    const visibleIdx = entries.findIndex((e) => e.key === raw);
    if (visibleIdx !== -1) return raw;

    const allEntry = this.allEntries().find((e) => e.key === raw);
    if (allEntry?.parentKey) {
      const parentVisible = entries.findIndex((e) => e.key === allEntry.parentKey);
      if (parentVisible !== -1) return allEntry.parentKey;
    }

    return entries[0].key;
  });

  private flattenNodes(
    nodes: readonly TreeNode[],
    depth: number,
    parentKey: string | null,
    expanded: Set<string>,
    result: FlatEntry[],
  ): void {
    const setsize = nodes.length;
    nodes.forEach((node, i) => {
      const hasChildren = this.nodeHasChildren(node);
      const isExpanded = expanded.has(node.key);
      result.push({
        node,
        key: node.key,
        depth,
        hasChildren,
        expanded: isExpanded,
        level: depth + 1,
        setsize,
        posinset: i + 1,
        parentKey,
      });
      if (node.children && hasChildren && isExpanded) {
        this.flattenNodes(node.children, depth + 1, node.key, expanded, result);
      }
    });
  }

  private flattenAllNodes(
    nodes: readonly TreeNode[],
    depth: number,
    parentKey: string | null,
    result: FlatEntry[],
  ): void {
    const setsize = nodes.length;
    nodes.forEach((node, i) => {
      const hasChildren = this.nodeHasChildren(node);
      result.push({
        node,
        key: node.key,
        depth,
        hasChildren,
        expanded: false,
        level: depth + 1,
        setsize,
        posinset: i + 1,
        parentKey,
      });
      if (node.children && hasChildren) {
        this.flattenAllNodes(node.children, depth + 1, node.key, result);
      }
    });
  }

  private nodeHasChildren(node: TreeNode): boolean {
    return node.children ? node.children.length > 0 : node.lazy === true;
  }

  protected isLoading(key: string): boolean {
    return this.loadingKeys().includes(key);
  }

  protected toggleExpand(key: string, event: Event): void {
    event.stopPropagation();
    this.toggleExpandKey(key);
  }

  protected selectNode(entry: FlatEntry): void {
    this.selectedKey.set(entry.key);
    this.rawActiveKey.set(entry.key);
    if (entry.hasChildren && this.expandOnClick() === 'single') {
      this.toggleExpandKey(entry.key);
    }
    this.nodeSelect.emit({ key: entry.key, node: entry.node });
  }

  protected onNodeDblClick(entry: FlatEntry): void {
    if (entry.hasChildren && this.expandOnClick() === 'double') {
      this.toggleExpandKey(entry.key);
    }
  }

  private toggleExpandKey(key: string): void {
    this.setExpanded(key, !this.expandedKeys().includes(key));
  }

  private setExpanded(key: string, expanded: boolean): void {
    const current = this.expandedKeys();
    if (current.includes(key) === expanded) return;
    this.expandedKeys.set(expanded ? [...current, key] : current.filter((k) => k !== key));
    const node = this.allEntries().find((entry) => entry.key === key)?.node;
    if (node) (expanded ? this.nodeExpand : this.nodeCollapse).emit({ key, node });
  }

  protected onNodeFocus(key: string): void {
    this.rawActiveKey.set(key);
    const index = this.visibleEntries().findIndex((entry) => entry.key === key);
    if (index >= 0) {
      this.navigator.setActiveItem(index);
    }
  }

  protected onNodeKeydown(event: KeyboardEvent, entry: FlatEntry): void {
    const entries = this.visibleEntries();
    const idx = entries.findIndex((e) => e.key === entry.key);
    this.navigator.setActiveItem(idx);

    // APG: the arrow that points INTO the tree expands, the one that points
    // back out collapses. In RTL the tree indents the other way, so they swap.
    const step = snInlineStep(event.key, this.rtl());
    if (step === 1) {
      event.preventDefault();
      this.expandOrDescend(entry);
      return;
    }
    if (step === -1) {
      event.preventDefault();
      this.collapseOrAscend(entry);
      return;
    }

    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.selectNode(entry);
        break;
      }
      default:
        this.navigate(event);
    }
  }

  /** Open a collapsed node, or step onto the first child of an open one. */
  private expandOrDescend(entry: FlatEntry): void {
    if (!entry.hasChildren) return;
    if (!entry.expanded) {
      this.setExpanded(entry.key, true);
      return;
    }
    const entries = this.visibleEntries();
    const idx = entries.findIndex((e) => e.key === entry.key);
    if (idx < entries.length - 1) this.moveFocus(entries[idx + 1].key);
  }

  /** Close an open node, or step out to the parent of a closed or leaf one. */
  private collapseOrAscend(entry: FlatEntry): void {
    if (entry.hasChildren && entry.expanded) {
      this.setExpanded(entry.key, false);
    } else if (entry.parentKey !== null) {
      this.moveFocus(entry.parentKey);
    }
  }

  protected isActive(key: string): boolean {
    return key === this.activeKey();
  }

  protected getToggleLabel(expanded: boolean): string {
    return expanded ? this.intl.collapse : this.intl.expand;
  }

  private moveFocus(key: string): void {
    this.rawActiveKey.set(key);
    const index = this.visibleEntries().findIndex((entry) => entry.key === key);
    if (index >= 0) {
      this.navigator.setActiveItem(index);
    }
    const nodes = this.elRef.nativeElement.querySelectorAll('[data-key]') as NodeListOf<HTMLElement>;
    const el = Array.from(nodes).find((node) => node.dataset['key'] === key);
    el?.focus();
  }

  private navigate(event: KeyboardEvent): void {
    if (!this.navigator.onKeydown(event)) {
      return;
    }
    event.preventDefault();
    const index = this.navigator.activeIndex();
    const entry = index === null ? null : this.visibleEntries()[index];
    if (entry) {
      this.moveFocus(entry.key);
    }
  }
}
