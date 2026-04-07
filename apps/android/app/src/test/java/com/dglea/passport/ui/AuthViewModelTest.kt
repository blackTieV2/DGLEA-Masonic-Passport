package com.dglea.passport.ui

import com.dglea.passport.data.AuthRepository
import com.dglea.passport.data.InMemorySessionStore
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
class AuthViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }
    @After fun teardown() { Dispatchers.resetMain() }

    @Test
    fun `sign in updates user state`() = runTest {
        val api = object : BackendApi {
            override suspend fun login(request: LoginRequest): LoginResponse =
                LoginResponse("token", UserDto("usr_brother", request.email, "Brother", "ACTIVE"))

            override suspend fun me(): UserDto = UserDto("usr_brother", "brother@example.org", "Brother", "ACTIVE")
            override suspend fun createDraft(memberId: String, request: CreateDraftRequest): PassportRecordDto { throw NotImplementedError() }
            override suspend fun submit(recordId: String): PassportRecordDto { throw NotImplementedError() }
        }

        val vm = AuthViewModel(AuthRepository(api, InMemorySessionStore()))
        vm.signIn("brother@example.org", "pass")
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("usr_brother", vm.state.value.user?.id)
        assertEquals(null, vm.state.value.error)
    }
}
