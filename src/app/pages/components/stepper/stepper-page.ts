import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Stepper, Step } from 'ashen-ui/stepper';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-stepper-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Stepper, Step, DocExample, DocApi],
  templateUrl: './stepper-page.html',
  styleUrl: './stepper-page.scss',
})
export class StepperPage {
  protected readonly activeStep = signal(0);
  protected readonly linearStep = signal(0);

}
