# Three-minute demo script

Target duration: **2:45**. Language: English. Add burned-in English captions.

## 0:00-0:20 — Problem

“Vehicle symptoms rarely arrive as clean diagnostic data. A driver describes a sound, a warning light, or a change in handling—often at the roadside, with poor connectivity, and in their own language. CarCare AI Field Assistant turns that note into a cautious inspection brief.”

Show the language selector and the empty report workspace.

## 0:20-0:55 — Privacy boundary

Paste the synthetic Swedish battery-warning case. Add a fake phone number to demonstrate redaction.

“Before any inference, the app redacts common identifiers locally and shows exactly what may leave the device. The raw note is never stored.”

Show the redacted preview and press **Prepare hybrid AI**. Capture the Gemini Nano download/status display.

## 0:55-1:35 — Hybrid inference

Press **Create inspection brief**.

“The request goes through Firebase AI Logic with `PREFER_ON_DEVICE`. On supported hardware, Gemini Nano handles the structured, single-turn task locally. If the model or request is unavailable, Firebase AI Logic falls back to the configured cloud Gemini model. The app displays the actual inference source instead of implying that every answer was local.”

Zoom in on the `ON_DEVICE` or `IN_CLOUD` evidence chip and model status.

## 1:35-2:10 — Useful, bounded output

Scroll through urgency, observations, inspection steps, suggested services, safety notices, and follow-up questions.

“The model cannot claim a confirmed diagnosis, invent a fault code, or mark work complete. The shared schema keeps Web and Android aligned, while safety rules elevate brake, steering, fire, fuel-leak, and overheating symptoms.”

## 2:10-2:30 — Three languages and Android

Show the Arabic synthetic overheating case, then cut to the Android app producing the same contract.

“The product supports Arabic, Swedish, and English with right-to-left layout where needed. The Android client uses Firebase AI Logic’s native hybrid SDK and Gemini Nano through AICore.”

## 2:30-2:45 — Optional field help and close

Show the explicit nearby-workshop action and its Geoapify attribution.

“Location is optional and separate: Geoapify receives only coordinates after consent, never the vehicle note. CarCare AI Field Assistant brings transparent, privacy-aware hybrid AI to the moment a vehicle problem is first described.”
