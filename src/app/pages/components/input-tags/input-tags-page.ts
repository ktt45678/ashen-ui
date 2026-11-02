import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { InputTags } from 'ashen-ui/input-tags';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-tags-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [FormField, FormFieldLabel, FormFieldHint, InputTags, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './input-tags-page.html',
  styleUrl: './input-tags-page.scss',
})
export class InputTagsPage {
  protected readonly presetTags = signal(['angular', 'typescript', 'rxjs']);
  protected readonly ngModelTags = signal<string[]>([]);
  protected readonly tagsCtrl = new FormControl<string[]>([]);

}
