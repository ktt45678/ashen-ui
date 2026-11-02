import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Select } from 'ashen-ui/select';
import { ListOption } from 'ashen-ui/listbox';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { IconTemplate } from 'ashen-ui/core';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Select, ListOption, FormField, FormFieldLabel, FormFieldHint, IconTemplate, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './select-page.html',
  styleUrl: './select-page.scss',
})
export class SelectPage {
  protected readonly basicValue = signal<unknown>(null);
  protected readonly checkmarkValue = signal<unknown>('angular');
  protected readonly ngModelValue = signal<unknown>(null);
  protected readonly formFieldValue = signal<unknown>(null);
  protected readonly preselectedValue = signal<unknown>('angular');
  protected readonly clearableValue = signal<unknown>('angular');

  protected readonly formCtrl = new FormControl<unknown>(null);

  protected readonly frameworks = [
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'SolidJS', value: 'solid' },
  ];

  protected readonly sizes = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

}
