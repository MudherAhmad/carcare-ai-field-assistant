import { describe, expect, it, vi } from "vitest";
import { findNearbyWorkshops } from "./geoapify";

describe("findNearbyWorkshops", () => {
  it("fails before a request when the key is absent", async () => {
    const request = vi.fn();
    await expect(findNearbyWorkshops(56.02, 14.15, "sv", "", request)).rejects.toThrow("not configured");
    expect(request).not.toHaveBeenCalled();
  });

  it("bounds and validates provider results", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      features: [
        { properties: { place_id: "one", name: "Testverkstad", formatted: "Testvägen 1", lat: 56.03, lon: 14.16, distance: 1200 } },
        { properties: { place_id: "bad", name: "Invalid", lat: 200, lon: 14.16 } },
      ],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const result = await findNearbyWorkshops(56.02, 14.15, "sv", "test-key", request);
    expect(result).toEqual([expect.objectContaining({ id: "one", name: "Testverkstad" })]);
    const requestedUrl = request.mock.calls[0][0] as URL;
    expect(requestedUrl.searchParams.get("categories")).toBe("service.vehicle.repair.car");
    expect(requestedUrl.searchParams.get("limit")).toBe("5");
  });
});
