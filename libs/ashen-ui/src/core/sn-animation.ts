import { type Injector, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Custom show/hide animation for overlay-style components.
 *
 * Each value is a CSS `animation` shorthand (e.g. `'my-pop-in 200ms ease-out'`)
 * applied inline to the panel element, replacing the component's built-in
 * keyframe animation. Keyframes must be defined globally (not inside a
 * component stylesheet with emulated encapsulation).
 */
export interface SnShowHideAnimation {
  /** Animation applied while the panel is entering. */
  enter?: string;
  /** Animation applied while the panel is exiting. The close waits for it to finish. */
  exit?: string;
}

/** Element(s) whose running animations an overlay waits for. */
export type SnAnimationTarget = Element | readonly Element[] | null | undefined;

/** Extra wait past the expected end, in case the animation's finish is reported late. */
const FINISH_GRACE_MS = 50;

/**
 * Call `done` once the finite animations running in `target` (one element or
 * several) and their subtrees have finished. The duration comes from the
 * running animations, so CSS owns it and themes can change it. Calls `done` at
 * once when nothing is animating.
 * Returns a function that cancels the wait.
 */
export function snWaitForAnimations(target: SnAnimationTarget, done: () => void): () => void {
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    done();
  };
  const elements = Array.isArray(target) ? target : target ? [target as Element] : [];
  const animations = elements
    .flatMap((element) => element.getAnimations?.({ subtree: true }) ?? [])
    .filter((animation) => Number.isFinite(remainingMs(animation)));
  if (animations.length === 0) {
    finish();
    return () => undefined;
  }
  // Safety net: `finished` never settles for a paused animation.
  const longest = Math.max(...animations.map(remainingMs));
  const fallback = setTimeout(finish, longest + FINISH_GRACE_MS);
  void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
    clearTimeout(fallback);
    finish();
  });
  return () => {
    settled = true;
    clearTimeout(fallback);
  };
}

/**
 * Wait for the next render, so the closing state's exit animation has started,
 * then wait for it to finish and call `done`. Runs `done` at once on the server.
 * Returns a function that cancels the wait.
 */
export function snAfterExitAnimation(
  injector: Injector,
  target: () => SnAnimationTarget,
  done: () => void,
): () => void {
  if (!isPlatformBrowser(injector.get(PLATFORM_ID))) {
    done();
    return () => undefined;
  }
  let cancelWait: (() => void) | null = null;
  const render = afterNextRender(
    {
      read: () => {
        cancelWait = snWaitForAnimations(target(), done);
      },
    },
    { injector },
  );
  return () => {
    render.destroy();
    cancelWait?.();
  };
}

function remainingMs(animation: Animation): number {
  const end = Number(animation.effect?.getComputedTiming().endTime ?? 0);
  const current = Number(animation.currentTime ?? 0);
  return end - current;
}
