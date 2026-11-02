import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from 'ashen-ui/skeleton';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-skeleton-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Skeleton, DocExample, DocApi],
  templateUrl: './skeleton-page.html',
  styleUrl: './skeleton-page.scss',
})
export class SkeletonPage {

}
