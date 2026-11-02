import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MultiSelect } from 'ashen-ui/multi-select';
import { ListOption } from 'ashen-ui/listbox';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-multi-select-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [MultiSelect, ListOption, FormField, FormFieldLabel, FormFieldHint, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './multi-select-page.html',
  styleUrl: './multi-select-page.scss',
})
export class MultiSelectPage {
  protected readonly basicValue = signal<unknown[]>([]);
  protected readonly manyValue = signal<unknown[]>(['clock', 'weather', 'stats', 'media', 'network']);
  protected readonly formFieldValue = signal<unknown[]>([]);
  protected readonly disabledValue = signal<unknown[]>(['angular']);

  protected readonly formCtrl = new FormControl<unknown[]>([]);

  protected readonly widgets = [
    { label: 'Clock', value: 'clock' },
    { label: 'Weather', value: 'weather' },
    { label: 'Stats', value: 'stats' },
    { label: 'Media', value: 'media' },
    { label: 'Network', value: 'network' },
  ];

  protected readonly frameworks = [
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
    { label: 'SolidJS', value: 'solid' },
  ];

}
