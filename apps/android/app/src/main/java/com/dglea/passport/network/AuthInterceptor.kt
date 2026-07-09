package com.dglea.passport.network

import com.dglea.passport.data.SessionStore
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val sessionStore: SessionStore) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = sessionStore.bearerToken
        val request = if (token.isNullOrBlank()) {
            chain.request()
        } else {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        }
        return chain.proceed(request)
    }
}

class DevAuthInterceptor(private val sessionStore: SessionStore) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val devFirebaseUid = sessionStore.devFirebaseUid
        val request = if (devFirebaseUid.isNullOrBlank()) {
            chain.request()
        } else {
            chain.request().newBuilder()
                .addHeader("X-Dev-Auth-Firebase-Uid", devFirebaseUid)
                .build()
        }
        return chain.proceed(request)
    }
}
