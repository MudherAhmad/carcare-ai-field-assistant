package ai.carcare.fieldassistant.ai

import ai.carcare.fieldassistant.BuildConfig
import ai.carcare.fieldassistant.data.EngineResult
import ai.carcare.fieldassistant.data.InspectionReportPayload
import ai.carcare.fieldassistant.data.InspectionStepPayload
import ai.carcare.fieldassistant.data.ObservationPayload
import ai.carcare.fieldassistant.data.SuggestedServicePayload
import ai.carcare.fieldassistant.data.VehicleInput
import ai.carcare.fieldassistant.data.firebaseAISchema
import com.google.firebase.Firebase
import com.google.firebase.ai.InferenceMode
import com.google.firebase.ai.OnDeviceConfig
import com.google.firebase.ai.OnDeviceModelOption
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.GenerativeBackend
import com.google.firebase.ai.type.PublicPreviewAPI

interface HybridReportEngine {
    suspend fun generate(input: VehicleInput, redactedNotes: String): EngineResult
}

class FirebaseHybridReportEngine : HybridReportEngine {
    @OptIn(PublicPreviewAPI::class)
    override suspend fun generate(input: VehicleInput, redactedNotes: String): EngineResult {
        check(BuildConfig.FIREBASE_CONFIGURED) { "Firebase is not configured for this build." }
        val model = Firebase.ai(backend = GenerativeBackend.googleAI()).generativeModel(
            modelName = BuildConfig.FIREBASE_CLOUD_MODEL,
            onDeviceConfig = OnDeviceConfig(
                mode = InferenceMode.PREFER_ON_DEVICE,
                modelOption = OnDeviceModelOption.PREVIEW_FAST,
                temperature = 0.2f,
                maxOutputTokens = 900,
            ),
        )
        val generated = model.generateObject(
            InspectionReportPayload.firebaseAISchema(),
            PromptFactory.create(input, redactedNotes),
        )
        val report: InspectionReportPayload = generated.getObject()
            ?: error("Firebase AI Logic returned no structured report.")
        val source = generated.response.inferenceSource.toString()
        return EngineResult(
            report = ReportValidator.requireValid(report, evidenceReview = input.redactedTechnicianNote != null),
            source = source,
            modelName = if (source == "ON_DEVICE") "Gemini Nano 4 Fast" else BuildConfig.FIREBASE_CLOUD_MODEL,
        )
    }
}

class SyntheticReportEngine : HybridReportEngine {
    override suspend fun generate(input: VehicleInput, redactedNotes: String): EngineResult {
        val report = when (input.language) {
            "ar" -> arabicReport()
            "sv" -> swedishReport()
            else -> englishReport()
        }
        return EngineResult(report, "SYNTHETIC_DEMO", "labelled synthetic report")
    }

    private fun englishReport() = InspectionReportPayload(
        "1.0", "en",
        "The note describes a braking-related vibration that should be inspected soon; the symptom does not confirm a cause.",
        "soon", 0.72,
        listOf(ObservationPayload("Braking / steering", "Steering wheel vibration during higher-speed braking", "medium")),
        listOf(InspectionStepPayload("Brake and steering inspection", "A technician should inspect wear, runout, looseness, and heat damage.", "professional_only")),
        listOf(SuggestedServicePayload("Brake and front-end inspection", "The symptom appears under braking and is felt through the steering wheel.", "priority")),
        listOf("Avoid hard or high-speed driving until the braking behavior has been assessed."),
        listOf("Does the brake pedal also pulse?"),
    )

    private fun swedishReport() = InspectionReportPayload(
        "1.0", "sv",
        "Batterilampan och svagare belysning kan betyda att elsystemet inte laddar normalt. Orsaken är inte bekräftad.",
        "urgent", 0.78,
        listOf(ObservationPayload("Laddningssystem", "Batterilampan tändes under körning", "high")),
        listOf(InspectionStepPayload("Kontrollera laddningssystemet", "En verkstad bör mäta spänning och kontrollera generator, rem och anslutningar.", "professional_only")),
        listOf(SuggestedServicePayload("Diagnos av laddningssystem", "Varningslampan kräver kontroll innan fortsatt normal körning.", "immediate")),
        listOf("Stäng av onödiga elförbrukare och kör bara till en säker plats."),
        listOf("Hörs missljud från remområdet?"),
    )

    private fun arabicReport() = InspectionReportPayload(
        "1.0", "ar",
        "تشير الملاحظة إلى ارتفاع حرارة المحرك مع بخار. السبب غير مؤكد، لكن متابعة القيادة قد تكون خطرة.",
        "stop_driving", 0.88,
        listOf(ObservationPayload("نظام التبريد", "ارتفاع حرارة المحرك وظهور بخار", "critical")),
        listOf(InspectionStepPayload("اترك المحرك يبرد تماماً", "فتح نظام التبريد وهو ساخن قد يسبب حروقاً خطيرة.", "owner_safe")),
        listOf(SuggestedServicePayload("فحص عاجل لنظام التبريد", "يجب الفحص قبل إعادة القيادة.", "immediate")),
        listOf("لا تفتح غطاء سائل التبريد والمحرك ساخن، ولا تواصل القيادة."),
        listOf("هل ظهر تسرب سائل تحت السيارة؟"),
    )
}
