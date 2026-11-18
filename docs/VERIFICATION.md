# Verification record

Date: **2026-11-18**
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
- A later cloud request returned `403: The Gemini API free tier is not available for this project`. Billing was not enabled until the project owner provided separate financial approval.
- On 2026-11-17 the project owner enabled Cloud Billing and started the Google Cloud free trial. The Cloud Billing API confirmed `billingEnabled: true` for the contest project.
- A fresh production request then reached Gemini but returned `429: Your prepayment credits are depleted`. Google AI Studio requires a positive Gemini API Prepay balance; the Google Cloud welcome credit cannot fund Gemini API usage for this new account.
- The production UI now maps that provider response to a short, localised billing-credit message instead of exposing the provider endpoint and raw error details.
- After an owner-authorised manual Prepay purchase with auto-reload disabled, a fresh production request rendered a complete inspection brief. The UI showed inference source `IN CLOUD`, model `gemini-3.5-flash-lite`, and 85% confidence for the synthetic braking-vibration sample.
- On 2026-11-18, the owner ran the same fictional sample in Chrome on a second Windows computer using the deployed app. The resulting brief showed `ON DEVICE`, `Gemini Nano`, `Inspect soon`, and 60% model-reported confidence. See the [on-device verification record](ON_DEVICE_VERIFICATION.md).

## Evidence review pilot

The local Chrome build exercised the fictional passenger-seat case twice through live Firebase AI Logic. The first response asked what the technician observed about the fabric. The UI deferred service suggestions with the technician field blank. After the note described intact fabric and a superficial stain, the revised report displayed both sources and recommended upholstery cleaning based on the technician's observation. Both requests in the captured run displayed `IN CLOUD` and `gemini-3.5-flash-lite`.

A separate run confirmed that the privacy preview redacts a fictional email in the technician note and that the revised report does not expose it. The Web production build and 14 tests passed. The Android debug APK built and six unit tests passed. A live Android run of this new flow remains pending.

The evidence-review build was released to Firebase Hosting from the source published in commit `a2131d4`. The hosted app returned HTTP 200 and served the tested `index-BlRXidCL.js` bundle. A fresh browser run on the public URL confirmed the seat-mark workflow end to end with two live `IN CLOUD` responses. The revised brief recommended interior upholstery cleaning and attributed that recommendation to the technician's observation. Reloading the standard sample returned to the regular inspection form.

## Controlled workshop-case comparison

On 2026-11-18, three fictional cases were run through the deployed Web app in Chrome. Each case used the same intake in the regular and evidence-review flows. The third request added a prepared technician observation. All nine responses reported `IN CLOUD` with `gemini-3.5-flash-lite`.

| Case and later observation | Regular report at intake | Evidence review at intake | Evidence review after observation |
| --- | --- | --- | --- |
| Customer requested seat replacement. The technician found intact fabric and a superficial stain. | Optional upholstery cleaning | Service suggestions deferred. The app asked for the technician's findings about the mark. | Upholstery cleaning recommended, citing the intact fabric and superficial stain. |
| Customer requested bumper repainting. The technician found removable transfer and intact paint. | Optional body shop consultation to assess the paint | Service suggestions deferred. The app asked about the paint condition under the mark. | Both accounts shown and no repainting suggested. |
| Customer requested a replacement passenger door after rainwater entry. The technician found a torn weatherstrip and an intact door panel and channel. | Body shop inspection to diagnose the leak before replacing components | Service suggestions deferred. The app asked what the technician found about the leak. | Weatherstrip replacement proposed, citing the tear and intact door. |

The evidence-review flow deferred service suggestions in all three intake runs. The revised decisions matched the expected scope in all three cases. The regular workflow also treated the evidence as incomplete and proposed assessment or optional cleaning. These runs measure the behavior of two workflows on fictional inputs. Technician time, report corrections, and effects on workshop decisions remain unmeasured. The [workshop pilot](FIELD_PILOT.md) records those measures with the same review criteria for both workflows.

The Web and Android instructions were then updated to ask for the affected part and a concrete observable condition. A local Web run made six live cloud requests over the same cases, one before and one after each technician observation. The questions distinguished torn fabric from a stain, cracked bumper trim from a surface scuff, and damaged weatherstripping from wear. Service suggestions remained deferred in all three intake runs. With observations, the brief suggested upholstery cleaning for the seat, no paint work for the bumper, and seal replacement for the door. The Web build and 14 tests passed. The matching Android change built and passed its six unit tests.

## Android emulator verification

The debug APK was installed and launched on the local Android 16 / API 36.1 emulator:

- The native Compose UI rendered in English with `Firebase AI Logic · ready`.
- The synthetic braking-vibration sample populated the vehicle, mileage, and symptom fields.
- The privacy preview rendered the exact redacted text and the decision-support disclaimer.
- The first live request was rejected because the emulator's App Check debug token had not yet been registered; the failure was not counted as a successful run.
- After explicit owner approval, the actual emulator-only token was registered in Firebase without saving it to the repository or local project files.
- A fresh live request rendered the complete structured inspection brief through Firebase AI Logic. The native UI showed inference source `In Cloud`, model `gemini-3.5-flash-lite`, urgency `Inspect soon`, and 85% confidence.
- The rendered report included observed signals, owner-safe and professional-only inspection steps, suggested services, and the decision-support boundary.
- App Check enforcement remained enabled throughout the verification.

Clean screenshots of the verified Android states are stored in `demo/evidence/`.

A separate continuous recording on 2026-11-18 captured the Android 16 / API 36.1 emulator's sample, privacy preview, fresh report request, and verified `In Cloud` result (`gemini-3.5-flash-lite`, `Inspect soon`, 85% confidence). The installed APK matched the local debug artifact. One earlier request returned a generic error before successful retries. AICore was absent on this emulator. The supplementary 1080p recording is saved locally as `demo/output/CarCare_Android_Emulator_Live_Test.mp4`.

## Physical Android compatibility check

The existing debug APK installed and opened on a Galaxy S8 (`SM-G950F`, Android 9, API 28) on 2026-11-18. The synthetic sample and privacy preview rendered. AICore was absent, and Firebase App Check rejected the live report request from this test installation. See [on-device verification](ON_DEVICE_VERIFICATION.md) for the remaining device test.

## Connected Firebase evidence

The dedicated contest project is `carcare-ai-field-assistant` (project number `1018543144766`) on the Spark plan. It is isolated from the commercial `car-care-sverige` project.

- Web app: `CarCare Field Web`.
- Android app: `CarCare Field Android`, application ID `org.carcare.fieldassistant`.
- Gemini Developer API: enabled through Firebase AI Logic.
- AI monitoring: enabled.
- Firebase AI Logic App Check: Basic protection enforced.
- Web provider: reCAPTCHA Enterprise, restricted to the two Firebase Hosting domains plus `localhost`.
- Android provider: Play Integrity with the local debug signing certificate registered; an emulator-only App Check debug token is registered for this local verification and is not committed.
- Hosting: deployed to [carcare-ai-field-assistant.web.app](https://carcare-ai-field-assistant.web.app).
- Cloud Billing: linked and enabled; a positive Gemini API Prepay balance is active and auto-reload is disabled.
- Public source: published to [MudherAhmad/carcare-ai-field-assistant](https://github.com/MudherAhmad/carcare-ai-field-assistant); the published `main` branch passed the clean-room safety scan.

Client configuration, App Check debug tokens, Geoapify keys, signing keys, and personal account credentials remain ignored and are not committed.

## Remaining release evidence

1. Capture an actual `ON_DEVICE` result in the native Android app on supported hardware.
2. Sign the Android release with the project owner's release key.

## Devpost submission evidence

On 2026-11-18, the owner completed the final submission action. The authenticated Devpost project page at https://devpost.com/software/carcare-ai-field-assistant displayed `Project submitted!` and `SUBMITTED TO #BuildHybridAI 2026`; the earlier `INCOMPLETE SUBMISSION` status was gone. The saved page listed Mudher Ahmad, the complete project story and technology tags, working app/source links, an embedded YouTube video, and the explicit ON_DEVICE verification limitation. Submission ID: `1310126`.

The owner published the demo at https://youtu.be/rlovigZkyo8 on 2026-11-18. YouTube's public oEmbed endpoint returned the title `CarCare AI Field Assistant Demo` and channel `Car care Sverige` (`@CarcareSverige`), confirming public embedding access. The separately prepared suggested title and description are not independently verified as saved on YouTube.

The final local demo render is 2:48.80, 1920 x 1080 at 30 fps, H.264/AAC, with English narration and burned English captions. It completed a full decode verification. The 14,636,897-byte file has SHA-256 `35F90A8FB936A62BCD4D8E2E3D0F635E07556A9B5F107A1024C55088C557219A`. Generated media is ignored by Git; upload metadata is recorded in `demo/YOUTUBE_METADATA.md`.

On 2026-11-18, the owner published the updated 2:21.51 demo at https://youtu.be/u5mh45_Y2dY. YouTube Studio confirmed publication. YouTube's public oEmbed endpoint returned `CarCare AI Field Assistant | Gemini Nano & Firebase AI Logic` from `Car care Sverige`. The updated demo shows the verified Chrome on-device run, the live cloud seat-mark workflow, and the native Android emulator cloud test.

The owner saved the updated story and judging video in Devpost submission `1310126`. Reopening that submission's Project details form confirmed `SUBMITTED`, the saved video URL `https://youtu.be/u5mh45_Y2dY`, the Chrome on-device evidence, the seat-mark workflow, and the description of a future fleet pilot.

Reopening the submission's Additional info form confirmed the saved technology answer and judge testing instructions. They reference the verified Chrome `ON DEVICE` result, the updated video, and the steps for both the regular report and the seat-mark evidence review.

These are release gates, not simulated evidence. See `docs/CONTEST_COMPLIANCE.md` for the exact checklist.

## Local Android artifacts

Generated artifacts are ignored by Git and must be rebuilt from the public source:

- Debug APK: 17,682,008 bytes; SHA-256 `44A8E32ED3C1B849D7C609CA2D649CB2A281FE22B7A3C10DD42BAD3898BCFF0E`.
- Unsigned release APK: 3,455,803 bytes; SHA-256 `0480B32D3424504802BC75DD122987E51F6633F667B8B82992DD60E23B115496`.

The release output is intentionally unsigned because no signing key belongs in the repository. The project owner must sign it and record the final signed hash. Rebuilds after source or toolchain changes are expected to differ.
