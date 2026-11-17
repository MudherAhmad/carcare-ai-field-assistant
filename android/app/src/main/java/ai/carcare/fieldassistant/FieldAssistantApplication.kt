package ai.carcare.fieldassistant

import android.app.Application
import com.google.firebase.Firebase
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.appCheck

class FieldAssistantApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        if (!BuildConfig.FIREBASE_CONFIGURED) return

        FirebaseApp.initializeApp(this)
        Firebase.appCheck.installAppCheckProviderFactory(AppCheckProvider.factory)
    }
}
