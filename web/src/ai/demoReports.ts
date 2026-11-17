import type { InspectionReport, Locale } from "../types";

const reports: Record<Locale, InspectionReport> = {
  en: {
    schemaVersion: "1.0",
    language: "en",
    summary: "The note describes a braking-related vibration that should be inspected soon. The symptom alone does not confirm a cause.",
    urgency: "soon",
    confidence: 0.72,
    observations: [
      { system: "Braking / steering", symptom: "Steering wheel vibration during higher-speed braking", severity: "medium" },
    ],
    inspectionSteps: [
      { title: "Check when the vibration occurs", reason: "Speed, pedal feel, and road conditions help a technician reproduce the symptom.", safetyLevel: "owner_safe" },
      { title: "Inspect brake and steering components", reason: "A qualified technician should inspect wear, runout, looseness, and heat damage.", safetyLevel: "professional_only" },
    ],
    suggestedServices: [
      { name: "Brake and front-end inspection", reason: "The symptom appears under braking and is felt through the steering wheel.", priority: "priority" },
    ],
    safetyNotices: ["Avoid hard or high-speed driving until the braking behavior has been assessed."],
    followUpQuestions: ["Does the brake pedal also pulse?", "Does the vehicle pull to either side?"],
  },
  sv: {
    schemaVersion: "1.0",
    language: "sv",
    summary: "Batterilampan tillsammans med svagare belysning kan tyda på att bilens elsystem inte laddar normalt. Orsaken är inte bekräftad.",
    urgency: "urgent",
    confidence: 0.78,
    observations: [
      { system: "Laddningssystem", symptom: "Batterilampan tändes under körning", severity: "high" },
      { system: "Elsystem", symptom: "Strålkastarna blev svagare", severity: "high" },
    ],
    inspectionSteps: [
      { title: "Stanna på en säker plats", reason: "Bilen kan stanna om laddningen upphör helt.", safetyLevel: "owner_safe" },
      { title: "Kontrollera laddningssystemet", reason: "En verkstad bör mäta systemspänning och kontrollera generator, rem och anslutningar.", safetyLevel: "professional_only" },
    ],
    suggestedServices: [
      { name: "Diagnos av laddningssystem", reason: "Varningslampan och svag belysning kräver kontroll innan fortsatt normal körning.", priority: "immediate" },
    ],
    safetyNotices: ["Stäng av onödiga elförbrukare och kör inte längre än vad som krävs för att nå en säker plats."],
    followUpQuestions: ["Hörs missljud från remområdet?", "Har styrningen blivit tyngre?"],
  },
  ar: {
    schemaVersion: "1.0",
    language: "ar",
    summary: "تشير الملاحظة إلى ارتفاع حرارة المحرك مع ظهور بخار. السبب غير مؤكد، لكن متابعة القيادة قد تسبب ضرراً أو خطراً.",
    urgency: "stop_driving",
    confidence: 0.88,
    observations: [
      { system: "نظام التبريد", symptom: "ارتفاع حرارة المحرك وظهور بخار من المقدمة", severity: "critical" },
    ],
    inspectionSteps: [
      { title: "اترك المحرك يبرد تماماً", reason: "فتح نظام التبريد وهو ساخن قد يسبب حروقاً خطيرة.", safetyLevel: "owner_safe" },
      { title: "فحص نظام التبريد مهنياً", reason: "يجب فحص التسرب ومستوى السائل والمروحة والمضخة بعد أن تبرد السيارة.", safetyLevel: "professional_only" },
    ],
    suggestedServices: [
      { name: "فحص عاجل لنظام التبريد", reason: "ارتفاع الحرارة مع البخار يتطلب فحصاً قبل إعادة القيادة.", priority: "immediate" },
    ],
    safetyNotices: ["لا تفتح غطاء سائل التبريد والمحرك ساخن، ولا تواصل القيادة."],
    followUpQuestions: ["هل ظهر تسرب سائل تحت السيارة؟", "هل عملت مروحة التبريد؟"],
  },
};

export function getSyntheticReport(locale: Locale): InspectionReport {
  return structuredClone(reports[locale]);
}
