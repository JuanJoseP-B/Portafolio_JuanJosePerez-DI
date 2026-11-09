import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('readiness waits for fonts, the manifest and each settled texture', async () => {
  const timers: Array<() => void> = [];
  const originalSetTimeout = globalThis.setTimeout;
  Object.assign(globalThis, {
    window: {},
    document: { fonts: { load: () => Promise.resolve([]) } },
    setTimeout: (callback: () => void) => { timers.push(callback); return 0; },
  });
  try {
    const progress = await import('../src/lib/loadProgress');
    assert.equal(progress.isLoadReady(), false);
    progress.reportManifest(2);
    progress.reportTextureSettled();
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(progress.isLoadReady(), false);
    progress.reportTextureSettled();
    assert.equal(progress.isLoadReady(), true);
    assert.equal(timers.length, 2); // Font timeout and the overall safety timeout remain in place.
  } finally {
    Object.assign(globalThis, { setTimeout: originalSetTimeout });
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'document');
  }
});
