import { InjectionToken, Signal } from '@angular/core';

export interface ColorPickerContext {
  readonly hue: Signal<number>;
  readonly saturation: Signal<number>;
  readonly brightness: Signal<number>;
  readonly alpha: Signal<number>;
  readonly hex: Signal<string>;
  readonly rgb: Signal<{ r: number; g: number; b: number }>;
  setHue(n: number): void;
  setSaturation(n: number): void;
  setBrightness(n: number): void;
  setAlpha(n: number): void;
  setHex(hex: string): boolean;
  setRgb(r: number, g: number, b: number): void;
  readonly isDisabled: Signal<boolean>;
}

export const SN_COLOR_PICKER = new InjectionToken<ColorPickerContext>('SN_COLOR_PICKER');
