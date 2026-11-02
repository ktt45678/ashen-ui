import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import type { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import {
  SnIconRegistry,
  ScrollLock,
  SN_PART_SOURCE,
  SnPart,
  snAnimated,
  snAfterExitAnimation,
  snDefault,
  snDefaults,
  SnDialogIntl,
  ModalStack,
  snNextId,
  type SnAttrs,
  type SnPartSource,
  type SnShowHideAnimation,
  type SnStyle,
} from 'ashen-ui/core';
import { SN_DIALOG_DEFAULTS } from './dialog-defaults';
import { DialogFooter } from './dialog-footer';
import { DialogTitle } from './dialog-title';
import { Icon } from 'ashen-ui/icon';

export type DialogSize = 'sm' | 'md' | 'lg';

const DIALOG_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['data-sn-open', 'data-sn-hiding'],
  panel: ['id', 'role', 'aria-modal', 'aria-labelledby'],
  title: ['id'],
  close: ['type', 'aria-label'],
};

@Component({
  selector: 'sn-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './dialog.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Dialog) }],
  host: {
    class: 'sn-dialog',
    '[attr.data-sn-open]': '_visibility() === "visible" ? "" : null',
    '[attr.data-sn-hiding]': '_visibility() === "hiding" ? "" : null',
  },
})
export class Dialog implements OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly open = model(false);
  readonly title = input('');
  readonly size = input<DialogSize>(snDefault(SN_DIALOG_DEFAULTS, 'size', 'md'));
  readonly closeLabel = input('');
  readonly snClass = input('');
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();
  readonly animated = input(true, { transform: booleanAttribute });
  /**
   * `animated` AND-ed with the app-wide motion setting. Read this, never
   * `animated()` directly, or SN_ANIMATIONS_DISABLED and prefers-reduced-motion
   * cannot skip the exit animation.
   */
  readonly _animated = snAnimated(this.animated);
  readonly animation = input<SnShowHideAnimation | undefined>(
    snDefaults(SN_DIALOG_DEFAULTS)?.animation,
  );

  readonly _footerDir = contentChild(DialogFooter);
  readonly _titleDir = contentChild(DialogTitle);

  readonly _visibility = signal<'visible' | 'hiding' | 'hidden'>('hidden');

  readonly reservedAttrs = (section: string): readonly string[] =>
    DIALOG_RESERVED_ATTRS[section] ?? [];

  readonly _panelAnimation = computed(() => {
    if (!this._animated()) return 'none';
    const custom = this.animation();
    return (this._visibility() === 'hiding' ? custom?.exit : custom?.enter) ?? null;
  });

  readonly _maskAnimation = computed(() => (this._animated() ? null : 'none'));

  private readonly _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _renderer = inject(Renderer2);
  private readonly _injector = inject(Injector);
  private readonly _host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _scrollLock = inject(ScrollLock);
  private readonly _modalStack = inject(ModalStack);
  readonly _intl = inject(SnDialogIntl);

  readonly _panelId = snNextId('sn-dialog');
  readonly _titleId = snNextId('sn-dialog-title');

  private _cancelExit: (() => void) | null = null;
  private _isClosing = false;
  /** True while the overlay is active (scroll locked + key listener attached). */
  private _active = false;
  private _previousFocus: HTMLElement | null = null;
  private _focusTrap: ConfigurableFocusTrap | null = null;
  private _unlistenKeydown: (() => void) | null = null;

  constructor() {
    afterNextRender(() => {
      if (this.open()) {
        this._activate();
      }
    });

    effect(() => {
      const isOpen = this.open();
      if (!isOpen && this._visibility() !== 'hidden' && !this._isClosing) {
        this._startClose();
      } else if (isOpen && this._visibility() === 'hidden' && !this._isClosing) {
        this._activate();
      }
    });
  }

  requestClose(): void {
    if (!this.open() || this._isClosing) return;
    this.open.set(false);
  }

  private _activate(): void {
    if (!this._isBrowser) return;
    if (this._isClosing) {
      this._cancelClose();
      return;
    }
    if (this._active) return;
    this._active = true;

    this._previousFocus = document.activeElement as HTMLElement | null;
    this._visibility.set('visible');
    this.open.set(true);

    this._scrollLock.lock();
    this._modalStack.push(this);
    this._unlistenKeydown = this._renderer.listen(
      'document',
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && !event.defaultPrevented && this._modalStack.isTop(this)) {
          event.preventDefault();
          this.requestClose();
        }
      },
    );

    setTimeout(() => this._initFocusTrap(), 0);
  }

  private _initFocusTrap(): void {
    if (!this._isBrowser || !this._active) return;
    const panelEl = document.getElementById(this._panelId);
    if (!panelEl) return;
    this._focusTrap = this._focusTrapFactory.create(panelEl);
    this._focusTrap.focusFirstTabbableElement();
  }

  private _startClose(): void {
    if (this._isClosing) return;
    this._isClosing = true;

    this._focusTrap?.destroy();
    this._focusTrap = null;
    this._visibility.set('hiding');

    this._cancelExit = snAfterExitAnimation(this._injector, () => this._host, () => {
      this._cancelExit = null;
      this._visibility.set('hidden');
      this._isClosing = false;
      this._teardown();
      this._restoreFocus();
    });
  }

  private _cancelClose(): void {
    this._cancelExit?.();
    this._cancelExit = null;
    this._isClosing = false;
    this._visibility.set('visible');
  }

  private _teardown(): void {
    if (!this._active) return;
    this._active = false;
    this._modalStack.remove(this);
    if (this._unlistenKeydown) {
      this._unlistenKeydown();
      this._unlistenKeydown = null;
    }
    this._scrollLock.unlock();
  }

  private _restoreFocus(): void {
    if (this._previousFocus && typeof this._previousFocus.focus === 'function') {
      this._previousFocus.focus();
    }
    this._previousFocus = null;
  }

  ngOnDestroy(): void {
    this._cancelExit?.();
    this._focusTrap?.destroy();
    this._teardown();
  }

  get _effectiveCloseLabel(): string {
    return this.closeLabel() || this._intl.close;
  }
}
