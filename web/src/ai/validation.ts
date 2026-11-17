import type { InspectionReport, Locale, Severity, Urgency } from "../types";

const locales = new Set<Locale>(["ar", "sv", "en"]);
const urgencies = new Set<Urgency>(["routine", "soon", "urgent", "stop_driving"]);
const severities = new Set<Severity>(["low", "medium", "high", "critical"]);
const safetyLevels = new Set(["owner_safe", "professional_only"]);
const priorities = new Set(["optional", "recommended", "priority", "immediate"]);

function isString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isStringArray(value: unknown, maxItems: number, maxLength: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((item) => isString(item, maxLength))
  );
}

export function parseInspectionReport(rawText: string): InspectionReport {
  let candidate: unknown;
  try {
    candidate = JSON.parse(rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
  } catch {
    throw new Error("The AI response was not valid JSON.");
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("The AI response did not contain an inspection report.");
  }

  const value = candidate as Record<string, unknown>;
  if (value.schemaVersion !== "1.0") throw new Error("Unsupported report schema version.");
  if (!locales.has(value.language as Locale)) throw new Error("Unsupported report language.");
  if (!isString(value.summary, 600)) throw new Error("Invalid report summary.");
  if (!urgencies.has(value.urgency as Urgency)) throw new Error("Invalid urgency.");
  if (typeof value.confidence !== "number" || value.confidence < 0 || value.confidence > 1) {
    throw new Error("Invalid confidence value.");
  }
  if (
    !Array.isArray(value.observations) ||
    value.observations.length > 8 ||
    !value.observations.every((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const row = item as Record<string, unknown>;
      return isString(row.system, 80) && isString(row.symptom, 240) && severities.has(row.severity as Severity);
    })
  ) throw new Error("Invalid observations.");
  if (
    !Array.isArray(value.inspectionSteps) ||
    value.inspectionSteps.length > 8 ||
    !value.inspectionSteps.every((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const row = item as Record<string, unknown>;
      return isString(row.title, 160) && isString(row.reason, 280) && safetyLevels.has(row.safetyLevel as string);
    })
  ) throw new Error("Invalid inspection steps.");
  if (
    !Array.isArray(value.suggestedServices) ||
    value.suggestedServices.length > 6 ||
    !value.suggestedServices.every((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return false;
      const row = item as Record<string, unknown>;
      return isString(row.name, 140) && isString(row.reason, 280) && priorities.has(row.priority as string);
    })
  ) throw new Error("Invalid suggested services.");
  if (!isStringArray(value.safetyNotices, 5, 260)) throw new Error("Invalid safety notices.");
  if (!isStringArray(value.followUpQuestions, 5, 220)) throw new Error("Invalid follow-up questions.");

  return candidate as InspectionReport;
}
