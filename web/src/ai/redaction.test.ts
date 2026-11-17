import { describe, expect, it } from "vitest";
import { redactSensitiveText } from "./redaction";

describe("redactSensitiveText", () => {
  it("redacts contact details, VINs, and Swedish registration numbers", () => {
    const result = redactSensitiveText(
      "Call +46 70 123 45 67 or tech@example.com about ABC123 and WBA3A5C50DF123456.",
    );

    expect(result.text).not.toContain("tech@example.com");
    expect(result.text).not.toContain("WBA3A5C50DF123456");
    expect(result.text).not.toContain("+46 70 123 45 67");
    expect(result.text).toContain("[REDACTED_EMAIL]");
    expect(result.text).toContain("[REDACTED_VIN]");
    expect(result.total).toBeGreaterThanOrEqual(3);
  });

  it("keeps ordinary multilingual symptom text", () => {
    const text = "Batterilampan lyser. ارتفعت حرارة المحرك.";
    expect(redactSensitiveText(text).text).toBe(text);
  });
});
