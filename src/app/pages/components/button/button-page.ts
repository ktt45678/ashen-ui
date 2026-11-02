import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-button-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Button, DocExample, DocApi],
  templateUrl: './button-page.html',
  styleUrl: './button-page.scss',
})
export class ButtonPage {

}
