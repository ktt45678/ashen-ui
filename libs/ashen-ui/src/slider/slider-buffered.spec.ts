import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Slider } from './slider';

@Component({
  template: `<sn-slider [value]="20" [buffered]="buffered()" [orientation]="orientation()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Slider],
})
class BufferedHost {
  readonly buffered = signal<number | null>(60);
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
}

describe('Slider buffered range', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  const bar = (root: HTMLElement): HTMLElement | null => root.querySelector('.sn-slider-buffer');

  it('draws a buffer bar sized from the buffered value', async () => {
    const fix = TestBed.createComponent(BufferedHost);
    await fix.whenStable();
    expect(bar(fix.nativeElement)?.style.width).toBe('60%');
  });

  it('clamps to the slider range', async () => {
    const fix = TestBed.createComponent(BufferedHost);
    fix.componentInstance.buffered.set(250);
    await fix.whenStable();
    expect(bar(fix.nativeElement)?.style.width).toBe('100%');
  });

  it('renders nothing without a buffered value', async () => {
    const fix = TestBed.createComponent(BufferedHost);
    fix.componentInstance.buffered.set(null);
    await fix.whenStable();
    expect(bar(fix.nativeElement)).toBeNull();
  });

  it('grows along the block axis when vertical', async () => {
    const fix = TestBed.createComponent(BufferedHost);
    fix.componentInstance.orientation.set('vertical');
    await fix.whenStable();
    expect(bar(fix.nativeElement)?.style.height).toBe('60%');
    expect(bar(fix.nativeElement)?.style.width).toBe('');
  });
});
