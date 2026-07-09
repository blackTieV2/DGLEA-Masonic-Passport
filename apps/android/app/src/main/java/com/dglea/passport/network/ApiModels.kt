package com.dglea.passport.network

data class MeProfileDto(
    val id: String,
    val email: String,
    val displayName: String,
    val roles: List<RoleAssignmentDto> = emptyList(),
    val brotherProfileId: String? = null,
    val lodgeId: String? = null,
    val currentStage: String? = null,
)

data class RoleAssignmentDto(
    val role: String,
    val scopeType: String,
    val scopeId: String? = null,
)

data class BrotherPassportDto(
    val profile: BrotherPassportProfileDto,
    val template: PassportTemplateDto,
    val progress: List<PassportProgressDto> = emptyList(),
    val signoffs: List<SectionSignoffDto> = emptyList(),
)

data class BrotherPassportProfileDto(
    val id: String,
    val currentStage: String,
    val lodge: LodgeDto,
)

data class LodgeDto(
    val id: String,
    val districtId: String,
    val lodgeName: String,
    val lodgeNumber: String,
    val meetingLocation: String? = null,
    val active: Boolean = true,
)

data class PassportTemplateDto(
    val id: String,
    val version: String,
    val active: Boolean = true,
    val sections: List<PassportSectionDto> = emptyList(),
)

data class PassportSectionDto(
    val id: String,
    val code: String,
    val title: String,
    val sortOrder: Int,
    val unlockStage: String,
    val milestoneTemplates: List<MilestoneTemplateDto> = emptyList(),
)

data class MilestoneTemplateDto(
    val id: String,
    val title: String,
    val description: String? = null,
    val category: String,
    val sortOrder: Int,
    val requiresReview: Boolean = true,
    val targetCount: Int? = null,
    val sectionId: String? = null,
)

data class PassportProgressDto(
    val id: String,
    val brotherProfileId: String,
    val milestoneTemplateId: String,
    val status: String,
    val version: Int = 0,
    val draftNote: String? = null,
    val submittedAt: String? = null,
    val completedAt: String? = null,
    val milestoneTemplate: MilestoneTemplateDto? = null,
    val brotherProfile: BrotherProfileDto? = null,
    val reviews: List<ReviewDto> = emptyList(),
)

data class BrotherProfileDto(
    val id: String,
    val userId: String,
    val lodgeId: String,
    val currentStage: String,
    val dateInitiated: String? = null,
    val datePassed: String? = null,
    val dateRaised: String? = null,
    val solomonRegisteredOn: String? = null,
    val lodge: LodgeDto? = null,
)

data class ReviewDto(
    val id: String,
    val progressId: String,
    val reviewerUserId: String,
    val decision: String,
    val reason: String? = null,
    val createdAt: String,
    val reviewer: ReviewerDto? = null,
)

data class ReviewerDto(
    val displayName: String,
)

data class SectionSignoffDto(
    val id: String,
    val brotherProfileId: String,
    val sectionCode: String,
    val signedBy: String,
    val signedAt: String,
    val outcome: String,
    val note: String? = null,
)

data class UpdateDraftRequest(val draftNote: String? = null)
data class ClarificationResponseRequest(val response: String)
data class ReviewActionRequest(val decision: String, val reason: String? = null)

data class NotificationDto(
    val id: String,
    val type: String,
    val title: String,
    val body: String,
    val readAt: String? = null,
    val relatedResourceType: String? = null,
    val relatedResourceId: String? = null,
    val createdAt: String,
)
