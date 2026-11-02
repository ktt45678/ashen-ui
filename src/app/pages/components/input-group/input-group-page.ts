import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldError } from 'ashen-ui/form-field';
import { InputText } from 'ashen-ui/input-text';
import { InputGroup, InputGroupAddon } from 'ashen-ui/input-group';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-input-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    FormField, FormFieldLabel, FormFieldError,
    InputText, InputGroup, InputGroupAddon, Button,
    DocExample, ReactiveFormsModule, DocApi],
  templateUrl: './input-group-page.html',
  styleUrl: './input-group-page.scss',
})
export class InputGroupPage {
  protected readonly urlCtrl = new FormControl('', [Validators.required]);

}
