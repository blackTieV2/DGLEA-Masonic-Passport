package com.dglea.passport.ui

import com.dglea.passport.data.AuthRepository
import com.dglea.passport.data.InMemorySessionStore
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.BrotherPassportProfileDto
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.LodgeDto
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.MilestoneTemplateDto
import com.dglea.passport.network.NotificationDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.PassportTemplateDto
import com.dglea.passport.network.PassportSectionDto
import com.dglea.passport.network.ReviewActionResultDto
import com.dglea.passport.network.ReviewActionRequest
import com.dglea.passport.network.ReviewDto
import com.dglea.passport.network.RoleAssignmentDto
import com.dglea.passport.network.SectionSignoffDto
import com.dglea.passport.network.UpdateDraftRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }
    @After fun teardown() { Dispatchers.resetMain() }

    @Test
    fun `connect loads current user`() = runTest {
        val api = object : BackendApi {
            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_brother",
                    email = "brother@example.org",
                    displayName = "Brother",
                    roles = listOf(RoleAssignmentDto("BROTHER", "GLOBAL")),
                    brotherProfileId = "bp_1",
                    lodgeId = "lodge_1",
                    currentStage = "ENTERED_APPRENTICE",
                )

            override suspend fun myPassport(): BrotherPassportDto =
                BrotherPassportDto(
                    profile = BrotherPassportProfileDto(
                        id = "bp_1",
                        currentStage = "ENTERED_APPRENTICE",
                        lodge = LodgeDto("lodge_1", "dist_1", "Lodge One", "L-001"),
                    ),
                    template = PassportTemplateDto("tpl_1", "1.0.0"),
                    progress = emptyList(),
                    signoffs = emptyList(),
                )

            override suspend fun updateDraft(progressId: String, request: UpdateDraftRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun submit(progressId: String): PassportProgressDto { throw NotImplementedError() }
            override suspend fun clarificationResponse(progressId: String, request: com.dglea.passport.network.ClarificationResponseRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun reviewQueue(brotherProfileId: String?): List<PassportProgressDto> = emptyList()
            override suspend fun review(progressId: String, request: ReviewActionRequest): ReviewActionResultDto { throw NotImplementedError() }
            override suspend fun notifications(): List<NotificationDto> = emptyList()
            override suspend fun markNotificationRead(id: String) = Unit
        }

        val sessionStore = InMemorySessionStore()
        val vm = AuthViewModel(AuthRepository(api, sessionStore))

        vm.connect("dev-brother-ea", null)
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("usr_brother", vm.state.value.user?.id)
        assertEquals("dev-brother-ea", sessionStore.devFirebaseUid)
        assertEquals(null, vm.state.value.error)
    }

    @Test
    fun `sign out clears session`() = runTest {
        val api = object : BackendApi {
            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_brother",
                    email = "brother@example.org",
                    displayName = "Brother",
                )

            override suspend fun myPassport(): BrotherPassportDto =
                BrotherPassportDto(
                    profile = BrotherPassportProfileDto(
                        id = "bp_1",
                        currentStage = "ENTERED_APPRENTICE",
                        lodge = LodgeDto("lodge_1", "dist_1", "Lodge One", "L-001"),
                    ),
                    template = PassportTemplateDto("tpl_1", "1.0.0"),
                    progress = emptyList(),
                    signoffs = emptyList(),
                )

            override suspend fun updateDraft(progressId: String, request: UpdateDraftRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun submit(progressId: String): PassportProgressDto { throw NotImplementedError() }
            override suspend fun clarificationResponse(progressId: String, request: com.dglea.passport.network.ClarificationResponseRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun reviewQueue(brotherProfileId: String?): List<PassportProgressDto> = emptyList()
            override suspend fun review(progressId: String, request: ReviewActionRequest): ReviewActionResultDto { throw NotImplementedError() }
            override suspend fun notifications(): List<NotificationDto> = emptyList()
            override suspend fun markNotificationRead(id: String) = Unit
        }

        val sessionStore = InMemorySessionStore()
        val vm = AuthViewModel(AuthRepository(api, sessionStore))

        vm.connect("dev-brother-ea", null)
        dispatcher.scheduler.advanceUntilIdle()
        vm.signOut()

        assertEquals(null, vm.state.value.user)
        assertEquals(false, sessionStore.hasSession())
    }
}
