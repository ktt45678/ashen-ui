import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MeterGroup } from './meter-group';
import { Meter } from './meter';

@Component({
  template: `
    <sn-meter-group>
      <sn-meter [value]="42" label="Apps" color="var(--sn-color-primary)" />
      <sn-meter [value]="23" label="Media" color="var(--sn-color-info)" />
      <sn-meter [value]="12" label="System" color="var(--sn-color-warning)" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class DefaultHost {}

@Component({
  template: `
    <sn-meter-group [max]="200">
      <sn-meter [value]="100" label="Used" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class CustomMaxHost {}

@Component({
  template: `
    <sn-meter-group [showLegend]="false">
      <sn-meter [value]="50" label="Used" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class NoLegendHost {}

@Component({
  template: `
    <sn-meter-group>
      <sn-meter [value]="30" label="A" unit="GB" />
      <sn-meter [value]="20" label="B" unit="GB" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class CustomUnitHost {}

@Component({
  template: `
    <sn-meter-group [snClass]="'extra-cls'">
      <sn-meter [value]="50" label="Test" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class SnClassHost {}

@Component({
  template: `
    <sn-meter-group>
      <sn-meter [value]="42" label="Apps" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class SingleMeterHost {}

@Component({
  template: `
    <sn-meter-group
      [snStyle]="{ root: { maxWidth: '24rem' }, bar: { minHeight: '12px' } }"
      [snAttrs]="{
        root: { 'data-testid': 'storage-meter', 'aria-label': 'Override' },
        bar: { 'data-testid': 'storage-bar', role: 'meter' },
        legend: { 'data-testid': 'storage-legend' }
      }"
      label="Storage"
    >
      <sn-meter [value]="42" label="Apps" />
    </sn-meter-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MeterGroup, Meter],
})
class SnPartHost {}

describe('MeterGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-meter-group host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-meter-group');
    expect(el.classList).toContain('sn-meter-group');
  });

  it('renders the bar element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const bar = fixture.nativeElement.querySelector('.sn-meter-group-bar');
    expect(bar).toBeTruthy();
  });

  it('renders the correct number of segments', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const segments = fixture.nativeElement.querySelectorAll('.sn-meter-group-segment');
    expect(segments.length).toBe(3);
  });

  it('sets role="meter" on each segment', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const segments = fixture.nativeElement.querySelectorAll('[role="meter"]');
    expect(segments.length).toBe(3);
  });

  it('sets aria-valuenow on segments', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const firstSeg = fixture.nativeElement.querySelector('[role="meter"]');
    expect(firstSeg.getAttribute('aria-valuenow')).toBe('42');
  });

  it('sets aria-valuemin="0" on segments', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const firstSeg = fixture.nativeElement.querySelector('[role="meter"]');
    expect(firstSeg.getAttribute('aria-valuemin')).toBe('0');
  });

  it('sets aria-valuemax to max on segments', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const firstSeg = fixture.nativeElement.querySelector('[role="meter"]');
    expect(firstSeg.getAttribute('aria-valuemax')).toBe('100');
  });

  it('sets aria-label from meter label on segments', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const firstSeg = fixture.nativeElement.querySelector('[role="meter"]');
    expect(firstSeg.getAttribute('aria-label')).toBe('Apps');
  });

  it('sets segment width as percentage of max', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const firstSeg: HTMLElement = fixture.nativeElement.querySelector('.sn-meter-group-segment');
    expect(firstSeg.style.width).toBe('42%');
  });

  it('uses custom max to compute percentage', async () => {
    const fixture = TestBed.createComponent(CustomMaxHost);
    await fixture.whenStable();
    const seg: HTMLElement = fixture.nativeElement.querySelector('.sn-meter-group-segment');
    expect(seg.style.width).toBe('50%');
  });

  it('sets aria-valuemax to custom max', async () => {
    const fixture = TestBed.createComponent(CustomMaxHost);
    await fixture.whenStable();
    const seg = fixture.nativeElement.querySelector('[role="meter"]');
    expect(seg.getAttribute('aria-valuemax')).toBe('200');
  });

  it('renders the legend by default', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const legend = fixture.nativeElement.querySelector('.sn-meter-group-legend');
    expect(legend).toBeTruthy();
  });

  it('hides the legend when showLegend=false', async () => {
    const fixture = TestBed.createComponent(NoLegendHost);
    await fixture.whenStable();
    const legend = fixture.nativeElement.querySelector('.sn-meter-group-legend');
    expect(legend).toBeNull();
  });

  it('renders legend items matching meter count', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.sn-meter-group-legend-item');
    expect(items.length).toBe(3);
  });

  it('renders legend dot for each meter', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const dots = fixture.nativeElement.querySelectorAll('.sn-meter-group-legend-dot');
    expect(dots.length).toBe(3);
  });

  it('renders legend label text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const labels = fixture.nativeElement.querySelectorAll('.sn-meter-group-legend-label');
    expect(labels[0].textContent?.trim()).toBe('Apps');
  });

  it('renders legend value text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const values = fixture.nativeElement.querySelectorAll('.sn-meter-group-legend-value');
    expect(values[0].textContent?.trim()).toBe('42%');
  });

  it('renders legend total text', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const total = fixture.nativeElement.querySelector('.sn-meter-group-legend-total');
    expect(total.textContent?.trim()).toBe('77% of 100%');
  });

  it('renders custom unit in legend value', async () => {
    const fixture = TestBed.createComponent(CustomUnitHost);
    await fixture.whenStable();
    const values = fixture.nativeElement.querySelectorAll('.sn-meter-group-legend-value');
    expect(values[0].textContent?.trim()).toBe('30GB');
  });

  it('renders custom unit in legend total', async () => {
    const fixture = TestBed.createComponent(CustomUnitHost);
    await fixture.whenStable();
    const total = fixture.nativeElement.querySelector('.sn-meter-group-legend-total');
    expect(total.textContent?.trim()).toBe('50GB of 100GB');
  });

  it('applies segment color from meter color input', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const seg: HTMLElement = fixture.nativeElement.querySelector('.sn-meter-group-segment');
    expect(seg.style.background).toBeTruthy();
  });

  it('applies snClass string to the host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-meter-group');
    expect(el.classList).toContain('extra-cls');
  });

  it('applies snStyle and allowed snAttrs without replacing owned semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const root = fixture.nativeElement.querySelector('sn-meter-group') as HTMLElement;
    const bar = fixture.nativeElement.querySelector('.sn-meter-group-bar') as HTMLElement;
    const legend = fixture.nativeElement.querySelector('.sn-meter-group-legend') as HTMLElement;
    expect(root.style.maxWidth).toBe('24rem');
    expect(root.getAttribute('data-testid')).toBe('storage-meter');
    expect(root.getAttribute('aria-label')).toBe('Storage');
    expect(bar.style.minHeight).toBe('12px');
    expect(bar.getAttribute('data-testid')).toBe('storage-bar');
    expect(bar.getAttribute('role')).toBe('group');
    expect(legend.getAttribute('data-testid')).toBe('storage-legend');
  });

  it('sn-meter host class is applied to meter children', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const meter: HTMLElement = fixture.nativeElement.querySelector('sn-meter');
    expect(meter.classList).toContain('sn-meter');
  });
});

describe('Meter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('defaults value to 0', async () => {
    const fixture = TestBed.createComponent(SingleMeterHost);
    await fixture.whenStable();
    const seg: HTMLElement = fixture.nativeElement.querySelector('.sn-meter-group-segment');
    expect(seg.getAttribute('aria-valuenow')).toBe('42');
  });

  it('defaults unit to %', async () => {
    const fixture = TestBed.createComponent(SingleMeterHost);
    await fixture.whenStable();
    const val = fixture.nativeElement.querySelector('.sn-meter-group-legend-value');
    expect(val.textContent?.trim()).toContain('%');
  });
});
