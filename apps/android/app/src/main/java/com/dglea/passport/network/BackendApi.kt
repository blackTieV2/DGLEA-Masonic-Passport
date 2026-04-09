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

    @GET("members/{memberId}/passport-summary")
    suspend fun passportSummary(@Path("memberId") memberId: String): BrotherPassportSummaryDto

    @GET("verification-queue")
    suspend fun verificationQueue(): VerificationQueueResponse

    @POST("passport-records/{recordId}/verify")
    suspend fun verify(@Path("recordId") recordId: String): PassportRecordDto

    @POST("passport-records/{recordId}/reject")
    suspend fun reject(
        @Path("recordId") recordId: String,
        @Body request: ActionReasonRequest,
    ): PassportRecordDto

    @POST("passport-records/{recordId}/clarification")
    suspend fun requestClarification(
        @Path("recordId") recordId: String,
        @Body request: ActionReasonRequest,
    ): PassportRecordDto
}
