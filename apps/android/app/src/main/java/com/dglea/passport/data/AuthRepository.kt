package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.LoginRequest
import com.dglea.passport.network.UserDto
import retrofit2.HttpException

class AuthRepository(
    private val api: BackendApi,
    private val sessionStore: SessionStore,
) {
    suspend fun signIn(email: String, password: String): UserDto {
        return try {
            val response = api.login(LoginRequest(email, password))
            sessionStore.accessToken = response.accessToken
            response.user
        } catch (e: Throwable) {
            sessionStore.accessToken = null
            throw e
        }
    }

    suspend fun currentUser(): UserDto {
        return try {
            api.me()
        } catch (e: HttpException) {
            if (e.code() == 401) {
                sessionStore.accessToken = null
            }
            throw e
        }
    }

    fun hasSessionToken(): Boolean = !sessionStore.accessToken.isNullOrBlank()
}
