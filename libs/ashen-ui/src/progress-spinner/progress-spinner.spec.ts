import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProgressSpinner } from './progress-spinner';
import { SN_PROGRESS_SPINNER_DEFAULTS } from './progress-spinner-defaults';
import { provideSnIntl } from 'ashen-ui/core';

@Component({
  template: `<sn-progress-spinner />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class DefaultHost {}

@Component({
  template: `<sn-progress-spinner [value]="70" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class DeterminateHost {}

@Component({
  template: `<sn-progress-spinner variant="material" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class MaterialIndeterminateHost {}

@Component({
  template: `<sn-progress-spinner [size]="24" color="var(--sn-color-warning)" [value]="30" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class CustomSizeColorHost {}

@Component({
  template: `<sn-progress-spinner [value]="value()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class DynamicValueHost {
  readonly value = signal<number | undefined>(undefined);
}

@Component({
  template: `<sn-progress-spinner ariaLabel="Uploading file" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class CustomAriaLabelHost {}

@Component({
  template: `<sn-progress-spinner [snClass]="'my-class'" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class SnClassHost {}

@Component({
  template: `
    <sn-progress-spinner
      [value]="70"
      [snStyle]="{
        root: { outline: '1px solid red' },
        svg: { color: 'rgb(1, 2, 3)' }
      }"
      [snAttrs]="{
        root: { 'data-testid': 'spinner-root', role: 'presentation', 'aria-label': 'invalid label' },
        svg: { 'data-testid': 'spinner-svg', 'aria-hidden': 'false' }
      }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ProgressSpinner],
})
class SnPartHost {}

describe('ProgressSpinner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-progress-spinner host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.classList).toContain('sn-progress-spinner');
  });

  it('sets role="progressbar" on the host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('role')).toBe('progressbar');
  });

  it('sets aria-valuemin and aria-valuemax on host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('sets default aria-label "Loading" in indeterminate mode', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('uses custom ariaLabel when provided', async () => {
    const fixture = TestBed.createComponent(CustomAriaLabelHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-label')).toBe('Uploading file');
  });

  it('uses SnIntl loading key for default label', async () => {
    TestBed.overrideProvider(provideZonelessChangeDetection, { useValue: {} });
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideSnIntl({ loading: 'Caricamento' }),
      ],
    });
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-label')).toBe('Caricamento');
  });

  it('renders an SVG element', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('applies default spin animation class in indeterminate default mode', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList).toContain('sn-progress-spinner-svg--rotate');
  });

  it('does not apply rotation class in determinate mode', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList).not.toContain('sn-progress-spinner-svg--rotate');
    expect(svg.classList).not.toContain('sn-progress-spinner-svg--rotate-material');
  });

  it('applies determinate host class when value is set', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.classList).toContain('sn-progress-spinner--determinate');
  });

  it('sets aria-valuenow in determinate mode', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-valuenow')).toBe('70');
  });

  it('omits aria-valuenow in indeterminate mode', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-valuenow')).toBeNull();
  });

  it('omits aria-label in determinate mode', async () => {
    const fixture = TestBed.createComponent(DeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-label')).toBeNull();
  });

  it('applies material host class for material variant', async () => {
    const fixture = TestBed.createComponent(MaterialIndeterminateHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.classList).toContain('sn-progress-spinner--material');
  });

  it('applies material rotation class in material indeterminate mode', async () => {
    const fixture = TestBed.createComponent(MaterialIndeterminateHost);
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.classList).toContain('sn-progress-spinner-svg--rotate-material');
  });

  it('renders material arc circle in material indeterminate mode', async () => {
    const fixture = TestBed.createComponent(MaterialIndeterminateHost);
    await fixture.whenStable();
    const arc = fixture.nativeElement.querySelector('.sn-progress-spinner-arc--material');
    expect(arc).toBeTruthy();
  });

  it('sets the size on the host element via inline style', async () => {
    const fixture = TestBed.createComponent(CustomSizeColorHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.style.width).toBe('24px');
    expect(el.style.height).toBe('24px');
  });

  it('defaults size to 32', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.style.width).toBe('32px');
    expect(el.style.height).toBe('32px');
  });

  it('switches from indeterminate to determinate when value is set', async () => {
    const fixture = TestBed.createComponent(DynamicValueHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.getAttribute('aria-valuenow')).toBeNull();
    fixture.componentInstance.value.set(50);
    await fixture.whenStable();
    expect(el.getAttribute('aria-valuenow')).toBe('50');
  });

  it('applies snClass string to the host', async () => {
    const fixture = TestBed.createComponent(SnClassHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-progress-spinner');
    expect(el.classList).toContain('my-class');
  });

  it('default indeterminate fill arc is 25% of the circumference (not zero)', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const circles = fixture.nativeElement.querySelectorAll('circle');
    const fill = circles[circles.length - 1] as SVGCircleElement;
    const dash = fill.getAttribute('stroke-dasharray')!;
    const [arc] = dash.split(' ').map(parseFloat);
    const circumference = 2 * Math.PI * 10;
    expect(arc).toBeCloseTo(0.25 * circumference, 1);
  });

  it('applies snStyle and allowed snAttrs to named parts without replacing spinner semantics', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const root: HTMLElement = el.querySelector('sn-progress-spinner')!;
    const svg: SVGSVGElement = el.querySelector('svg')!;

    expect(root.style.outline).toContain('red');
    expect(root.getAttribute('data-testid')).toBe('spinner-root');
    // role and aria-label stay owned by the component, not the pass-through.
    expect(root.getAttribute('role')).toBe('progressbar');
    expect(root.getAttribute('aria-label')).not.toBe('invalid label');
    expect(svg.style.color).toBe('rgb(1, 2, 3)');
    expect(svg.getAttribute('data-testid')).toBe('spinner-svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ProgressSpinner defaults', () => {
  it('reads size, strokeWidth and variant from SN_PROGRESS_SPINNER_DEFAULTS', async () => {
    TestBed.configureTestingModule({
      imports: [DefaultHost],
      providers: [
        provideZonelessChangeDetection(),
        { provide: SN_PROGRESS_SPINNER_DEFAULTS, useValue: { size: 100, strokeWidth: 1.5, variant: 'material' } },
      ],
    });
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const host = fixture.nativeElement.querySelector('sn-progress-spinner') as HTMLElement;
    expect(host.style.width).toBe('100px');
    expect(host.getAttribute('data-sn-variant')).toBe('material');
    expect(host.querySelector('circle')?.getAttribute('stroke-width')).toBe('1.5');
  });
});
