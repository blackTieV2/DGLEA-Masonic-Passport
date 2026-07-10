package com.dglea.passport.ui

import com.dglea.passport.data.MentorRepository
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.BrotherPassportProfileDto
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.ClarificationResponseRequest
import com.dglea.passport.network.LodgeDto
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.MilestoneTemplateDto
import com.dglea.passport.network.NotificationDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.PassportTemplateDto
import com.dglea.passport.network.PassportSectionDto
import com.dglea.passport.network.ReviewActionRequest
import com.dglea.passport.network.ReviewActionResultDto
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
class MentorViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }
    @After fun teardown() { Dispatchers.resetMain() }

    @Test
    fun `queue and verification actions update state`() = runTest {
        val api = object : BackendApi {
            private val queue = listOf(
                PassportProgressDto(
                    id = "pr_1",
                    brotherProfileId = "bp_1",
                    milestoneTemplateId = "mt_1",
                    status = "SUBMITTED",
                    milestoneTemplate = MilestoneTemplateDto(
                        id = "mt_1",
                        title = "Review learning topics",
                        category = "learning",
                        sortOrder = 1,
                    ),
                    brotherProfile = BrotherProfileDto(
                        id = "bp_1",
                        userId = "usr_1",
                        lodgeId = "lodge_1",
                        currentStage = "ENTERED_APPRENTICE",
                        lodge = LodgeDto("lodge_1", "dist_1", "Lodge One", "L-001"),
                    ),
                ),
            )

            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_mentor",
                    email = "mentor@example.org",
                    displayName = "Mentor",
                    roles = listOf(RoleAssignmentDto("LODGE_MENTOR", "LODGE", "lodge_1")),
                )

            override suspend fun myPassport(): BrotherPassportDto =
                BrotherPassportDto(
                    profile = BrotherPassportProfileDto(
                        id = "bp_1",
                        currentStage = "ENTERED_APPRENTICE",
                        lodge = LodgeDto("lodge_1", "dist_1", "Lodge One", "L-001"),
                    ),
                    template = PassportTemplateDto("tpl_1", "1.0.0"),
                    progress = queue,
                    signoffs = emptyList(),
                )

            override suspend fun updateDraft(progressId: String, request: UpdateDraftRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun submit(progressId: String): PassportProgressDto { throw NotImplementedError() }
            override suspend fun clarificationResponse(progressId: String, request: ClarificationResponseRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun reviewQueue(brotherProfileId: String?): List<PassportProgressDto> = queue
            override suspend fun review(progressId: String, request: ReviewActionRequest): ReviewActionResultDto =
                ReviewActionResultDto(
                    review = ReviewDto(
                        id = "rv_1",
                        progressId = progressId,
                        reviewerUserId = "usr_mentor",
                        decision = request.decision,
                        reason = request.reason,
                        createdAt = "2026-01-01T00:00:00Z",
                    ),
                    progress = queue.first().copy(status = request.decision),
                )
            override suspend fun notifications(): List<NotificationDto> = emptyList()
            override suspend fun markNotificationRead(id: String) = Unit
        }

        val vm = MentorViewModel(MentorRepository(api))

        vm.refreshQueue()
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals(1, vm.state.value.queue.size)

        vm.verify("pr_1")
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals("VERIFY", vm.state.value.lastDecision?.review?.decision)
    }

    @Test
    fun `stale selection is rejected locally`() = runTest {
        val api = object : BackendApi {
            override suspend fun me(): MeProfileDto = MeProfileDto("usr_mentor", "mentor@example.org", "Mentor")
            override suspend fun myPassport(): BrotherPassportDto = BrotherPassportDto(
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
            override suspend fun clarificationResponse(progressId: String, request: ClarificationResponseRequest): PassportProgressDto { throw NotImplementedError() }
            override suspend fun reviewQueue(brotherProfileId: String?): List<PassportProgressDto> = emptyList()
            override suspend fun review(progressId: String, request: ReviewActionRequest): ReviewActionResultDto { throw NotImplementedError() }
            override suspend fun notifications(): List<NotificationDto> = emptyList()
            override suspend fun markNotificationRead(id: String) = Unit
        }

        val vm = MentorViewModel(MentorRepository(api))
        vm.verify("pr_missing")
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("Selected record is no longer pending. Refresh queue and try again.", vm.state.value.error)
    }
}
