import { isPlatformBrowser } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import {
  type ConnectedOverlayPositionChange,
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  type OverlaySizeConfig,
  Overlay,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { type Portal, TemplatePortal } from '@angular/cdk/portal';
import {
  type ComponentRef,
  DestroyRef,
  Injector,
  type EmbeddedViewRef,
  type ElementRef,
  PLATFORM_ID,
  type Signal,
  type TemplateRef,
  type ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Subject, type Observable, Subscription } from 'rxjs';
import { snAfterExitAnimation, snAnimationsDisabled, type SnShowHideAnimation } from 'ashen-ui/core';

export type SnOverlayPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';

export type SnOverlayOrigin = ElementRef<HTMLElement> | HTMLElement | { x: number; y: number } | null;

export type SnOverlayCloseReason =
  | 'programmatic'
  | 'escape'
  | 'backdrop'
  | 'outside-pointer'
  | 'tab'
  | 'scroll';

export interface SnOverlayPanelConfig {
  origin: SnOverlayOrigin | undefined;
  template: TemplateRef<unknown> | undefined;
  portal?: Portal<unknown>;
  viewContainerRef: ViewContainerRef;
  positions?: readonly ConnectedPosition[] | SnOverlayPlacement;
  /** `true` sizes the pane to the origin's width, `'min'` only uses it as the minimum. */
  matchOriginWidth?: boolean | 'min';
  hasBackdrop?: boolean;
  backdropClass?: string | readonly string[];
  panelClass?: string | readonly string[];
  scrollStrategy?: 'reposition' | 'block' | 'close' | 'noop';
  viewportMargin?: number;
  offsetX?: number;
  offsetY?: number;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  closeOnOutsidePointer?: boolean;
  restoreFocus?: boolean;
  animation?: SnShowHideAnimation | null;
  animated?: boolean;
}

export type SnOverlayAttachment = ComponentRef<unknown> | EmbeddedViewRef<unknown>;

export type SnOverlaySide = 'above' | 'below';

export interface SnOverlayPanelRef {
  readonly isOpen: Signal<boolean>;
  readonly isClosing: Signal<boolean>;
  readonly panelElement: Signal<HTMLElement | null>;
  readonly side: Signal<SnOverlaySide>;
  readonly attachment: Signal<SnOverlayAttachment | null>;
  readonly keydown: Observable<KeyboardEvent>;
  readonly backdropClick: Observable<MouseEvent>;
  readonly outsidePointer: Observable<MouseEvent>;
  readonly positionChange: Observable<ConnectedOverlayPositionChange>;
  readonly afterOpened: Observable<void>;
  readonly afterClosed: Observable<SnOverlayCloseReason>;

  open(): boolean;
  close(reason?: SnOverlayCloseReason): void;
  detach(reason?: SnOverlayCloseReason): void;
  updateSize(size: OverlaySizeConfig): void;
  reposition(): void;
  dispose(): void;
}

export function snOverlaySelect(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'bottom-start',
    matchOriginWidth: true,
    hasBackdrop: true,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlayMenu(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'bottom-start',
    hasBackdrop: true,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlaySubmenu(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'right-start',
    hasBackdrop: false,
    closeOnOutsidePointer: false,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlayPopover(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'bottom-start',
    hasBackdrop: true,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlayTooltip(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'top-start',
    hasBackdrop: false,
    closeOnEscape: false,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlayContextMenu(config: SnOverlayPanelConfig): SnOverlayPanelConfig {
  return {
    positions: 'bottom-start',
    hasBackdrop: true,
    restoreFocus: false,
    scrollStrategy: 'reposition',
    ...config,
  };
}

export function snOverlayPanel(
  configSource: SnOverlayPanelConfig | (() => SnOverlayPanelConfig),
): SnOverlayPanelRef {
  const overlay = inject(Overlay);
  const directionality = inject(Directionality);
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const animationsDisabled = snAnimationsDisabled();
  const destroyRef = inject(DestroyRef);
  const injector = inject(Injector);
  const isOpen = signal(false);
  const isClosing = signal(false);
  const panelElement = signal<HTMLElement | null>(null);
  const side = signal<SnOverlaySide>('below');
  const attachment = signal<SnOverlayAttachment | null>(null);
  const overlayVersion = signal(0);
  const keydown = new Subject<KeyboardEvent>();
  const backdropClick = new Subject<MouseEvent>();
  const outsidePointer = new Subject<MouseEvent>();
  const positionChange = new Subject<ConnectedOverlayPositionChange>();
  const afterOpened = new Subject<void>();
  const afterClosed = new Subject<SnOverlayCloseReason>();
  let overlayRef: OverlayRef | null = null;
  let subscriptions = new Subscription();
  let cancelExit: (() => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let originToRestore: HTMLElement | null = null;
  let activeConfig: SnOverlayPanelConfig | null = null;
  // Reused across direction changes so the positionChanges subscription keeps firing.
  let activeStrategy: FlexibleConnectedPositionStrategy | null = null;
  let detaching = false;

  const config = (): SnOverlayPanelConfig =>
    typeof configSource === 'function' ? configSource() : configSource;

  const currentDirection = computed(() => directionality.valueSignal());

  effect(() => {
    const direction = currentDirection();
    overlayVersion();
    if (!overlayRef || !activeConfig || !activeStrategy) return;
    overlayRef.setDirection(direction);
    // Recompute positions on the live strategy; replacing it would orphan the positionChanges subscription.
    activeStrategy.withPositions(
      positions(activeConfig.positions, activeConfig.offsetX, activeConfig.offsetY),
    );
    overlayRef.updatePosition();
  });

  const close = (reason: SnOverlayCloseReason = 'programmatic'): void => {
    if (!overlayRef || !isOpen() || isClosing()) return;
    const closeConfig = activeConfig ?? config();
    if (closeConfig.animated !== true || animationsDisabled()) {
      detach(reason);
      return;
    }
    isClosing.set(true);
    cancelExit = snAfterExitAnimation(injector, () => overlayRef?.overlayElement, () => detach(reason));
  };

  const detach = (reason: SnOverlayCloseReason = 'programmatic'): void => {
    cancelExit?.();
    cancelExit = null;
    const currentOverlay = overlayRef;
    if (!currentOverlay) return;
    detaching = true;
    resizeObserver?.disconnect();
    resizeObserver = null;
    subscriptions.unsubscribe();
    subscriptions = new Subscription();
    if (currentOverlay.hasAttached()) currentOverlay.detach();
    currentOverlay.dispose();
    overlayRef = null;
    activeStrategy = null;
    overlayVersion.update((version) => version + 1);
    panelElement.set(null);
    attachment.set(null);
    isOpen.set(false);
    isClosing.set(false);
    const shouldRestoreFocus = activeConfig?.restoreFocus ?? originToRestore !== null;
    activeConfig = null;
    if (shouldRestoreFocus) originToRestore?.focus();
    originToRestore?.removeAttribute('data-sn-overlay-origin-side');
    originToRestore = null;
    detaching = false;
    afterClosed.next(reason);
  };

  const open = (): boolean => {
    if (!isBrowser) return false;
    const nextConfig = config();
    if (!nextConfig.origin || (!nextConfig.template && !nextConfig.portal)) return false;
    if (isOpen() && !isClosing()) return true;
    if (isClosing()) detach('programmatic');
    activeConfig = nextConfig;
    originToRestore = originElement(nextConfig.origin);
    activeStrategy = positionStrategy(nextConfig);
    overlayRef = overlay.create({
      positionStrategy: activeStrategy,
      scrollStrategy: scrollStrategy(nextConfig.scrollStrategy),
      panelClass: classList(nextConfig.panelClass),
      hasBackdrop: nextConfig.hasBackdrop ?? false,
      backdropClass: classList(nextConfig.backdropClass),
      direction: currentDirection(),
    });
    overlayVersion.update((version) => version + 1);
    connectEvents(overlayRef, nextConfig, activeStrategy);
    // Seed 'below' before attach(), so the side positionChanges reports synchronously wins.
    side.set('below');
    overlayRef.overlayElement.setAttribute('data-sn-overlay-side', 'below');
    originElement(nextConfig.origin)?.setAttribute('data-sn-overlay-origin-side', 'below');
    const portal = nextConfig.portal ?? new TemplatePortal(nextConfig.template!, nextConfig.viewContainerRef);
    attachment.set(overlayRef.attach(portal));
    panelElement.set(overlayRef.overlayElement);
    isOpen.set(true);
    isClosing.set(false);
    updateOriginWidth(nextConfig);
    afterOpened.next();
    return true;
  };

  const updateSize = (size: OverlaySizeConfig): void => overlayRef?.updateSize(size);
  const reposition = (): void => overlayRef?.updatePosition();
  const dispose = (): void => {
    if (overlayRef) detach('programmatic');
    keydown.complete();
    backdropClick.complete();
    outsidePointer.complete();
    positionChange.complete();
    afterOpened.complete();
    afterClosed.complete();
  };

  function connectEvents(
    ref: OverlayRef,
    nextConfig: SnOverlayPanelConfig,
    strategy: FlexibleConnectedPositionStrategy,
  ): void {
    subscriptions.add(
      ref.keydownEvents().subscribe((event) => {
        keydown.next(event);
        if (event.key === 'Escape' && (nextConfig.closeOnEscape ?? true)) {
          event.preventDefault();
          close('escape');
        }
      }),
    );
    subscriptions.add(
      ref.backdropClick().subscribe((event) => {
        backdropClick.next(event);
        if (nextConfig.closeOnBackdrop ?? true) close('backdrop');
      }),
    );
    subscriptions.add(
      ref.outsidePointerEvents().subscribe((event) => {
        const origin = originElement(nextConfig.origin);
        if (origin && event.composedPath().includes(origin)) return;
        outsidePointer.next(event);
        if (nextConfig.closeOnOutsidePointer) close('outside-pointer');
      }),
    );
    subscriptions.add(
      strategy.positionChanges.subscribe((event) => {
        const pair = event.connectionPair;
        const next: SnOverlaySide = pair.overlayY === 'bottom' && pair.originY === 'top' ? 'above' : 'below';
        side.set(next);
        ref.overlayElement.setAttribute('data-sn-overlay-side', next);
        originElement(nextConfig.origin)?.setAttribute('data-sn-overlay-origin-side', next);
        positionChange.next(event);
      }),
    );
    subscriptions.add(
      ref.detachments().subscribe(() => {
        if (!detaching && overlayRef === ref) detach('scroll');
      }),
    );
  }

  function positionStrategy(nextConfig: SnOverlayPanelConfig): FlexibleConnectedPositionStrategy {
    return overlay
      .position()
      .flexibleConnectedTo(nextConfig.origin as NonNullable<SnOverlayOrigin>)
      .withPositions(positions(nextConfig.positions, nextConfig.offsetX, nextConfig.offsetY))
      .withPush(false)
      .withViewportMargin(nextConfig.viewportMargin ?? 8);
  }

  function positions(
    value: SnOverlayPanelConfig['positions'],
    configuredOffsetX: number | undefined,
    configuredOffsetY: number | undefined,
  ): ConnectedPosition[] {
    if (typeof value !== 'string' && value) return [...value];
    const placement = value ?? 'bottom-start';
    const start = currentDirection() === 'rtl' ? 'end' : 'start';
    const end = currentDirection() === 'rtl' ? 'start' : 'end';
    const offsetX = configuredOffsetX ?? 0;
    const offsetY = configuredOffsetY ?? 0;
    const bottomStart = { originX: start, originY: 'bottom', overlayX: start, overlayY: 'top', offsetX, offsetY } as ConnectedPosition;
    const bottomEnd = { originX: end, originY: 'bottom', overlayX: end, overlayY: 'top', offsetX: -offsetX, offsetY } as ConnectedPosition;
    const topStart = { originX: start, originY: 'top', overlayX: start, overlayY: 'bottom', offsetX, offsetY: -offsetY } as ConnectedPosition;
    const topEnd = { originX: end, originY: 'top', overlayX: end, overlayY: 'bottom', offsetX: -offsetX, offsetY: -offsetY } as ConnectedPosition;
    const rightStart = { originX: end, originY: 'top', overlayX: start, overlayY: 'top', offsetX, offsetY } as ConnectedPosition;
    const rightEnd = { originX: end, originY: 'bottom', overlayX: start, overlayY: 'bottom', offsetX, offsetY: -offsetY } as ConnectedPosition;
    const leftStart = { originX: start, originY: 'top', overlayX: end, overlayY: 'top', offsetX: -offsetX, offsetY } as ConnectedPosition;
    const leftEnd = { originX: start, originY: 'bottom', overlayX: end, overlayY: 'bottom', offsetX: -offsetX, offsetY: -offsetY } as ConnectedPosition;
    const maps: Record<SnOverlayPlacement, ConnectedPosition[]> = {
      'bottom-start': [bottomStart, topStart, bottomEnd, topEnd],
      'bottom-end': [bottomEnd, topEnd, bottomStart, topStart],
      'top-start': [topStart, bottomStart, topEnd, bottomEnd],
      'top-end': [topEnd, bottomEnd, topStart, bottomStart],
      'right-start': [rightStart, leftStart, rightEnd, leftEnd],
      'right-end': [rightEnd, leftEnd, rightStart, leftStart],
      'left-start': [leftStart, rightStart, leftEnd, rightEnd],
      'left-end': [leftEnd, rightEnd, leftStart, rightStart],
    };
    return maps[placement];
  }

  function scrollStrategy(kind: SnOverlayPanelConfig['scrollStrategy']) {
    if (kind === 'block') return overlay.scrollStrategies.block();
    if (kind === 'close') return overlay.scrollStrategies.close();
    if (kind === 'noop') return overlay.scrollStrategies.noop();
    return overlay.scrollStrategies.reposition();
  }

  function updateOriginWidth(nextConfig: SnOverlayPanelConfig): void {
    const element = originElement(nextConfig.origin);
    if (!nextConfig.matchOriginWidth || !element || !overlayRef) return;
    const update = () => {
      const width = element.getBoundingClientRect().width;
      overlayRef?.updateSize(nextConfig.matchOriginWidth === 'min' ? { minWidth: width } : { width });
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);
  }

  destroyRef.onDestroy(dispose);

  return {
    isOpen: isOpen.asReadonly(),
    isClosing: isClosing.asReadonly(),
    panelElement: panelElement.asReadonly(),
    side: side.asReadonly(),
    attachment: attachment.asReadonly(),
    keydown: keydown.asObservable(),
    backdropClick: backdropClick.asObservable(),
    outsidePointer: outsidePointer.asObservable(),
    positionChange: positionChange.asObservable(),
    afterOpened: afterOpened.asObservable(),
    afterClosed: afterClosed.asObservable(),
    open,
    close,
    detach,
    updateSize,
    reposition,
    dispose,
  };
}

function classList(value: string | readonly string[] | undefined): string | string[] | undefined {
  if (typeof value === 'string') return value;
  return value ? [...value] : undefined;
}

function originElement(origin: SnOverlayOrigin | undefined): HTMLElement | null {
  if (!origin || 'x' in origin) return null;
  return 'nativeElement' in origin ? origin.nativeElement : origin;
}
