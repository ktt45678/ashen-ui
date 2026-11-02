import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint, FormFieldError } from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-text-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, InputText, DocExample, ReactiveFormsModule, DocApi],
  templateUrl: './input-text-page.html',
  styleUrl: './input-text-page.scss',
})
export class InputTextPage {
  protected readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);

}
