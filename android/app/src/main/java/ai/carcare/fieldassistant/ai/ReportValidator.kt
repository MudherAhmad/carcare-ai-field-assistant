package ai.carcare.fieldassistant.ai

import ai.carcare.fieldassistant.data.InspectionReportPayload

object ReportValidator {
    private val languages = setOf("ar", "sv", "en")
    private val urgencies = setOf("routine", "soon", "urgent", "stop_driving")
    private val severities = setOf("low", "medium", "high", "critical")
    private val safetyLevels = setOf("owner_safe", "professional_only")
    private val priorities = setOf("optional", "recommended", "priority", "immediate")

    fun requireValid(report: InspectionReportPayload): InspectionReportPayload {
        require(report.schemaVersion == "1.0") { "Unsupported report schema." }
        require(report.language in languages) { "Unsupported report language." }
        require(report.summary.isNotBlank() && report.summary.length <= 600) { "Invalid summary." }
        require(report.urgency in urgencies) { "Invalid urgency." }
        require(report.confidence in 0.0..1.0) { "Invalid confidence." }
        require(report.observations.size in 1..8)
        require(report.observations.all { it.system.isNotBlank() && it.symptom.isNotBlank() && it.severity in severities })
        require(report.inspectionSteps.size in 1..8)
        require(report.inspectionSteps.all { it.title.isNotBlank() && it.reason.isNotBlank() && it.safetyLevel in safetyLevels })
        require(report.suggestedServices.size in 1..6)
        require(report.suggestedServices.all { it.name.isNotBlank() && it.reason.isNotBlank() && it.priority in priorities })
        require(report.safetyNotices.size <= 5 && report.followUpQuestions.size <= 5)
        return report
    }
}
