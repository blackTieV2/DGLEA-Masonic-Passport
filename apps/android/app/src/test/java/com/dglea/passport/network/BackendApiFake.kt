package com.dglea.passport.network

import okhttp3.ResponseBody
import retrofit2.Response

open class BackendApiFake : BackendApi {
    override suspend fun me(): MeProfileDto = throw NotImplementedError()
    override suspend fun myPassport(): BrotherPassportDto = throw NotImplementedError()
    override suspend fun updateDraft(progressId: String, request: UpdateDraftRequest): PassportProgressDto = throw NotImplementedError()
    override suspend fun submit(progressId: String): PassportProgressDto = throw NotImplementedError()
    override suspend fun clarificationResponse(progressId: String, request: ClarificationResponseRequest): PassportProgressDto = throw NotImplementedError()
    override suspend fun reviewQueue(brotherProfileId: String?): List<PassportProgressDto> = throw NotImplementedError()
    override suspend fun review(progressId: String, request: ReviewActionRequest): ReviewActionResultDto = throw NotImplementedError()
    override suspend fun notifications(): List<NotificationDto> = throw NotImplementedError()
    override suspend fun markNotificationRead(id: String) = throw NotImplementedError()
    override suspend fun listBrotherProfiles(): List<BrotherProfileDto> = throw NotImplementedError()
    override suspend fun createBrotherProfile(request: CreateBrotherProfileRequest): BrotherProfileDto = throw NotImplementedError()
    override suspend fun getBrotherProfile(id: String): BrotherProfileDto = throw NotImplementedError()
    override suspend fun updateBrotherProfile(id: String, request: UpdateBrotherProfileRequest): BrotherProfileDto = throw NotImplementedError()
    override suspend fun deleteBrotherProfile(id: String) = throw NotImplementedError()
    override suspend fun listLodgeProfiles(): List<LodgeProfileDto> = throw NotImplementedError()
    override suspend fun createLodgeProfile(request: CreateLodgeProfileRequest): LodgeProfileDto = throw NotImplementedError()
    override suspend fun getLodgeProfile(id: String): LodgeProfileDto = throw NotImplementedError()
    override suspend fun updateLodgeProfile(id: String, request: UpdateLodgeProfileRequest): LodgeProfileDto = throw NotImplementedError()
    override suspend fun deleteLodgeProfile(id: String) = throw NotImplementedError()
    override suspend fun listDegreeProgress(): List<DegreeProgressDto> = throw NotImplementedError()
    override suspend fun createDegreeProgress(request: CreateDegreeProgressRequest): DegreeProgressDto = throw NotImplementedError()
    override suspend fun getDegreeProgress(id: String): DegreeProgressDto = throw NotImplementedError()
    override suspend fun updateDegreeProgress(id: String, request: UpdateDegreeProgressRequest): DegreeProgressDto = throw NotImplementedError()
    override suspend fun deleteDegreeProgress(id: String) = throw NotImplementedError()
    override suspend fun readyForSignOffDegreeProgress(id: String, request: ReadyForSignOffDegreeProgressRequest): DegreeProgressDto = throw NotImplementedError()
    override suspend fun approveDegreeProgress(id: String, request: ApproveDegreeProgressRequest): DegreeProgressDto = throw NotImplementedError()
    override suspend fun reopenDegreeProgress(id: String, request: ReopenDegreeProgressRequest): DegreeProgressDto = throw NotImplementedError()
    override suspend fun listReferencePages(): List<ReferencePageDto> = throw NotImplementedError()
    override suspend fun getReferencePage(slug: String): ReferencePageDetailDto = throw NotImplementedError()
    override suspend fun downloadPassportPdf(brotherProfileId: String): Response<ResponseBody> = throw NotImplementedError()
}
