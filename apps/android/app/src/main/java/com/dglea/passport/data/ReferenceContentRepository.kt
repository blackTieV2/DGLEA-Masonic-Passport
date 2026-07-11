package com.dglea.passport.data

import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.ReferencePageDetailDto
import com.dglea.passport.network.ReferencePageDto

class ReferenceContentRepository(private val api: BackendApi) {

    suspend fun listReferencePages(): List<ReferencePageDto> = api.listReferencePages()

    suspend fun getReferencePage(slug: String): ReferencePageDetailDto = api.getReferencePage(slug)
}
