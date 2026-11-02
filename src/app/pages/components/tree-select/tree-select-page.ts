import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeSelect } from 'ashen-ui/tree-select';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';
import type { TreeNode } from 'ashen-ui/tree';

@Component({
  selector: 'app-tree-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [TreeSelect, FormField, FormFieldLabel, FormFieldHint, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './tree-select-page.html',
  styleUrl: './tree-select-page.scss',
})
export class TreeSelectPage {
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
            { key: 'app.ts', label: 'app.ts', icon: 'description' },
            { key: 'app.html', label: 'app.html', icon: 'description' },
          ],
        },
        { key: 'main.ts', label: 'main.ts', icon: 'description' },
        { key: 'styles.css', label: 'styles.css', icon: 'description' },
      ],
    },
    {
      key: 'public',
      label: 'public',
      icon: 'folder',
      children: [
        { key: 'favicon.ico', label: 'favicon.ico', icon: 'image' },
      ],
    },
    { key: 'package.json', label: 'package.json', icon: 'data_object' },
    { key: 'tsconfig.json', label: 'tsconfig.json', icon: 'settings' },
  ];

  protected readonly basicValue = signal<string | null>(null);
  protected readonly formFieldValue = signal<string | null>(null);
  protected readonly disabledValue = signal<string | null>('main.ts');

  protected readonly preExpandedValue = signal<string | null>(null);
  protected readonly preExpandedKeys = signal<readonly string[]>(['src', 'app']);

  protected readonly formCtrl = new FormControl<string | null>(null);

}
