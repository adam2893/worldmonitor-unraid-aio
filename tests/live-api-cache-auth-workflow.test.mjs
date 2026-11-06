import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const workflow = readFileSync(
  new URL('../.github/workflows/live-api-cache-auth.yml', import.meta.url),
  'utf8',
);

describe('live API cache/auth workflow policy', () => {
  it('skips scheduled sweeps in the downstream Unraid fork', () => {
    assert.doesNotMatch(workflow, /^\s*push:/m);
    assert.match(workflow, /^\s*workflow_dispatch:/m);
    assert.match(
      workflow,
      /github\.event_name != 'schedule' \|\| github\.repository == 'koala73\/worldmonitor'/,
    );
  });

  it('retains the deliberate production diagnostic', () => {
    assert.match(workflow, /LIVE_API_CACHE_TESTS:\s*['"]1['"]/);
    assert.match(
      workflow,
      /node --test --test-reporter=tap tests\/live-api-cache-auth-regression\.test\.mjs/,
    );
  });
});
