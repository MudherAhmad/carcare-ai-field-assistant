import { describe, expect, it } from "vitest";
import { getSyntheticReport } from "./demoReports";
import { parseInspectionReport } from "./validation";

describe("parseInspectionReport", () => {
  it("accepts the shared report contract", () => {
    const report = getSyntheticReport("sv");
    expect(parseInspectionReport(JSON.stringify(report))).toEqual(report);
  });

  it("accepts a fenced JSON response", () => {
    const report = getSyntheticReport("ar");
    expect(parseInspectionReport(`\`\`\`json\n${JSON.stringify(report)}\n\`\`\``).urgency).toBe("stop_driving");
  });

  it("rejects invented schema shapes", () => {
    expect(() => parseInspectionReport('{"diagnosis":"alternator"}')).toThrow();
  });
});
