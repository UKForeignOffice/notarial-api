# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

## 2026-10-01

| Dependency (lockfile) | From | To | Why |
| --- | --- | --- | --- |
| `brace-expansion` | 5.0.9 | 5.0.12 | Fix development-dependency denial-of-service advisories. |
| `brace-expansion` (nested under `glob` and `test-exclude`) | 1.1.18 | 1.1.21 | Fix development-dependency denial-of-service advisories. |
| `npm` (transitive release-tool dependency) | 11.19.1 | 11.21.0 | Refresh bundled npm dependencies within the compatible release-tool range; this does **not** resolve all bundled advisories. |

The npm lockfile also refreshed several bundled `@npmcli/*` and `libnpm*` packages as part of the npm update. At the time, the production npm audit reported no advisories after patching. Three development-only advisories remained in npm's bundled `brace-expansion`, `undici`, and `ip-address`; their remediation needed a separate release-tool review. Workspace unit tests passed before and after patching.