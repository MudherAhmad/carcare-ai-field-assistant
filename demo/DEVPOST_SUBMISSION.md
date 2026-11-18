# CarCare AI Field Assistant

- Entrant: **Mudher Ahmad**
- Team: **Car Care Sverige**
- Submission status: **Submitted to #BuildHybridAI 2026 on 2026-11-18**
- Devpost project: **https://devpost.com/software/carcare-ai-field-assistant**
- Live demo: **https://carcare-ai-field-assistant.web.app**
- Public source: **https://github.com/MudherAhmad/carcare-ai-field-assistant**
- Updated public demo video: **https://youtu.be/u5mh45_Y2dY**
- Video channel: **Car care Sverige / @CarcareSverige**
- Tagline: **Turn multilingual vehicle notes into cautious inspection briefs with visible on-device and cloud AI routing.**
- Platforms: **Web/Chrome and Android**
- Built with: **React, TypeScript, Kotlin, Jetpack Compose, Firebase AI Logic, Firebase App Check, Firebase Hosting, Gemini, Gemini Nano, Geoapify, Vite, Vitest**

The deployed web app generated a live inspection brief in Chrome on Windows with `ON DEVICE` and `Gemini Nano` visible in the report. Separate Web and native Android tests verified `IN_CLOUD` results. The updated 2:21 demo also shows the fictional seat-mark example from the live cloud test of the evidence-review build.

## Inspiration

The first description of a vehicle problem is usually unstructured: a vibration, a smell, a warning light, or a change in handling. It may be written at the roadside, in a noisy workshop, with unreliable connectivity, and in the driver’s own language. We wanted that first note to become a useful, cautious inspection brief without pretending that an AI had physically inspected the car.

During my own automatic transmission service, an extra flush was proposed after the initial estimate. I wanted to understand what the technician had observed, why the extra work was recommended, and what I was being asked to approve. That experience led to a question we built around. What evidence should a workshop have before it proposes extra work?

Our existing Car Care Sverige platform already supports booking, vehicle intake, inspection photos, and itemized proposals that customers can review. For the hackathon we built CarCare AI Field Assistant, which uses Firebase AI Logic to review workshop notes and ask for missing evidence before a service is suggested. The seat-mark case in the judging demo illustrates that new evidence review with sample data. The existing platform explains where the resulting reasoning can be useful in day-to-day workshop work.

## What it does

CarCare AI Field Assistant accepts Arabic, Swedish, or English vehicle notes and produces a structured brief with urgency, observations, inspection steps, suggested services, safety notices, and follow-up questions. It redacts common identifiers locally, shows the redacted prompt, and reports whether Firebase AI Logic used on-device or cloud inference. An optional Geoapify action finds nearby car-repair services without sharing the note or report.

In the evidence-review workflow, CarCare records the customer's request and the technician's observation separately. In the tested seat-mark example, it deferred service suggestions while the technician field was blank. Once the technician reported intact fabric and a superficial stain, the revised brief recommended upholstery cleaning and showed the observation that supported that suggestion.

Judges can [open evidence review directly](https://carcare-ai-field-assistant.web.app/?review=quote&lang=en) and load the seat-mark example. This entry opens a blank review without a booking identifier or any customer data. Staff decide what reasoning belongs in a proposal after reviewing the brief.

## How we built it

The Web app uses React, TypeScript, Firebase App Check, and the Firebase AI Logic Web SDK. The native Android app uses Kotlin, Jetpack Compose, Firebase App Check, `firebase-ai`, and `firebase-ai-ondevice`. Both prefer Gemini Nano for a short single-turn structured task and use a cloud Gemini fallback through Firebase AI Logic. They share the same public report schema, prompt constraints, urgency vocabulary, and synthetic acceptance cases.

## Challenges we ran into

Hybrid inference is not just a network fallback. On-device availability, model download, supported request shapes, user activation in Chrome, language behavior, and output limits all affect the experience. We made those states visible, bounded the prompt and output, and validated the response instead of hiding the routing decision.

## Accomplishments that we're proud of

- A coherent Web and Android experience built around the same contract.
- Visible, evidence-based inference routing.
- A privacy boundary that shows what may reach the model.
- Safety constraints that prevent the UI from presenting an AI guess as a confirmed diagnosis.
- A verified live `ON_DEVICE` brief from the deployed Web app in Chrome using Gemini Nano.
- A verified live `IN_CLOUD` inspection brief from the deployed Firebase Hosting site.
- A verified live `IN_CLOUD` inspection brief from the native Android app with App Check enforcement enabled.
- A live Web evidence-review test that deferred a recommendation, asked for a technician observation, and revised the recommendation when the observation was added.
- A clean public repository with synthetic data and automated secret checks.

## What we learned

The strongest hybrid AI design gives each execution path a clear product role. On-device inference is valuable for privacy, latency, and weak connectivity; cloud inference provides broad compatibility and capacity. Firebase AI Logic lets one client API express that trade-off while still telling the product which source actually answered.

## What's next

For a future fleet pilot, we plan to help drivers document vehicle defects before a shift. A driver could photograph a defect and dictate a note in Arabic or Swedish. CarCare would ask for clarification when a technical term is ambiguous, mask faces and license plates on the device, and let the driver review the edited image and transcript before sending the report to the maintenance team. We would measure how long reporting takes and how often maintenance staff need to request additional information.
