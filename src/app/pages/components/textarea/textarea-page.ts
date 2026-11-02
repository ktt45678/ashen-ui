import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint, FormFieldError } from 'ashen-ui/form-field';
import { Textarea } from 'ashen-ui/textarea';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-textarea-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    FormField,
    FormFieldLabel,
    FormFieldHint,
    FormFieldError,
    Textarea,
    DocExample,
    ReactiveFormsModule,
    FormsModule, DocApi],
  templateUrl: './textarea-page.html',
  styleUrl: './textarea-page.scss',
})
export class TextareaPage {
  protected readonly notesCtrl = new FormControl('', Validators.required);
  protected readonly description = signal('');
  protected readonly touched = signal(false);

}
