package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.ReviewActionRequest
import com.dglea.passport.network.ReviewActionResultDto

class MentorRepository(private val api: BackendApi) {
    suspend fun reviewQueue(brotherProfileId: String? = null): List<PassportProgressDto> =
        api.reviewQueue(brotherProfileId)

    suspend fun verify(progressId: String): ReviewActionResultDto =
        api.review(progressId, ReviewActionRequest(decision = "VERIFY"))

    suspend fun reject(progressId: String, reason: String): ReviewActionResultDto =
        api.review(progressId, ReviewActionRequest(decision = "REJECT", reason = reason))

    suspend fun requestClarification(progressId: String, reason: String): ReviewActionResultDto =
        api.review(progressId, ReviewActionRequest(decision = "REQUEST_CLARIFICATION", reason = reason))
}
