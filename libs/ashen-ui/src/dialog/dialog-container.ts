import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import type { ComponentRef, EmbeddedViewRef, TemplateRef, Type } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import type { ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { SnIconRegistry, SnDialogIntl, snAfterExitAnimation, snNextId } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { SnDialogRef } from './dialog-ref';
import { SN_DIALOG_CONFIG, type SnDialogConfig } from './dialog-config';

/**
 * Container rendered inside the CDK overlay for an imperatively-opened dialog.
 * Renders the same `.sn-dialog-*` chrome as the declarative `<sn-dialog>` and
 * hosts the caller's component/template through a `CdkPortalOutlet`.
 *
 * @internal Not part of the public API; created by `DialogService`.
 */
@Component({
  selector: 'sn-dialog-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkPortalOutlet, Icon],
  templateUrl: './dialog-container.html',
  host: {
    class: 'sn-dialog',
  },
})
export class SnDialogContainer implements OnDestroy {
  protected readonly icons = inject(SnIconRegistry);

  // Static queries resolve during creation, so content can attach right away.
  /* eslint-disable @angular-eslint/prefer-signals -- signal queries resolve too late for that */
  @ViewChild(CdkPortalOutlet, { static: true }) private _portalOutlet!: CdkPortalOutlet;
  @ViewChild('panel', { static: true }) private _panel!: ElementRef<HTMLElement>;
  /* eslint-enable @angular-eslint/prefer-signals */

  protected readonly config = inject<SnDialogConfig>(SN_DIALOG_CONFIG);
  private readonly ref = inject<SnDialogRef>(SnDialogRef);
  private readonly vcr = inject(ViewContainerRef);
  private readonly focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private readonly injector = inject(Injector);
  private readonly host: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly intl = inject(SnDialogIntl);

  protected readonly hiding = signal(false);
  protected readonly panelId = snNextId('sn-dialog');
  protected readonly titleId = snNextId('sn-dialog-title');

  private focusTrap: ConfigurableFocusTrap | null = null;

  protected get closable(): boolean {
    return this.config.closable !== false;
  }

  protected get showHeader(): boolean {
    return !!this.config.header || this.closable;
  }

  protected get hasBackdrop(): boolean {
    return this.config.hasBackdrop !== false;
  }

  protected get panelClassStr(): string {
    return classString(this.config.panelClass);
  }

  protected get headerClassStr(): string {
    return classString(this.config.headerClass);
  }

  protected get titleClassStr(): string {
    return classString(this.config.titleClass);
  }

  protected get bodyClassStr(): string {
    return classString(this.config.bodyClass);
  }

  protected get effectiveCloseLabel(): string {
    return this.config.closeLabel || this.intl.close;
  }

  constructor() {
    afterNextRender(() => {
      if (this.config.autoFocus !== false) {
        this.focusTrap = this.focusTrapFactory.create(this._panel.nativeElement);
        this.focusTrap.focusInitialElement();
      }
      this.ref._markOpened();
    });
  }

  /** @internal Render a component into the dialog body. */
  attachComponent<C>(component: Type<C>, injector: Injector): ComponentRef<C> {
    return this._portalOutlet.attachComponentPortal(
      new ComponentPortal(component, null, injector),
    );
  }

  /** @internal Render a template into the dialog body. */
  attachTemplate<C>(
    template: TemplateRef<C>,
    injector: Injector,
    context: C,
  ): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(
      new TemplatePortal(template, this.vcr, context, injector),
    );
  }

  /** @internal Play the exit animation, then call `done`. */
  startHiding(done: () => void): void {
    this.hiding.set(true);
    snAfterExitAnimation(this.injector, () => this.host, done);
  }

  protected onMaskClick(): void {
    if (this.config.disableClose) return;
    this.ref.close(undefined, 'backdrop');
  }

  protected onCloseClick(): void {
    this.ref.close(undefined, 'close-button');
  }

  ngOnDestroy(): void {
    this.focusTrap?.destroy();
    this.focusTrap = null;
  }
}

function classString(c: string | string[] | undefined): string {
  return Array.isArray(c) ? c.join(' ') : c ?? '';
}
