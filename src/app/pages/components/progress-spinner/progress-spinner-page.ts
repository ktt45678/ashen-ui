import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinner } from 'ashen-ui/progress-spinner';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-progress-spinner-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ProgressSpinner, DocExample, DocApi],
  templateUrl: './progress-spinner-page.html',
  styleUrl: './progress-spinner-page.scss',
})
export class ProgressSpinnerPage {

}
