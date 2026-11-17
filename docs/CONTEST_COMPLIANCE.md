# #BuildHybridAI 2026 compliance matrix

Official deadline: **November 30, 2026 at 2:00 PM Pacific Time** (23:00 Europe/Stockholm on that date).

| Requirement | Implementation | Evidence status |
| --- | --- | --- |
| Firebase AI Logic | Native Web and Android SDK integrations | Implemented; live project verification pending Firebase configuration |
| On-device inference | `PREFER_ON_DEVICE` with Gemini Nano initialization | Implemented |
| Cloud inference | Firebase AI Logic cloud fallback model | Implemented |
| App Check | Web reCAPTCHA Enterprise/debug setup and Android Play Integrity/debug setup | Implemented; production enforcement pending project owner |
| Platform | Chrome Web and native Android | Implemented |
| Working demo | Synthetic, labelled UI mode plus live configuration path | Local demo ready; hosted live URL pending project owner |
| Public source | Clean standalone MIT repository | Ready locally; public remote pending project owner |
| Video | English script, shot list, captions plan, max 3 minutes | Prepared; final live recording and YouTube upload pending project owner |
| Written submission | Devpost copy in `demo/DEVPOST_SUBMISSION.md` | Prepared |

## Final submission gate

- [ ] Confirm entrant eligibility and legal name/team members.
- [ ] Create or select a dedicated Firebase project.
- [ ] Register Web and Android apps.
- [ ] Enable Firebase AI Logic with the Gemini Developer API.
- [ ] Configure and enforce App Check for deployed builds.
- [ ] Verify an `ON_DEVICE` result on supported Chrome and Android hardware.
- [ ] Verify an `IN_CLOUD` fallback result.
- [ ] Deploy Firebase Hosting and record its public URL.
- [ ] Publish the source repository and run the clean-room safety scan on the published commit.
- [ ] Record a live English demo of no more than 3 minutes.
- [ ] Upload the video publicly to YouTube and add English subtitles.
- [ ] Complete Devpost team membership and submission fields before the deadline.
