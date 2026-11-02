import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProgressBar } from './progress-bar';

@Component({
  template: `<sn-progress-bar [value]="64" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class DeterminateHost {}

@Component({
  template: `<sn-progress-bar [indeterminate]="true" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class IndeterminateHost {}

@Component({
  template: `<sn-progress-bar [value]="64" variant="material" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class MaterialDeterminateHost {}

@Component({
  template: `<sn-progress-bar [indeterminate]="true" variant="material" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class MaterialIndeterminateHost {}

@Component({
  template: `<sn-progress-bar [value]="value()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class DynamicValueHost {
  readonly value = signal<number>(0);
}

@Component({
  template: `<sn-progress-bar [value]="64" [showValue]="false" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class HideValueHost {}

@Component({
  template: `<sn-progress-bar [value]="150" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class ClampHighHost {}

@Component({
  template: `<sn-progress-bar [value]="-10" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class ClampLowHost {}

@Component({
  template: `<sn-progress-bar [value]="50" [snClass]="'extra-class'" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class SnClassHost {}

@Component({
  template: `
    <sn-progress-bar
      [value]="64"
      [snStyle]="{
        root: { outline: '1px solid red' },
        track: { color: 'rgb(1, 2, 3)' },
        fill: { color: 'rgb(4, 5, 6)' },
        label: { color: 'rgb(7, 8, 9)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'bar-root' },
        track: { 'data-testid': 'bar-track', role: 'presentation', 'aria-valuenow': '999' },
        fill: { 'data-testid': 'bar-fill' },
        label: { 'data-testid': 'bar-label', 'aria-hidden': 'false' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressBar],
})
class SnPartHost {}

describe('ProgressBar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-progress-bar host class', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-bar');
    expect(el.classList).toContain('sn-progress-bar');
  });

  it('renders the track element', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('.sn-progress-bar-track');
    expect(track).toBeTruthy();
  });

  it('sets role="progressbar" on the track', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(track).toBeTruthy();
    expect(track.getAttribute('role')).toBe('progressbar');
  });

  it('sets aria-valuenow to the clamped value', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).toBe('64');
  });

  it('sets aria-valuemin="0" and aria-valuemax="100"', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
  });

  it('shows the value label by default in determinate mode', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-progress-bar-value');
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('64%');
  });

  it('hides the value label when showValue=false', async () => {
    const fixture = TestBed.createComponent(HideValueHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-progress-bar-value');
    expect(label).toBeNull();
  });

  it('does not show the value label in indeterminate mode', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-progress-bar-value');
    expect(label).toBeNull();
  });

  it('applies indeterminate fill class in default indeterminate mode', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const fill = fixture.nativeElement.querySelector('.sn-progress-bar-fill--indeterminate');
    expect(fill).toBeTruthy();
  });

  it('omits aria-valuenow in indeterminate mode', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).toBeNull();
  });

  it('applies sn-progress-bar--indeterminate host class when indeterminate', async () => {
    const fixture = TestBed.createComponent(IndeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-bar');
    expect(el.classList).toContain('sn-progress-bar--indeterminate');
  });

  it('does not apply sn-progress-bar--indeterminate when determinate', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-bar');
    expect(el.classList).not.toContain('sn-progress-bar--indeterminate');
  });

  it('applies sn-progress-bar--material host class for material variant', async () => {
    const fixture = TestBed.createComponent(MaterialDeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-bar');
    expect(el.classList).toContain('sn-progress-bar--material');
  });

  it('renders material track class in material variant', async () => {
    const fixture = TestBed.createComponent(MaterialDeterminateHost);
    await fixture.whenStable();
    const track = fixture.nativeElement.querySelector('.sn-progress-bar-track--material');
    expect(track).toBeTruthy();
  });

  it('renders stop dot in material determinate mode', async () => {
    const fixture = TestBed.createComponent(MaterialDeterminateHost);
    await fixture.whenStable();
    const dot = fixture.nativeElement.querySelector('.sn-progress-bar-stop-dot');
    expect(dot).toBeTruthy();
  });

  it('renders track remainder in material determinate mode', async () => {
    const fixture = TestBed.createComponent(MaterialDeterminateHost);
    await fixture.whenStable();
    const rem = fixture.nativeElement.querySelector('.sn-progress-bar-track-remainder');
    expect(rem).toBeTruthy();
  });

  it('renders material indeterminate fill class', async () => {
    const fixture = TestBed.createComponent(MaterialIndeterminateHost);
    await fixture.whenStable();
    const fill = fixture.nativeElement.querySelector('.sn-progress-bar-fill--indeterminate-material');
    expect(fill).toBeTruthy();
  });

  it('clamps value above 100', async () => {
    const fixture = TestBed.createComponent(ClampHighHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-progress-bar-value');
    expect(label.textContent?.trim()).toBe('100%');
  });

  it('clamps value below 0', async () => {
    const fixture = TestBed.createComponent(ClampLowHost);
    await fixture.whenStable();
    const label = fixture.nativeElement.querySelector('.sn-progress-bar-value');
    expect(label.textContent?.trim()).toBe('0%');
  });

  it('updates fill width when value changes', async () => {
    const fixture = TestBed.createComponent(DynamicValueHost);
    fixture.componentInstance.value.set(30);
    await fixture.whenStable();
    const fill = fixture.nativeElement.querySelector('.sn-progress-bar-fill');
    expect(fill.style.width).toBe('30%');
    fixture.componentInstance.value.set(70);
    await fixture.whenStable();
    expect(fill.style.width).toBe('70%');
  });

  it('applies snClass string to the host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-bar');
    expect(el.classList).toContain('extra-class');
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing progress-bar semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-progress-bar')!;
    const track: HTMLElement = el.querySelector('.sn-progress-bar-track')!;
    const fill: HTMLElement = el.querySelector('.sn-progress-bar-fill')!;
    const label: HTMLElement = el.querySelector('.sn-progress-bar-value')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('bar-root');
    expect(track.style.color).toBe('rgb(1, 2, 3)');
    expect(track.getAttribute('data-testid')).toBe('bar-track');
    // role and aria-valuenow stay owned by the component, not the pass-through.
    expect(track.getAttribute('role')).toBe('progressbar');
    expect(track.getAttribute('aria-valuenow')).toBe('64');
    expect(fill.style.color).toBe('rgb(4, 5, 6)');
    expect(fill.getAttribute('data-testid')).toBe('bar-fill');
    expect(label.style.color).toBe('rgb(7, 8, 9)');
    expect(label.getAttribute('data-testid')).toBe('bar-label');
    expect(label.getAttribute('aria-hidden')).toBe('true');
  });
});
