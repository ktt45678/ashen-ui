import { computed, signal, type Signal, type WritableSignal } from '@angular/core';

export interface SnSelectionModelConfig<T> {
  multiple?: boolean;
  trackBy?: (item: T) => unknown;
  orderBy?: Signal<readonly T[]>;
  unique?: boolean;
  value?: WritableSignal<T[]>;
}

export type SnSelectionModelConfigSource<T> =
  | SnSelectionModelConfig<T>
  | (() => SnSelectionModelConfig<T>);

export interface SnSelectionModelRef<T> {
  readonly selected: Signal<readonly T[]>;
  isSelected(item: T): boolean;
  select(...items: T[]): void;
  deselect(...items: T[]): void;
  toggle(item: T): void;
  clear(): void;
  set(items: readonly T[]): void;
}

export function snSelectionModel<T>(
  config: SnSelectionModelConfigSource<T>,
): SnSelectionModelRef<T> {
  const getConfig = typeof config === 'function' ? config : () => config;
  const internalValue = signal<T[]>([]);
  const value = (): WritableSignal<T[]> => getConfig().value ?? internalValue;
  const selected = computed(() => normalize(value()(), getConfig()));

  const isSelected = (item: T): boolean =>
    selected().some((candidate) => sameItem(candidate, item, getConfig().trackBy));

  const set = (items: readonly T[]): void => {
    value().set(normalize(items, getConfig()));
  };

  const select = (...items: T[]): void => {
    const next = getConfig().multiple === true ? [...selected(), ...items] : items.slice(-1);
    set(next);
  };

  const deselect = (...items: T[]): void => {
    const trackBy = getConfig().trackBy;
    set(selected().filter((candidate) => !items.some((item) => sameItem(candidate, item, trackBy))));
  };

  return {
    selected,
    isSelected,
    select,
    deselect,
    toggle(item) {
      if (isSelected(item)) {
        deselect(item);
      } else {
        select(item);
      }
    },
    clear() {
      set([]);
    },
    set,
  };
}

function normalize<T>(items: readonly T[], config: SnSelectionModelConfig<T>): T[] {
  const multiple = config.multiple === true;
  const limited = multiple ? [...items] : items.slice(-1);
  const unique = config.unique === true ? uniqueItems(limited, config.trackBy) : limited;
  return orderItems(unique, config.orderBy, config.trackBy);
}

function uniqueItems<T>(items: readonly T[], trackBy: ((item: T) => unknown) | undefined): T[] {
  const seen = new Set<unknown>();
  return items.filter((item) => {
    const key = itemKey(item, trackBy);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function orderItems<T>(
  items: readonly T[],
  orderBy: Signal<readonly T[]> | undefined,
  trackBy: ((item: T) => unknown) | undefined,
): T[] {
  if (!orderBy) {
    return [...items];
  }
  const positions = new Map<unknown, number>();
  orderBy().forEach((item, index) => {
    const key = itemKey(item, trackBy);
    if (!positions.has(key)) {
      positions.set(key, index);
    }
  });
  return items
    .map((item, index) => ({ item, index, position: positions.get(itemKey(item, trackBy)) }))
    .sort((left, right) => {
      const leftPosition = left.position ?? Number.POSITIVE_INFINITY;
      const rightPosition = right.position ?? Number.POSITIVE_INFINITY;
      return leftPosition - rightPosition || left.index - right.index;
    })
    .map(({ item }) => item);
}

function sameItem<T>(
  left: T,
  right: T,
  trackBy: ((item: T) => unknown) | undefined,
): boolean {
  return itemKey(left, trackBy) === itemKey(right, trackBy);
}

function itemKey<T>(item: T, trackBy: ((item: T) => unknown) | undefined): unknown {
  return trackBy ? trackBy(item) : item;
}
