package com.dglea.passport.data

class FakeFirebaseAuthManager(
    private val available: Boolean = true,
    private val currentUser: FirebaseUserInfo? = null,
    private val idToken: String? = null,
    private val signInResult: Result<String>? = null,
) : FirebaseAuthManager {
    override val isAvailable: Boolean = available
    val signedOutCalls = mutableListOf<Unit>()
    val signInCalls = mutableListOf<Pair<String, String>>()
    val tokenRefreshCalls = mutableListOf<Boolean>()

    override suspend fun signIn(email: String, password: String): Result<String> {
        signInCalls.add(email to password)
        return signInResult ?: Result.success(currentUser?.uid ?: "fake-uid")
    }

    override suspend fun getIdToken(forceRefresh: Boolean): String? {
        tokenRefreshCalls.add(forceRefresh)
        return idToken
    }

    override fun getCurrentUser(): FirebaseUserInfo? = currentUser

    override fun signOut() {
        signedOutCalls.add(Unit)
    }
}
