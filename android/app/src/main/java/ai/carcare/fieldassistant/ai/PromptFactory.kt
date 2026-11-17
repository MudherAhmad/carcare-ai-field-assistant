package ai.carcare.fieldassistant.ai

import ai.carcare.fieldassistant.data.VehicleInput

object PromptFactory {
    private val languageNames = mapOf("ar" to "Arabic", "sv" to "Swedish", "en" to "English")

    fun create(input: VehicleInput, redactedNotes: String): String {
        val language = languageNames[input.language] ?: "English"
        val mileage = input.mileageKm?.let { "$it km" } ?: "not provided"
        return """
            You are a cautious vehicle field-inspection assistant.

            Create one structured inspection brief in $language.

            Hard rules:
            - This is not a confirmed diagnosis and you did not inspect the vehicle.
            - Separate observed symptoms from possible checks; do not state causes as facts.
            - Never invent OBD codes, measurements, sensor values, prices, parts availability, or completed work.
            - Treat brake, steering, fire, fuel leak, overheating, smoke, and severe warning-light symptoms conservatively.
            - Mark hazardous, under-vehicle, high-voltage, hot-engine, fuel-system, or moving-part checks professional_only.
            - If immediate driving may be unsafe, use stop_driving and add a short safety notice.
            - Keep every text field concise and fully in $language.
            - schemaVersion must be 1.0 and language must be ${input.language}.

            Vehicle: ${input.vehicle.ifBlank { "not provided" }}
            Mileage: $mileage
            Driver or technician note after local redaction:
            ${redactedNotes.take(3000)}
        """.trimIndent()
    }
}
