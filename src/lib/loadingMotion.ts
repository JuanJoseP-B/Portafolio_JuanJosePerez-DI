/** The loading cover is a minimum, never an additional wait after readiness. */
export function initialHoldMs(elapsed: number, reduced: boolean): number {
  return reduced ? 0 : Math.max(0, 700 - elapsed);
}

/** A short painted hold followed by a crossfade, not a simulated loading delay. */
export function transitionTimings(reduced: boolean): { hold: number; fade: number } {
  return reduced ? { hold: 0, fade: 0 } : { hold: 160, fade: 500 };
}

type Scheduler = {
  requestFrame: (callback: () => void) => number;
  cancelFrame: (id: number) => void;
  setTimer: (callback: () => void, delay: number) => number;
  clearTimer: (id: number) => void;
};

export function createWindowScheduler(browser: Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame' | 'setTimeout' | 'clearTimeout'>): Scheduler {
  return {
    requestFrame: (callback) => browser.requestAnimationFrame(callback),
    cancelFrame: (id) => browser.cancelAnimationFrame(id),
    setTimer: (callback, delay) => browser.setTimeout(callback, delay),
    clearTimer: (id) => browser.clearTimeout(id),
  };
}

/** Start the fade only after the destination has had two opportunities to paint. */
export function scheduleTransitionReveal(scheduler: Scheduler, hold: number, reveal: () => void): () => void {
  let second = 0;
  let timer = 0;
  const first = scheduler.requestFrame(() => {
    second = scheduler.requestFrame(() => {
      timer = scheduler.setTimer(reveal, hold);
    });
  });
  return () => {
    scheduler.cancelFrame(first);
    scheduler.cancelFrame(second);
    scheduler.clearTimer(timer);
  };
}
