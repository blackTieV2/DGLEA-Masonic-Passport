package com.dglea.passport.data

import android.content.SharedPreferences

interface SessionStore {
    var bearerToken: String?
    var devFirebaseUid: String?
    fun clear()
    fun hasSession(): Boolean = !bearerToken.isNullOrBlank() || !devFirebaseUid.isNullOrBlank()
}

class InMemorySessionStore : SessionStore {
    override var bearerToken: String? = null
    override var devFirebaseUid: String? = null

    override fun clear() {
        bearerToken = null
        devFirebaseUid = null
    }
}

class SharedPrefsSessionStore(private val prefs: SharedPreferences) : SessionStore {
    override var bearerToken: String?
        get() = prefs.getString(KEY_BEARER_TOKEN, null)
        set(value) {
            prefs.edit().putString(KEY_BEARER_TOKEN, value).apply()
        }

    override var devFirebaseUid: String?
        get() = prefs.getString(KEY_DEV_FIREBASE_UID, null)
        set(value) {
            prefs.edit().putString(KEY_DEV_FIREBASE_UID, value).apply()
        }

    override fun clear() {
        prefs.edit()
            .remove(KEY_BEARER_TOKEN)
            .remove(KEY_DEV_FIREBASE_UID)
            .apply()
    }

    private companion object {
        const val KEY_BEARER_TOKEN = "bearer_token"
        const val KEY_DEV_FIREBASE_UID = "dev_firebase_uid"
    }
}
