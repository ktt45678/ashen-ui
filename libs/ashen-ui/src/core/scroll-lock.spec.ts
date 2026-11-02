import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { ScrollLock } from './scroll-lock';

/**
 * What belongs here is the REF-COUNTING, which is the part `ScrollLock` adds on
 * top of the CDK and the reason the wrapper exists at all. The DOM effect
 * (`.cdk-global-scrollblock`, the frozen scroll offset) is CDK-owned and cannot
 * be asserted under jsdom anyway: `BlockScrollStrategy._canBeEnabled()` only
 * returns true when the document actually overflows, and jsdom performs no
 * layout, so `scrollHeight` is always 0 and the strategy is a permanent no-op.
 * Real-browser behaviour is covered by e2e/scroll-lock.spec.ts.
 */
describe('ScrollLock', () => {
  let enable: ReturnType<typeof vi.spyOn>;
  let disable: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    enable = vi.spyOn(BlockScrollStrategy.prototype, 'enable').mockImplementation(() => {});
    disable = vi.spyOn(BlockScrollStrategy.prototype, 'disable').mockImplementation(() => {});
  });

  afterEach(() => {
    enable.mockRestore();
    disable.mockRestore();
  });

  const lock = () => TestBed.inject(ScrollLock);

  it('enables the strategy on the first lock and disables it on the last unlock', () => {
    const sl = lock();

    sl.lock();
    expect(enable).toHaveBeenCalledTimes(1);
    expect(disable).not.toHaveBeenCalled();

    sl.unlock();
    expect(disable).toHaveBeenCalledTimes(1);
  });

  it('keeps the page blocked until every nested holder releases', () => {
    // BlockScrollStrategy is per overlay and a second enable() is a no-op, so the ref-count keeps nested dialogs locked.
    const sl = lock();
    sl.lock();
    sl.lock();
    sl.lock();

    // Only the outermost lock touches the strategy.
    expect(enable).toHaveBeenCalledTimes(1);

    sl.unlock();
    sl.unlock();
    expect(disable).not.toHaveBeenCalled();

    sl.unlock();
    expect(disable).toHaveBeenCalledTimes(1);
  });

  it('ignores an unbalanced unlock instead of driving the counter negative', () => {
    const sl = lock();

    sl.unlock();
    sl.unlock();
    expect(disable).not.toHaveBeenCalled();

    // A stray unlock must not leave the counter below zero; if it did, the next
    // genuine lock/unlock pair would leave the page permanently blocked.
    sl.lock();
    expect(enable).toHaveBeenCalledTimes(1);
    sl.unlock();
    expect(disable).toHaveBeenCalledTimes(1);
  });

  it('builds a fresh strategy per lock cycle', () => {
    const sl = lock();

    sl.lock();
    sl.unlock();
    sl.lock();
    sl.unlock();

    expect(enable).toHaveBeenCalledTimes(2);
    expect(disable).toHaveBeenCalledTimes(2);
  });

  it('never reserves a gutter or repaints the page background', () => {
    // Only the properties the lock set are cleared, not the background shorthand.
    const html = document.documentElement;
    html.style.backgroundImage = 'linear-gradient(red, blue)';

    const sl = lock();
    sl.lock();

    expect(html.style.paddingRight).toBe('');
    expect(html.style.scrollbarGutter).toBe('');
    expect(html.style.background).toBe('');
    expect(html.style.backgroundImage).toBe('linear-gradient(red, blue)');

    sl.unlock();
    html.style.backgroundImage = '';
  });
  it('hides the page scrollbar while a hideScrollbar holder is active', () => {
    const html = document.documentElement;
    const sl = lock();

    sl.lock();
    expect(html.style.overflowY).toBe('');

    sl.lock({ hideScrollbar: true });
    sl.lock({ hideScrollbar: true });
    expect(html.style.overflowY).toBe('hidden');

    sl.unlock({ hideScrollbar: true });
    expect(html.style.overflowY).toBe('hidden');

    sl.unlock({ hideScrollbar: true });
    expect(html.style.overflowY).toBe('');
    expect(disable).not.toHaveBeenCalled();

    sl.unlock();
    expect(disable).toHaveBeenCalledTimes(1);
  });
});
