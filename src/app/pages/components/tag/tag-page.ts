import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tag } from 'ashen-ui/tag';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-tag-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Tag, DocExample, DocApi],
  templateUrl: './tag-page.html',
  styleUrl: './tag-page.scss',
})
export class TagPage {

}
