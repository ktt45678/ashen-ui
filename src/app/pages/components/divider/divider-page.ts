import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from 'ashen-ui/button';
import { Divider } from 'ashen-ui/divider';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-divider-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Button, Divider, DocExample, DocApi],
  templateUrl: './divider-page.html',
  styleUrl: './divider-page.scss',
})
export class DividerPage {

}
