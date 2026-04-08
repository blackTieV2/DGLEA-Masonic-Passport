package com.dglea.passport.data

import android.content.Context
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.NetworkClientFactory

class AppContainer(context: Context, baseUrl: String) {
    private val sessionStore: SessionStore = SharedPrefsSessionStore(
        context.getSharedPreferences("dglea_session", Context.MODE_PRIVATE),
    )

    private val api: BackendApi by lazy {
        NetworkClientFactory.createBackendApi(baseUrl) { sessionStore.accessToken }
    }

    val authRepository: AuthRepository by lazy { AuthRepository(api, sessionStore) }
    val passportRepository: PassportRepository by lazy { PassportRepository(api) }
}
