# On-device verification

## Current evidence

- Live `IN_CLOUD` results are verified on Web and native Android.
- An actual `ON_DEVICE` report is not yet verified.
- On 2026-11-18, `adb devices -l` returned no connected device.
- A separate clean headless Chrome 157 session on the hosted app exposed `LanguageModel`, but `LanguageModel.availability()` returned `unavailable`. The session reported 4 logical CPU cores and 16 GiB device memory.
- This is a negative availability observation in that session, not proof that every interactive Chrome configuration on the computer is unsupported.

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
