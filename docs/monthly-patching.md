# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

## 2026-11-05

| Dependency (lockfile) | From | To | Why |
| --- | --- | --- | --- |
| `npm` under `@semantic-release/npm` | 11.21.0 | 11.21.2 | Latest npm 11 within the parent's `^11.6.2` range; refresh its bundled dependencies without a major upgrade. |
| npm-bundled `brace-expansion`, `http-cache-semantics`, `ip-address`, `postcss-selector-parser`, and `undici` | 5.0.9, 4.2.0, 10.5.0, 7.1.4, and 6.28.0 | 5.0.12, 4.3.0, 10.7.5, 7.1.6, and 6.29.1 | Refresh bundled npm dependencies to patched versions where compatible. |
| `body-parser` | 2.3.0 | 2.4.0 | Fix the production compressed-request DoS advisory. |
| `follow-redirects` | 1.16.0 | 1.16.2 | Fix production credential-forwarding advisories. |
| `handlebars` | 4.7.9 | 4.7.10 | Fix production template-injection advisories. |
| `joi` (API / dynamic-content) | 18.2.9 / 17.13.8 | 18.3.2 / 17.13.9 | Fix production email-validation DoS advisories. |
| `qs` | 6.16.0 | 6.17.1 | Fix production stringify DoS advisory. |
| `undici` (HTTP client / root) | 6.28.1 / 7.29.1 | 6.29.1 / 7.30.2 | Fix compatible transitive Undici advisories. |

The npm bump also refreshed bundled `@npmcli/arborist` (9.9.2 → 9.9.3), `@npmcli/promise-spawn` (9.0.1 → 9.0.2), `bin-links` (6.0.2 → 6.0.3), `libnpmdiff` (8.1.13 → 8.1.14), `libnpmexec` (10.3.3 → 10.3.5), `libnpmfund` (7.0.27 → 7.0.28), `libnpmpack` (9.1.14 → 9.1.15), `pacote` (21.5.1 → 21.5.2), and `semver` (7.8.5 → 7.8.6). The compatible lockfile refresh also advanced ESLint (10.10.0 → 10.14.0), `@typescript-eslint/*` (8.70.0 → 8.72.1), `unrs-resolver` and platform bindings (1.12.2 → 1.13.0), `babel-plugin-istanbul` (8.0.0 → 8.0.2), and `napi-postinstall` (0.3.4 → 0.3.8). No package manifests changed; npm's lockfile re-resolution also moved/deduplicated package entries.

The complete audit changed from **68 affected-package vulnerability entries** (3 low, 59 moderate, 5 high, 1 critical; 38 distinct advisory IDs) to **59** (1 low, 58 moderate, no high or critical; 3 distinct advisory IDs). The production audit changed from **5 affected-package entries** (1 moderate, 3 high, 1 critical; 10 distinct advisory IDs) to **0**. Workspace tests passed before and after: 29 suites, 166 tests, and 16 snapshots. After patching, `npm run build` and `npm run lint` passed. `npm run security:production` passed; `npm run security` remains blocked by the development-only findings below.

Deferred findings (npm advisory ID and GHSA):

| Advisory | Severity | Affected locked version(s) | Reason deferred |
| --- | --- | --- | --- |
| 1243505 / GHSA-gcqx-w48m-w2h4 (`deepmerge` prototype poisoning) | Low | `deepmerge` 4.3.1 | This is the latest published v4; Jest 30's `jest-config` requires `^4.3.1`. No patched v4 is available, and changing its major requires a Jest compatibility review. |
| 1244013 / GHSA-3g3m-2fjr-6pw4 (glob cancellation bypass / post-timeout traversal) | Moderate | `glob` 10.5.0 and 13.0.6 | The fixed release is in glob 14 (`14.0.3`); current parents require glob 10 or 13. The compatible npm 11.21.2 bundle still uses glob 13.0.6. Updating those parents or overriding across majors is a deeper compatibility change. |
| 1244623 / GHSA-g3hv-75wg-m249 (minimatch globparts DoS) | Moderate | `minimatch` 9.0.9, 10.2.5, and 10.2.6 | The fix is minimatch 11.0.1 or later, while current parents require `^9` or `^10`; npm 11.21.2's bundled dependency also remains on v10. A major parent update or cross-major override needs separate compatibility work. |

Commands and validation:

- Before edits: `npm test` (29 suites, 166 tests, 16 snapshots passed); `npm audit --json` and `npm audit --omit=dev --json`.
- Dependency updates: `npm update npm --ignore-scripts`, then non-forced `npm audit fix --ignore-scripts`. `.npmrc` has `ignore-scripts=true`; no force option was used.
- After edits: `npm test` (same passing totals), `npm run build`, `npm run lint`, `npm audit --json`, `npm audit --omit=dev --json`, `npm run security`, and `npm run security:production`.
- The initial audit inherited `NODE_TLS_REJECT_UNAUTHORIZED=0`; baseline and post-patch audits and dependency updates were repeated with that variable unset, with TLS verification enabled. No validation was left blocked by the environment.

## 2026-10-06

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| `proxy-addr` (lockfile) | 2.0.7 | 2.0.8 | Fix the production IP-spoofing advisory. |
| `joi` 17 (lockfile) | 17.13.7 | 17.13.8 | Fix the production prototype-replacement advisory. |
| Jest, `babel-jest`, and Jest types | 29 | 30 | Remove vulnerable Jest 29 dependencies; update removed matcher aliases in worker tests. |
| `jest-mock-extended` | 3.0.7 | 4.0.1 | Support Jest 30. |
| `@babel/cli` | 7 | removed | No build or test script uses the CLI; remove its vulnerable file-watcher dependencies. |
| `js-yaml` via `@istanbuljs/load-nyc-config` | 3 | 4 | Avoid the vulnerable `argparse` / `sprintf-js` chain; the loader uses the supported `load` API. |

The production audit reports no advisories. The full audit still reports 12 development-only findings: `braces` (no patched published version, pulled in by `semantic-release` via `micromatch`) and five dependencies bundled by the npm 11 release plugin (`brace-expansion`, `http-cache-semantics`, `ip-address`, `postcss-selector-parser`, and `undici`). npm overrides do not replace npm's bundled dependencies. The CodeBuild `npm run security` step remains blocking until those upstream release-tool dependencies are resolved; do not substitute `npm audit fix --force`, which proposes an incompatible `semantic-release` downgrade.

## 2026-10-01

| Dependency (lockfile) | From | To | Why |
| --- | --- | --- | --- |
| `brace-expansion` | 5.0.9 | 5.0.12 | Fix development-dependency denial-of-service advisories. |
| `brace-expansion` (nested under `glob` and `test-exclude`) | 1.1.18 | 1.1.21 | Fix development-dependency denial-of-service advisories. |
| `npm` (transitive release-tool dependency) | 11.19.1 | 11.21.0 | Refresh bundled npm dependencies within the compatible release-tool range; this does **not** resolve all bundled advisories. |

The npm lockfile also refreshed several bundled `@npmcli/*` and `libnpm*` packages as part of the npm update. At the time, the production npm audit reported no advisories after patching. Three development-only advisories remained in npm's bundled `brace-expansion`, `undici`, and `ip-address`; their remediation needed a separate release-tool review. Workspace unit tests passed before and after patching.