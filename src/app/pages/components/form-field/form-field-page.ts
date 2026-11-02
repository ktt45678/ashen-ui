import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FormField,
  FormFieldLabel,
  FormFieldHint,
  FormFieldError,
  FormFieldPrefix,
  FormFieldSuffix,
} from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-form-field-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, FormFieldPrefix, FormFieldSuffix, Icon, InputText, DocExample, FormsModule, ReactiveFormsModule, DocApi],
  templateUrl: './form-field-page.html',
  styleUrl: './form-field-page.scss',
})
export class FormFieldPage {
  protected readonly username = signal('');
  protected readonly touched = signal(false);
  protected readonly floatName = signal('');
  protected readonly invalidFloatName = signal('');
  protected readonly showSubError = signal(false);
  protected readonly autoCtrl = new FormControl('', Validators.required);

  // The label and its indicator are parts inside sn-label, so a page stylesheet
  // cannot reach them: Angular scopes it to this component's own elements.
  protected readonly labelSkin = {
    root: { '--sn-form-field-label-color': 'var(--sn-color-primary)' },
    requiredIndicator: { '--sn-form-field-required-color': 'var(--sn-color-warning)' },
  };

}
