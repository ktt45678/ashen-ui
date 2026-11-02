import {
  ActiveDescendantKeyManager,
  FocusKeyManager,
  type FocusableOption,
  type Highlightable,
} from '@angular/cdk/a11y';
import { END, HOME, LEFT_ARROW, RIGHT_ARROW, TAB, UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { DestroyRef, Injector, computed, effect, inject, isSignal, signal, type Signal } from '@angular/core';
import { type SnDirection, snDirection } from 'ashen-ui/core';
import type { Observable } from 'rxjs';

export type SnListNavigatorOrientation = 'horizontal' | 'vertical';

export interface SnListNavigatorConfig<T extends FocusableOption> {
  items: Signal<readonly T[]>;
  orientation: Signal<SnListNavigatorOrientation> | SnListNavigatorOrientation;
  direction?: Signal<SnDirection>;
  wrap?: boolean;
  homeAndEnd?: boolean;
  typeahead?: boolean;
  skipPredicate?: (item: T) => boolean;
  activeDescendant?: boolean;
}

export interface SnListNavigatorIndexConfig {
  mode: 'index';
  itemCount: Signal<number>;
  getLabel: (index: number) => string;
  isDisabled?: (index: number) => boolean;
  orientation: Signal<SnListNavigatorOrientation> | SnListNavigatorOrientation;
  direction?: Signal<SnDirection>;
  wrap?: boolean;
  homeAndEnd?: boolean;
  typeahead?: boolean;
  activeDescendant?: boolean;
}

interface SnListNavigatorSettings {
  orientation: Signal<SnListNavigatorOrientation> | SnListNavigatorOrientation;
  direction?: Signal<SnDirection>;
  wrap?: boolean;
  homeAndEnd?: boolean;
  typeahead?: boolean;
  activeDescendant?: boolean;
}

export interface SnListNavigatorRef<T = never> {
  readonly activeItem: Signal<T | null>;
  readonly activeIndex: Signal<number | null>;
  readonly tabOut: Observable<void>;
  onKeydown(event: KeyboardEvent): boolean;
  setActiveItem(index: number): void;
  setFirstItemActive(): void;
  setLastItemActive(): void;
  setPreviousItemActive(): void;
  setNextItemActive(): void;
  clearActiveItem(): void;
  destroy(): void;
}

export function snListNavigator<T extends FocusableOption>(
  config: SnListNavigatorConfig<T>,
): SnListNavigatorRef<T>;
export function snListNavigator(config: SnListNavigatorIndexConfig): SnListNavigatorRef<number>;
export function snListNavigator<T extends FocusableOption>(
  config: SnListNavigatorConfig<T> | SnListNavigatorIndexConfig,
): SnListNavigatorRef<T> | SnListNavigatorRef<number> {
  if ('mode' in config) {
    const items = computed<readonly FocusableOption[]>(() =>
      Array.from(
        { length: config.itemCount() },
        (_, index) => new IndexedNavigationOption(index, config),
      ),
    );
    return createSnListNavigator(
      config,
      items,
      (index) => (index < config.itemCount() ? index : null),
      (item) => config.isDisabled?.((item as IndexedNavigationOption).index) ?? false,
    );
  }
  return createSnListNavigator(
    config,
    config.items,
    (index) => config.items()[index] ?? null,
    (item) => config.skipPredicate?.(item as T) ?? false,
  );
}

function createSnListNavigator<T>(
  config: SnListNavigatorSettings,
  items: Signal<readonly FocusableOption[]>,
  getItem: (index: number) => T | null,
  skipPredicate?: (item: FocusableOption) => boolean,
): SnListNavigatorRef<T> {
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);
  const direction = config.direction ?? snDirection();
  const orientation = isSignal(config.orientation)
    ? config.orientation
    : (): SnListNavigatorOrientation => config.orientation as SnListNavigatorOrientation;
  const keyManager = config.activeDescendant
    ? new ActiveDescendantKeyManager<FocusableOption & Highlightable>(
        items as Signal<readonly (FocusableOption & Highlightable)[]>,
        injector,
      )
    : new FocusKeyManager<FocusableOption>(items, injector);
  const activeIndex = signal<number | null>(null);
  const activeItem = signal<T | null>(null);
  let destroyed = false;

  if (config.wrap) {
    keyManager.withWrap();
  }
  if (config.homeAndEnd) {
    keyManager.withHomeAndEnd();
  }
  if (config.typeahead) {
    keyManager.withTypeAhead();
  }
  if (skipPredicate) {
    keyManager.skipPredicate(skipPredicate);
  }

  const configureOrientation = (): void => {
    if (orientation() === 'horizontal') {
      keyManager.withHorizontalOrientation(direction());
    } else {
      keyManager.withVerticalOrientation();
    }
  };

  configureOrientation();
  effect(configureOrientation);

  const synchronizeActiveItem = (): void => {
    const index = keyManager.activeItemIndex;
    activeIndex.set(index ?? null);
    activeItem.set(index == null ? null : getItem(index));
  };

  // Typeahead moves the active item from inside the manager, so only its change stream sees every move.
  const changeSubscription = keyManager.change.subscribe(synchronizeActiveItem);

  const setActiveItem = (index: number): void => {
    keyManager.setActiveItem(index);
    synchronizeActiveItem();
  };

  const setFirstItemActive = (): void => {
    keyManager.setFirstItemActive();
    synchronizeActiveItem();
  };

  const setLastItemActive = (): void => {
    keyManager.setLastItemActive();
    synchronizeActiveItem();
  };

  const clearActiveItem = (): void => {
    keyManager.setActiveItem(-1);
    synchronizeActiveItem();
  };

  // Step without a key event: a menubar moves from inside an open submenu.
  const setPreviousItemActive = (): void => {
    keyManager.setPreviousItemActive();
    synchronizeActiveItem();
  };

  const setNextItemActive = (): void => {
    keyManager.setNextItemActive();
    synchronizeActiveItem();
  };

  const onKeydown = (event: KeyboardEvent): boolean => {
    const keyCode = event.keyCode || eventKeyCode(event.key);
    const managed = isManagedKey(keyCode, event, orientation(), config.typeahead === true);
    if (!managed && keyCode !== TAB) {
      return false;
    }
    keyManager.onKeydown(keyCode === event.keyCode ? event : normalizedKeyEvent(event, keyCode));
    synchronizeActiveItem();
    return managed;
  };

  const destroy = (): void => {
    if (destroyed) {
      return;
    }
    destroyed = true;
    changeSubscription.unsubscribe();
    // Clear the highlight: a fresh manager on each open has no memory of the last active option.
    keyManager.setActiveItem(-1);
    keyManager.destroy();
  };

  destroyRef.onDestroy(destroy);

  return {
    activeItem: activeItem.asReadonly(),
    activeIndex: activeIndex.asReadonly(),
    tabOut: keyManager.tabOut,
    onKeydown,
    setActiveItem,
    setFirstItemActive,
    setLastItemActive,
    setPreviousItemActive,
    setNextItemActive,
    clearActiveItem,
    destroy,
  };
}

class IndexedNavigationOption implements FocusableOption, Highlightable {
  constructor(
    readonly index: number,
    private readonly config: SnListNavigatorIndexConfig,
  ) {}

  focus(): void {}

  getLabel(): string {
    return this.config.getLabel(this.index);
  }

  setActiveStyles(): void {}

  setInactiveStyles(): void {}

  isDisabled(): boolean {
    return this.config.isDisabled?.(this.index) ?? false;
  }
}

function isManagedKey(
  keyCode: number,
  event: KeyboardEvent,
  orientation: SnListNavigatorOrientation,
  typeahead: boolean,
): boolean {
  if (keyCode === HOME || keyCode === END) {
    return true;
  }
  if (orientation === 'horizontal') {
    return keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
  }
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    return true;
  }
  return typeahead && event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
}

function eventKeyCode(key: string): number {
  switch (key) {
    case 'ArrowDown':
      return DOWN_ARROW;
    case 'ArrowUp':
      return UP_ARROW;
    case 'ArrowLeft':
      return LEFT_ARROW;
    case 'ArrowRight':
      return RIGHT_ARROW;
    case 'Home':
      return HOME;
    case 'End':
      return END;
    case 'Tab':
      return TAB;
    default:
      return 0;
  }
}

function normalizedKeyEvent(event: KeyboardEvent, keyCode: number): KeyboardEvent {
  return new KeyboardEvent(event.type, {
    altKey: event.altKey,
    code: event.code,
    ctrlKey: event.ctrlKey,
    key: event.key,
    keyCode,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
  });
}
