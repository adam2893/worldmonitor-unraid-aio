/**
 * Detects whether the frontend is running in a self-hosted Docker deployment.
 *
 * Lives in `config/` so both `config/panels.ts` and `services/*` can import it
 * without violating the `types -> config -> services -> components -> app`
 * architectural boundary.
 */

const ENV = (() => {
  try {
    return {
      VITE_SELF_HOSTED: import.meta.env.VITE_SELF_HOSTED,
    };
  } catch {
    return {} as Record<string, string | undefined>;
  }
})();

const BUILD_SELF_HOSTED =
  ENV.VITE_SELF_HOSTED === 'true' || ENV.VITE_SELF_HOSTED === '1';

export function isSelfHostedRuntime(): boolean {
  if (BUILD_SELF_HOSTED) return true;
  if (typeof globalThis !== 'undefined') {
    const flag = (globalThis as { __WM_SELF_HOSTED__?: unknown }).__WM_SELF_HOSTED__;
    if (flag === true || flag === 'true' || flag === '1') return true;
  }
  return false;
}
