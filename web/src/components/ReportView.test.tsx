import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getSyntheticReport } from "../ai/demoReports";
import { getMessages } from "../i18n/messages";
import type { ReportResult } from "../types";
import { ReportView } from "./ReportView";

const messages = getMessages("en");
const report = getSyntheticReport("en");
const result: ReportResult = {
  report,
  source: "IN_CLOUD",
  modelName: "Gemini",
};

describe("evidence review", () => {
  it("holds model-proposed services but keeps follow-up and safety information visible", () => {
    const markup = renderToStaticMarkup(<ReportView result={{ ...result, evidenceReview: { intake: "The customer reported a new symptom.", technicianNote: "" } }} messages={messages} />);

    expect(markup).toContain(messages.evidenceNeeded);
    expect(markup).not.toContain(messages.services);
    expect(markup).not.toContain(report.suggestedServices[0].name);
    expect(markup).toContain(report.safetyNotices[0]);
    expect(markup).toContain(report.followUpQuestions[0]);
  });

  it("shows the supplied technician note and the revised service rationale", () => {
    const technicianNote = "The seat fabric is intact and the mark is a superficial stain.";
    const suggestion = { name: "Upholstery cleaning", reason: "The technician observed a superficial stain.", priority: "recommended" as const };
    const markup = renderToStaticMarkup(<ReportView result={{
      ...result,
      report: { ...report, suggestedServices: [suggestion] },
      evidenceReview: { intake: "The customer requested seat replacement.", technicianNote },
    }} messages={messages} />);

    expect(markup).toContain(technicianNote);
    expect(markup).toContain(suggestion.name);
    expect(markup).toContain(suggestion.reason);
  });
});
