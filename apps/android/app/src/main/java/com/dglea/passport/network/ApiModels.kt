package com.dglea.passport.network

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(
    val accessToken: String,
    val user: UserDto,
    val roles: List<String> = emptyList(),
)
data class UserDto(
    val id: String,
    val email: String,
    val displayName: String,
    val status: String,
    val roles: List<String> = emptyList(),
)

data class CreateDraftRequest(
    val districtId: String,
    val lodgeId: String,
    val sectionTemplateId: String,
    val templateItemId: String,
    val note: String? = null,
    val eventDate: String? = null,
)

data class ActionReasonRequest(val reason: String)
data class UpdateRecordRequest(val note: String? = null, val eventDate: String? = null)

data class PassportRecordDto(
    val id: String,
    val memberProfileId: String,
    val districtId: String,
    val lodgeId: String,
    val sectionTemplateId: String,
    val templateItemId: String,
    val templateIsDistrictCore: Boolean,
    val templateLodgeId: String? = null,
    val note: String? = null,
    val status: String,
    val submittedAt: String? = null,
)

data class BrotherPassportSummaryDto(
    val memberProfileId: String,
    val sections: List<SectionSummaryDto>,
)

data class SectionSummaryDto(
    val sectionCode: String,
    val sectionName: String,
    val progressState: String,
    val latestStatus: String? = null,
    val lastActivityAt: String? = null,
    val pendingAction: String? = null,
    val latestReviewReason: String? = null,
)

data class VerificationQueueResponse(
    val items: List<VerificationQueueItemDto>,
    val page: Int,
    val pageSize: Int,
    val totalItems: Int,
    val totalPages: Int,
)

data class VerificationQueueItemDto(
    val id: String,
    val passportRecordId: String,
    val memberProfileId: String,
    val lodgeId: String,
    val currentStatus: String,
    val submittedAt: String? = null,
    val isStale: Boolean = false,
)
