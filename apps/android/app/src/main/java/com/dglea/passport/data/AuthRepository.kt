package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.MeProfileDto

class AuthRepository(
    private val api: BackendApi,
    private val sessionStore: SessionStore,
) {
    fun connect(devFirebaseUid: String?, bearerToken: String?) {
        sessionStore.devFirebaseUid = devFirebaseUid?.trim()?.takeIf { it.isNotBlank() }
        sessionStore.bearerToken = bearerToken?.trim()?.takeIf { it.isNotBlank() }
    }

    suspend fun currentUser(): MeProfileDto = api.me()

    suspend fun myPassport(): BrotherPassportDto = api.myPassport()

    fun hasSession(): Boolean = sessionStore.hasSession()

    fun signOut() {
        sessionStore.clear()
    }
}
