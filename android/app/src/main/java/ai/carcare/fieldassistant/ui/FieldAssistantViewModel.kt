package ai.carcare.fieldassistant.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.carcare.fieldassistant.BuildConfig
import ai.carcare.fieldassistant.ai.FirebaseHybridReportEngine
import ai.carcare.fieldassistant.ai.HybridReportEngine
import ai.carcare.fieldassistant.ai.RedactionResult
import ai.carcare.fieldassistant.ai.Redactor
import ai.carcare.fieldassistant.ai.SyntheticReportEngine
import ai.carcare.fieldassistant.data.EngineResult
import ai.carcare.fieldassistant.data.EvidenceReview
import ai.carcare.fieldassistant.data.VehicleInput
import kotlinx.coroutines.launch

data class FieldUiState(
    val language: String = "en",
    val vehicle: String = "",
    val mileage: String = "",
    val notes: String = "",
    val reviewEvidence: Boolean = false,
    val technicianNote: String = "",
    val loading: Boolean = false,
    val result: EngineResult? = null,
    val error: String? = null,
)

class FieldAssistantViewModel : ViewModel() {
    var state by mutableStateOf(FieldUiState())
        private set

    val isAvailable: Boolean get() = BuildConfig.FIREBASE_CONFIGURED || BuildConfig.SYNTHETIC_DEMO
    val isSyntheticDemo: Boolean get() = BuildConfig.SYNTHETIC_DEMO
    val redaction: RedactionResult get() = Redactor.redact(state.notes)
    val technicianRedaction: RedactionResult get() = Redactor.redact(state.technicianNote)

    private val engine: HybridReportEngine by lazy {
        if (BuildConfig.SYNTHETIC_DEMO) SyntheticReportEngine() else FirebaseHybridReportEngine()
    }

    fun setLanguage(value: String) { state = state.copy(language = value, result = null, error = null) }
    fun setVehicle(value: String) { state = state.copy(vehicle = value.take(160), result = null) }
    fun setMileage(value: String) { state = state.copy(mileage = value.filter(Char::isDigit).take(7), result = null) }
    fun setNotes(value: String) { state = state.copy(notes = value.take(3000), result = null) }
    fun setReviewEvidence(value: Boolean) {
        state = state.copy(reviewEvidence = value, technicianNote = "", result = null, error = null)
    }
    fun setTechnicianNote(value: String) {
        val result = state.result?.takeIf { it.evidenceReview?.technicianNote.isNullOrEmpty() }
        state = state.copy(technicianNote = value.take(1000), result = result)
    }

    fun loadSample(review: Boolean = false) {
        val sample = when (state.language) {
            "sv" -> state.copy(vehicle = "2016 dieselkombi", mileage = "142000", notes = "Batterilampan tändes under körning och strålkastarna blev svagare. Motorn går fortfarande.", result = null)
            "ar" -> state.copy(vehicle = "سيارة بنزين موديل 2020", mileage = "67000", notes = "ارتفعت حرارة المحرك وظهر بخار خفيف من مقدمة السيارة. أوقفت السيارة ولم أفتح غطاء سائل التبريد.", result = null)
            else -> state.copy(vehicle = "2018 compact petrol car", mileage = "84000", notes = "The steering wheel shakes while braking from motorway speed. No warning lights. It started this week.", result = null)
        }
        val seatNote = when (state.language) {
            "ar" -> "لاحظ الزبون أثراً على قماش مقعد الراكب وطلب تبديل المقعد. سبب الأثر غير معروف."
            "sv" -> "Kunden såg ett märke på passagerarsätets tyg och bad att få sätet utbytt. Orsaken är okänd."
            else -> "The customer noticed a mark on the fabric passenger seat and asked to replace the seat. The cause is unknown."
        }
        state = sample.copy(notes = if (review) seatNote else sample.notes, reviewEvidence = review, technicianNote = "", error = null)
    }

    fun generate() {
        if (state.loading || state.notes.trim().length < 12 || !isAvailable) return
        val snapshot = state
        val intake = Redactor.redact(snapshot.notes).text
        val review = if (snapshot.reviewEvidence) EvidenceReview(intake, technicianRedaction.text.trim().take(1000)) else null
        state = state.copy(loading = true, result = null, error = null)
        viewModelScope.launch {
            runCatching {
                engine.generate(
                    VehicleInput(
                        language = snapshot.language,
                        vehicle = snapshot.vehicle.trim(),
                        mileageKm = snapshot.mileage.toIntOrNull(),
                        notes = snapshot.notes,
                        redactedTechnicianNote = review?.technicianNote,
                    ),
                    intake,
                )
            }.onSuccess { result ->
                state = state.copy(loading = false, result = result.copy(evidenceReview = review))
            }.onFailure { cause ->
                state = state.copy(loading = false, error = cause.message ?: "Could not create the report.")
            }
        }
    }
}
