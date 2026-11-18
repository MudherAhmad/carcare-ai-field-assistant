# On-device verification

## Current evidence

- Live `IN_CLOUD` results are verified on Web and native Android.
- Web `ON_DEVICE` was verified on 2026-11-18 from the owner's photos of the live CarCare app running in Chrome on a second Windows computer. The English braking-vibration sample (2018 compact petrol car, 84,000 km) produced a structured brief showing `ON DEVICE`, `Gemini Nano`, `Inspect soon`, and 60% model-reported confidence. The exact Chrome version and deployed commit were not captured in the photos.
- The owner's separate 49.5-second screen recording shows the same fictional sample being loaded, the model-ready status, a fresh report request, and the resulting `ON DEVICE` and `Gemini Nano` labels. The original 1080p file is saved locally as `demo/output/CarCare_Chrome_On_Device_Raw.mp4`.
- Native Android `ON_DEVICE` verification is pending.
- On 2026-11-18, ADB connected to a physical Samsung Galaxy S8 (`SM-G950F`) running Android 9 (API 28). `pm path com.google.android.aicore` returned no package. Google does not list this model for Gemini Nano inference through ML Kit.
- The existing debug APK installed and launched on the S8. The English synthetic braking-vibration sample loaded and the privacy preview rendered. The report request displayed `Firebase App Check token is invalid.` The S8 did not produce a live report. Firebase App Check was not changed for this test.
- On 2026-11-18, a physical Pixel 10 Pro XL running GrapheneOS (Android 17, API 37) generated a fresh report for the English braking-vibration sample. The app showed `In Cloud`, `gemini-3.5-flash-lite`, `Inspect soon`, and 85% confidence. ADB found no `com.google.android.aicore` package, including when listing uninstalled or disabled packages. The already-installed debug app was version `0.1.0`, version code `1`, and its APK hash differed from the local debug build. The capture therefore applies to the installed build. The screenshot is stored locally as `demo/output/pixel10-pro-xl-cloud-test.png`.
- After the owner installed Android AICore from Google Play, ADB confirmed its production build (`prod_aicore_20261015.00_RC11`) in the same user profile as CarCare. A fresh report on the installed CarCare build still showed `In Cloud` via `gemini-3.5-flash-lite`. AICore had no resolvable launcher activity and was still in a never-launched state. Developer Preview enrollment and model readiness have not been verified on this phone.
- A separate clean headless Chrome 157 session on the hosted app exposed `LanguageModel`, but `LanguageModel.availability()` returned `unavailable`. The session reported 4 logical CPU cores and 16 GiB device memory.
- An interactive Chrome 157 session on the same Windows workstation also returned `unavailable`. On the deployed app, **Prepare hybrid AI** confirmed that only the cloud fallback was available. ADB listed no connected Android device at the time of this retry.
- Both browser availability checks above describe sessions on the original workstation.

## Prerequisites

For Android, identify the actual phone model and check it against the [ML Kit supported-device documentation](https://developers.google.com/ml-kit/genai). Preview model use can require AICore developer-preview enrollment; follow the [Firebase Android guide](https://firebase.google.com/docs/ai-logic/hybrid/android/get-started) and [model configuration guide](https://firebase.google.com/docs/ai-logic/hybrid/android/configuration-options).

For Web, check the [Firebase Web guide](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started) and [Chrome Prompt API requirements](https://developer.chrome.com/docs/ai/prompt-api). As checked on 2026-11-18, Chrome documents at least 22 GB free storage, and either a GPU with more than 4 GB VRAM or a CPU with at least 16 GB RAM and 4 cores. The model must also be available and downloaded; hardware specifications alone are not inference evidence.

## Capture procedure

1. Keep the existing submitted source and Firebase App Check protection. Use the normal live application, with synthetic demo mode disabled.
2. On a supported device, complete the official model setup/download. Start with English and the existing fictional braking-vibration sample.
3. Generate a report through Firebase AI Logic. Capture the actual inference source returned by the SDK; a prepared model, static badge, mock report or disconnected cloud request does not establish local inference.
4. Require the rendered report to show `ON_DEVICE`, with a valid structured response and model identity. Capture the source badge and report in an account-free screenshot or recording.
5. Record the date, device/browser or Android/AICore version, app commit, sample ID, actual source, model and observed output. Only then update the verification record and Devpost claim.

If the app falls back to `IN_CLOUD`, record that result honestly and keep the ON_DEVICE item open.
