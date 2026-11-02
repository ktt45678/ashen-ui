import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TreeTable } from 'ashen-ui/tree-table';
import type { TreeTableNode } from 'ashen-ui/tree-table';
import { TableColumn } from 'ashen-ui/table';
import { TableCellDef } from 'ashen-ui/table';
import { Tag } from 'ashen-ui/tag';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tree-table-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [TreeTable, TableColumn, TableCellDef, Tag, DocExample, DocApi],
  templateUrl: './tree-table-page.html',
  styleUrl: './tree-table-page.scss',
})
export class TreeTablePage {
  protected readonly fileNodes: TreeTableNode[] = [
    {
      key: 'src',
      icon: 'folder',
      data: { name: 'src', size: '-', modified: '2026-07-14' },
      children: [
        {
          key: 'app',
          icon: 'folder',
          data: { name: 'app', size: '-', modified: '2026-07-14' },
          children: [
            { key: 'app-ts', icon: 'description', data: { name: 'app.ts', size: '2 KB', modified: '2026-07-14' } },
            { key: 'app-routes', icon: 'description', data: { name: 'app.routes.ts', size: '8 KB', modified: '2026-07-12' } },
          ],
        },
        { key: 'main', icon: 'description', data: { name: 'main.ts', size: '320 B', modified: '2026-07-01' } },
        { key: 'styles', icon: 'description', data: { name: 'styles.css', size: '1 KB', modified: '2026-07-10' } },
      ],
    },
    {
      key: 'public',
      icon: 'folder',
      data: { name: 'public', size: '-', modified: '2026-06-15' },
      children: [
        { key: 'favicon', icon: 'image', data: { name: 'favicon.ico', size: '4 KB', modified: '2026-06-15' } },
      ],
    },
    { key: 'angular-json', icon: 'description', data: { name: 'angular.json', size: '12 KB', modified: '2026-06-20' } },
  ];

  protected readonly deployNodes: TreeTableNode[] = [
    {
      key: 'prod',
      icon: 'cloud',
      data: { name: 'production', region: 'us-east-1', status: 'healthy' },
      children: [
        { key: 'api', icon: 'dns', data: { name: 'api-server', region: 'us-east-1', status: 'healthy' } },
        { key: 'db', icon: 'storage', data: { name: 'database', region: 'us-east-1', status: 'degraded' } },
      ],
    },
    {
      key: 'staging',
      icon: 'cloud',
      data: { name: 'staging', region: 'eu-west-1', status: 'healthy' },
      children: [
        { key: 'staging-api', icon: 'dns', data: { name: 'api-server', region: 'eu-west-1', status: 'healthy' } },
      ],
    },
  ];

  protected readonly expandedKeys = signal<readonly string[]>(['src']);

  protected expandAll(): void {
    const keys: string[] = [];
    this.collectKeys(this.fileNodes, keys);
    this.expandedKeys.set(keys);
  }

  protected collapseAll(): void {
    this.expandedKeys.set([]);
  }

  private collectKeys(nodes: readonly TreeTableNode[], result: string[]): void {
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) {
        result.push(n.key);
        this.collectKeys(n.children, result);
      }
    });
  }

}
