import { InjectionToken } from '@angular/core';

export interface SnFormFieldContext {
  /** The id of the control, which `sn-label` points its `for` at. */
  controlId: () => string;
  invalid: () => boolean;
  required: () => boolean;
  hasError: () => boolean;
  filled: () => boolean;
  getDescribedBy: () => string | null;
  registerFocus: (focused: boolean) => void;
  setInvalid: (invalid: boolean) => void;
  setRequired: (required: boolean) => void;
  setFilled: (filled: boolean) => void;
  setLabelWidth: (px: number) => void;
  registerDescribedBy: (id: string, kind: 'hint' | 'error') => void;
  unregisterDescribedBy: (id: string) => void;
  isReady: () => boolean;
  setErrorState: (state: boolean) => void;
  /** A control with an authored `id` claims it, so the label follows it instead of the generated one. */
  setControlId: (id: string | null) => void;
}

export const SN_FORM_FIELD = new InjectionToken<SnFormFieldContext>('SN_FORM_FIELD');
