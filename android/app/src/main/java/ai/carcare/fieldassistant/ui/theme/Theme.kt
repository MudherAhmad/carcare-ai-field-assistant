package ai.carcare.fieldassistant.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val FieldColors = lightColorScheme(
    primary = Color(0xFF102B27),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD9FF80),
    onPrimaryContainer = Color(0xFF102B27),
    secondary = Color(0xFF3F7468),
    tertiary = Color(0xFFFF8C68),
    background = Color(0xFFF4F0E7),
    surface = Color(0xFFFFFDF8),
    onSurface = Color(0xFF17322D),
    outline = Color(0xFF9AA8A2),
    error = Color(0xFFB44735),
)

@Composable
fun FieldAssistantTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = FieldColors, content = content)
}
