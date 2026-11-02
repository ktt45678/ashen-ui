import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint, FormFieldError } from 'ashen-ui/form-field';
import { InputPassword } from 'ashen-ui/input-password';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    FormField,
    FormFieldLabel,
    FormFieldHint,
    FormFieldError,
    InputPassword,
    DocExample,
    ReactiveFormsModule,
    FormsModule, DocApi],
  templateUrl: './input-password-page.html',
  styleUrl: './input-password-page.scss',
})
export class InputPasswordPage {
  protected readonly passwordCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  protected readonly ngModelValue = signal('');

  // The radius belongs to the inner input, which a page stylesheet cannot reach.
  protected readonly inputSkin = { input: { '--sn-input-text-border-radius': '9999px' } };

}
