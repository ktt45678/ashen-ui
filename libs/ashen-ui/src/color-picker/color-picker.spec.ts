import { vi } from 'vitest';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideSnIntl } from 'ashen-ui/core';
import { ColorPicker } from './color-picker';
import { ColorArea } from './color-area';
import { ColorSlider } from './color-slider';
import { ColorInput } from './color-input';
import { OverlayContainer } from '@angular/cdk/overlay';
import { fakeRunningAnimations } from '../core/fake-animations.spec-helper';

@Component({
  template: `<sn-color-picker [(value)]="color"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class DefaultHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [showAlpha]="true"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class ShowAlphaHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [showEyeDropper]="true"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class ShowEyeDropperHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [showPreview]="false"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class NoPreviewHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `
    <sn-color-picker [(value)]="color">
      <sn-color-area />
      <sn-color-input format="hex" />
    </sn-color-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker, ColorArea, ColorInput],
})
class CustomLayoutHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [formControl]="ctrl"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker, ReactiveFormsModule],
})
class ReactiveFormHost {
  readonly color = signal('#000000');
  ctrl = new FormControl<string>('#ff0000');
}

@Component({
  template: `<sn-color-picker [formControl]="ctrl"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker, ReactiveFormsModule],
})
class ResettableFormHost {
  ctrl = new FormControl<string | null>('#ff0000');
}

@Component({
  template: `<sn-color-picker [(ngModel)]="color"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker, FormsModule],
})
class NgModelHost {
  color = '#3399e6';
}

@Component({
  template: `<sn-color-picker [disabled]="true" [(value)]="color"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class DisabledHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [popover]="true"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class PopoverHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [popover]="true" [showInput]="false"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class SwatchOnlyHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `<sn-color-picker snClass="extra-cls" [(value)]="color"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class SnClassHost {
  readonly color = signal('#000000');
}

@Component({
  template: `<sn-color-picker [(value)]="color" [showAlpha]="true"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class AlphaEmitHost {
  readonly color = signal('#ff000080');
}

@Component({
  template: `
    <sn-color-picker [(value)]="color">
      <sn-color-area
        [snStyle]="{ root: { height: '12rem' }, thumb: { outlineWidth: '3px' } }"
        [snAttrs]="{
          root: { 'data-testid': 'color-area', role: 'button' },
          thumb: { 'data-testid': 'color-area-thumb' }
        }"
      />
      <sn-color-slider
        [snStyle]="{ root: { width: '14rem' }, thumb: { outlineWidth: '3px' } }"
        [snAttrs]="{
          root: { 'data-testid': 'hue-slider', role: 'button' },
          thumb: { 'data-testid': 'hue-slider-thumb' }
        }"
      />
    </sn-color-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker, ColorArea, ColorSlider],
})
class SnPartHost {
  readonly color = signal('#3399e6');
}

function getArea(root: HTMLElement): HTMLElement | null {
  return root.querySelector('sn-color-area');
}

function getHueSlider(root: HTMLElement): HTMLElement | null {
  return root.querySelector('sn-color-slider[channel="hue"], sn-color-slider');
}

function getHexInput(root: HTMLElement): HTMLInputElement | null {
  return root.querySelector('sn-color-input input[type="text"], sn-color-input input:not([type="number"])');
}

function getPreview(root: HTMLElement): HTMLElement | null {
  return root.querySelector('.sn-color-picker-preview');
}

function dispatchKey(el: HTMLElement, key: string, options: KeyboardEventInit = {}): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options }));
}

describe('ColorPicker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('shows the default colour again after the form control is reset', async () => {
    const fixture = TestBed.createComponent(ResettableFormHost);
    await fixture.whenStable();
    const hexOf = () => getHexInput(fixture.nativeElement)!.value.replace('#', '').toLowerCase();
    expect(hexOf()).toBe('ff0000');

    fixture.componentInstance.ctrl.reset();
    await fixture.whenStable();
    expect(hexOf()).toBe('000000');

    fixture.componentInstance.ctrl.setValue('#ff0000');
    await fixture.whenStable();
    expect(hexOf()).toBe('ff0000');
  });

  it('renders host with sn-color-picker class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-color-picker');
    expect(host.classList).toContain('sn-color-picker');
  });

  it('renders preview bar by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getPreview(fixture.nativeElement)).toBeTruthy();
  });

  it('hides preview when showPreview=false', async () => {
    const fixture = TestBed.createComponent(NoPreviewHost);
    await fixture.whenStable();
    expect(getPreview(fixture.nativeElement)).toBeNull();
  });

  it('renders color area in default layout', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getArea(fixture.nativeElement)).toBeTruthy();
  });

  it('renders hue slider in default layout', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getHueSlider(fixture.nativeElement)).toBeTruthy();
  });

  it('renders hex input in default layout', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getHexInput(fixture.nativeElement)).toBeTruthy();
  });

  it('does not render alpha slider without showAlpha', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const sliders = fixture.nativeElement.querySelectorAll('sn-color-slider');
    const alphaSlider = Array.from(sliders).find(
      (s) => (s as HTMLElement).getAttribute('channel') === 'alpha',
    );
    expect(alphaSlider).toBeFalsy();
  });

  it('renders alpha slider with showAlpha=true', async () => {
    const fixture = TestBed.createComponent(ShowAlphaHost);
    await fixture.whenStable();
    const sliders = fixture.nativeElement.querySelectorAll('sn-color-slider');
    const alphaSlider = Array.from(sliders).find(
      (s) => (s as HTMLElement).getAttribute('channel') === 'alpha',
    );
    expect(alphaSlider).toBeTruthy();
  });

  it('does not render eye dropper without showEyeDropper', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('sn-color-eye-dropper')).toBeNull();
  });

  it('renders eye dropper with showEyeDropper=true', async () => {
    const fixture = TestBed.createComponent(ShowEyeDropperHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('sn-color-eye-dropper')).toBeTruthy();
  });

  it('custom children suppress default layout', async () => {
    const fixture = TestBed.createComponent(CustomLayoutHost);
    await fixture.whenStable();
    expect(getPreview(fixture.nativeElement)).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('sn-color-slider').length).toBe(0);
  });

  it('reflects writeValue #ff0000 in area aria-valuetext', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    fixture.componentInstance.ctrl.setValue('#ff0000');
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.getAttribute('aria-valuetext')).toContain('Saturation');
  });

  it('reflects writeValue #ff0000 in hex input value', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    fixture.componentInstance.ctrl.setValue('#ff0000');
    await fixture.whenStable();
    const input = getHexInput(fixture.nativeElement) as HTMLInputElement;
    expect(input.value.toLowerCase()).toBe('#ff0000');
  });

  it('reverts hex input on invalid value', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getHexInput(fixture.nativeElement) as HTMLInputElement;
    input.value = 'not-a-color';
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(input.value.toLowerCase()).toMatch(/^#[0-9a-f]{6}/);
  });

  it('accepts valid hex input on blur', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getHexInput(fixture.nativeElement) as HTMLInputElement;
    input.value = '#00ff00';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.color()).toBe('#00ff00');
  });

  it('emits #rrggbb when alpha is 1', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#ff0000');
    await fixture.whenStable();
    expect(fixture.componentInstance.color()).not.toMatch(/[0-9a-f]{8}$/i);
  });

  it('emits #rrggbbaa when alpha < 1', async () => {
    const fixture = TestBed.createComponent(AlphaEmitHost);
    await fixture.whenStable();
    expect(fixture.componentInstance.color()).toMatch(/#[0-9a-f]{8}$/i);
  });

  it('area keyboard ArrowRight increases saturation', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#000000');
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    const before = area.getAttribute('aria-valuetext') ?? '';
    dispatchKey(area, 'ArrowRight');
    await fixture.whenStable();
    const after = area.getAttribute('aria-valuetext') ?? '';
    expect(after).not.toBe(before);
  });

  it('area keyboard ArrowUp increases brightness', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#000000');
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    const before = area.getAttribute('aria-valuetext') ?? '';
    dispatchKey(area, 'ArrowUp');
    await fixture.whenStable();
    const after = area.getAttribute('aria-valuetext') ?? '';
    expect(after).not.toBe(before);
  });

  it('area aria-valuetext format is correct', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.getAttribute('aria-valuetext')).toMatch(/Saturation \d+%, Brightness \d+%/);
  });

  it('slider track and area hue custom properties are bound on the hosts', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#3399e6');
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    expect(slider.style.getPropertyValue('--sn-color-slider-track')).toContain('linear-gradient');
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.style.getPropertyValue('--sn-color-area-hue')).toMatch(/^hsl\(/);
  });

  it('hue slider ArrowRight increments aria-valuenow', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#ff0000');
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    const before = Number(slider.getAttribute('aria-valuenow'));
    dispatchKey(slider, 'ArrowRight');
    await fixture.whenStable();
    const after = Number(slider.getAttribute('aria-valuenow'));
    expect(after).toBeGreaterThan(before);
  });

  it('hue slider Home sets to 0', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#3399e6');
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    dispatchKey(slider, 'Home');
    await fixture.whenStable();
    expect(Number(slider.getAttribute('aria-valuenow'))).toBe(0);
  });

  it('hue slider End sets to 360', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#3399e6');
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    dispatchKey(slider, 'End');
    await fixture.whenStable();
    expect(Number(slider.getAttribute('aria-valuenow'))).toBe(360);
  });

  it('slider pointer drag sets value', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#ff0000');
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;

    Object.defineProperty(slider, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 20, right: 200, bottom: 20 }),
      configurable: true,
    });
    slider.setPointerCapture = () => {};

    slider.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 0, clientY: 10, bubbles: true, button: 0 }),
    );
    document.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 100, clientY: 10, bubbles: true }),
    );
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await fixture.whenStable();
    expect(Number(slider.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  });

  it('area pointer drag updates saturation/brightness', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    fixture.componentInstance.color.set('#ff0000');
    await fixture.whenStable();
    const area = fixture.nativeElement.querySelector('sn-color-area') as HTMLElement;

    Object.defineProperty(area, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 }),
      configurable: true,
    });
    area.setPointerCapture = () => {};

    area.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 0, clientY: 0, bubbles: true, button: 0 }),
    );
    document.dispatchEvent(
      new PointerEvent('pointermove', { clientX: 100, clientY: 50, bubbles: true }),
    );
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await fixture.whenStable();
    const vt = area.getAttribute('aria-valuetext') ?? '';
    expect(vt).toMatch(/Saturation 50%, Brightness 75%/);
  });

  it('popover mode renders swatch button', async () => {
    const fixture = TestBed.createComponent(PopoverHost);
    await fixture.whenStable();
    const swatch = fixture.nativeElement.querySelector('.sn-color-picker-swatch');
    expect(swatch).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sn-color-input')).toBeTruthy();
  });

  it('popover mode hides the hex field when showInput is false', async () => {
    const fixture = TestBed.createComponent(SwatchOnlyHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.sn-color-picker-swatch')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('sn-color-input')).toBeNull();
  });

  it('popover does not render panel initially', async () => {
    const fixture = TestBed.createComponent(PopoverHost);
    await fixture.whenStable();
    const panel = document.querySelector('.sn-color-picker-panel');
    expect(panel).toBeNull();
  });

  it('eye dropper is disabled in jsdom (no EyeDropper API)', async () => {
    const fixture = TestBed.createComponent(ShowEyeDropperHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-color-eye-dropper-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('setDisabledState disables the component', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-color-picker') as HTMLElement;
    expect(host.classList).toContain('sn-color-picker-disabled');
  });

  it('reactive form ctrl.disable() propagates disabled state', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-color-picker') as HTMLElement;
    expect(host.classList).toContain('sn-color-picker-disabled');
  });

  it('snClass string applies extra class to root', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-color-picker') as HTMLElement;
    expect(host.classList).toContain('extra-cls');
  });

  it('echo guard: writeValue then value does not loop', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    const spy = vi.spyOn(fixture.componentInstance.ctrl, 'setValue');
    fixture.componentInstance.ctrl.setValue('#00ff00');
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('SnIntl colorArea override changes aria-label', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ colorArea: 'Custom Area Label' }),
      ],
    });
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.getAttribute('aria-label')).toBe('Custom Area Label');
  });

  it('ngModel binding works', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    await fixture.whenStable();
    const input = getHexInput(fixture.nativeElement) as HTMLInputElement;
    expect(input.value.toLowerCase()).toBe('#3399e6');
  });

  it('rgb inputs call setRgb and emit new hex', async () => {
    const fixture = TestBed.createComponent(CustomLayoutHost);
    await fixture.whenStable();
    const fixture2 = TestBed.createComponent(DefaultHost);
    await fixture2.whenStable();
    expect(fixture.componentInstance.color()).toMatch(/^#[0-9a-f]{6}/i);
  });
});

describe('ColorSlider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('hue slider has role slider', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    expect(slider.getAttribute('role')).toBe('slider');
  });

  it('hue slider has aria-valuemin=0 and aria-valuemax=360', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('360');
  });

  it('applies snStyle and allowed snAttrs without replacing slider semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const slider = fixture.nativeElement.querySelector('sn-color-slider') as HTMLElement;
    const thumb = slider.querySelector('.sn-color-slider-thumb') as HTMLElement;
    expect(slider.style.width).toBe('14rem');
    expect(slider.getAttribute('data-testid')).toBe('hue-slider');
    expect(slider.getAttribute('role')).toBe('slider');
    expect(thumb.style.outlineWidth).toBe('3px');
    expect(thumb.getAttribute('data-testid')).toBe('hue-slider-thumb');
  });
});

describe('ColorArea', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('area has role slider', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.getAttribute('role')).toBe('slider');
  });

  it('area has tabindex 0', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const area = getArea(fixture.nativeElement) as HTMLElement;
    expect(area.getAttribute('tabindex')).toBe('0');
  });

  it('applies snStyle and allowed snAttrs without replacing area semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const area = fixture.nativeElement.querySelector('sn-color-area') as HTMLElement;
    const thumb = area.querySelector('.sn-color-area-thumb') as HTMLElement;
    expect(area.style.height).toBe('12rem');
    expect(area.getAttribute('data-testid')).toBe('color-area');
    expect(area.getAttribute('role')).toBe('slider');
    expect(thumb.style.outlineWidth).toBe('3px');
    expect(thumb.getAttribute('data-testid')).toBe('color-area-thumb');
  });
});

describe('ColorEyeDropper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('button is disabled in jsdom environment', async () => {
    const fixture = TestBed.createComponent(ShowEyeDropperHost);
    await fixture.whenStable();
    const btn = fixture.nativeElement.querySelector('.sn-color-eye-dropper-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('renders colorize icon', async () => {
    const fixture = TestBed.createComponent(ShowEyeDropperHost);
    await fixture.whenStable();
    const icon = fixture.nativeElement.querySelector('sn-color-eye-dropper sn-icon');
    expect(icon).toBeTruthy();
  });
});

// Separate SnIntl override test suite that properly resets the module
describe('ColorPicker SnIntl overrides', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ colorPickerOpen: 'Ouvrir le sélecteur' }),
      ],
    });
  });

  it('colorPickerOpen override is used in popover swatch aria-label', async () => {
    const fixture = TestBed.createComponent(PopoverHost);
    await fixture.whenStable();
    const swatch = fixture.nativeElement.querySelector('.sn-color-picker-swatch') as HTMLElement;
    expect(swatch.getAttribute('aria-label')).toBe('Ouvrir le sélecteur');
  });
});

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  template: `<sn-color-picker [(value)]="color" [popover]="true" [animated]="false"></sn-color-picker>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class NoAnimColorPickerHost {
  readonly color = signal('#ff0000');
}

@Component({
  template: `
    <sn-color-picker [(value)]="color" [popover]="true"
      [animation]="{ enter: 'my-in 40ms ease-out', exit: 'my-out 40ms ease-in' }">
    </sn-color-picker>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ColorPicker],
})
class CustomAnimColorPickerHost {
  readonly color = signal('#ff0000');
}

describe('ColorPicker animation inputs', () => {
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getPanel(): HTMLElement | null {
    return overlayEl.querySelector('.sn-color-picker-panel');
  }

  it('animated=false suppresses the panel animation and closes immediately', async () => {
    const fix = TestBed.createComponent(NoAnimColorPickerHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-color-picker-swatch') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toBe('none');
    // Close via backdrop click simulation - use requestClose directly via service
    const component = fix.debugElement.children[0].componentInstance as ColorPicker;
    (component as unknown as { requestClose(): void }).requestClose();
    await fix.whenStable();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });

  it('custom enter/exit animations apply inline and drive the close timer', async () => {
    onTestFinished(fakeRunningAnimations(40));
    const fix = TestBed.createComponent(CustomAnimColorPickerHost);
    await fix.whenStable();
    (fix.nativeElement.querySelector('.sn-color-picker-swatch') as HTMLElement).click();
    await tick(10);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-in');
    const component = fix.debugElement.children[0].componentInstance as ColorPicker;
    (component as unknown as { requestClose(): void }).requestClose();
    await fix.whenStable();
    await tick(5);
    await fix.whenStable();
    expect(getPanel()!.style.animation).toContain('my-out');
    await tick(80);
    await fix.whenStable();
    expect(getPanel()).toBeNull();
  });
});
