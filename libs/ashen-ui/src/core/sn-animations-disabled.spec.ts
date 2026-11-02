import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import {
  ANIMATION_MODULE_TYPE,
  Component,
  Injector,
  runInInjectionContext,
  provideZonelessChangeDetection,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SN_ANIMATIONS_DISABLED,
  provideSnAnimations,
  snAnimated,
  snAnimationsDisabled,
  snPrefersReducedMotion,
} from './sn-animations-disabled';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Select } from 'ashen-ui/select';
import { ListOption } from 'ashen-ui/listbox';
import { fakeRunningAnimations } from './fake-animations.spec-helper';

function inCtx<T>(providers: unknown[], fn: () => T): T {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...(providers as never[])],
  });
  return runInInjectionContext(TestBed.inject(Injector), fn);
}

describe('snAnimationsDisabled', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('follows an explicit SN_ANIMATIONS_DISABLED value', () => {
    expect(inCtx([{ provide: SN_ANIMATIONS_DISABLED, useValue: true }], snAnimationsDisabled)()).toBe(true);
    expect(inCtx([{ provide: SN_ANIMATIONS_DISABLED, useValue: false }], snAnimationsDisabled)()).toBe(false);
  });

  it('honours provideNoopAnimations via ANIMATION_MODULE_TYPE', () => {
    const off = inCtx(
      [{ provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' }],
      snAnimationsDisabled,
    );
    expect(off()).toBe(true);
  });

  it('lets an explicit token win over ANIMATION_MODULE_TYPE', () => {
    const on = inCtx(
      [
        { provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' },
        { provide: SN_ANIMATIONS_DISABLED, useValue: false },
      ],
      snAnimationsDisabled,
    );
    expect(on()).toBe(false);
  });

  it('falls through to prefers-reduced-motion when nothing is provided', () => {
    const original = window.matchMedia;
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => listeners.push(cb),
      removeEventListener: () => {},
    })) as never;

    try {
      const off = inCtx([], snAnimationsDisabled);
      expect(off()).toBe(true);

      // Tracked live: flipping the OS setting must update the signal, so an app
      // left open across a preference change starts honouring it immediately.
      listeners.forEach((cb) => cb({ matches: false }));
      expect(off()).toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('snPrefersReducedMotion', () => {
  it('shares one media query listener across every caller', () => {
    const original = window.matchMedia;
    let queries = 0;
    let listeners = 0;
    window.matchMedia = ((q: string) => {
      queries++;
      return {
        matches: false,
        media: q,
        addEventListener: () => listeners++,
        removeEventListener: () => {},
      };
    }) as never;

    try {
      const first = inCtx([], snPrefersReducedMotion);
      const second = inCtx([], snPrefersReducedMotion);
      expect(second).toBe(first);
      expect(queries).toBe(1);
      expect(listeners).toBe(1);
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('provideSnAnimations', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it("'disabled' turns animations off", () => {
    expect(inCtx([provideSnAnimations('disabled')], snAnimationsDisabled)()).toBe(true);
  });

  it("'enabled' keeps them on even if the OS asks for reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as never;
    try {
      expect(inCtx([provideSnAnimations('enabled')], snAnimationsDisabled)()).toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });

  it("'reduced-motion' leaves the token unprovided rather than pinning it false", () => {
    // Providing `false` here would defeat the very preference the mode exists to
    // honour, so the mode must contribute no providers at all.
    expect(provideSnAnimations('reduced-motion')).toEqual([]);
  });
});

describe('snAnimated', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('animates only when the input and the app setting agree', () => {
    const on = signal(true);
    expect(inCtx([{ provide: SN_ANIMATIONS_DISABLED, useValue: false }], () => snAnimated(on))()).toBe(true);
    expect(inCtx([{ provide: SN_ANIMATIONS_DISABLED, useValue: true }], () => snAnimated(on))()).toBe(false);

    const off = signal(false);
    expect(inCtx([{ provide: SN_ANIMATIONS_DISABLED, useValue: false }], () => snAnimated(off))()).toBe(false);
  });
});

@Component({
  template: `
    <sn-select [(value)]="value">
      <sn-list-option value="a">A</sn-list-option>
      <sn-list-option value="b">B</sn-list-option>
    </sn-select>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [Select, ListOption],
})
class SelectHost {
  readonly value = signal<string | null>(null);
}

describe('animations disabled makes overlay teardown synchronous', () => {
  const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

  let overlayContainer: OverlayContainer;

  function setup(providers: unknown[]) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...(providers as never[])],
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    return TestBed.createComponent(SelectHost);
  }

  async function openThenEscape(providers: unknown[]) {
    const f = setup(providers);
    await f.whenStable();
    (f.nativeElement.querySelector('.sn-select-trigger') as HTMLElement).click();
    await tick(10);
    await f.whenStable();

    const overlayEl = overlayContainer.getContainerElement();
    expect(overlayEl.querySelector('[role="listbox"]')).not.toBeNull();

    overlayEl.dispatchEvent(
      new KeyboardEvent('keydown', { keyCode: ESCAPE, bubbles: true } as never),
    );
    return { fixture: f, overlayEl };
  }

  afterEach(() => overlayContainer?.ngOnDestroy());

  it('detaches on the next tick instead of after the exit animation', async () => {
    // With animations off, one macrotask is enough instead of waiting out the exit timer.
    const { fixture, overlayEl } = await openThenEscape([
      { provide: SN_ANIMATIONS_DISABLED, useValue: true },
    ]);
    await tick(0);
    await fixture.whenStable();
    expect(overlayEl.querySelector('[role="listbox"]')).toBeNull();
  });

  it('still waits out the exit animation when animations are on', async () => {
    onTestFinished(fakeRunningAnimations(120));
    // The contrast that makes the test above meaningful: same interaction, same
    // single tick, panel still attached because the close timer has not fired.
    const { fixture, overlayEl } = await openThenEscape([
      { provide: SN_ANIMATIONS_DISABLED, useValue: false },
    ]);
    await tick(0);
    await fixture.whenStable();
    expect(overlayEl.querySelector('[role="listbox"]')).not.toBeNull();

    await tick(200);
    await fixture.whenStable();
    expect(overlayEl.querySelector('[role="listbox"]')).toBeNull();
  });
});
