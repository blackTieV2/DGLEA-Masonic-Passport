package com.dglea.passport.ui

import com.dglea.passport.data.PassportRepository
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.CreateDraftRequest
import com.dglea.passport.network.LoginRequest
import com.dglea.passport.network.LoginResponse
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.UserDto
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
    fun `create then submit updates record status`() = runTest {
        val api = object : BackendApi {
            var latest = PassportRecordDto(
                id = "pr_1",
                memberProfileId = "mp_1",
                districtId = "dist_1",
                lodgeId = "lodge_1",
                sectionTemplateId = "sec_1",
                templateItemId = "ti_1",
                templateIsDistrictCore = true,
                status = "DRAFT",
            )

            override suspend fun login(request: LoginRequest): LoginResponse { throw NotImplementedError() }
            override suspend fun me(): UserDto { throw NotImplementedError() }
            override suspend fun createDraft(memberId: String, request: CreateDraftRequest): PassportRecordDto = latest
            override suspend fun submit(recordId: String): PassportRecordDto {
                latest = latest.copy(status = "SUBMITTED")
                return latest
            }
        }

        val vm = PassportViewModel(PassportRepository(api))
        vm.createDraft("mp_1", "dist_1", "lodge_1", "sec_1", "ti_1", "note")
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals("DRAFT", vm.state.value.lastRecord?.status)

        vm.submitLastDraft()
        dispatcher.scheduler.advanceUntilIdle()
        assertEquals("SUBMITTED", vm.state.value.lastRecord?.status)
    }
}
