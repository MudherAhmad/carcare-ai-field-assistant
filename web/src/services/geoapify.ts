import type { Locale, NearbyWorkshop } from "../types";

const endpoint = "https://api.geoapify.com/v2/places";

function validCoordinate(latitude: number, longitude: number): boolean {
  return Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

export async function findNearbyWorkshops(
  latitude: number,
  longitude: number,
  locale: Locale,
  apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY?.trim() ?? "",
  request: typeof fetch = fetch,
): Promise<NearbyWorkshop[]> {
  if (!validCoordinate(latitude, longitude)) throw new Error("Invalid location.");
  if (!apiKey) throw new Error("Geoapify is not configured for this build.");

  const url = new URL(endpoint);
  url.searchParams.set("categories", "service.vehicle.repair.car");
  url.searchParams.set("filter", `circle:${longitude},${latitude},15000`);
  url.searchParams.set("bias", `proximity:${longitude},${latitude}`);
  url.searchParams.set("limit", "5");
  url.searchParams.set("lang", locale);
  url.searchParams.set("apiKey", apiKey);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await request(url, {
      method: "GET",
      redirect: "error",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Workshop lookup is temporarily unavailable.");
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || !Array.isArray((payload as { features?: unknown }).features)) {
      throw new Error("Workshop lookup returned an invalid response.");
    }

    return (payload as { features: unknown[] }).features.slice(0, 5).flatMap((feature) => {
      if (!feature || typeof feature !== "object") return [];
      const properties = (feature as { properties?: unknown }).properties;
      if (!properties || typeof properties !== "object") return [];
      const row = properties as Record<string, unknown>;
      const lat = Number(row.lat);
      const lon = Number(row.lon);
      if (!validCoordinate(lat, lon)) return [];
      const id = typeof row.place_id === "string" ? row.place_id : `${lat},${lon}`;
      const name = typeof row.name === "string" && row.name.trim() ? row.name.trim() : "Vehicle repair";
      const address = typeof row.formatted === "string" ? row.formatted.trim() : "";
      const distance = Number(row.distance);
      return [{
        id,
        name,
        address,
        distanceMeters: Number.isFinite(distance) && distance >= 0 ? distance : undefined,
        latitude: lat,
        longitude: lon,
      }];
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Workshop lookup timed out.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
