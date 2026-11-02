import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Toggle } from 'ashen-ui/toggle';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-toggle-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Toggle, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './toggle-page.html',
  styleUrl: './toggle-page.scss',
})
export class TogglePage {
  protected readonly zoomEffect = signal(true);
  protected readonly ngModelVal = signal(false);
  protected readonly formCtrl = new FormControl(false);

}
