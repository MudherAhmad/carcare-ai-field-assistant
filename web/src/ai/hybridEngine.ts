import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  InferenceSource,
  type GenerativeModel,
} from "firebase/ai";
import { getSyntheticReport } from "./demoReports";
import { buildInspectionPrompt } from "./prompt";
import { reportJsonSchema } from "./reportSchema";
import { parseInspectionReport } from "./validation";
import type { ReportResult, VehicleInput } from "../types";

export type PreparationState = "idle" | "downloading" | "ready" | "cloud_only";

export interface HybridPreparation {
  state: PreparationState;
  progress: number;
}

export interface HybridReportEngine {
  isConfigured(): boolean;
  isSyntheticDemo(): boolean;
  prepare(onProgress: (state: HybridPreparation) => void): Promise<void>;
  generate(input: VehicleInput, redactedNotes: string): Promise<ReportResult>;
}

function envValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function normalizeInferenceSource(source: unknown): "ON_DEVICE" | "IN_CLOUD" | "UNKNOWN" {
  if (source === InferenceSource.ON_DEVICE || source === "ON_DEVICE") return "ON_DEVICE";
  if (source === InferenceSource.IN_CLOUD || source === "IN_CLOUD") return "IN_CLOUD";
  return "UNKNOWN";
}

export function isOnDeviceAvailabilityReady(availability: unknown): boolean {
  return availability === "available";
}

export class FirebaseHybridReportEngine implements HybridReportEngine {
  private app?: FirebaseApp;
  private model?: GenerativeModel;
  private prepared = false;
  private readonly cloudModel = envValue(import.meta.env.VITE_FIREBASE_CLOUD_MODEL) || "gemini-3.5-flash-lite";

  isSyntheticDemo(): boolean {
    return import.meta.env.VITE_SYNTHETIC_DEMO === "true";
  }

  isConfigured(): boolean {
    if (this.isSyntheticDemo()) return true;
    return [
      import.meta.env.VITE_FIREBASE_API_KEY,
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_APP_ID,
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY,
    ].every((value) => envValue(value).length > 0);
  }

  private getModel(): GenerativeModel {
    if (this.model) return this.model;
    if (!this.isConfigured()) {
      throw new Error("Firebase and App Check are not configured for this build.");
    }

    this.app = initializeApp({
      apiKey: envValue(import.meta.env.VITE_FIREBASE_API_KEY),
      authDomain: envValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId: envValue(import.meta.env.VITE_FIREBASE_PROJECT_ID),
      appId: envValue(import.meta.env.VITE_FIREBASE_APP_ID),
      messagingSenderId: envValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    });

    if (import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG === "true") {
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(this.app, {
      provider: new ReCaptchaEnterpriseProvider(
        envValue(import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY),
      ),
      isTokenAutoRefreshEnabled: true,
    });

    const ai = getAI(this.app, { backend: new GoogleAIBackend() });
    this.model = getGenerativeModel(ai, {
      mode: InferenceMode.PREFER_ON_DEVICE,
      inCloudParams: {
        model: this.cloudModel,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200,
          responseMimeType: "application/json",
          responseSchema: reportJsonSchema,
        },
      },
      onDeviceParams: {
        promptOptions: {
          responseConstraint: reportJsonSchema,
        },
      },
    });
    return this.model;
  }

  async prepare(onProgress: (state: HybridPreparation) => void): Promise<void> {
    if (this.isSyntheticDemo()) {
      this.prepared = true;
      onProgress({ state: "ready", progress: 1 });
      return;
    }

    const model = this.getModel();
    const languageModel = window.LanguageModel;
    if (!languageModel) {
      this.prepared = true;
      onProgress({ state: "cloud_only", progress: 0 });
      return;
    }
    onProgress({ state: "downloading", progress: 0 });
    try {
      await model.initializeDeviceModel((progress) => {
        onProgress({ state: "downloading", progress });
      });
      this.prepared = true;
      const availability = await languageModel.availability({
        expectedInputs: [
          { type: "text", languages: ["en"] },
          { type: "image" },
        ],
        expectedOutputs: [{ type: "text", languages: ["en"] }],
      });
      onProgress(
        isOnDeviceAvailabilityReady(availability)
          ? { state: "ready", progress: 1 }
          : { state: "cloud_only", progress: 0 },
      );
    } catch {
      this.prepared = true;
      onProgress({ state: "cloud_only", progress: 0 });
    }
  }

  async generate(input: VehicleInput, redactedNotes: string): Promise<ReportResult> {
    if (this.isSyntheticDemo()) {
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      return {
        report: getSyntheticReport(input.language),
        source: "SYNTHETIC_DEMO",
        modelName: "labelled synthetic report",
      };
    }

    if (!this.prepared) {
      await this.prepare(() => undefined);
    }
    const model = this.getModel();
    const result = await model.generateContent(buildInspectionPrompt(input, redactedNotes));
    const source = normalizeInferenceSource(result.response.inferenceSource);
    return {
      report: parseInspectionReport(result.response.text()),
      source,
      modelName: source === "ON_DEVICE" ? "Gemini Nano" : this.cloudModel,
    };
  }
}
