package com.dglea.passport.data

import android.content.SharedPreferences

interface SessionStore {
    var accessToken: String?
}

class InMemorySessionStore : SessionStore {
    override var accessToken: String? = null
}

class SharedPrefsSessionStore(private val prefs: SharedPreferences) : SessionStore {
    override var accessToken: String?
        get() = prefs.getString(KEY_ACCESS_TOKEN, null)
        set(value) {
            prefs.edit().putString(KEY_ACCESS_TOKEN, value).apply()
        }

    private companion object {
        const val KEY_ACCESS_TOKEN = "access_token"
    }
}
