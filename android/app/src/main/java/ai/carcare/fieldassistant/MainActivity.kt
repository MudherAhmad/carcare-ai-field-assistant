package ai.carcare.fieldassistant

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.viewmodel.compose.viewModel
import ai.carcare.fieldassistant.ui.FieldAssistantScreen
import ai.carcare.fieldassistant.ui.FieldAssistantViewModel
import ai.carcare.fieldassistant.ui.theme.FieldAssistantTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FieldAssistantTheme {
                val model: FieldAssistantViewModel = viewModel()
                FieldAssistantScreen(model)
            }
        }
    }
}
