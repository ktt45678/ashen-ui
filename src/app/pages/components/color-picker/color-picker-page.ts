import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  ColorPicker,
  ColorArea,
  ColorSlider,
  ColorInput,
  ColorEyeDropper,
} from 'ashen-ui/color-picker';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-color-picker-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [
    ColorPicker,
    ColorArea,
    ColorSlider,
    ColorInput,
    ColorEyeDropper,
    DocExample,
    ReactiveFormsModule,
    FormsModule, DocApi],
  templateUrl: './color-picker-page.html',
  styleUrl: './color-picker-page.scss',
})
export class ColorPickerPage {
  protected readonly basicValue = signal('#3399e6');
  protected readonly alphaValue = signal('#3399e680');
  protected readonly popoverValue = signal('#ff6600');
  protected readonly customValue = signal('#22c55e');
  protected readonly disabledValue = signal('#888888');
  protected readonly formCtrl = new FormControl<string>('#7c3aed');

}
