# #BuildHybridAI 2026 compliance matrix

Official deadline: **November 30, 2026 at 2:00 PM Pacific Time** (23:00 Europe/Stockholm on that date).

| Requirement | Implementation | Evidence status |
| --- | --- | --- |
| Firebase AI Logic | Native Web and Android SDK integrations | Enabled in dedicated project; live request reached the configured Gemini model |
| On-device inference | `PREFER_ON_DEVICE` with Gemini Nano initialization | Implemented |
| Cloud inference | Firebase AI Logic cloud fallback model | Implemented |
| App Check | Web reCAPTCHA Enterprise and Android Play Integrity/debug setup | Registered; Basic protection enforced for Firebase AI Logic |
| Platform | Chrome Web and native Android | Implemented |
| Working demo | Synthetic, labelled UI mode plus live configuration path | Deployed at `https://carcare-ai-field-assistant.web.app`; Cloud Billing is linked, but Gemini API Prepay credit is empty |
| Public source | Clean standalone MIT repository | Published at `https://github.com/MudherAhmad/carcare-ai-field-assistant` |
| Video | English script, shot list, captions plan, max 3 minutes | Prepared; final live recording and YouTube upload pending project owner |
| Written submission | Devpost copy in `demo/DEVPOST_SUBMISSION.md` | Prepared |

- Entrant: **Mudher Ahmad**
- Team / public channel: **Car Care Sverige**

## Final submission gate

- [x] Confirm entrant legal name and team name.
- [x] Create or select a dedicated Firebase project.
- [x] Register Web and Android apps.
- [x] Enable Firebase AI Logic with the Gemini Developer API.
- [x] Configure and enforce App Check for deployed builds.
- [ ] Verify an `ON_DEVICE` result on supported Chrome and Android hardware.
- [ ] Add a positive Gemini API Prepay balance and verify the corrected `IN_CLOUD` label.
- [x] Deploy Firebase Hosting and record its public URL.
- [x] Publish the source repository and run the clean-room safety scan on the published commit.
- [ ] Record a live English demo of no more than 3 minutes.
- [ ] Upload the video publicly to YouTube and add English subtitles.
- [ ] Complete Devpost team membership and submission fields before the deadline.
