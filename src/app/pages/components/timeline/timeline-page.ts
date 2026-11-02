import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Timeline } from 'ashen-ui/timeline';
import { TimelineItem } from 'ashen-ui/timeline';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-timeline-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Timeline, TimelineItem, DocExample, DocApi],
  templateUrl: './timeline-page.html',
  styleUrl: './timeline-page.scss',
})
export class TimelinePage {

}
