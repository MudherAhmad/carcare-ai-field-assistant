# CarCare AI Field Assistant

- Entrant: **Mudher Ahmad**
- Team: **Car Care Sverige**
- Live demo: **https://carcare-ai-field-assistant.web.app**
- Public source: **https://github.com/MudherAhmad/carcare-ai-field-assistant**
- Video channel: **Car Care Sverige / @CarCareSverige** (final video URL pending)

## Inspiration

The first description of a vehicle problem is usually unstructured: a vibration, a smell, a warning light, or a change in handling. It may be written at the roadside, in a noisy workshop, with unreliable connectivity, and in the driver’s own language. We wanted that first note to become a useful, cautious inspection brief without pretending that an AI had physically inspected the car.

## What it does

CarCare AI Field Assistant accepts Arabic, Swedish, or English vehicle notes and produces a structured brief with urgency, observations, inspection steps, suggested services, safety notices, and follow-up questions. It redacts common identifiers locally, shows the redacted prompt, and reports whether Firebase AI Logic used on-device or cloud inference. An optional Geoapify action finds nearby car-repair services without sharing the note or report.

## How we built it

The Web app uses React, TypeScript, Firebase App Check, and the Firebase AI Logic Web SDK. The native Android app uses Kotlin, Jetpack Compose, Firebase App Check, `firebase-ai`, and `firebase-ai-ondevice`. Both prefer Gemini Nano for a short single-turn structured task and use a cloud Gemini fallback through Firebase AI Logic. They share the same public report schema, prompt constraints, urgency vocabulary, and synthetic acceptance cases.

## Challenges we ran into

Hybrid inference is not just a network fallback. On-device availability, model download, supported request shapes, user activation in Chrome, language behavior, and output limits all affect the experience. We made those states visible, bounded the prompt and output, and validated the response instead of hiding the routing decision.

## Accomplishments that we're proud of

- A coherent Web and Android experience built around the same contract.
- Visible, evidence-based inference routing.
- A privacy boundary that shows what may reach the model.
- Safety constraints that prevent the UI from presenting an AI guess as a confirmed diagnosis.
- A verified live `IN_CLOUD` inspection brief from the deployed Firebase Hosting site.
- A verified live `IN_CLOUD` inspection brief from the native Android app with App Check enforcement enabled.
- A clean public repository with synthetic data and automated secret checks.

## What we learned

The strongest hybrid AI design gives each execution path a clear product role. On-device inference is valuable for privacy, latency, and weak connectivity; cloud inference provides broad compatibility and capacity. Firebase AI Logic lets one client API express that trade-off while still telling the product which source actually answered.

## What's next

We would add opt-in photo evidence, OBD data import with explicit provenance, human mechanic review, more on-device language validation, and accessibility testing with field technicians. We would keep report persistence opt-in and separate from inference.
