# Privacy and safety

## Privacy defaults

- The app does not require an account and stores no report by default.
- Common email, phone, and registration-number patterns are replaced locally before inference.
- The UI shows the exact redacted note that may reach Firebase AI Logic.
- Location is requested only for an explicit nearby-workshop search.
- Geoapify never receives the vehicle note or report.
- App Check is required for deployed builds. Debug providers are local-development only.

Pattern-based redaction reduces accidental disclosure but cannot guarantee that every identifier is detected. Users are told not to enter names, addresses, phone numbers, email addresses, VINs, or registration numbers.

## Safety rules embedded in the prompt

The model must:

- separate observations from possible causes;
- avoid claiming a confirmed diagnosis or completed inspection;
- never invent fault codes, measurements, sensor readings, prices, or service availability;
- elevate brake, steering, fire, fuel leak, overheating, and severe warning-light symptoms;
- mark hazardous checks as `professional_only`;
- ask focused follow-up questions when evidence is incomplete;
- answer in the selected language.

The app validates model output and presents it as decision support, not as a repair authorization.
