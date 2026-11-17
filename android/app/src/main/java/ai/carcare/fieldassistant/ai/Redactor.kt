package ai.carcare.fieldassistant.ai

data class RedactionResult(
    val text: String,
    val count: Int,
)

object Redactor {
    private val patterns = listOf(
        Regex("\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b", RegexOption.IGNORE_CASE) to "[REDACTED_EMAIL]",
        Regex("\\b[A-HJ-NPR-Z0-9]{17}\\b", RegexOption.IGNORE_CASE) to "[REDACTED_VIN]",
        Regex("(?:\\+?\\d[\\d\\s().-]{7,}\\d)") to "[REDACTED_PHONE]",
        Regex("\\b[A-ZÅÄÖ]{3}[ -]?[0-9]{2}[A-Z0-9]\\b", RegexOption.IGNORE_CASE) to "[REDACTED_REGISTRATION]",
    )

    fun redact(input: String): RedactionResult {
        var count = 0
        var text = input.trim().replace("\u0000", "")
        patterns.forEach { (pattern, replacement) ->
            text = pattern.replace(text) {
                count += 1
                replacement
            }
        }
        return RedactionResult(text = text, count = count)
    }
}
