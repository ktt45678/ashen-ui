import { Directive } from '@angular/core';

/**
 * Marks content as the form field's leading affix (an icon, a currency symbol,
 * a country code) drawn inside the control's border box.
 *
 * ```html
 * <sn-form-field>
 *   <sn-label>Amount</sn-label>
 *   <sn-icon snPrefix>attach_money</sn-icon>
 *   <input snInputText type="number" />
 * </sn-form-field>
 * ```
 *
 * For a separately-bordered box beside the control (Bootstrap's input-group
 * style) use `sn-input-group` with `sn-input-group-addon` instead. The
 * difference is visual, not functional: an affix shares the control's border,
 * an addon has its own.
 *
 * The control's padding is the wider of the measured affix and
 * `--sn-form-field-affix-width`, so no configuration is needed for wide affixes.
 */
@Directive({
  selector: '[snPrefix]',
  host: { class: 'sn-form-field-affix-content' },
})
export class FormFieldPrefix {}

/**
 * Marks content as the form field's trailing affix (a unit, a clear button, a
 * validation tick) drawn inside the control's border box.
 *
 * ```html
 * <sn-form-field>
 *   <sn-label>Search</sn-label>
 *   <input snInputText />
 *   <sn-icon snSuffix>search</sn-icon>
 * </sn-form-field>
 * ```
 *
 * Affixes don't take pointer events by default, so a click lands on the input
 * underneath, which is what you want for a decorative icon. Interactive content
 * (`button`, `a`, `input`, `select`, `textarea`, or anything with `[tabindex]`)
 * gets them back automatically.
 *
 * See {@link FormFieldPrefix} for how this differs from `sn-input-group-addon`.
 */
@Directive({
  selector: '[snSuffix]',
  host: { class: 'sn-form-field-affix-content' },
})
export class FormFieldSuffix {}
