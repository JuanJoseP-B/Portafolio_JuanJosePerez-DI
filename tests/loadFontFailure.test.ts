import { strict as assert } from 'node:assert';
import { test } from 'node:test';

test('failed font loads settle rather than blocking a ready scene', async () => {
  const originalSetTimeout = globalThis.setTimeout;
  Object.assign(globalThis, {
    window: {},
    document: { fonts: { load: () => Promise.reject(new Error('font failed')) } },
    setTimeout: () => 0,
  });
  try {
    const progress = await import('../src/lib/loadProgress');
    progress.reportManifest(0);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(progress.isLoadReady(), true);
  } finally {
    Object.assign(globalThis, { setTimeout: originalSetTimeout });
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'document');
  }
});
