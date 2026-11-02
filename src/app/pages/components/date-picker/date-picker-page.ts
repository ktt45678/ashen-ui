import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePicker } from 'ashen-ui/date-picker';
import { FormField, FormFieldLabel, FormFieldHint } from 'ashen-ui/form-field';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-date-picker-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [DatePicker, FormField, FormFieldLabel, FormFieldHint, DocExample, ReactiveFormsModule, FormsModule, DocApi],
  templateUrl: './date-picker-page.html',
  styleUrl: './date-picker-page.scss',
})
export class DatePickerPage {
  protected readonly basicValue = signal<Date | null>(null);
  protected readonly formFieldValue = signal<Date | null>(null);
  protected readonly disabledValue = signal<Date | null>(new Date(2026, 0, 15));
  protected readonly customFormatValue = signal<Date | null>(null);
  protected readonly formCtrl = new FormControl<Date | null>(null);

  /** A week either side of today, so the demo boundary is always visible. */
  protected readonly rangeMin = this.addDays(new Date(), -7);
  protected readonly rangeMax = this.addDays(new Date(), 7);
  protected readonly rangeValue = signal<Date | null>(null);

  private addDays(from: Date, days: number): Date {
    const d = new Date(from);
    d.setDate(d.getDate() + days);
    return d;
  }

  protected readonly isoFormat = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

}
