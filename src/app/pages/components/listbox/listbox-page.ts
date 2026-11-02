import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Listbox, ListOption } from 'ashen-ui/listbox';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-listbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Listbox, ListOption, Icon, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './listbox-page.html',
  styleUrl: './listbox-page.scss',
})
export class ListboxPage {
  protected readonly singleValue = signal<unknown>(null);
  protected readonly checkmarkValue = signal<unknown>(null);
  protected readonly multipleValue = signal<unknown[]>([]);
  protected readonly iconsValue = signal<unknown>(null);
  protected readonly ngModelValue = signal<unknown>('streams');
  protected readonly disabledValue = signal<unknown>('option1');

  protected readonly formCtrl = new FormControl<unknown>('react');

  protected readonly options = ['Main', 'Streaming', 'Empty'];
  protected readonly widgets = [
    { label: 'Sales', value: 'sales' },
    { label: 'Revenue', value: 'revenue' },
    { label: 'Orders', value: 'orders' },
    { label: 'Customers', value: 'customers' },
  ];
  protected readonly iconOptions = [
    { label: 'View List', value: 'list', icon: 'view_list' },
    { label: 'Grid View', value: 'grid', icon: 'grid_view' },
    { label: 'Table Chart', value: 'table', icon: 'table_chart' },
    { label: 'Map (disabled)', value: 'map', icon: 'map', disabled: true },
  ];
  protected readonly frameworks = ['React', 'Angular', 'Vue', 'Svelte'];

}
