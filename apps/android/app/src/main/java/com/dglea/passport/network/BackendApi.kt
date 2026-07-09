package com.dglea.passport.network

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface BackendApi {
    @GET("me")
    suspend fun me(): MeProfileDto

    @GET("me/passport")
    suspend fun myPassport(): BrotherPassportDto

    @PATCH("progress/{progressId}/draft")
    suspend fun updateDraft(
        @Path("progressId") progressId: String,
        @Body request: UpdateDraftRequest,
    ): PassportProgressDto

    @POST("progress/{progressId}/submit")
    suspend fun submit(@Path("progressId") progressId: String): PassportProgressDto

    @POST("progress/{progressId}/clarification-response")
    suspend fun clarificationResponse(
        @Path("progressId") progressId: String,
        @Body request: ClarificationResponseRequest,
    ): PassportProgressDto

    @GET("mentor/review-queue")
    suspend fun reviewQueue(
        @Query("brotherProfileId") brotherProfileId: String? = null,
    ): List<PassportProgressDto>

    @POST("progress/{progressId}/review")
    suspend fun review(
        @Path("progressId") progressId: String,
        @Body request: ReviewActionRequest,
    ): ReviewActionResultDto

    @GET("notifications")
    suspend fun notifications(): List<NotificationDto>

    @PATCH("notifications/{id}/read")
    suspend fun markNotificationRead(@Path("id") id: String)
}

data class ReviewActionResultDto(
    val review: ReviewDto,
    val progress: PassportProgressDto,
)
