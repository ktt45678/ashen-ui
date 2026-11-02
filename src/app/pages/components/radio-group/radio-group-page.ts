import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RadioGroup } from 'ashen-ui/radio-group';
import { Radio } from 'ashen-ui/radio-group';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-radio-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [RadioGroup, Radio, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './radio-group-page.html',
  styleUrl: './radio-group-page.scss',
})
export class RadioGroupPage {
  protected readonly ngModelVal = signal<unknown>('email');
  protected readonly formCtrl = new FormControl<unknown>('email');

}
