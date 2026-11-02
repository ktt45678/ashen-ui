import { describe, it, expect, beforeEach } from 'vitest';
import { Component, provideZonelessChangeDetection, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Dir, Directionality } from '@angular/cdk/bidi';
import { snDirection, snInlineStep, snIsRtl } from './sn-direction';

@Component({
  selector: 'sn-direction-probe',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class Probe {
  readonly direction = snDirection();
  readonly rtl = snIsRtl();
}

@Component({
  template: `
    <div [dir]="dir()">
      <sn-direction-probe />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Dir, Probe],
})
class Host {
  readonly dir = signal<'ltr' | 'rtl'>('ltr');
}

describe('snDirection', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('defaults to ltr', () => {
    const fixture = TestBed.createComponent(Probe);
    fixture.detectChanges();

    expect(fixture.componentInstance.direction()).toBe('ltr');
    expect(fixture.componentInstance.rtl()).toBe(false);
  });

  it('reads the direction of the nearest [dir] ancestor', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.dir.set('rtl');
    fixture.detectChanges();
    const probe = fixture.debugElement.children[0].children[0].componentInstance as Probe;

    expect(probe.direction()).toBe('rtl');
    expect(probe.rtl()).toBe(true);
  });

  it('follows a direction that changes after the component is created', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const probe = fixture.debugElement.children[0].children[0].componentInstance as Probe;
    expect(probe.rtl()).toBe(false);

    fixture.componentInstance.dir.set('rtl');
    fixture.detectChanges();

    expect(probe.rtl()).toBe(true);
  });

  it('reads the document direction when there is no [dir] ancestor', () => {
    TestBed.inject(Directionality).valueSignal.set('rtl');
    const fixture = TestBed.createComponent(Probe);
    fixture.detectChanges();

    expect(fixture.componentInstance.rtl()).toBe(true);
  });
});

describe('snInlineStep', () => {
  it('maps the arrows to the inline axis in ltr', () => {
    expect(snInlineStep('ArrowRight', false)).toBe(1);
    expect(snInlineStep('ArrowLeft', false)).toBe(-1);
  });

  it('swaps the arrows in rtl', () => {
    expect(snInlineStep('ArrowRight', true)).toBe(-1);
    expect(snInlineStep('ArrowLeft', true)).toBe(1);
  });

  it('ignores keys off the inline axis', () => {
    for (const key of ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ']) {
      expect(snInlineStep(key, false)).toBe(0);
      expect(snInlineStep(key, true)).toBe(0);
    }
  });
});
