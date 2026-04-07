package com.dglea.passport.network

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val accessToken: String, val user: UserDto)
data class UserDto(val id: String, val email: String, val displayName: String, val status: String)

data class CreateDraftRequest(
    val districtId: String,
    val lodgeId: String,
    val sectionTemplateId: String,
    val templateItemId: String,
    val note: String? = null,
    val eventDate: String? = null,
)

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
