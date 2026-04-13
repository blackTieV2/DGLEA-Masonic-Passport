package com.dglea.passport.data

import com.dglea.passport.network.ActionReasonRequest
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.VerificationQueueItemDto

class MentorRepository(private val api: BackendApi) {
    suspend fun pendingQueue(): List<VerificationQueueItemDto> = api.verificationQueue().items

    suspend fun verify(recordId: String): PassportRecordDto = api.verify(recordId)

    suspend fun reject(recordId: String, reason: String): PassportRecordDto =
        api.reject(recordId, ActionReasonRequest(reason))

    suspend fun requestClarification(recordId: String, reason: String): PassportRecordDto =
        api.requestClarification(recordId, ActionReasonRequest(reason))
}
