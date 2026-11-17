# Verification record

Date: **2026-11-17**
Environment: Windows, Node.js 24.12.0, npm 11.6.2, JDK 17, Android SDK 36.

## Automated results

| Surface | Check | Result |
| --- | --- | --- |
| Web | TypeScript project check | Passed |
| Web | Vitest redaction, schema, and Geoapify tests | **7 passed** |
| Web | V8 coverage | 52.7% statements; 60.41% branches; 58.59% lines |
| Web | Vite production build | Passed |
| Web | `npm audit --omit=dev` | **0 known runtime vulnerabilities** |
| Android | JUnit redaction, prompt, and schema tests | **5 passed** |
| Android | Debug APK assembly | Passed; `app-debug.apk` produced |
| Android | Lint | Passed with **0 errors**; remaining warnings are intentional compatible-version pins |
| Android | Minified release assembly | Passed; unsigned APK produced for project-owner signing |

The full npm audit also reports seven high-severity advisories in the current Vite/Vitest development toolchain through `picomatch`. They are not present in production dependencies (`npm audit --omit=dev` is clean). The suggested forced downgrade was evaluated and rejected because it introduced additional findings, including a critical advisory. This record keeps that limitation visible instead of suppressing it.

## Browser verification

The labelled synthetic mode was exercised end to end in the local production UI:

- English sample loaded, hybrid preparation completed, and a structured report rendered.
- Arabic sample rendered with `lang="ar"`, `dir="rtl"`, stop-driving urgency, safety notice, and follow-up questions.
- Swedish UI rendered with `lang="sv"` and `dir="ltr"`.
- Desktop viewport: 1440 × 900.
- Mobile viewport: 390 × 844; document width remained within the viewport with no horizontal overflow.
- Browser console: no warnings or errors during the checked flows.
- Synthetic results remained visibly labelled `SYNTHETIC DEMO`; they are not presented as live AI evidence.

## Evidence that still requires project-owner access

The repository deliberately contains no Firebase project, App Check token, Geoapify key, signing key, personal account, or submission identity. The following checks therefore remain open:

1. Configure a dedicated public-contest Firebase project and enable Firebase AI Logic.
2. Enforce App Check for the deployed Web and Android apps.
3. Capture an actual `ON_DEVICE` result on supported Chrome and Android hardware.
4. Capture an actual `IN_CLOUD` fallback result through Firebase AI Logic.
5. Deploy Firebase Hosting, publish the source remote, record the live demo, upload it to YouTube, and submit through the entrant's Devpost account.

These are release gates, not simulated evidence. See `docs/CONTEST_COMPLIANCE.md` for the exact checklist.

## Local Android artifacts

Generated artifacts are ignored by Git and must be rebuilt from the public source:

- Debug APK: 18,499,396 bytes; SHA-256 `0040E7D620C37A0F382872BEB55759C3C0ACFA6EE03BDB41D7C658E4D069C34A`.
- Unsigned release APK: 3,223,655 bytes; SHA-256 `ABFAE13170B8C26C5C8C11D2BD07DE65216CEF4F945EA797DD5F11A55C6FA3E7`.

The release output is intentionally unsigned because no signing key belongs in the repository. The project owner must sign it and record the final signed hash. Rebuilds after source or toolchain changes are expected to differ.
