# CarCare workshop pilot

Measure how quickly a technician can turn an intake note into a reviewable service decision and how often the reviewer needs to request evidence or correct the suggested action.

## Run a short session

1. Ask a technician and a reviewer to choose four anonymized, low-risk cases with known outcomes. Form two pairs of cases with comparable difficulty. Prepare a short intake note and a separately held technician observation for each case. Record only a case ID.
2. Give the technician one case in each pair using the workshop's usual process and the other using [CarCare](https://carcare-ai-field-assistant.web.app). Start with the usual process in the first pair and with CarCare in the second. Use a different case each time.
3. Start timing when the technician reads the intake. In CarCare, enable **Review evidence before suggesting a service**, submit the intake with the technician field blank, and record the question. Supply the prepared observation at the same point in either workflow. Stop timing when the reviewer accepts a suggested action or accepts a documented request for more evidence.
4. Record active time and waiting time separately. Have the reviewer count clarification requests, unsupported suggestions, and corrections using the same criteria for both workflows. Record the actual inference source shown for each CarCare response.

## Capture the results

| Pair and case ID | Workflow | Active seconds | Waiting seconds | Clarifications | Unsupported service suggestions | Corrections | Accepted action or next question | Inference source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | Usual process | | | | | | | |
| | CarCare | | | | | | | |
| | CarCare | | | | | | | |
| | Usual process | | | | | | | |

Count a suggestion as unsupported when the reviewer judges that the available notes do not support carrying out that service. Count additional intake questions separately from corrections to an already prepared report. Record the case mix and technician count alongside any time or quality comparison. Report the results as observations from this pilot and obtain permission before using a named workshop, a quote, or footage in the submission.

## Workshop walkthrough results

On November 19, 2026, a real rear-seat inspection was documented using a test booking. The same anonymized intake note was used in both desktop Chrome reports. The first report deferred a service suggestion while the technician field was empty. The update included the technician's observation of a surface stain and intact fabric and suggested a visual check and follow-up. Both reports displayed `ON DEVICE` and `Gemini Nano`. [Screenshots of both stages](ON_DEVICE_VERIFICATION.md#workshop-seat-inspection-in-chrome)

Staff separately entered a spot-cleaning proposal in the existing Car Care Sverige system. The SEK 300 add-on brought the SEK 500 base service to SEK 800. The test quote was awaiting a customer decision.

| Activity | Operator estimate | Scope |
| --- | ---: | --- |
| Two CarCare AI passes | About 60 seconds | Initial evidence review and updated report, about 30 seconds each. |
| Usual text entry | About 90 seconds | Writing and entering the report without photo handling. |
| Usual administrative workflow | About 2 minutes 30 seconds to 4 minutes | Broader three-stage process with additional-cost review and photo handling when applicable. The second staff member's full handoff was not timed. |
| Recorded walkthrough | About 9 minutes 50 seconds | Broader session including photographing the seat and recording the demonstration. |

The recording verifies the two AI stages and the displayed inference source. The operator described the AI-assisted report as clearer and better structured. The estimates cover different steps. No paired elapsed-time saving or independent quality score has been measured. The current assistant handles text observations, and photo masking is planned work.
