package com.dglea.passport.network

import com.dglea.passport.BuildConfig
import com.dglea.passport.data.FirebaseAuthManager
import com.dglea.passport.data.SessionStore
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

object NetworkClientFactory {
    fun createBackendApi(
        baseUrl: String,
        sessionStore: SessionStore,
        firebaseAuthManager: FirebaseAuthManager,
    ): BackendApi {
        val logger = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }
        val client = OkHttpClient.Builder()
            .authenticator(TokenRefreshAuthenticator(sessionStore, firebaseAuthManager))
            .addInterceptor(AuthInterceptor(sessionStore))
            .apply {
                // Dev-auth fallback is enabled only for local debug builds.
                // Staging and release builds must authenticate via real Firebase Bearer tokens.
                if (BuildConfig.ALLOW_DEV_AUTH) {
                    addInterceptor(DevAuthInterceptor(sessionStore))
                }
            }
            .addInterceptor(logger)
            .build()

        val moshi = Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(BackendApi::class.java)
    }
}
