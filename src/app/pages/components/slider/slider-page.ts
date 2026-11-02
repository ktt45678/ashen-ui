import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { Slider } from 'ashen-ui/slider';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-slider-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [FormField, FormFieldLabel, FormFieldHint, Slider, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './slider-page.html',
  styleUrl: './slider-page.scss',
})
export class SliderPage {
  protected readonly basicValue = signal(40);
  protected readonly pctValue = signal(40);
  protected readonly customValue = signal(50);
  protected readonly verticalValue = signal(60);
  protected readonly ngModelValue = signal(30);
  protected readonly reactiveCtrl = new FormControl<number>(60);
  protected readonly formFieldCtrl = new FormControl<number>(70);
  protected readonly formatPct = (v: number) => v + '%';
  protected readonly formatCurrency = (v: number) => '$' + v.toFixed(2);

}
