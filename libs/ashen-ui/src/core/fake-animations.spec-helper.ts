/**
 * jsdom has no Web Animations API, so overlays close right after the next
 * render. This makes every element report one running animation of `ms`,
 * which lets a spec observe the closing state. Returns the restore function.
 */
export function fakeRunningAnimations(ms: number): () => void {
  const proto = Element.prototype as { getAnimations?: Element['getAnimations'] };
  const original = proto.getAnimations;
  proto.getAnimations = () => [fakeAnimation(ms)];
  return () => {
    if (original) proto.getAnimations = original;
    else delete proto.getAnimations;
  };
}

function fakeAnimation(ms: number): Animation {
  return {
    currentTime: 0,
    effect: { getComputedTiming: () => ({ endTime: ms }) },
    finished: new Promise((resolve) => setTimeout(resolve, ms)),
  } as unknown as Animation;
}
