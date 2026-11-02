import { Injectable, inject } from '@angular/core';
import { SnCommonIntl } from './intl/sn-intl-common';
import {
  SnChipIntl,
  SnInputTagsIntl,
  SnListboxIntl,
  SnPasswordIntl,
  SnSelectIntl,
} from './intl/sn-intl-forms';
import {
  SnConfirmIntl,
  SnDialogIntl,
  SnDrawerIntl,
  SnMessageIntl,
  SnToastIntl,
} from './intl/sn-intl-overlays';
import {
  SnBreadcrumbIntl,
  SnPaginatorIntl,
  SnPanelIntl,
  SnSplitButtonIntl,
  SnSplitterIntl,
} from './intl/sn-intl-navigation';
import { SnCarouselIntl, SnTreeIntl } from './intl/sn-intl-data';
import { SnColorPickerIntl, SnDatePickerIntl } from './intl/sn-intl-pickers';
import type { SnIntlFlat } from './intl/sn-intl-registry';

export * from './intl/sn-intl-common';
export * from './intl/sn-intl-forms';
export * from './intl/sn-intl-overlays';
export * from './intl/sn-intl-navigation';
export * from './intl/sn-intl-data';
export * from './intl/sn-intl-display';
export * from './intl/sn-intl-pickers';
export * from './intl/sn-intl-registry';

/**
 * The flat text object: one class carrying all keys.
 *
 * It is a read-only façade over the per-component services, so
 * `provideSnIntl()` overrides, in either shape, are still visible through it.
 * No component in the library injects it.
 *
 * @deprecated Inject the service for the component you care about instead:
 * `SnPaginatorIntl`, `SnDatePickerIntl`, `SnCommonIntl`, … Overriding this
 * class directly (`{ provide: SnIntl, useClass: … }`) does not affect any
 * component, because nothing reads it; use `provideSnIntl()` instead. This
 * class will be removed.
 */
@Injectable({ providedIn: 'root' })
export class SnIntl implements SnIntlFlat {
  private readonly _common = inject(SnCommonIntl);
  private readonly _select = inject(SnSelectIntl);
  private readonly _listbox = inject(SnListboxIntl);
  private readonly _password = inject(SnPasswordIntl);
  private readonly _inputTags = inject(SnInputTagsIntl);
  private readonly _chip = inject(SnChipIntl);
  private readonly _dialog = inject(SnDialogIntl);
  private readonly _drawer = inject(SnDrawerIntl);
  private readonly _confirm = inject(SnConfirmIntl);
  private readonly _message = inject(SnMessageIntl);
  private readonly _toast = inject(SnToastIntl);
  private readonly _breadcrumb = inject(SnBreadcrumbIntl);
  private readonly _paginator = inject(SnPaginatorIntl);
  private readonly _splitButton = inject(SnSplitButtonIntl);
  private readonly _panel = inject(SnPanelIntl);
  private readonly _splitter = inject(SnSplitterIntl);
  private readonly _tree = inject(SnTreeIntl);
  private readonly _carousel = inject(SnCarouselIntl);
  private readonly _datePicker = inject(SnDatePickerIntl);
  private readonly _colorPicker = inject(SnColorPickerIntl);

  removeChip(label: string): string { return this._chip.remove(label); }

  get close(): string { return this._common.close; }
  get next(): string { return this._common.next; }
  get previous(): string { return this._common.previous; }
  get loading(): string { return this._common.loading; }
  get emptyMessage(): string { return this._common.emptyMessage; }

  get dialogClose(): string { return this._dialog.close; }
  get drawerClose(): string { return this._drawer.close; }
  get messageClose(): string { return this._message.close; }
  get toastClose(): string { return this._toast.close; }
  get confirmAccept(): string { return this._confirm.accept; }
  get confirmReject(): string { return this._confirm.reject; }

  get selectPlaceholder(): string { return this._select.placeholder; }
  get selectClear(): string { return this._select.clear; }
  get listboxLabel(): string { return this._listbox.label; }
  get addTag(): string { return this._inputTags.addTag; }

  get showPassword(): string { return this._password.show; }
  get hidePassword(): string { return this._password.hide; }
  get passwordPlaceholder(): string { return this._password.placeholder; }
  get passwordStrengthWeak(): string { return this._password.strengthWeak; }
  get passwordStrengthFair(): string { return this._password.strengthFair; }
  get passwordStrengthGood(): string { return this._password.strengthGood; }
  get passwordStrengthStrong(): string { return this._password.strengthStrong; }

  get panelExpand(): string { return this._panel.expand; }
  get panelCollapse(): string { return this._panel.collapse; }
  get splitterResize(): string { return this._splitter.resize; }
  get splitButtonMore(): string { return this._splitButton.more; }
  get breadcrumb(): string { return this._breadcrumb.label; }

  get paginator(): string { return this._paginator.label; }
  get paginatorFirst(): string { return this._paginator.first; }
  get paginatorPrev(): string { return this._paginator.previous; }
  get paginatorNext(): string { return this._paginator.next; }
  get paginatorLast(): string { return this._paginator.last; }
  get paginatorJump(): string { return this._paginator.jump; }
  get paginatorRowsPerPage(): string { return this._paginator.rowsPerPage; }
  paginatorReport(first: number, last: number, total: number): string {
    return this._paginator.report(first, last, total);
  }

  get carouselLabel(): string { return this._carousel.label; }
  get carouselPrev(): string { return this._carousel.previous; }
  get carouselNext(): string { return this._carousel.next; }
  carouselSlide(index: number, total: number): string { return this._carousel.slide(index, total); }
  carouselGoto(index: number): string { return this._carousel.goto(index); }

  get treeLabel(): string { return this._tree.label; }
  get treeExpand(): string { return this._tree.expand; }
  get treeCollapse(): string { return this._tree.collapse; }
  get treeTableLabel(): string { return this._tree.tableLabel; }

  get locale(): string | undefined { return this._datePicker.locale; }
  get datePickerPlaceholder(): string { return this._datePicker.placeholder; }
  get datePickerLabel(): string { return this._datePicker.label; }
  get datePickerPrev(): string { return this._datePicker.previous; }
  get datePickerNext(): string { return this._datePicker.next; }
  get datePickerChooseMonth(): string { return this._datePicker.chooseMonth; }
  get datePickerChooseYear(): string { return this._datePicker.chooseYear; }
  get datePickerMonths(): readonly string[] { return this._datePicker.months; }
  get datePickerMonthsShort(): readonly string[] { return this._datePicker.monthsShort; }
  get datePickerWeekdaysShort(): readonly string[] { return this._datePicker.weekdaysShort; }
  get datePickerFirstDayOfWeek(): number { return this._datePicker.firstDayOfWeek; }

  get colorPickerOpen(): string { return this._colorPicker.open; }
  get colorArea(): string { return this._colorPicker.area; }
  colorAreaValueText(saturation: number, brightness: number): string {
    return this._colorPicker.areaValueText(saturation, brightness);
  }
  get colorSliderHue(): string { return this._colorPicker.sliderHue; }
  get colorSliderAlpha(): string { return this._colorPicker.sliderAlpha; }
  get colorSliderBrightness(): string { return this._colorPicker.sliderBrightness; }
  get colorSliderSaturation(): string { return this._colorPicker.sliderSaturation; }
  get colorEyeDropper(): string { return this._colorPicker.eyeDropper; }
  get colorInputHex(): string { return this._colorPicker.inputHex; }
  get colorInputRed(): string { return this._colorPicker.inputRed; }
  get colorInputGreen(): string { return this._colorPicker.inputGreen; }
  get colorInputBlue(): string { return this._colorPicker.inputBlue; }
}
