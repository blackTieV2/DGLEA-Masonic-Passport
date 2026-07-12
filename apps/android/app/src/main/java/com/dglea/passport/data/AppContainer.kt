package com.dglea.passport.data

import android.content.Context
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.NetworkClientFactory

class AppContainer(context: Context) {
    private val sessionStore: SessionStore = SharedPrefsSessionStore(
        context.getSharedPreferences("dglea_session", Context.MODE_PRIVATE),
    )

    private val api: BackendApi by lazy {
        NetworkClientFactory.createBackendApi(BASE_URL, sessionStore)
    }

    val authRepository: AuthRepository by lazy { AuthRepository(api, sessionStore) }
    val passportRepository: PassportRepository by lazy { PassportRepository(api) }
    val mentorRepository: MentorRepository by lazy { MentorRepository(api) }
    val profilesRepository: ProfilesRepository by lazy { ProfilesRepository(api, context) }
    val referenceContentRepository: ReferenceContentRepository by lazy { ReferenceContentRepository(api) }

    companion object {
        const val BASE_URL = "http://10.0.2.2:3000/api/v1/"
    }
}
