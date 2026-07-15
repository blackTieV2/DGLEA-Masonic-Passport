package com.dglea.passport.ui

import com.dglea.passport.data.PassportRepository
import com.dglea.passport.network.BackendApiFake
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.BrotherPassportProfileDto
import com.dglea.passport.network.ClarificationResponseRequest
import com.dglea.passport.network.LodgeDto
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.MilestoneTemplateDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.PassportSectionDto
import com.dglea.passport.network.PassportTemplateDto
import com.dglea.passport.network.RoleAssignmentDto
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
class PassportViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }
    @After fun teardown() { Dispatchers.resetMain() }

    @Test
    fun `refresh and submit update passport state`() = runTest {
        val progress = PassportProgressDto(
            id = "pr_1",
            brotherProfileId = "bp_1",
            milestoneTemplateId = "mt_1",
            status = "DRAFT",
            draftNote = "Initial note",
            milestoneTemplate = MilestoneTemplateDto(
                id = "mt_1",
                title = "Review learning topics",
                category = "learning",
                sortOrder = 1,
            ),
        )

        val api = object : BackendApiFake() {
            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_brother",
                    email = "brother@example.org",
                    displayName = "Brother",
                    roles = listOf(RoleAssignmentDto("BROTHER", "GLOBAL")),
                )

            override suspend fun myPassport(): BrotherPassportDto =
                BrotherPassportDto(
                    profile = BrotherPassportProfileDto(
                        id = "bp_1",
                        currentStage = "ENTERED_APPRENTICE",
                        lodge = LodgeDto("lodge_1", "dist_1", "Lodge One", "L-001"),
                    ),
                    template = PassportTemplateDto(
                        id = "tpl_1",
                        version = "1.0.0",
                        sections = listOf(
                            PassportSectionDto(
                                id = "sec_1",
                                code = "ENTERED_APPRENTICE",
                                title = "Entered Apprentice",
                                sortOrder = 1,
                                unlockStage = "ENTERED_APPRENTICE",
                                milestoneTemplates = listOf(progress.milestoneTemplate!!),
                            ),
                        ),
                    ),
                    progress = listOf(progress),
                    signoffs = emptyList(),
                )

            override suspend fun updateDraft(progressId: String, request: UpdateDraftRequest): PassportProgressDto =
                progress.copy(draftNote = request.draftNote)

            override suspend fun submit(progressId: String): PassportProgressDto =
                progress.copy(status = "SUBMITTED")

            override suspend fun clarificationResponse(progressId: String, request: ClarificationResponseRequest): PassportProgressDto =
                progress.copy(status = "DRAFT", draftNote = request.response)
        }

        val vm = PassportViewModel(PassportRepository(api))

        vm.refreshPassport()
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals(1, vm.state.value.passport?.progress?.size)

        vm.submit("pr_1")
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals("SUBMITTED", vm.state.value.lastMutatedProgress?.status)
    }
}
