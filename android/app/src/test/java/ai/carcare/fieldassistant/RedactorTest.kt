package ai.carcare.fieldassistant

import ai.carcare.fieldassistant.ai.Redactor
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class RedactorTest {
    @Test
    fun redactsCommonIdentifiersLocally() {
        val result = Redactor.redact("Call +46 70 123 45 67 about ABC123 or email tech@example.com")
        assertFalse(result.text.contains("tech@example.com"))
        assertFalse(result.text.contains("+46 70 123 45 67"))
        assertFalse(result.text.contains("ABC123"))
        assertTrue(result.count >= 3)
    }

    @Test
    fun preservesMultilingualSymptoms() {
        val text = "Batterilampan lyser. ارتفعت حرارة المحرك."
        assertEquals(text, Redactor.redact(text).text)
    }
}
