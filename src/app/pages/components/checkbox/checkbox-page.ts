import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Checkbox } from 'ashen-ui/checkbox';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-checkbox-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Checkbox, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './checkbox-page.html',
  styleUrl: './checkbox-page.scss',
})
export class CheckboxPage {
  protected readonly showLabel = signal(true);
  protected readonly ngModelVal = signal(false);
  protected readonly formCtrl = new FormControl(false);

}
