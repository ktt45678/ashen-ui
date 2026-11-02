import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  forwardRef,
} from '@angular/core';
import {
  SnIconRegistry,
  SnConfirmIntl,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
} from 'ashen-ui/core';
import { Dialog } from 'ashen-ui/dialog';
import { DialogFooter } from 'ashen-ui/dialog';
import { Icon } from 'ashen-ui/icon';
import { Button } from 'ashen-ui/button';
import type { ButtonColor } from 'ashen-ui/button';

export type ConfirmDialogSeverity = 'primary' | 'error' | 'warning' | 'success';

// Icon and message are the only parts this wrapper owns; neither carries a library attr.
const CONFIRM_DIALOG_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {};

@Component({
  selector: 'sn-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog, DialogFooter, Icon, Button, SnPart],
  templateUrl: './confirm-dialog.html',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ConfirmDialog) }],
  host: {
    class: 'sn-confirm-dialog',
  },
})
export class ConfirmDialog implements SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly open = model(false);
  readonly header = input<string | undefined>(undefined);
  readonly message = input('');
  readonly icon = input<string>();
  protected readonly effectiveIcon = computed(() => this.icon() ?? this.icons.resolve('help'));
  readonly severity = input<ConfirmDialogSeverity>('primary');
  readonly acceptLabel = input('');
  readonly rejectLabel = input('');
  readonly animated = input(true, { transform: booleanAttribute });
  readonly animation = input<SnShowHideAnimation | undefined>(undefined);

  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CONFIRM_DIALOG_RESERVED_ATTRS[section] ?? [];

  readonly accept = output<void>();
  readonly reject = output<void>();

  protected readonly _intl = inject(SnConfirmIntl);

  protected readonly _effectiveHeader = computed(() => this.header() ?? this._intl.header);

  protected readonly _effectiveAcceptLabel = computed(
    () => this.acceptLabel() || this._intl.accept,
  );

  protected readonly _effectiveRejectLabel = computed(
    () => this.rejectLabel() || this._intl.reject,
  );

  protected readonly _acceptColor = computed<ButtonColor>(() => {
    const s = this.severity();
    if (s === 'primary' || s === 'error' || s === 'warning' || s === 'success') return s;
    return 'primary';
  });

  /** Prevents reject from being emitted twice when we programmatically close. */
  private _actionTaken = false;

  constructor() {
    effect(() => {
      if (this.open()) {
        this._actionTaken = false;
      }
    });
  }

  protected onDialogOpenChange(isOpen: boolean): void {
    if (!isOpen && !this._actionTaken) {
      this._actionTaken = true;
      this.reject.emit();
      this.open.set(false);
    }
  }

  protected onAccept(): void {
    if (this._actionTaken) return;
    this._actionTaken = true;
    this.accept.emit();
    this.open.set(false);
  }

  protected onReject(): void {
    if (this._actionTaken) return;
    this._actionTaken = true;
    this.reject.emit();
    this.open.set(false);
  }
}
