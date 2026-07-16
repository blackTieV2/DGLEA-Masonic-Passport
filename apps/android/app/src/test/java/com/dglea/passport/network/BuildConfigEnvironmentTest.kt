package com.dglea.passport.network

import com.dglea.passport.BuildConfig
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test

class BuildConfigEnvironmentTest {
    @Test
    fun environmentConfigMatchesBuildType() {
        when (BuildConfig.ENVIRONMENT_NAME) {
            "debug" -> {
                assertEquals("http://10.0.2.2:3000/api/v1/", BuildConfig.API_BASE_URL)
                assertTrue(
                    "Debug builds must allow dev-auth fallback",
                    BuildConfig.ALLOW_DEV_AUTH,
                )
            }
            "staging" -> {
                assertEquals(
                    "https://REPLACE-WITH-STAGING-BACKEND.invalid/api/v1/",
                    BuildConfig.API_BASE_URL,
                )
                assertFalse(
                    "Staging builds must not allow dev-auth fallback",
                    BuildConfig.ALLOW_DEV_AUTH,
                )
            }
            "release" -> {
                assertEquals(
                    "https://REPLACE-WITH-PRODUCTION-BACKEND.invalid/api/v1/",
                    BuildConfig.API_BASE_URL,
                )
                assertFalse(
                    "Release builds must not allow dev-auth fallback",
                    BuildConfig.ALLOW_DEV_AUTH,
                )
            }
            else -> fail("Unknown environment: ${BuildConfig.ENVIRONMENT_NAME}")
        }
    }

    @Test
    fun releaseAndStagingDoNotPointToLocalhostOrEmulator() {
        if (BuildConfig.ENVIRONMENT_NAME == "debug") {
            // Debug is expected to use the emulator loopback address.
            return
        }
        val lower = BuildConfig.API_BASE_URL.lowercase()
        assertFalse("Non-debug builds must not use localhost", lower.contains("localhost"))
        assertFalse("Non-debug builds must not use emulator loopback", lower.contains("10.0.2.2"))
        assertFalse("Non-debug builds must not use plain HTTP", lower.startsWith("http://"))
        assertTrue("Non-debug builds must use HTTPS placeholders", lower.startsWith("https://"))
    }
}
