# CarCare AI Field Assistant

CarCare AI Field Assistant turns a driver's or technician's free-form vehicle notes into a cautious, structured inspection brief. It runs on the web and Android, supports Arabic, Swedish, and English, and makes the hybrid inference boundary visible instead of hiding it.

Built for **Google #BuildHybridAI 2026** with Firebase AI Logic.

**Live web app:** [carcare-ai-field-assistant.web.app](https://carcare-ai-field-assistant.web.app)

## Why hybrid AI belongs in the field

Vehicle notes are often captured in a noisy garage, at the roadside, or somewhere with unreliable connectivity. A short, privacy-sensitive first pass is well suited to Gemini Nano on the device. Firebase AI Logic can then fall back to a cloud Gemini model when the device model is unavailable or the request needs more capacity.

The app:

- redacts common phone, email, and vehicle-registration patterns before inference;
- uses Firebase AI Logic `PREFER_ON_DEVICE` for a single-turn structured report;
- displays whether the result came from `ON_DEVICE` or `IN_CLOUD` inference;
- never claims a confirmed diagnosis, price, sensor reading, or completed repair;
- provides an optional Geoapify workshop lookup that is separate from AI inference;
- includes a clearly labelled synthetic demo path for UI review without credentials.

## Repository layout

```text
android/   Native Kotlin + Jetpack Compose Android app
web/       React + TypeScript progressive web app
shared/    Public report schema and synthetic sample cases
docs/      Architecture, privacy, contest, and delivery evidence
demo/      Three-minute video script and recording checklist
scripts/   Public-release safety checks
```

## Quick start: web

Requirements: Node.js 24.12 or newer and Chrome 139 or newer for on-device inference.

```bash
cd web
cp .env.example .env.local
npm ci
npm run dev
```

Populate the Firebase values in `.env.local`, configure Firebase AI Logic with the Gemini Developer API, and register a Web App Check provider. For local development, set `VITE_FIREBASE_APP_CHECK_DEBUG=true`; register the printed debug token in Firebase Console rather than committing it.

The UI can be reviewed without Firebase by setting `VITE_SYNTHETIC_DEMO=true`. That mode is visibly labelled and is not evidence of a live AI call.

## Quick start: Android

Requirements: JDK 17, Android SDK 36, and a recent Android Studio.

1. Register the Android application ID `org.carcare.fieldassistant` in the same Firebase project. The Kotlin namespace remains `ai.carcare.fieldassistant`.
2. Download its `google-services.json` to `android/app/google-services.json`.
3. Enable Firebase AI Logic and App Check. Use the debug provider only for local development.
4. Build:

```bash
cd android
./gradlew testDebugUnitTest assembleDebug
```

Gemini Nano requires a supported Android device and the current AICore developer-preview prerequisites. Unsupported devices use the configured cloud fallback through the same Firebase AI Logic SDK.

## Verification

```bash
cd web
npm run check
npm run test:coverage
npm run build

cd ../android
./gradlew testDebugUnitTest assembleDebug

cd ..
node scripts/verify-public-safety.mjs
```

See [docs/VERIFICATION.md](docs/VERIFICATION.md) for the dated test record, [docs/CONTEST_COMPLIANCE.md](docs/CONTEST_COMPLIANCE.md) for the submission gate, and [demo/VIDEO_SCRIPT.md](demo/VIDEO_SCRIPT.md) for the three-minute English demo.

## Safety scope

This is a decision-support prototype, not a diagnostic device. It does not read OBD data, inspect a vehicle, verify repairs, estimate prices, or replace a qualified mechanic. If the report says to stop driving, the driver should move to a safe location if possible and contact roadside assistance or a qualified professional.

## Clean-room status

This is an independent public project created during the contest period. It contains no commercial Car Care source code, customer records, production configuration, private API contracts, or credentials. The clean-room record is in [docs/CLEAN_ROOM.md](docs/CLEAN_ROOM.md).
