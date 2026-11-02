import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Tree } from 'ashen-ui/tree';
import type { TreeNode } from 'ashen-ui/tree';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tree-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Tree, DocExample, DocApi],
  templateUrl: './tree-page.html',
  styleUrl: './tree-page.scss',
})
export class TreePage {
  protected readonly fileTree: TreeNode[] = [
    {
      key: 'src',
      label: 'src',
      icon: 'folder',
      children: [
        {
          key: 'app',
          label: 'app',
          icon: 'folder',
          children: [
            { key: 'app-ts', label: 'app.ts', icon: 'description' },
            { key: 'app-routes', label: 'app.routes.ts', icon: 'description' },
          ],
        },
        { key: 'main', label: 'main.ts', icon: 'description' },
        { key: 'styles', label: 'styles.css', icon: 'description' },
      ],
    },
    {
      key: 'public',
      label: 'public',
      icon: 'folder',
      children: [
        { key: 'favicon', label: 'favicon.ico', icon: 'image' },
      ],
    },
    { key: 'angular-json', label: 'angular.json', icon: 'description' },
  ];

  protected readonly selectedKey = signal<string | null>(null);
  protected readonly lastSelectedLabel = signal<string>('');

  protected readonly expandedKeys = signal<readonly string[]>(['src']);

  protected onNodeSelect(event: { key: string; node: TreeNode }): void {
    this.lastSelectedLabel.set(event.node.label);
  }

  protected expandAll(): void {
    const keys: string[] = [];
    this.collectKeys(this.fileTree, keys);
    this.expandedKeys.set(keys);
  }

  protected collapseAll(): void {
    this.expandedKeys.set([]);
  }

  private collectKeys(nodes: readonly TreeNode[], result: string[]): void {
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) {
        result.push(n.key);
        this.collectKeys(n.children, result);
      }
    });
  }

}
