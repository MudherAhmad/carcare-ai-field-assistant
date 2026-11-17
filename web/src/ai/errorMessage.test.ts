import { describe, expect, it } from "vitest";
import { getMessages, messages } from "../i18n/messages";
import { toUserFacingAiError } from "./errorMessage";

describe("toUserFacingAiError", () => {
  it("turns a depleted Gemini Prepay error into an actionable message", () => {
    const cause = new Error(
      "Error fetching from https://firebasevertexai.googleapis.com: [429] Your prepayment credits are depleted.",
    );

    const result = toUserFacingAiError(cause, messages.en);

    expect(result).toBe(messages.en.billingCreditRequired);
    expect(result).not.toContain("firebasevertexai.googleapis.com");
  });

  it("does not expose unexpected provider errors", () => {
    const swedish = getMessages("sv");
    const result = toUserFacingAiError(new Error("provider-internal-id-123"), swedish);

    expect(result).toBe(swedish.aiUnavailable);
    expect(result).not.toContain("provider-internal-id-123");
  });
});
