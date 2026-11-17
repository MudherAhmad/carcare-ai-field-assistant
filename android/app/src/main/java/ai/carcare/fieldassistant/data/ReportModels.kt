package ai.carcare.fieldassistant.data

import com.google.firebase.ai.annotations.Generable
import com.google.firebase.ai.annotations.Guide
import kotlinx.serialization.Serializable

@Serializable
@Generable(description = "A cautious vehicle inspection observation")
data class ObservationPayload(
    @Guide(description = "Vehicle system, maximum 80 characters")
    val system: String,
    @Guide(description = "Observed symptom only, maximum 240 characters")
    val symptom: String,
    @Guide(description = "One of low, medium, high, critical")
    val severity: String,
) {
    companion object
}

@Serializable
@Generable(description = "A bounded vehicle inspection step")
data class InspectionStepPayload(
    @Guide(description = "Short action title")
    val title: String,
    @Guide(description = "Why this step matters without claiming a diagnosis")
    val reason: String,
    @Guide(description = "One of owner_safe or professional_only")
    val safetyLevel: String,
) {
    companion object
}

@Serializable
@Generable(description = "A suggested professional service, not a completed repair")
data class SuggestedServicePayload(
    val name: String,
    val reason: String,
    @Guide(description = "One of optional, recommended, priority, immediate")
    val priority: String,
) {
    companion object
}

@Serializable
@Generable(description = "A cautious structured vehicle inspection brief")
data class InspectionReportPayload(
    @Guide(description = "Always 1.0")
    val schemaVersion: String,
    @Guide(description = "One of ar, sv, en")
    val language: String,
    @Guide(description = "Concise summary that does not claim a confirmed diagnosis")
    val summary: String,
    @Guide(description = "One of routine, soon, urgent, stop_driving")
    val urgency: String,
    @Guide(description = "Confidence from 0 to 1", minimum = 0.0, maximum = 1.0)
    val confidence: Double,
    @Guide(minItems = 1, maxItems = 8)
    val observations: List<ObservationPayload>,
    @Guide(minItems = 1, maxItems = 8)
    val inspectionSteps: List<InspectionStepPayload>,
    @Guide(minItems = 1, maxItems = 6)
    val suggestedServices: List<SuggestedServicePayload>,
    @Guide(maxItems = 5)
    val safetyNotices: List<String>,
    @Guide(maxItems = 5)
    val followUpQuestions: List<String>,
) {
    companion object
}

data class VehicleInput(
    val language: String,
    val vehicle: String,
    val mileageKm: Int?,
    val notes: String,
)

data class EngineResult(
    val report: InspectionReportPayload,
    val source: String,
    val modelName: String,
)
