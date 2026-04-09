package com.dglea.passport.ui

import com.dglea.passport.data.MentorRepository
import com.dglea.passport.network.ActionReasonRequest
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherPassportSummaryDto
import com.dglea.passport.network.CreateDraftRequest
import com.dglea.passport.network.LoginRequest
import com.dglea.passport.network.LoginResponse
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.SectionSummaryDto
import com.dglea.passport.network.UserDto
import com.dglea.passport.network.VerificationQueueItemDto
import com.dglea.passport.network.VerificationQueueResponse
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
                VerificationQueueItemDto(
                    id = "vq_pr_1",
                    passportRecordId = "pr_1",
                    memberProfileId = "mp_1",
                    lodgeId = "lodge_1",
                    currentStatus = "SUBMITTED",
                ),
            )

            override suspend fun login(request: LoginRequest): LoginResponse { throw NotImplementedError() }
            override suspend fun me(): UserDto { throw NotImplementedError() }
            override suspend fun createDraft(memberId: String, request: CreateDraftRequest): PassportRecordDto { throw NotImplementedError() }
            override suspend fun submit(recordId: String): PassportRecordDto { throw NotImplementedError() }
            override suspend fun passportSummary(memberId: String): BrotherPassportSummaryDto =
                BrotherPassportSummaryDto(memberId, listOf(SectionSummaryDto("EA", "Entered Apprentice", "IN_PROGRESS")))

            override suspend fun verificationQueue(): VerificationQueueResponse =
                VerificationQueueResponse(queue, 1, queue.size, queue.size, 1)

            override suspend fun verify(recordId: String): PassportRecordDto =
                PassportRecordDto(
                    id = recordId,
                    memberProfileId = "mp_1",
                    districtId = "dist_1",
                    lodgeId = "lodge_1",
                    sectionTemplateId = "sec_1",
                    templateItemId = "ti_1",
                    templateIsDistrictCore = true,
                    status = "VERIFIED",
                )

            override suspend fun reject(recordId: String, request: ActionReasonRequest): PassportRecordDto =
                PassportRecordDto(
                    id = recordId,
                    memberProfileId = "mp_1",
                    districtId = "dist_1",
                    lodgeId = "lodge_1",
                    sectionTemplateId = "sec_1",
                    templateItemId = "ti_1",
                    templateIsDistrictCore = true,
                    status = "REJECTED",
                )

            override suspend fun requestClarification(recordId: String, request: ActionReasonRequest): PassportRecordDto =
                PassportRecordDto(
                    id = recordId,
                    memberProfileId = "mp_1",
                    districtId = "dist_1",
                    lodgeId = "lodge_1",
                    sectionTemplateId = "sec_1",
                    templateItemId = "ti_1",
                    templateIsDistrictCore = true,
                    status = "NEEDS_CLARIFICATION",
                )
        }

        val vm = MentorViewModel(MentorRepository(api))

        vm.refreshQueue()
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals(1, vm.state.value.queue.size)

        vm.verify("pr_1")
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals("VERIFIED", vm.state.value.lastDecision?.status)
        assertEquals(1, vm.state.value.actionNonce)
    }

    @Test
    fun `stale selection is rejected locally`() = runTest {
        val api = object : BackendApi {
            override suspend fun login(request: LoginRequest): LoginResponse { throw NotImplementedError() }
            override suspend fun me(): UserDto { throw NotImplementedError() }
            override suspend fun createDraft(memberId: String, request: CreateDraftRequest): PassportRecordDto { throw NotImplementedError() }
            override suspend fun submit(recordId: String): PassportRecordDto { throw NotImplementedError() }
            override suspend fun passportSummary(memberId: String): BrotherPassportSummaryDto =
                BrotherPassportSummaryDto(memberId, listOf(SectionSummaryDto("EA", "Entered Apprentice", "IN_PROGRESS")))
            override suspend fun verificationQueue(): VerificationQueueResponse =
                VerificationQueueResponse(emptyList(), 1, 0, 0, 1)
            override suspend fun verify(recordId: String): PassportRecordDto { throw NotImplementedError() }
            override suspend fun reject(recordId: String, request: ActionReasonRequest): PassportRecordDto { throw NotImplementedError() }
            override suspend fun requestClarification(recordId: String, request: ActionReasonRequest): PassportRecordDto { throw NotImplementedError() }
        }

        val vm = MentorViewModel(MentorRepository(api))
        vm.verify("pr_missing")
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("Selected record is no longer pending. Refresh queue and try again.", vm.state.value.error)
    }

}
