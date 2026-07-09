package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.CreateBrotherProfileRequest
import com.dglea.passport.network.CreateDegreeProgressRequest
import com.dglea.passport.network.CreateLodgeProfileRequest
import com.dglea.passport.network.DegreeProgressDto
import com.dglea.passport.network.LodgeProfileDto
import com.dglea.passport.network.UpdateBrotherProfileRequest
import com.dglea.passport.network.UpdateDegreeProgressRequest
import com.dglea.passport.network.UpdateLodgeProfileRequest
import com.dglea.passport.network.ReadyForSignOffDegreeProgressRequest
import com.dglea.passport.network.ApproveDegreeProgressRequest
import com.dglea.passport.network.ReopenDegreeProgressRequest

class ProfilesRepository(private val api: BackendApi) {

    // Brother profiles
    suspend fun listBrotherProfiles(): List<BrotherProfileDto> = api.listBrotherProfiles()

    suspend fun createBrotherProfile(request: CreateBrotherProfileRequest): BrotherProfileDto =
        api.createBrotherProfile(request)

    suspend fun getBrotherProfile(id: String): BrotherProfileDto = api.getBrotherProfile(id)

    suspend fun updateBrotherProfile(
        id: String,
        request: UpdateBrotherProfileRequest,
    ): BrotherProfileDto = api.updateBrotherProfile(id, request)

    suspend fun deleteBrotherProfile(id: String) = api.deleteBrotherProfile(id)

    // Lodge profiles
    suspend fun listLodgeProfiles(): List<LodgeProfileDto> = api.listLodgeProfiles()

    suspend fun createLodgeProfile(request: CreateLodgeProfileRequest): LodgeProfileDto =
        api.createLodgeProfile(request)

    suspend fun getLodgeProfile(id: String): LodgeProfileDto = api.getLodgeProfile(id)

    suspend fun updateLodgeProfile(
        id: String,
        request: UpdateLodgeProfileRequest,
    ): LodgeProfileDto = api.updateLodgeProfile(id, request)

    suspend fun deleteLodgeProfile(id: String) = api.deleteLodgeProfile(id)

    // Degree progress
    suspend fun listDegreeProgress(): List<DegreeProgressDto> = api.listDegreeProgress()

    suspend fun createDegreeProgress(request: CreateDegreeProgressRequest): DegreeProgressDto =
        api.createDegreeProgress(request)

    suspend fun getDegreeProgress(id: String): DegreeProgressDto = api.getDegreeProgress(id)

    suspend fun updateDegreeProgress(
        id: String,
        request: UpdateDegreeProgressRequest,
    ): DegreeProgressDto = api.updateDegreeProgress(id, request)

    suspend fun deleteDegreeProgress(id: String) = api.deleteDegreeProgress(id)

    suspend fun markDegreeProgressReadyForSignOff(
        id: String,
        request: ReadyForSignOffDegreeProgressRequest = ReadyForSignOffDegreeProgressRequest(),
    ): DegreeProgressDto = api.readyForSignOffDegreeProgress(id, request)

    suspend fun approveDegreeProgress(
        id: String,
        request: ApproveDegreeProgressRequest = ApproveDegreeProgressRequest(),
    ): DegreeProgressDto = api.approveDegreeProgress(id, request)

    suspend fun reopenDegreeProgress(
        id: String,
        request: ReopenDegreeProgressRequest = ReopenDegreeProgressRequest(),
    ): DegreeProgressDto = api.reopenDegreeProgress(id, request)
}
