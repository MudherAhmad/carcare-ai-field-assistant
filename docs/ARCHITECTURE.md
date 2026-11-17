# Architecture

## Data flow

```text
Vehicle note
    |
    v
Deterministic client-side redaction
    |
    v
Firebase App Check protected client
    |
    v
Firebase AI Logic hybrid model (PREFER_ON_DEVICE)
    |                         |
    | supported              | unavailable / unsupported
    v                         v
Gemini Nano on device        Cloud Gemini fallback
    |                         |
    +------------+------------+
                 v
Validated report schema + visible inference source
                 |
                 +--> Optional Geoapify nearby repair lookup
```

All generative AI calls go through Firebase AI Logic. Geoapify is a non-AI, optional place lookup and never receives the vehicle note or generated report.

## Trust boundaries

- **Raw note:** remains in browser or app memory and is redacted before the model request.
- **Firebase AI Logic:** protected with App Check; the Gemini API key is not embedded in either client.
- **On-device model:** preferred for low latency, privacy, and offline availability.
- **Cloud fallback:** receives the same redacted, bounded prompt only when required by the selected hybrid mode.
- **Geoapify:** receives latitude, longitude, radius, and language only after an explicit user action.
- **Persistence:** none by default. Reports stay in memory and can be copied by the user.

## Cross-platform contract

Web and Android use the same public JSON schema, prompt rules, urgency vocabulary, and redaction policy. Each client uses the native Firebase AI Logic SDK so the on-device path is real on its platform.
