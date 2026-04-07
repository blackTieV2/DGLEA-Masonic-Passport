package com.dglea.passport.network

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface BackendApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("me")
    suspend fun me(): UserDto

    @POST("members/{memberId}/passport-records")
    suspend fun createDraft(
        @Path("memberId") memberId: String,
        @Body request: CreateDraftRequest,
    ): PassportRecordDto

    @POST("passport-records/{recordId}/submit")
    suspend fun submit(@Path("recordId") recordId: String): PassportRecordDto
}
