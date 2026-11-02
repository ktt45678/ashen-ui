import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint, FormFieldError } from 'ashen-ui/form-field';
import { InputGroup } from 'ashen-ui/input-group';
import { InputNumber, InputNumberStepper } from 'ashen-ui/input-number';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-number-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [FormField, FormFieldLabel, FormFieldHint, FormFieldError, InputGroup, InputNumber, InputNumberStepper, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './input-number-page.html',
  styleUrl: './input-number-page.scss',
})
export class InputNumberPage {
  protected readonly quantityCtrl = new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(99)]);
  protected readonly ngModelValue = signal<number | null>(null);

}
