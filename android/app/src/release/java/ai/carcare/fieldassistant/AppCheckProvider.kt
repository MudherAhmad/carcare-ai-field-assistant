package ai.carcare.fieldassistant

import com.google.firebase.appcheck.AppCheckProviderFactory
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory

internal object AppCheckProvider {
    val factory: AppCheckProviderFactory
        get() = PlayIntegrityAppCheckProviderFactory.getInstance()
}
