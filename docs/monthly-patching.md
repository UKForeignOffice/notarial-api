# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

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