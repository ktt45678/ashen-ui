import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  output,
  signal,
  viewChild,
  forwardRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Icon } from 'ashen-ui/icon';
import { Button } from 'ashen-ui/button';
import type { ButtonColor } from 'ashen-ui/button';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnPartSource,
  type SnStyle,
} from 'ashen-ui/core';
export type ConfirmPopupSeverity = 'primary' | 'error' | 'warning' | 'success';
export type ConfirmPopupPanelVisibility = 'visible' | 'hiding' | 'hidden';

const CONFIRM_POPUP_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  panel: ['id', 'role', 'aria-describedby'],
};

@Component({
  selector: 'sn-confirm-popup-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button, SnPart],
  templateUrl: './confirm-popup-panel.html',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => ConfirmPopupPanel) }],
  host: {
    class: 'sn-confirm-popup-container',
    '[class.sn-confirm-popup-visible]': 'visibility() === "visible"',
    '[class.sn-confirm-popup-hiding]': 'visibility() === "hiding"',
    '[attr.data-sn-open]': 'visibility() === "visible" ? "" : null',
    '[attr.data-sn-hiding]': 'visibility() === "hiding" ? "" : null',
  },
})
export class ConfirmPopupPanel implements SnPartSource {
  readonly panelId = signal('');
  readonly messageId = signal('');
  readonly message = signal('');
  readonly icon = signal('help');
  readonly severity = signal<ConfirmPopupSeverity>('primary');
  readonly effectiveAcceptLabel = signal('Yes');
  readonly effectiveRejectLabel = signal('Cancel');
  readonly visibility = signal<ConfirmPopupPanelVisibility>('hidden');
  readonly panelAnimation = signal<string | null>(null);

  readonly snStyle = signal<SnStyle | undefined>(undefined);
  readonly snAttrs = signal<SnAttrs | undefined>(undefined);

  readonly reservedAttrs = (section: string): readonly string[] =>
    CONFIRM_POPUP_RESERVED_ATTRS[section] ?? [];

  readonly acceptClicked = output<void>();
  readonly rejectClicked = output<void>();

  protected readonly acceptColor = computed<ButtonColor>(() => {
    const s = this.severity();
    if (s === 'primary' || s === 'error' || s === 'warning' || s === 'success') return s;
    return 'primary';
  });

  private readonly _rejectBtnRef = viewChild('rejectBtn', { read: ElementRef });
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  focusRejectButton(): void {
    if (!this._isBrowser) return;
    const el = this._rejectBtnRef()?.nativeElement;
    if (el) {
      el.focus();
    }
  }

  protected onAccept(): void {
    this.acceptClicked.emit();
  }

  protected onReject(): void {
    this.rejectClicked.emit();
  }
}
