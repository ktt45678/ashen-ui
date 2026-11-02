import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Splitter, SplitterPanel } from 'ashen-ui/splitter';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-splitter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Splitter, SplitterPanel, DocExample, DocApi],
  templateUrl: './splitter-page.html',
  styleUrl: './splitter-page.scss',
})
export class SplitterPage {
  protected readonly controlledSize = signal(40);

}
