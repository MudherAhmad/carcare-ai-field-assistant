export type Locale = "ar" | "sv" | "en";
export type Urgency = "routine" | "soon" | "urgent" | "stop_driving";
export type Severity = "low" | "medium" | "high" | "critical";
export type InferenceSource = "ON_DEVICE" | "IN_CLOUD" | "SYNTHETIC_DEMO" | "UNKNOWN";

export interface Observation {
  system: string;
  symptom: string;
  severity: Severity;
}

export interface InspectionStep {
  title: string;
  reason: string;
  safetyLevel: "owner_safe" | "professional_only";
}

export interface SuggestedService {
  name: string;
  reason: string;
  priority: "optional" | "recommended" | "priority" | "immediate";
}

export interface InspectionReport {
  schemaVersion: "1.0";
  language: Locale;
  summary: string;
  urgency: Urgency;
  confidence: number;
  observations: Observation[];
  inspectionSteps: InspectionStep[];
  suggestedServices: SuggestedService[];
  safetyNotices: string[];
  followUpQuestions: string[];
}

export interface VehicleInput {
  language: Locale;
  vehicle: string;
  mileageKm?: number;
  notes: string;
}

export interface ReportResult {
  report: InspectionReport;
  source: InferenceSource;
  modelName: string;
}

export interface NearbyWorkshop {
  id: string;
  name: string;
  address: string;
  distanceMeters?: number;
  latitude: number;
  longitude: number;
}
