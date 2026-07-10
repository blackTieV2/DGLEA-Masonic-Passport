package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.UpdateDraftRequest

class PassportRepository(private val api: BackendApi) {
    suspend fun loadMyPassport(): BrotherPassportDto = api.myPassport()

    suspend fun updateDraft(progressId: String, note: String?): PassportProgressDto =
        api.updateDraft(progressId, UpdateDraftRequest(draftNote = note))

    suspend fun submit(progressId: String): PassportProgressDto = api.submit(progressId)

    suspend fun respondToClarification(progressId: String, response: String): PassportProgressDto =
        api.clarificationResponse(progressId, com.dglea.passport.network.ClarificationResponseRequest(response))
}
