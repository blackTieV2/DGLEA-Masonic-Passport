package com.dglea.passport.network

import com.dglea.passport.data.FirebaseAuthManager
import com.dglea.passport.data.SessionStore
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class TokenRefreshAuthenticator(
    private val sessionStore: SessionStore,
    private val firebaseAuthManager: FirebaseAuthManager,
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        // Only one retry per request to avoid infinite loops.
        if (response.priorResponse != null) return null
        if (!firebaseAuthManager.isAvailable) return null

        val token = runCatching {
            runBlocking { firebaseAuthManager.getIdToken(forceRefresh = true) }
        }.getOrNull() ?: return null

        sessionStore.bearerToken = token
        return response.request.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()
    }
}
