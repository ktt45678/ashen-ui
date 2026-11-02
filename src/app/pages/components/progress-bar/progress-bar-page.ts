import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProgressBar } from 'ashen-ui/progress-bar';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-progress-bar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [ProgressBar, DocExample, DocApi],
  templateUrl: './progress-bar-page.html',
  styleUrl: './progress-bar-page.scss',
})
export class ProgressBarPage {
  protected readonly value = signal(64);

}
