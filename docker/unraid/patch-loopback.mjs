import { readFile, writeFile } from 'node:fs/promises';

async function replaceExactlyOnce(path, before, after) {
  const source = await readFile(path, 'utf8');
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`${path}: expected exactly one match for AIO loopback patch`);
  }
  await writeFile(path, source.slice(0, first) + after + source.slice(first + before.length));
}

await replaceExactlyOnce(
  '/app/docker/redis-rest-proxy.mjs',
  "const BIND_HOST = (process.env.SRH_BIND_HOST || '').trim() || '0.0.0.0';",
  "const BIND_HOST = (process.env.SRH_BIND_HOST || process.env.REDIS_REST_HOST || '').trim() || '127.0.0.1';",
);

await replaceExactlyOnce(
  '/app/scripts/ais-relay.cjs',
  "const RELAY_BIND_HOST = (process.env.RELAY_BIND_HOST || '').trim() || undefined;",
  "const RELAY_BIND_HOST = (process.env.RELAY_BIND_HOST || process.env.RELAY_HOST || '').trim() || '127.0.0.1';",
);

const { PUBLIC_INVENTORY_FACTS } = await import('/app/api/_inventory-facts.generated.js');
await writeFile(
  '/app/scripts/shared/inventory-facts.generated.json',
  `${JSON.stringify(PUBLIC_INVENTORY_FACTS, null, 2)}\n`,
);
