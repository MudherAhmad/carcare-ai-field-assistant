import { describe, expect, it } from "vitest";
import { reportJsonSchema } from "./reportSchema";

describe("reportJsonSchema", () => {
  it("uses only Firebase AI Logic-supported schema keywords", () => {
    expect(JSON.stringify(reportJsonSchema)).not.toContain('"additionalProperties"');
  });
});
