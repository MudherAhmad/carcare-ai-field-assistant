import { describe, expect, it } from "vitest";
import { InferenceSource } from "firebase/ai";
import { isOnDeviceAvailabilityReady, normalizeInferenceSource } from "./hybridEngine";

describe("normalizeInferenceSource", () => {
  it("maps Firebase hybrid inference values to the public report labels", () => {
    expect(normalizeInferenceSource(InferenceSource.ON_DEVICE)).toBe("ON_DEVICE");
    expect(normalizeInferenceSource(InferenceSource.IN_CLOUD)).toBe("IN_CLOUD");
    expect(normalizeInferenceSource(undefined)).toBe("UNKNOWN");
  });

  it("only reports the on-device model as ready after Chrome confirms availability", () => {
    expect(isOnDeviceAvailabilityReady("available")).toBe(true);
    expect(isOnDeviceAvailabilityReady("downloadable")).toBe(false);
    expect(isOnDeviceAvailabilityReady(undefined)).toBe(false);
  });
});
