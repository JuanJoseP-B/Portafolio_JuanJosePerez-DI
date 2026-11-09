import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('the safety timeout releases readiness when assets never settle', async () => {
  const timers = new Map<number, () => void>();
  const originalSetTimeout = globalThis.setTimeout;
  Object.assign(globalThis, {
    window: {},
    document: { fonts: { load: () => Promise.reject(new Error('font failed')) } },
    setTimeout: (callback: () => void, delay: number) => { timers.set(delay, callback); return 0; },
  });
  try {
    const progress = await import('../src/lib/loadProgress');
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(progress.isLoadReady(), false);
    assert.ok(timers.has(3000));
    assert.ok(timers.has(12000));
    timers.get(12000)!();
    assert.equal(progress.isLoadReady(), true);
  } finally {
    Object.assign(globalThis, { setTimeout: originalSetTimeout });
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'document');
  }
});
