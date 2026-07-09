package com.dglea.passport.network

import retrofit2.http.Body
import retrofit2.http.DELETE
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

    // Brother profiles
    @GET("brother-profiles")
    suspend fun listBrotherProfiles(): List<BrotherProfileDto>

    @POST("brother-profiles")
    suspend fun createBrotherProfile(@Body request: CreateBrotherProfileRequest): BrotherProfileDto

    @GET("brother-profiles/{id}")
    suspend fun getBrotherProfile(@Path("id") id: String): BrotherProfileDto

    @PATCH("brother-profiles/{id}")
    suspend fun updateBrotherProfile(
        @Path("id") id: String,
        @Body request: UpdateBrotherProfileRequest,
    ): BrotherProfileDto

    @DELETE("brother-profiles/{id}")
    suspend fun deleteBrotherProfile(@Path("id") id: String)

    // Lodge profiles
    @GET("lodge-profiles")
    suspend fun listLodgeProfiles(): List<LodgeProfileDto>

    @POST("lodge-profiles")
    suspend fun createLodgeProfile(@Body request: CreateLodgeProfileRequest): LodgeProfileDto

    @GET("lodge-profiles/{id}")
    suspend fun getLodgeProfile(@Path("id") id: String): LodgeProfileDto

    @PATCH("lodge-profiles/{id}")
    suspend fun updateLodgeProfile(
        @Path("id") id: String,
        @Body request: UpdateLodgeProfileRequest,
    ): LodgeProfileDto

    @DELETE("lodge-profiles/{id}")
    suspend fun deleteLodgeProfile(@Path("id") id: String)

    // Degree progress
    @GET("degree-progress")
    suspend fun listDegreeProgress(): List<DegreeProgressDto>

    @POST("degree-progress")
    suspend fun createDegreeProgress(@Body request: CreateDegreeProgressRequest): DegreeProgressDto

    @GET("degree-progress/{id}")
    suspend fun getDegreeProgress(@Path("id") id: String): DegreeProgressDto

    @PATCH("degree-progress/{id}")
    suspend fun updateDegreeProgress(
        @Path("id") id: String,
        @Body request: UpdateDegreeProgressRequest,
    ): DegreeProgressDto

    @DELETE("degree-progress/{id}")
    suspend fun deleteDegreeProgress(@Path("id") id: String)
}

data class ReviewActionResultDto(
    val review: ReviewDto,
    val progress: PassportProgressDto,
)
