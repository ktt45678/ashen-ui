import { describe, it, expect, afterEach, vi } from 'vitest';
import { snAfterFrames } from './sn-render-gate';

function withHidden(hidden: boolean): void {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
}

describe('snAfterFrames', () => {
  afterEach(() => {
    delete (document as unknown as Record<string, unknown>)['hidden'];
    vi.unstubAllGlobals();
  });

  it('runs after the requested number of frames', async () => {
    withHidden(false);
    const run = vi.fn();

    snAfterFrames(2, run);
    expect(run).not.toHaveBeenCalled();

    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    expect(run).toHaveBeenCalledOnce();
  });

  it('runs immediately while the document is hidden, without waiting on a frame', () => {
    withHidden(true);
    // A background tab suspends rAF: a gate that waited on it would never open.
    const raf = vi.fn();
    vi.stubGlobal('requestAnimationFrame', raf);
    const run = vi.fn();

    snAfterFrames(2, run);

    expect(run).toHaveBeenCalledOnce();
    expect(raf).not.toHaveBeenCalled();
  });

  it('stops waiting when the tab is backgrounded part-way through', async () => {
    withHidden(false);
    const run = vi.fn();

    snAfterFrames(2, run);
    withHidden(true);
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    expect(run).toHaveBeenCalledOnce();
  });

  it('runs immediately when there is no requestAnimationFrame', () => {
    withHidden(false);
    vi.stubGlobal('requestAnimationFrame', undefined);
    const run = vi.fn();

    snAfterFrames(1, run);

    expect(run).toHaveBeenCalledOnce();
  });
});
