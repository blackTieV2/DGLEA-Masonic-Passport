package com.dglea.passport.ui

import com.dglea.passport.data.AuthRepository
import com.dglea.passport.data.FakeFirebaseAuthManager
import com.dglea.passport.data.FirebaseUserInfo
import com.dglea.passport.data.InMemorySessionStore
import com.dglea.passport.network.BackendApiFake
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.BrotherPassportProfileDto
import com.dglea.passport.network.LodgeDto
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.PassportTemplateDto
import com.dglea.passport.network.RoleAssignmentDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {
    private val dispatcher = StandardTestDispatcher()

    @Before fun setup() { Dispatchers.setMain(dispatcher) }
    @After fun teardown() { Dispatchers.resetMain() }

    @Test
    fun `sign in loads current user`() = runTest {
        val api = object : BackendApiFake() {
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
        }

        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager(idToken = "id-token-123")
        val vm = AuthViewModel(AuthRepository(api, sessionStore, firebase))

        vm.signIn("brother@example.org", "password")
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("usr_brother", vm.state.value.user?.id)
        assertEquals("id-token-123", sessionStore.bearerToken)
        assertNull(sessionStore.devFirebaseUid)
        assertNull(vm.state.value.error)
    }

    @Test
    fun `sign in failure shows error`() = runTest {
        val api = BackendApiFake()
        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager(signInResult = Result.failure(RuntimeException("Invalid credentials")))
        val vm = AuthViewModel(AuthRepository(api, sessionStore, firebase))

        vm.signIn("brother@example.org", "wrong")
        dispatcher.scheduler.advanceUntilIdle()

        assertNull(vm.state.value.user)
        assertNotNull(vm.state.value.error)
        assertTrue(vm.state.value.error!!.contains("Invalid credentials"))
    }

    @Test
    fun `connect loads current user`() = runTest {
        val api = object : BackendApiFake() {
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
        }

        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager()
        val vm = AuthViewModel(AuthRepository(api, sessionStore, firebase))

        vm.connect("dev-brother-ea", null)
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("usr_brother", vm.state.value.user?.id)
        assertEquals("dev-brother-ea", sessionStore.devFirebaseUid)
        assertEquals(null, vm.state.value.error)
    }

    @Test
    fun `sign out clears session`() = runTest {
        val api = object : BackendApiFake() {
            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_brother",
                    email = "brother@example.org",
                    displayName = "Brother",
                )
        }

        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager()
        val vm = AuthViewModel(AuthRepository(api, sessionStore, firebase))

        vm.connect("dev-brother-ea", null)
        dispatcher.scheduler.advanceUntilIdle()
        vm.signOut()

        assertEquals(null, vm.state.value.user)
        assertEquals(false, sessionStore.hasSession())
        assertEquals(1, firebase.signedOutCalls.size)
    }

    @Test
    fun `restore session refreshes current user from Firebase`() = runTest {
        val api = object : BackendApiFake() {
            override suspend fun me(): MeProfileDto =
                MeProfileDto(
                    id = "usr_brother",
                    email = "brother@example.org",
                    displayName = "Brother",
                )
        }

        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager(
            currentUser = FirebaseUserInfo("uid-1", "brother@example.org"),
            idToken = "id-token-123",
        )
        val vm = AuthViewModel(AuthRepository(api, sessionStore, firebase))

        vm.restoreSessionIfPresent()
        dispatcher.scheduler.advanceUntilIdle()

        assertEquals("usr_brother", vm.state.value.user?.id)
        assertEquals("id-token-123", sessionStore.bearerToken)
        assertNull(sessionStore.devFirebaseUid)
    }
}
