import type { VehicleInput } from "../types";

const languageNames = {
  ar: "Arabic",
  sv: "Swedish",
  en: "English",
} as const;

export function buildInspectionPrompt(input: VehicleInput, redactedNotes: string): string {
  const mileage = input.mileageKm == null ? "not provided" : `${input.mileageKm} km`;

  return `You are a cautious vehicle field-inspection assistant.

Create one JSON inspection brief in ${languageNames[input.language]}.

Hard rules:
- This is not a confirmed diagnosis and you did not inspect the vehicle.
- Separate observed symptoms from possible checks; do not state causes as facts.
- Never invent OBD codes, measurements, sensor values, prices, parts availability, or completed work.
- Treat brake, steering, fire, fuel leak, overheating, smoke, and severe warning-light symptoms conservatively.
- Mark any hazardous, under-vehicle, high-voltage, hot-engine, fuel-system, or moving-part check as professional_only.
- If immediate driving may be unsafe, use urgency stop_driving and give a short safety notice.
- Keep the response concise, practical, and fully in ${languageNames[input.language]}.
- Return JSON only, matching schemaVersion 1.0.

Vehicle: ${input.vehicle.trim() || "not provided"}
Mileage: ${mileage}
Driver or technician note after local redaction:
${redactedNotes.slice(0, 3000)}`;
}
