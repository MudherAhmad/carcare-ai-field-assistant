package ai.carcare.fieldassistant

import com.google.firebase.appcheck.AppCheckProviderFactory
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory

internal object AppCheckProvider {
    val factory: AppCheckProviderFactory
        get() = DebugAppCheckProviderFactory.getInstance()
}
