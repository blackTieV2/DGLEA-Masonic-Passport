package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.LoginRequest
import com.dglea.passport.network.UserDto

class AuthRepository(
    private val api: BackendApi,
    private val sessionStore: SessionStore,
) {
    suspend fun signIn(email: String, password: String): UserDto {
        val response = api.login(LoginRequest(email, password))
        sessionStore.accessToken = response.accessToken
        return response.user
    }

    suspend fun currentUser(): UserDto = api.me()
}
