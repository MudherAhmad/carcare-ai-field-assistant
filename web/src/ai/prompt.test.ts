import { expect, it } from "vitest";
import { buildInspectionPrompt } from "./prompt";

it("removes identifiers from the vehicle field while preserving model names", () => {
  const prompt = buildInspectionPrompt({
    language: "en",
    vehicle: "Toyota RAV4 ABC123 owner@example.test",
    notes: "original note",
  }, "Seat mark reported.");

  expect(prompt).toContain('Vehicle: "Toyota RAV4 [REDACTED_REGISTRATION] [REDACTED_EMAIL]"');
  expect(prompt).not.toContain("ABC123");
  expect(prompt).not.toContain("owner@example.test");
  expect(prompt).not.toContain("original note");
});
