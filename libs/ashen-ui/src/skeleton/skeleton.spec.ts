import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Skeleton } from './skeleton';

@Component({
  template: `<sn-skeleton />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class DefaultHost {}

@Component({
  template: `<sn-skeleton shape="text" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class TextShapeHost {}

@Component({
  template: `<sn-skeleton shape="circle" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class CircleShapeHost {}

@Component({
  template: `<sn-skeleton shape="tile" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class TileShapeHost {}

@Component({
  template: `<sn-skeleton shape="rect" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class RectShapeHost {}

@Component({
  template: `<sn-skeleton animation="pulse" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class PulseAnimationHost {}

@Component({
  template: `<sn-skeleton animation="none" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class NoAnimationHost {}

@Component({
  template: `<sn-skeleton animation="shimmer" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class ShimmerAnimationHost {}

@Component({
  template: `<sn-skeleton width="200px" height="100px" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class CustomSizeHost {}

@Component({
  template: `<sn-skeleton [width]="150" [height]="50" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class NumericSizeHost {}

@Component({
  template: `<sn-skeleton snClass="extra-class" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class SnClassStringHost {}

@Component({
  template: `<sn-skeleton [snClass]="{ root: 'custom-root' }" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class SnClassObjectHost {}

@Component({
  template: `<sn-skeleton [snClass]="[{ root: 'first' }, { root: 'second' }]" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class SnClassArrayHost {}

@Component({
  template: `
    <sn-skeleton
      [snStyle]="{ root: { width: '12rem' } }"
      [snAttrs]="{ root: { 'data-testid': 'loading-card', 'aria-hidden': 'false' } }"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Skeleton],
})
class SnPartHost {}

describe('Skeleton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('applies sn-skeleton host class', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton');
  });

  it('defaults shape to rect', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-rect');
  });

  it('defaults animation to shimmer (no pulse/static class)', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).not.toContain('sn-skeleton-pulse');
    expect(el.classList).not.toContain('sn-skeleton-static');
  });

  it('applies sn-skeleton-text class for shape="text"', async () => {
    const fixture = TestBed.createComponent(TextShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-text');
  });

  it('applies sn-skeleton-circle class for shape="circle"', async () => {
    const fixture = TestBed.createComponent(CircleShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-circle');
  });

  it('applies sn-skeleton-tile class for shape="tile"', async () => {
    const fixture = TestBed.createComponent(TileShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-tile');
  });

  it('applies sn-skeleton-rect class for shape="rect"', async () => {
    const fixture = TestBed.createComponent(RectShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-rect');
  });

  it('applies sn-skeleton-pulse class for animation="pulse"', async () => {
    const fixture = TestBed.createComponent(PulseAnimationHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-pulse');
  });

  it('applies sn-skeleton-static class for animation="none"', async () => {
    const fixture = TestBed.createComponent(NoAnimationHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('sn-skeleton-static');
  });

  it('applies no animation modifier class for animation="shimmer"', async () => {
    const fixture = TestBed.createComponent(ShimmerAnimationHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).not.toContain('sn-skeleton-pulse');
    expect(el.classList).not.toContain('sn-skeleton-static');
  });

  it('sets width and height style from text shape defaults', async () => {
    const fixture = TestBed.createComponent(TextShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-width')).toBeTruthy();
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-height')).toBeTruthy();
  });

  it('sets width and height from explicit string inputs', async () => {
    const fixture = TestBed.createComponent(CustomSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-width')).toBe('200px');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-height')).toBe('100px');
  });

  it('converts numeric width/height inputs to px strings', async () => {
    const fixture = TestBed.createComponent(NumericSizeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-width')).toBe('150px');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-height')).toBe('50px');
  });

  it('applies border-radius for circle shape (50%)', async () => {
    const fixture = TestBed.createComponent(CircleShapeHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.style.getPropertyValue('--sn-skeleton-rendered-radius')).toBe('50%');
  });

  it('sets aria-hidden="true" on the host', async () => {
    const fixture = TestBed.createComponent(DefaultHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies plain string snClass to the root element', async () => {
    const fixture = TestBed.createComponent(SnClassStringHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('extra-class');
  });

  it('applies object snClass root section to the host', async () => {
    const fixture = TestBed.createComponent(SnClassObjectHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('custom-root');
  });

  it('merges array snClass root sections in order', async () => {
    const fixture = TestBed.createComponent(SnClassArrayHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.classList).toContain('first');
    expect(el.classList).toContain('second');
  });

  it('applies snStyle and allowed snAttrs without replacing aria-hidden', async () => {
    const fixture = TestBed.createComponent(SnPartHost);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement.querySelector('sn-skeleton');
    expect(el.style.width).toBe('12rem');
    expect(el.getAttribute('data-testid')).toBe('loading-card');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
