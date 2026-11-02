import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge } from 'ashen-ui/badge';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-badge-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Badge, Button, DocExample, DocApi],
  templateUrl: './badge-page.html',
  styleUrl: './badge-page.scss',
})
export class BadgePage {

}
