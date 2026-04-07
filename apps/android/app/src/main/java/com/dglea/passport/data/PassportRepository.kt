package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.CreateDraftRequest
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.BrotherPassportSummaryDto

class PassportRepository(private val api: BackendApi) {
    suspend fun createDraft(
        memberProfileId: String,
        districtId: String,
        lodgeId: String,
        sectionTemplateId: String,
        templateItemId: String,
        note: String?,
    ): PassportRecordDto = api.createDraft(
        memberProfileId,
        CreateDraftRequest(
            districtId = districtId,
            lodgeId = lodgeId,
            sectionTemplateId = sectionTemplateId,
            templateItemId = templateItemId,
            note = note,
        ),
    )

    suspend fun submit(recordId: String): PassportRecordDto = api.submit(recordId)

    suspend fun summary(memberProfileId: String): BrotherPassportSummaryDto = api.passportSummary(memberProfileId)
}
