import {
  computed,
  effect,
  forwardRef,
  inject,
  signal,
  type ModelSignal,
  type Provider,
  type Signal,
  type Type,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SN_FORM_FIELD, type SnFormFieldContext } from 'ashen-ui/core';

export interface SnFormControlConfig<T> {
  value: ModelSignal<T | null>;
  disabled?: Signal<boolean>;
  isEmpty?: (value: T | null) => boolean;
}

export type SnFormControlConfigSource<T> =
  | SnFormControlConfig<T>
  | (() => SnFormControlConfig<T>);

export interface SnFormControlRef<T> {
  readonly value: ModelSignal<T | null>;
  readonly isDisabled: Signal<boolean>;
  readonly field: SnFormFieldContext | null;
  commit(value: T | null): void;
  markTouched(): void;
  writeValue(value: T | null | undefined): void;
  registerOnChange(fn: (value: T | null) => void): void;
  registerOnTouched(fn: () => void): void;
  setDisabledState(disabled: boolean): void;
}

export function provideSnValueAccessor(type: Type<unknown>): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true,
  };
}

export function snFormControl<T>(config: SnFormControlConfigSource<T>): SnFormControlRef<T> {
  const getConfig = typeof config === 'function' ? config : () => config;
  const value = getConfig().value;
  const field = inject(SN_FORM_FIELD, { optional: true });
  const disabledFromForms = signal(false);
  const isDisabled = computed(
    () => getConfig().disabled?.() === true || disabledFromForms(),
  );
  let onChange: (value: T | null) => void = () => {};
  let onTouched: () => void = () => {};

  const setFilled = (next: T | null): void => {
    const isEmpty = getConfig().isEmpty ?? defaultIsEmpty;
    field?.setFilled(!isEmpty(next));
  };

  effect(() => setFilled(value()));

  return {
    value,
    isDisabled,
    field,
    commit(next) {
      value.set(next);
      setFilled(next);
      onChange(next);
      onTouched();
    },
    markTouched() {
      onTouched();
    },
    writeValue(next) {
      const normalized = next ?? null;
      value.set(normalized);
      setFilled(normalized);
    },
    registerOnChange(fn) {
      onChange = fn;
    },
    registerOnTouched(fn) {
      onTouched = fn;
    },
    setDisabledState(disabled) {
      disabledFromForms.set(disabled);
    },
  };
}

function defaultIsEmpty(value: unknown): boolean {
  return value === null || value === '';
}
