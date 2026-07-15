package com.dglea.passport.data

import com.dglea.passport.network.BackendApiFake
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AuthRepositoryTest {
    @Test
    fun `signIn stores id token and clears dev uid`() = runTest {
        val api = BackendApiFake()
        val sessionStore = InMemorySessionStore().apply {
            devFirebaseUid = "dev-brother-ea"
        }
        val firebase = FakeFirebaseAuthManager(
            currentUser = FirebaseUserInfo("uid-1", "brother@example.org"),
            idToken = "id-token-123",
        )
        val repository = AuthRepository(api, sessionStore, firebase)

        val result = repository.signIn("brother@example.org", "password")

        assertTrue(result.isSuccess)
        assertEquals("id-token-123", sessionStore.bearerToken)
        assertNull(sessionStore.devFirebaseUid)
        assertEquals(1, firebase.signInCalls.size)
    }

    @Test
    fun `signOut clears session and calls signOut on manager`() = runTest {
        val api = BackendApiFake()
        val sessionStore = InMemorySessionStore().apply {
            bearerToken = "token"
            devFirebaseUid = "dev-uid"
        }
        val firebase = FakeFirebaseAuthManager()
        val repository = AuthRepository(api, sessionStore, firebase)

        repository.signOut()

        assertFalse(sessionStore.hasSession())
        assertEquals(1, firebase.signedOutCalls.size)
    }

    @Test
    fun `hasSession returns true when Firebase current user exists`() {
        val api = BackendApiFake()
        val sessionStore = InMemorySessionStore()
        val firebase = FakeFirebaseAuthManager(
            currentUser = FirebaseUserInfo("uid-1", "brother@example.org"),
        )
        val repository = AuthRepository(api, sessionStore, firebase)

        assertTrue(repository.hasSession())
    }

    @Test
    fun `restoreFirebaseSession stores token and clears dev uid`() = runTest {
        val api = BackendApiFake()
        val sessionStore = InMemorySessionStore().apply {
            devFirebaseUid = "dev-brother-ea"
        }
        val firebase = FakeFirebaseAuthManager(
            currentUser = FirebaseUserInfo("uid-1", "brother@example.org"),
            idToken = "id-token-123",
        )
        val repository = AuthRepository(api, sessionStore, firebase)

        val restored = repository.restoreFirebaseSession()

        assertTrue(restored)
        assertEquals("id-token-123", sessionStore.bearerToken)
        assertNull(sessionStore.devFirebaseUid)
    }
}
