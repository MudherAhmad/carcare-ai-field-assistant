package ai.carcare.fieldassistant

import ai.carcare.fieldassistant.ai.PromptFactory
import ai.carcare.fieldassistant.data.VehicleInput
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PromptFactoryTest {
    @Test
    fun buildsBoundedSwedishSafetyPrompt() {
        val prompt = PromptFactory.create(
            VehicleInput("sv", "2016 dieselkombi", 142000, "raw note"),
            "Batterilampan lyser",
        )
        assertTrue(prompt.contains("Swedish"))
        assertTrue(prompt.contains("professional_only"))
        assertTrue(prompt.contains("Batterilampan lyser"))
        assertFalse(prompt.contains("raw note"))
    }
}
