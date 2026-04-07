package com.dglea.passport.data

import android.content.Context
import com.dglea.passport.network.AuthInterceptor
import com.dglea.passport.network.BackendApi
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

class AppContainer(context: Context, baseUrl: String) {
    private val sessionStore: SessionStore = SharedPrefsSessionStore(
        context.getSharedPreferences("dglea_session", Context.MODE_PRIVATE),
    )

    private val api: BackendApi by lazy {
        val logger = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }
        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor { sessionStore.accessToken })
            .addInterceptor(logger)
            .build()

        Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
            .create(BackendApi::class.java)
    }

    val authRepository: AuthRepository by lazy { AuthRepository(api, sessionStore) }
    val passportRepository: PassportRepository by lazy { PassportRepository(api) }
}
