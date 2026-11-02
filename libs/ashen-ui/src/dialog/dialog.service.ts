import { Injectable, Injector, PLATFORM_ID, inject } from '@angular/core';
import type { TemplateRef, Type } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ESCAPE } from '@angular/cdk/keycodes';
import { catchError, defaultIfEmpty, from, map, of, Subscription, take } from 'rxjs';
import type { Observable } from 'rxjs';
import { ScrollLock, SnConfirmIntl } from 'ashen-ui/core';
import { SnDialogRef } from './dialog-ref';
import {
  SN_DIALOG_CONFIG,
  SN_DIALOG_DATA,
  type DialogCloseReason,
  type SnDialogConfig,
} from './dialog-config';
import { SnDialogContainer } from './dialog-container';
import { SN_DIALOG_DEFAULTS } from './dialog-defaults';
import { SnDialogConfirm, type SnConfirmDialogData } from './dialog-confirm';

/**
 * Opens dialogs imperatively (from component or service code).
 * Complements the declarative `<sn-dialog>`; both share the same visual chrome.
 *
 * @example
 * ```ts
 * const ref = dialog.open(EditUserForm, { header: 'Edit', data: { id } });
 * ref.afterClosed().subscribe((result) => { ... });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly scrollLock = inject(ScrollLock);
  private readonly confirmIntl = inject(SnConfirmIntl);
  private readonly location = inject(Location);
  private readonly defaults = inject(SN_DIALOG_DEFAULTS, { optional: true });
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Open `content` (a component type or template) as a modal dialog.
   *
   * @returns A {@link SnDialogRef} for closing the dialog and observing its
   *   lifecycle. Also injected into the opened content (alongside
   *   {@link SN_DIALOG_DATA}).
   */
  open<C = unknown, R = unknown, D = unknown>(
    content: Type<C> | TemplateRef<C>,
    config: SnDialogConfig<D, R> = {},
  ): SnDialogRef<R, C> {
    const ref = new SnDialogRef<R, C>();

    // SSR / non-browser: no overlay to attach to, so return an inert ref.
    if (!this.isBrowser) return ref;

    const previousFocus = document.activeElement as HTMLElement | null;

    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global(),
      // ScrollLock handles page scroll; keep the overlay strategy inert.
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      hasBackdrop: false,
      disposeOnNavigation: config.closeOnNavigation !== false,
    });

    const dialogInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: SN_DIALOG_DATA, useValue: config.data ?? null },
        { provide: SN_DIALOG_CONFIG, useValue: config },
        { provide: SnDialogRef, useValue: ref },
      ],
    });

    const containerRef = overlayRef.attach(
      new ComponentPortal(SnDialogContainer, null, dialogInjector),
    );
    containerRef.changeDetectorRef.detectChanges();
    const container = containerRef.instance;

    if (isTemplateRef(content)) {
      container.attachTemplate(content, dialogInjector, {
        $implicit: config.data ?? null,
        dialogRef: ref,
      } as unknown as C);
    } else {
      const compRef = container.attachComponent(content, dialogInjector);
      ref.componentInstance = compRef.instance;
    }

    const lockOptions = { hideScrollbar: !!config.fullscreen };
    this.scrollLock.lock(lockOptions);

    let closed = false;
    let closeGuardSub: Subscription | null = null;
    let detachSub: Subscription | null = null;
    const finalize = () => {
      if (closed) return;
      closed = true;
      closeGuardSub?.unsubscribe();
      detachSub?.unsubscribe();
      overlayRef.dispose();
      this.scrollLock.unlock(lockOptions);
      ref._markClosed();
      previousFocus?.focus?.();
    };

    detachSub = overlayRef.detachments().subscribe(finalize);

    let closePending = false;
    ref._init((result, reason) => {
      if (closePending || closed) return;
      closePending = true;
      closeGuardSub = this.canClose(config, result, reason)
        .pipe(take(1))
        .subscribe((allowed) => {
          if (closed) return;
          if (!allowed) {
            closePending = false;
            return;
          }
          ref._setResult(result);
          container.startHiding(finalize);
        });
    });

    const keySub = overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.keyCode === ESCAPE && !config.disableClose) {
        event.preventDefault();
        ref.close(undefined, 'escape');
      }
    });
    ref.afterClosed().subscribe({ complete: () => keySub.unsubscribe() });

    // The CDK reacts only to back/forward; router links update the URL through Location.go.
    if (config.closeOnNavigation !== false) {
      const stopUrlListener = this.location.onUrlChange(() => ref.close(undefined, 'navigation'));
      ref.afterClosed().subscribe({ complete: stopUrlListener });
    }

    return ref;
  }

  private canClose<R, D>(
    config: SnDialogConfig<D, R>,
    result: R | undefined,
    reason: DialogCloseReason,
  ): Observable<boolean> {
    if (!config.canClose) return of(true);
    try {
      const decision = config.canClose(result, reason);
      if (typeof decision === 'boolean') return of(decision);
      return from(decision).pipe(
        defaultIfEmpty(false),
        catchError(() => of(false)),
      );
    } catch {
      return of(false);
    }
  }

  /**
   * Open a built-in confirmation dialog. Resolves to `true` when accepted and
   * `false` when rejected or dismissed.
   *
   * @example
   * ```ts
   * dialog.confirm({ message: 'Delete this item?', severity: 'error' })
   *   .subscribe((ok) => { if (ok) remove(); });
   * ```
   */
  confirm(options: SnConfirmDialogData = {}): Observable<boolean> {
    const data: SnConfirmDialogData = { ...this.defaults?.confirm, ...options };
    const ref = this.open<SnDialogConfirm, boolean, SnConfirmDialogData>(SnDialogConfirm, {
      size: 'sm',
      width: data.width,
      panelClass: 'sn-dialog-panel--confirm',
      header: data.header ?? this.confirmIntl.header,
      data,
      closable: data.closable,
      disableClose: data.disableClose,
    });
    return ref.afterClosed().pipe(map((result) => result === true));
  }
}

/** TemplateRef is abstract, so detect it structurally rather than via instanceof. */
function isTemplateRef(value: unknown): value is TemplateRef<unknown> {
  return (
    !!value &&
    typeof (value as { createEmbeddedView?: unknown }).createEmbeddedView === 'function'
  );
}
