import { Injectable } from '@angular/core';

/**
 * Text and locale for `sn-date-picker`.
 *
 * The month and weekday arrays are the reason this is a service rather than a
 * set of inputs. `provideSnIntlLocale()` derives them from
 * `Intl.DateTimeFormat` so a calendar can be localised without hand-writing
 * them.
 */
@Injectable({ providedIn: 'root' })
export class SnDatePickerIntl {
  /**
   * BCP-47 locale used for locale-aware date formatting (the trigger label).
   * `undefined` uses the runtime default. Set by `provideSnIntlLocale`.
   */
  locale: string | undefined = undefined;
  placeholder = 'Select date';
  /** Fallback `aria-label` of the trigger. */
  label = 'Choose date';
  previous = 'Previous';
  next = 'Next';
  chooseMonth = 'Choose month';
  chooseYear = 'Choose year';
  months: readonly string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  monthsShort: readonly string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  /**
   * Always Sunday-first, whatever the locale's week starts on. The calendar
   * rotates them by {@link firstDayOfWeek}, so this stays indexable by
   * `Date.prototype.getDay()`.
   */
  weekdaysShort: readonly string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  /**
   * The day a calendar week starts on, `0` for Sunday through `6` for Saturday.
   * `provideSnIntlLocale()` derives it; most of the world is not Sunday.
   */
  firstDayOfWeek = 0;
}

/** Text for `sn-color-picker` and its sub-components. */
@Injectable({ providedIn: 'root' })
export class SnColorPickerIntl {
  /** `aria-label` of the swatch trigger. */
  open = 'Open color picker';
  /** `aria-label` of the saturation/brightness area. */
  area = 'Saturation and brightness';
  /** `aria-valuetext` of the area; both arguments are percentages. */
  areaValueText(saturation: number, brightness: number): string {
    return `Saturation ${saturation}%, Brightness ${brightness}%`;
  }
  sliderHue = 'Hue';
  sliderAlpha = 'Alpha';
  sliderBrightness = 'Brightness';
  sliderSaturation = 'Saturation';
  eyeDropper = 'Pick color from screen';
  inputHex = 'Hex color';
  inputRed = 'Red';
  inputGreen = 'Green';
  inputBlue = 'Blue';
}
