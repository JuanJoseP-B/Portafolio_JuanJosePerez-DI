import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createWindowScheduler, initialHoldMs, scheduleTransitionReveal, transitionTimings } from '../src/lib/loadingMotion';

test('initial loading only holds for the remaining minimum time', () => {
  assert.equal(initialHoldMs(200, false), 500);
  assert.equal(initialHoldMs(1000, false), 0);
  assert.equal(initialHoldMs(0, true), 0);
});

test('interrupted switches cancel pending frames and timers', () => {
  let nextId = 0;
  const pending = new Map<number, () => void>();
  const scheduler = {
    requestFrame: (callback: () => void) => { const id = ++nextId; pending.set(id, callback); return id; },
    cancelFrame: (id: number) => { pending.delete(id); },
    setTimer: (callback: () => void) => { const id = ++nextId; pending.set(id, callback); return id; },
    clearTimer: (id: number) => { pending.delete(id); },
  };
  const runNext = () => {
    const [id, callback] = pending.entries().next().value!;
    pending.delete(id);
    callback();
  };
  let reveals = 0;
  const cancelFirst = scheduleTransitionReveal(scheduler, 160, () => reveals++);
  runNext(); // First frame; the second is still pending.
  cancelFirst();
  assert.equal(pending.size, 0);
  const cancelSecond = scheduleTransitionReveal(scheduler, 160, () => reveals++);
  runNext();
  runNext(); // Both frames painted; the hold timer is pending.
  cancelSecond();
  assert.equal(pending.size, 0);
  assert.equal(reveals, 0);
  scheduleTransitionReveal(scheduler, 160, () => reveals++);
  runNext();
  runNext();
  runNext();
  assert.equal(reveals, 1);
});

test('mode transition is bounded and reduced motion removes delays', () => {
  assert.deepEqual(transitionTimings(false), { hold: 160, fade: 500 });
  assert.deepEqual(transitionTimings(true), { hold: 0, fade: 0 });
});

test('window scheduler preserves the receiver for browser animation APIs', () => {
  const calls: string[] = [];
  const browser = {
    requestAnimationFrame(this: unknown, _callback: FrameRequestCallback) { assert.equal(this, browser); calls.push('request'); return 1; },
    cancelAnimationFrame(this: unknown, _id: number) { assert.equal(this, browser); calls.push('cancel'); },
    setTimeout(this: unknown, _callback: () => void, _delay: number) { assert.equal(this, browser); calls.push('set'); return 2; },
    clearTimeout(this: unknown, _id: number) { assert.equal(this, browser); calls.push('clear'); },
  };
  const scheduler = createWindowScheduler(browser);
  scheduler.requestFrame(() => {});
  scheduler.cancelFrame(1);
  scheduler.setTimer(() => {}, 160);
  scheduler.clearTimer(2);
  assert.deepEqual(calls, ['request', 'cancel', 'set', 'clear']);
});

