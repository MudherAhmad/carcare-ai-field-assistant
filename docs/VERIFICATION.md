# Verification record

Date: **2026-11-17**
Environment: Windows, Node.js 24.12.0, npm 11.6.2, JDK 17, Android SDK 36.

## Automated results

| Surface | Check | Result |
| --- | --- | --- |
| Web | TypeScript project check | Passed |
| Web | Vitest routing, redaction, schema, provider-error, and Geoapify tests | **12 passed** |
| Web | V8 coverage | 55.15% statements; 62.82% branches; 60.13% lines |
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

The production build was then deployed and checked at [carcare-ai-field-assistant.web.app](https://carcare-ai-field-assistant.web.app):

- Firebase Hosting returned HTTP 200 with the configured `nosniff`, referrer, and permissions-policy headers.
- reCAPTCHA Enterprise App Check accepted the deployed origin.
- A live Firebase AI Logic request reached `gemini-3.5-flash-lite` and rendered a complete structured inspection brief.
- The first live request exposed two integration defects that were fixed and regression-tested: Firebase's response schema rejects `additionalProperties`, and the Web SDK returns lowercase `on_device` / `in_cloud` inference-source values.
- The browser now checks Chrome's `LanguageModel.availability()` before claiming that Gemini Nano is ready. The verification browser correctly reports `Cloud fallback available; on-device model unavailable`.
- A later cloud request returned `403: The Gemini API free tier is not available for this project`. Billing was deliberately not enabled without the project owner's separate financial approval, so a post-fix screenshot showing the `IN_CLOUD` label remains open.
- On 2026-11-17 the project owner enabled Cloud Billing and started the Google Cloud free trial. The Cloud Billing API confirmed `billingEnabled: true` for the contest project.
- A fresh production request then reached Gemini but returned `429: Your prepayment credits are depleted`. Google AI Studio requires a positive Gemini API Prepay balance; the Google Cloud welcome credit cannot fund Gemini API usage for this new account.
- The production UI now maps that provider response to a short, localised billing-credit message instead of exposing the provider endpoint and raw error details.

## Connected Firebase evidence

The dedicated contest project is `carcare-ai-field-assistant` (project number `1018543144766`) on the Spark plan. It is isolated from the commercial `car-care-sverige` project.

- Web app: `CarCare Field Web`.
- Android app: `CarCare Field Android`, application ID `org.carcare.fieldassistant`.
- Gemini Developer API: enabled through Firebase AI Logic.
- AI monitoring: enabled.
- Firebase AI Logic App Check: Basic protection enforced.
- Web provider: reCAPTCHA Enterprise, restricted to the two Firebase Hosting domains plus `localhost`.
- Android provider: Play Integrity with the local debug signing certificate registered.
- Hosting: deployed to [carcare-ai-field-assistant.web.app](https://carcare-ai-field-assistant.web.app).
- Cloud Billing: linked and enabled; the separate Gemini API Prepay balance remains empty.
- Public source: published to [MudherAhmad/carcare-ai-field-assistant](https://github.com/MudherAhmad/carcare-ai-field-assistant); the published `main` branch passed the clean-room safety scan.

Client configuration, App Check debug tokens, Geoapify keys, signing keys, and personal account credentials remain ignored and are not committed.

## Remaining release evidence

1. Capture an actual `ON_DEVICE` result on supported Chrome and Android hardware.
2. Add Gemini API Prepay credit in Google AI Studio and capture the corrected `IN_CLOUD` label.
3. Sign the Android release with the project owner's release key.
4. Record the final live demo, upload it to YouTube, and submit through the entrant's Devpost account.

These are release gates, not simulated evidence. See `docs/CONTEST_COMPLIANCE.md` for the exact checklist.

## Local Android artifacts

Generated artifacts are ignored by Git and must be rebuilt from the public source:

- Debug APK: 17,682,008 bytes; SHA-256 `44A8E32ED3C1B849D7C609CA2D649CB2A281FE22B7A3C10DD42BAD3898BCFF0E`.
- Unsigned release APK: 3,455,803 bytes; SHA-256 `0480B32D3424504802BC75DD122987E51F6633F667B8B82992DD60E23B115496`.

The release output is intentionally unsigned because no signing key belongs in the repository. The project owner must sign it and record the final signed hash. Rebuilds after source or toolchain changes are expected to differ.
