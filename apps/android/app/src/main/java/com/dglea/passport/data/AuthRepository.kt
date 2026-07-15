package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.MeProfileDto

class AuthRepository(
    private val api: BackendApi,
    private val sessionStore: SessionStore,
    private val firebaseAuthManager: FirebaseAuthManager,
) {
    fun connect(devFirebaseUid: String?, bearerToken: String?) {
        sessionStore.devFirebaseUid = devFirebaseUid?.trim()?.takeIf { it.isNotBlank() }
        sessionStore.bearerToken = bearerToken?.trim()?.takeIf { it.isNotBlank() }
    }

    suspend fun signIn(email: String, password: String): Result<Unit> {
        val result = firebaseAuthManager.signIn(email, password)
        if (result.isSuccess) {
            val token = firebaseAuthManager.getIdToken(forceRefresh = false)
                ?: return Result.failure(IllegalStateException("Failed to obtain Firebase ID token"))
            sessionStore.bearerToken = token
            sessionStore.devFirebaseUid = null
        }
        return result.map { }
    }

    suspend fun currentUser(): MeProfileDto = api.me()

    suspend fun myPassport(): BrotherPassportDto = api.myPassport()

    fun hasSession(): Boolean = sessionStore.hasSession() || firebaseAuthManager.getCurrentUser() != null

    suspend fun restoreFirebaseSession(): Boolean {
        if (!firebaseAuthManager.isAvailable) return false
        firebaseAuthManager.getCurrentUser() ?: return false
        val token = firebaseAuthManager.getIdToken(forceRefresh = false) ?: return false
        sessionStore.bearerToken = token
        sessionStore.devFirebaseUid = null
        return true
    }

    fun signOut() {
        sessionStore.clear()
        firebaseAuthManager.signOut()
    }
}
