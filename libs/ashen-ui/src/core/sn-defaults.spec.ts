import { describe, it, expect, beforeEach } from 'vitest';
import {
  Component,
  Injector,
  InjectionToken,
  provideZonelessChangeDetection,
  runInInjectionContext,
  ChangeDetectionStrategy
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SN_INPUT_DEFAULTS, snDefault, snDefaults } from './sn-defaults';

interface Fake {
  str?: string;
  flag?: boolean;
  num?: number;
}
const FAKE = new InjectionToken<Fake>('FAKE');

function inCtx<T>(providers: unknown[], fn: () => T): T {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...(providers as never[])],
  });
  return runInInjectionContext(TestBed.inject(Injector), fn);
}

describe('snDefault', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('returns the fallback when the token is not provided', () => {
    expect(inCtx([], () => snDefault(FAKE, 'str', 'fallback'))).toBe('fallback');
  });

  it('returns the provided value when the token is provided', () => {
    expect(
      inCtx([{ provide: FAKE, useValue: { str: 'configured' } }], () =>
        snDefault(FAKE, 'str', 'fallback'),
      ),
    ).toBe('configured');
  });

  it('falls back per key, so a partial defaults object works', () => {
    // Configuring one field must not blank out the others.
    const providers = [{ provide: FAKE, useValue: { str: 'configured' } }];
    expect(inCtx(providers, () => snDefault(FAKE, 'num', 42))).toBe(42);
  });

  it('passes a configured `false` through instead of treating it as unset', () => {
    // The bug this guards: `value || fallback` would turn `flag: false` back
    // into `true`, so an app could never switch a `true`-by-default input off.
    expect(
      inCtx([{ provide: FAKE, useValue: { flag: false } }], () =>
        snDefault(FAKE, 'flag', true),
      ),
    ).toBe(false);
  });

  it('passes a configured `0` through', () => {
    expect(
      inCtx([{ provide: FAKE, useValue: { num: 0 } }], () => snDefault(FAKE, 'num', 300)),
    ).toBe(0);
  });
});

describe('snDefaults', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('returns null when the token is not provided', () => {
    expect(inCtx([], () => snDefaults(FAKE))).toBeNull();
  });

  it('returns the whole provided object', () => {
    const value = { str: 'x' };
    expect(inCtx([{ provide: FAKE, useValue: value }], () => snDefaults(FAKE))).toBe(value);
  });
});

// Defaults are DI tokens so they can be scoped to a subtree.

@Component({
  selector: 'sn-defaults-probe',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class Probe {
  readonly resolved = snDefault(SN_INPUT_DEFAULTS, 'size', 'md');
}

@Component({
  selector: 'sn-defaults-scoped',
  template: '<sn-defaults-probe />',
  imports: [Probe],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [{ provide: SN_INPUT_DEFAULTS, useValue: { size: 'lg' } }],
})
class Scoped {}

@Component({
  template: '<sn-defaults-probe /><sn-defaults-scoped />',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Probe, Scoped],
})
class Host {}

describe('defaults tokens resolve through the node injector', () => {
  it('lets a component subtree override the application default', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: SN_INPUT_DEFAULTS, useValue: { size: 'sm' } },
      ],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const probes = fixture.debugElement.queryAll(By.directive(Probe));
    expect(probes).toHaveLength(2);
    // Outside the scoped subtree: the application-wide value.
    expect(probes[0].componentInstance.resolved).toBe('sm');
    // Inside it: the subtree's own value.
    expect(probes[1].componentInstance.resolved).toBe('lg');
  });
});
