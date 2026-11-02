import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeterGroup, Meter } from 'ashen-ui/meter-group';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-meter-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [MeterGroup, Meter, DocExample, DocApi],
  templateUrl: './meter-group-page.html',
  styleUrl: './meter-group-page.scss',
})
export class MeterGroupPage {

}
