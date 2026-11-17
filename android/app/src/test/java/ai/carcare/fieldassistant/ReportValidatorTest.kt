package ai.carcare.fieldassistant

import ai.carcare.fieldassistant.ai.ReportValidator
import ai.carcare.fieldassistant.data.InspectionReportPayload
import ai.carcare.fieldassistant.data.InspectionStepPayload
import ai.carcare.fieldassistant.data.ObservationPayload
import ai.carcare.fieldassistant.data.SuggestedServicePayload
import org.junit.Assert.assertThrows
import org.junit.Test

class ReportValidatorTest {
    private fun report(urgency: String = "urgent") = InspectionReportPayload(
        "1.0", "en", "A cautious summary", urgency, 0.7,
        listOf(ObservationPayload("Charging", "Warning lamp", "high")),
        listOf(InspectionStepPayload("Inspect", "Confirm with proper equipment", "professional_only")),
        listOf(SuggestedServicePayload("Electrical inspection", "Warning lamp", "priority")),
        emptyList(), emptyList(),
    )

    @Test
    fun acceptsSharedContract() {
        ReportValidator.requireValid(report())
    }

    @Test
    fun rejectsUnsupportedUrgency() {
        assertThrows(IllegalArgumentException::class.java) {
            ReportValidator.requireValid(report("maybe"))
        }
    }
}
