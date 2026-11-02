import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  contentChildren,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
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
import { Icon } from 'ashen-ui/icon';
import { TableColumn } from 'ashen-ui/table';
import { snListNavigator } from 'ashen-ui/cdk';

export interface TreeTableNode {
  key: string;
  data: Record<string, unknown>;
  icon?: string;
  children?: TreeTableNode[];
}

interface FlatEntry {
  node: TreeTableNode;
  key: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  level: number;
  setsize: number;
  posinset: number;
  parentKey: string | null;
}

const TREE_TABLE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  table: ['role', 'aria-label'],
  row: ['role', 'aria-level', 'aria-posinset', 'aria-setsize', 'aria-expanded', 'tabindex', 'data-key'],
  toggle: ['type', 'tabindex', 'aria-label'],
};

@Component({
  selector: 'sn-tree-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, SnPart],
  templateUrl: './tree-table.html',
  styleUrl: './tree-table.scss',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => TreeTable) }],
  host: {
    class: 'sn-tree-table',
    '[class]': 'rootClassExtra()',
  },
})
export class TreeTable implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly nodes = input<readonly TreeTableNode[]>([]);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly expandedKeys = model<readonly string[]>([]);

  protected readonly columns = contentChildren(TableColumn);
  protected readonly intl = inject(SnTreeIntl);
  private readonly rtl = snIsRtl();
  private readonly elRef = inject(ElementRef<HTMLElement>);

  private readonly rawActiveKey = signal<string | null>(null);
  private readonly navigator = snListNavigator({
    mode: 'index',
    itemCount: computed(() => this.visibleEntries().length),
    getLabel: (index) => this.visibleEntries()[index]?.key ?? '',
    orientation: 'vertical',
    homeAndEnd: true,
  });

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.intl.tableLabel,
  );

  protected readonly headerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'header', false),
  );

  protected readonly rowClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'row', false),
  );

  protected readonly cellClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'cell', false),
  );

  protected readonly toggleClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'toggle', false),
  );

  protected readonly tableClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'table', false),
  );

  readonly reservedAttrs = (section: string): readonly string[] =>
    TREE_TABLE_RESERVED_ATTRS[section] ?? [];

  private readonly allEntries = computed<FlatEntry[]>(() => {
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
    nodes: readonly TreeTableNode[],
    depth: number,
    parentKey: string | null,
    expanded: Set<string>,
    result: FlatEntry[],
  ): void {
    const setsize = nodes.length;
    nodes.forEach((node, i) => {
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
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
      if (hasChildren && isExpanded) {
        this.flattenNodes(node.children!, depth + 1, node.key, expanded, result);
      }
    });
  }

  private flattenAllNodes(
    nodes: readonly TreeTableNode[],
    depth: number,
    parentKey: string | null,
    result: FlatEntry[],
  ): void {
    const setsize = nodes.length;
    nodes.forEach((node, i) => {
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
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
      if (hasChildren) {
        this.flattenAllNodes(node.children!, depth + 1, node.key, result);
      }
    });
  }

  protected toggleExpand(key: string): void {
    const current = this.expandedKeys();
    const idx = current.indexOf(key);
    if (idx === -1) {
      this.expandedKeys.set([...current, key]);
    } else {
      this.expandedKeys.set(current.filter((k) => k !== key));
    }
  }

  protected onRowFocus(key: string): void {
    this.rawActiveKey.set(key);
    const index = this.visibleEntries().findIndex((entry) => entry.key === key);
    if (index !== -1) {
      this.navigator.setActiveItem(index);
    }
  }

  protected onRowKeydown(event: KeyboardEvent, entry: FlatEntry): void {
    const entries = this.visibleEntries();
    const idx = entries.findIndex((e) => e.key === entry.key);
    if (idx === -1) return;
    this.navigator.setActiveItem(idx);

    // APG: the arrow that points INTO the tree expands, the one that points
    // back out collapses. In RTL the rows indent the other way, so they swap.
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

    if (this.navigator.onKeydown(event)) {
      event.preventDefault();
      const activeIndex = this.navigator.activeIndex();
      if (activeIndex !== null) {
        const activeEntry = entries[activeIndex];
        if (activeEntry) {
          this.moveFocus(activeEntry.key);
        }
      }
    }
  }

  /** Open a collapsed row, or step onto the first child of an open one. */
  private expandOrDescend(entry: FlatEntry): void {
    if (!entry.hasChildren) return;
    if (!entry.expanded) {
      this.expandedKeys.set([...this.expandedKeys(), entry.key]);
      return;
    }
    const entries = this.visibleEntries();
    const idx = entries.findIndex((e) => e.key === entry.key);
    if (idx < entries.length - 1) this.moveFocus(entries[idx + 1].key);
  }

  /** Close an open row, or step out to the parent of a closed or leaf one. */
  private collapseOrAscend(entry: FlatEntry): void {
    if (entry.hasChildren && entry.expanded) {
      this.expandedKeys.set(this.expandedKeys().filter((k) => k !== entry.key));
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

  protected getFirstColPaddingLeft(depth: number): number {
    return 12 + depth * 20;
  }

  private moveFocus(key: string): void {
    this.rawActiveKey.set(key);
    const nodes = this.elRef.nativeElement.querySelectorAll('[data-key]') as NodeListOf<HTMLElement>;
    const el = Array.from(nodes).find((node) => node.dataset['key'] === key);
    el?.focus();
  }
}
