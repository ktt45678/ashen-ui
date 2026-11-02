import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToggleButton } from 'ashen-ui/toggle-button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-toggle-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ToggleButton, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './toggle-button-page.html',
  styleUrl: './toggle-button-page.scss',
})
export class ToggleButtonPage {
  protected readonly muted = signal(false);
  protected readonly ngModelVal = signal(false);
  protected readonly formCtrl = new FormControl(false);

}
