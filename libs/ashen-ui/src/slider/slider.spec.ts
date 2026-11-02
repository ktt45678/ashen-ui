import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Slider } from './slider';
import { FormField } from '../form-field/form-field';
import { FormFieldLabel } from '../form-field/form-field-label';
import { FormFieldHint } from '../form-field/form-field-hint';

@Component({
  template: `<sn-slider />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class DefaultHost {}

@Component({
  template: `<sn-slider [min]="10" [max]="200" [step]="5" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class CustomRangeHost {}

@Component({
  template: `<sn-slider [showValue]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class NoValueHost {}

@Component({
  template: `<sn-slider [disabled]="true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class DisabledHost {}

@Component({
  template: `<sn-slider [(value)]="val" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class TwoWayHost {
  readonly val = signal(50);
}

@Component({
  template: `<sn-slider [formControl]="ctrl" />`,
  imports: [Slider, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive-form-host' },
})
class ReactiveFormHost {
  ctrl = new FormControl<number>(30);
}

@Component({
  template: `<sn-slider [formControl]="ctrl" />`,
  imports: [Slider, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'data-testid': 'reactive-form-disabled-host' },
})
class ReactiveFormDisabledHost {
  ctrl = new FormControl<number>({ value: 40, disabled: true });
}

@Component({
  template: `<sn-slider [(ngModel)]="val" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider, FormsModule],
})
class NgModelHost {
  val = 25;
}

@Component({
  template: `
    <sn-form-field>
      <sn-label>Volume</sn-label>
      <sn-slider />
      <sn-hint>Drag to adjust</sn-hint>
    </sn-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider, FormField, FormFieldLabel, FormFieldHint],
})
class FormFieldHost {}

@Component({
  template: `<sn-slider [formatValue]="fmt" [(value)]="val" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class FormatValueHost {
  readonly val = signal(50);
  fmt = (v: number) => v + '%';
}

@Component({
  template: `<sn-slider snClass="extra-cls" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class SnClassStringHost {}

@Component({
  template: `<sn-slider [snClass]="{ root: 'root-x', track: 'track-x', fill: 'fill-x', thumb: 'thumb-x', input: 'input-x', value: 'value-x' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-slider orientation="vertical" [(value)]="value" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class VerticalHost {
  readonly value = signal(30);
}

@Component({
  template: `
    <sn-slider
      [min]="0"
      [max]="100"
      [(value)]="value"
      [snStyle]="{
        root: { outline: '1px solid red' },
        track: { color: 'rgb(1, 2, 3)' },
        fill: { color: 'rgb(4, 5, 6)' },
        thumb: { color: 'rgb(7, 8, 9)' },
        input: { color: 'rgb(10, 11, 12)' },
        value: { color: 'rgb(13, 14, 15)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'slider-root' },
        track: { 'data-testid': 'slider-track' },
        fill: { 'data-testid': 'slider-fill' },
        thumb: { 'data-testid': 'slider-thumb' },
        input: { 'data-testid': 'slider-input', min: '999', id: 'hijacked' },
        value: { 'data-testid': 'slider-value' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class SnPartHost {
  readonly value = signal(40);
}

function getRangeInput(el: HTMLElement): HTMLInputElement {
  return el.querySelector('input[type="range"]')!;
}

function getTrack(el: HTMLElement): HTMLElement {
  return el.querySelector('.sn-slider-track')!;
}

function getFill(el: HTMLElement): HTMLElement {
  return el.querySelector('.sn-slider-fill')!;
}

function getThumb(el: HTMLElement): HTMLElement {
  return el.querySelector('.sn-slider-thumb')!;
}

function getValueSpan(el: HTMLElement): HTMLElement | null {
  return el.querySelector('.sn-slider-value');
}

function dispatchInput(input: HTMLInputElement, value: number): void {
  input.value = String(value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('Slider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders host with sn-slider-wrapper class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');
    expect(host.classList).toContain('sn-slider-wrapper');
  });

  it('renders track element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getTrack(fixture.nativeElement)).toBeTruthy();
  });

  it('renders fill element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getFill(fixture.nativeElement)).toBeTruthy();
  });

  it('renders thumb element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getThumb(fixture.nativeElement)).toBeTruthy();
  });

  it('renders native input with type=range', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input).toBeTruthy();
    expect(input.type).toBe('range');
  });

  it('reflects min input on range input', async () => {
    const fixture = TestBed.createComponent(CustomRangeHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.min).toBe(10);
  });

  it('reflects max input on range input', async () => {
    const fixture = TestBed.createComponent(CustomRangeHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.max).toBe(200);
  });

  it('reflects step input on range input', async () => {
    const fixture = TestBed.createComponent(CustomRangeHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.step).toBe(5);
  });

  it('fill width starts at 0% for default value 0', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const fill = getFill(fixture.nativeElement);
    expect(fill.style.width).toBe('0%');
  });

  it('puts the thumb at the start of the track for the minimum value', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const thumb = getThumb(fixture.nativeElement);
    expect(thumb.style.insetInlineStart).toBe('0%');
  });

  it('fill width is 50% when value=50 on 0-100 range', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const fill = getFill(fixture.nativeElement);
    expect(fill.style.width).toBe('50%');
  });

  it('places the thumb halfway along the track for the midpoint value', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const thumb = getThumb(fixture.nativeElement);
    expect(thumb.style.insetInlineStart).toBe('50%');
  });

  it('updates fill and thumb after input event', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    dispatchInput(input, 75);
    await fixture.whenStable();
    const fill = getFill(fixture.nativeElement);
    expect(fill.style.width).toBe('75%');
    const thumb = getThumb(fixture.nativeElement);
    expect(thumb.style.insetInlineStart).toBe('75%');
  });

  it('shows value span by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    expect(getValueSpan(fixture.nativeElement)).toBeTruthy();
  });

  it('hides value span when showValue=false', async () => {
    const fixture = TestBed.createComponent(NoValueHost);
    await fixture.whenStable();
    expect(getValueSpan(fixture.nativeElement)).toBeNull();
  });

  it('displays current value in value span', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const span = getValueSpan(fixture.nativeElement)!;
    expect(span.textContent?.trim()).toBe('50');
  });

  it('uses formatValue to display formatted text', async () => {
    const fixture = TestBed.createComponent(FormatValueHost);
    await fixture.whenStable();
    const span = getValueSpan(fixture.nativeElement)!;
    expect(span.textContent?.trim()).toBe('50%');
  });

  it('sets aria-valuetext when formatValue is provided', async () => {
    const fixture = TestBed.createComponent(FormatValueHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.getAttribute('aria-valuetext')).toBe('50%');
  });

  it('updates aria-valuetext after input event', async () => {
    const fixture = TestBed.createComponent(FormatValueHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    dispatchInput(input, 75);
    await fixture.whenStable();
    expect(input.getAttribute('aria-valuetext')).toBe('75%');
  });

  it('does not set aria-valuetext when no formatValue', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.getAttribute('aria-valuetext')).toBeNull();
  });

  it('adds sn-slider-disabled class when disabled', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');
    expect(host.classList).toContain('sn-slider-disabled');
  });

  it('disables range input when disabled=true', async () => {
    const fixture = TestBed.createComponent(DisabledHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('reflects value model in range input', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.value).toBe(50);
  });

  it('updates value model on input event', async () => {
    const fixture = TestBed.createComponent(TwoWayHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    dispatchInput(input, 80);
    await fixture.whenStable();
    expect(fixture.componentInstance.val()).toBe(80);
  });

  it('writes FormControl value to range input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.value).toBe(30);
  });

  it('emits numeric value to FormControl on input', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    dispatchInput(input, 65);
    await fixture.whenStable();
    expect(fixture.componentInstance.ctrl.value).toBe(65);
  });

  it('disables range input when FormControl is disabled', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('applies setDisabledState via FormControl.disable()', async () => {
    const fixture = TestBed.createComponent(ReactiveFormHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.disable();
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.disabled).toBe(true);
  });

  it('re-enables when FormControl.enable() called', async () => {
    const fixture = TestBed.createComponent(ReactiveFormDisabledHost);
    await fixture.whenStable();
    fixture.componentInstance.ctrl.enable();
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.disabled).toBe(false);
  });

  it('reflects ngModel value in range input', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(+input.value).toBe(25);
  });

  it('updates ngModel on input event', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    dispatchInput(input, 60);
    await fixture.whenStable();
    expect(fixture.componentInstance.val).toBe(60);
  });

  it('sets range input id from FormField controlId', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.id).toMatch(/^sn-ff-ctrl/);
  });

  it('sets aria-describedby from FormField hint', async () => {
    const fixture = TestBed.createComponent(FormFieldHost);
    await fixture.whenStable();
    const input = getRangeInput(fixture.nativeElement);
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('applies string snClass to root host', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');
    expect(host.classList).toContain('extra-cls');
  });

  it('applies object snClass root section to host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');
    expect(host.classList).toContain('root-x');
  });

  it('applies object snClass track section to track element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    expect(getTrack(fixture.nativeElement).classList).toContain('track-x');
  });

  it('applies object snClass fill section to fill element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    expect(getFill(fixture.nativeElement).classList).toContain('fill-x');
  });

  it('applies object snClass thumb section to thumb element', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    expect(getThumb(fixture.nativeElement).classList).toContain('thumb-x');
  });

  it('applies object snClass input section to range input', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    expect(getRangeInput(fixture.nativeElement).classList).toContain('input-x');
  });

  it('applies object snClass value section to value span', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const span = getValueSpan(fixture.nativeElement);
    expect(span).toBeTruthy();
    expect(span!.classList).toContain('value-x');
  });

  it('is horizontal by default, with the fill sized along the width', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');

    expect(host.classList).not.toContain('sn-slider-vertical');
    expect(host.getAttribute('data-sn-orientation')).toBe('horizontal');
    expect(getFill(fixture.nativeElement).style.height).toBe('');
  });

  it('vertical sizes the fill along the height instead of the width', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const fill = getFill(fixture.nativeElement);

    expect(fill.style.height).toBe('30%');
    expect(fill.style.width).toBe('');
  });

  it('vertical offsets the thumb from the bottom, not the inline start', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const thumb = getThumb(fixture.nativeElement);

    expect(thumb.style.bottom).toBe('30%');
    expect(thumb.style.getPropertyValue('inset-inline-start')).toBe('');
  });

  it('vertical marks the host and the range with the orientation', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('sn-slider');

    expect(host.classList).toContain('sn-slider-vertical');
    expect(host.getAttribute('data-sn-orientation')).toBe('vertical');
    expect(getRangeInput(fixture.nativeElement).getAttribute('aria-orientation')).toBe('vertical');
  });

  it('vertical still commits a value through the range input', async () => {
    const fixture = TestBed.createComponent(VerticalHost);
    await fixture.whenStable();

    dispatchInput(getRangeInput(fixture.nativeElement), 80);
    await fixture.whenStable();

    expect(fixture.componentInstance.value()).toBe(80);
    expect(getFill(fixture.nativeElement).style.height).toBe('80%');
  });

  it('applies snStyle and allowed snAttrs to named parts without breaking slider semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-slider')!;
    const track = getTrack(el);
    const fill = getFill(el);
    const thumb = getThumb(el);
    const input = getRangeInput(el);
    const value = getValueSpan(el)!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('slider-root');
    expect(track.style.color).toBe('rgb(1, 2, 3)');
    expect(track.getAttribute('data-testid')).toBe('slider-track');
    expect(fill.style.color).toBe('rgb(4, 5, 6)');
    expect(fill.getAttribute('data-testid')).toBe('slider-fill');
    expect(thumb.style.color).toBe('rgb(7, 8, 9)');
    expect(thumb.getAttribute('data-testid')).toBe('slider-thumb');
    expect(input.style.color).toBe('rgb(10, 11, 12)');
    expect(input.getAttribute('data-testid')).toBe('slider-input');
    expect(value.style.color).toBe('rgb(13, 14, 15)');
    expect(value.getAttribute('data-testid')).toBe('slider-value');

    // Reserved attrs stay under the component's control, not the pass-through's.
    expect(input.min).toBe('0');
    expect(input.id).not.toBe('hijacked');
  });
});
