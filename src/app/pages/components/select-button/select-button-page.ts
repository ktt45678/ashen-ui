import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectButton, SelectOption } from 'ashen-ui/select-button';
import { Icon } from 'ashen-ui/icon';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-select-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [SelectButton, SelectOption, Icon, DocExample, ReactiveFormsModule, FormsModule, JsonPipe, DocApi],
  templateUrl: './select-button-page.html',
  styleUrl: './select-button-page.scss',
})
export class SelectButtonPage {
  protected readonly singleValue = signal<unknown>(undefined);
  protected readonly multipleValue = signal<unknown[]>([]);
  protected readonly iconsValue = signal<unknown>('list');
  protected readonly ngModelSingle = signal<unknown>('week');
  protected readonly ngModelMultiple = signal<unknown[]>(['mon']);

  protected readonly formCtrlSingle = new FormControl<unknown>('list');
  protected readonly formCtrlMultiple = new FormControl<unknown[]>(['bold']);

}
