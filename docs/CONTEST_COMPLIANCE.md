# #BuildHybridAI 2026 compliance matrix

Official deadline: **November 30, 2026 at 2:00 PM Pacific Time** (23:00 Europe/Stockholm on that date).

| Requirement | Implementation | Evidence status |
| --- | --- | --- |
| Firebase AI Logic | Native Web and Android SDK integrations | Enabled in dedicated project; live request reached the configured Gemini model |
| On-device inference | `PREFER_ON_DEVICE` with Gemini Nano initialization | Verified in production on Chrome. Native Android verification is pending. |
| Cloud inference | Firebase AI Logic cloud fallback model | Verified in live Web and native Android runs. |
| App Check | Web reCAPTCHA Enterprise and Android Play Integrity/debug setup | Registered; Basic protection enforced for Firebase AI Logic |
| Platform | Chrome Web and native Android | Chrome is the demonstrated local-and-cloud platform. Native Android has a verified cloud path. The rules require at least one qualifying platform. |
| Working demo | Synthetic, labelled UI mode plus live configuration path | Deployed at `https://carcare-ai-field-assistant.web.app`; live `IN_CLOUD` result verified through Firebase AI Logic |
| Public source | Clean standalone MIT repository | Published at `https://github.com/MudherAhmad/carcare-ai-field-assistant` |
| Video | English narration, verified Web and Android evidence, burned English captions, max 3 minutes | The approximately 1:51 [workshop demo](https://youtu.be/Xzp_eaj-8P4) was verified publicly on YouTube and embedded in Devpost on 2026-11-19. |
| Written submission | Devpost copy in `demo/DEVPOST_SUBMISSION.md` | The project remains submitted. The [public story](https://devpost.com/software/carcare-ai-field-assistant) was verified with the workshop evidence and scoped timing estimates on 2026-11-19. |
| Existing-work disclosure | The standalone submission states what was built during the contest and names the role of the pre-existing booking and quoting system. | Documented in the submission copy. |

- Entrant: **Mudher Ahmad**
- Team / public channel: **Car Care Sverige**

## Final submission gate

- [x] Confirm entrant legal name and team name.
- [x] Create or select a dedicated Firebase project.
- [x] Register Web and Android apps.
- [x] Enable Firebase AI Logic with the Gemini Developer API.
- [x] Configure and enforce App Check for deployed builds.
- [x] Verify an `ON_DEVICE` result on supported Chrome hardware.
- [ ] Verify native Android `ON_DEVICE` on supported hardware if pursuing the Android category.
- [x] Add a positive Gemini API Prepay balance and verify the corrected `IN_CLOUD` label.
- [x] Deploy Firebase Hosting and record its public URL.
- [x] Publish the source repository and run the clean-room safety scan on the published commit.
- [x] Produce and verify an English demo of no more than 3 minutes.
- [x] Upload the video publicly to YouTube with burned English subtitles.
- [x] Complete Devpost team membership and submission fields before the deadline.

Devpost displayed `Project submitted!` and `SUBMITTED TO #BuildHybridAI 2026` on 2026-11-18. The project lists Mudher Ahmad as its creator and embeds the published YouTube video. The [verification record](VERIFICATION.md) documents the later Chrome result and the remaining native Android verification and signing work.
