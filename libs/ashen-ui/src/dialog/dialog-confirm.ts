import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SnIconRegistry, SnConfirmIntl } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { Button } from 'ashen-ui/button';
import type { ButtonColor, ButtonSize, ButtonVariant } from 'ashen-ui/button';
import { SnDialogRef } from './dialog-ref';
import { SN_DIALOG_DATA } from './dialog-config';

export type SnConfirmSeverity = 'primary' | 'error' | 'warning' | 'success';

/** Data payload accepted by `DialogService.confirm`. */
export interface SnConfirmDialogData {
  /** Header title. Defaults to `SnConfirmIntl.header` (`'Confirm'`). */
  header?: string;
  /** Body message. */
  message?: string;
  /**
   * Render the message as HTML, for translated text that carries markup such as `<strong>`.
   * Angular strips scripts and event handlers, but other markup stays, so escape any user
   * value you interpolate into the message. Defaults to plain text.
   */
  html?: boolean;
  /** Leading Material Symbol ligature. Defaults to `'help'`. */
  icon?: string;
  /** Colour of the icon and accept button. Defaults to `'primary'`. */
  severity?: SnConfirmSeverity;
  /** Accept button label. Defaults to `SnIntl.confirmAccept`. */
  acceptLabel?: string;
  /** Reject button label. Defaults to `SnIntl.confirmReject`. */
  rejectLabel?: string;
  /** Variant of the reject button. Defaults to `'outlined'`. */
  rejectVariant?: ButtonVariant;
  /** Size of both buttons. Defaults to the button default. */
  buttonSize?: ButtonSize;
  /** Dialog width, for example `'500px'`. Defaults to the `sm` size. */
  width?: string;
  /** Show the header close button. Defaults to `true`. */
  closable?: boolean;
  /** Block backdrop/Escape dismissal. Defaults to `false`. */
  disableClose?: boolean;
}

/**
 * Built-in confirmation content rendered by `DialogService.confirm`. Closes the
 * dialog with `true` (accept) or `false` (reject).
 *
 * @internal Not part of the public API.
 */
@Component({
  selector: 'sn-dialog-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button],
  templateUrl: './dialog-confirm.html',
})
export class SnDialogConfirm {
  protected readonly icons = inject(SnIconRegistry);

  private readonly ref = inject<SnDialogRef<boolean>>(SnDialogRef);
  protected readonly intl = inject(SnConfirmIntl);
  protected readonly data = inject<SnConfirmDialogData>(SN_DIALOG_DATA) ?? {};

  protected readonly icon = computed(() => this.data.icon ?? this.icons.resolve('help'));
  protected readonly message = computed(() => this.data.message ?? '');
  protected readonly html = computed(() => this.data.html === true);
  protected readonly severity = computed<SnConfirmSeverity>(() => this.data.severity ?? 'primary');

  protected readonly acceptLabel = computed(
    () => this.data.acceptLabel || this.intl.accept,
  );
  protected readonly rejectLabel = computed(
    () => this.data.rejectLabel || this.intl.reject,
  );

  protected readonly rejectVariant = computed<ButtonVariant>(() => this.data.rejectVariant ?? 'outlined');
  protected readonly buttonSize = computed<ButtonSize | undefined>(() => this.data.buttonSize);

  protected readonly acceptColor = computed<ButtonColor>(() => this.severity());

  protected accept(): void {
    this.ref.close(true);
  }

  protected reject(): void {
    this.ref.close(false);
  }
}
