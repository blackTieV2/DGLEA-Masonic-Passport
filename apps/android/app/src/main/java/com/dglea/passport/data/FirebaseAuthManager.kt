package com.dglea.passport.data

import kotlinx.coroutines.tasks.await
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser

data class FirebaseUserInfo(
    val uid: String,
    val email: String?,
)

interface FirebaseAuthManager {
    val isAvailable: Boolean
    suspend fun signIn(email: String, password: String): Result<String>
    suspend fun getIdToken(forceRefresh: Boolean): String?
    fun getCurrentUser(): FirebaseUserInfo?
    fun signOut()
}

class DefaultFirebaseAuthManager : FirebaseAuthManager {
    private val auth = try {
        FirebaseAuth.getInstance()
    } catch (e: IllegalStateException) {
        null
    }

    override val isAvailable: Boolean = auth != null

    override suspend fun signIn(email: String, password: String): Result<String> = runCatching {
        val result = requireNotNull(auth)
            .signInWithEmailAndPassword(email, password)
            .await()
        // Validate that we can fetch an ID token before declaring success.
        result.user?.getIdToken(false)?.await()?.token
            ?: throw IllegalStateException("Failed to obtain Firebase ID token")
        result.user?.uid ?: throw IllegalStateException("Firebase sign-in returned no user")
    }

    override suspend fun getIdToken(forceRefresh: Boolean): String? = runCatching {
        auth?.currentUser?.getIdToken(forceRefresh)?.await()?.token
    }.getOrNull()

    override fun getCurrentUser(): FirebaseUserInfo? =
        auth?.currentUser?.toInfo()

    override fun signOut() {
        auth?.signOut()
    }

    private fun FirebaseUser.toInfo(): FirebaseUserInfo = FirebaseUserInfo(
        uid = uid,
        email = email,
    )
}
