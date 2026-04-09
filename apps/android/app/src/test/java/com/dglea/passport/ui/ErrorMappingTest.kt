package com.dglea.passport.ui

import java.net.UnknownHostException
import okhttp3.ResponseBody.Companion.toResponseBody
import org.junit.Assert.assertEquals
import org.junit.Test
import retrofit2.HttpException
import retrofit2.Response

class ErrorMappingTest {
    @Test
    fun unauthorized_maps_to_sign_in_again_message() {
        val ex = HttpException(Response.error<String>(401, "".toResponseBody()))
        assertEquals("Session expired or unauthorized. Please sign in again.", ex.toUiMessage("fallback"))
    }

    @Test
    fun invalid_state_transition_maps_to_refresh_message() {
        val ex = HttpException(Response.error<String>(409, "{\"code\":\"INVALID_STATE_TRANSITION\"}".toResponseBody()))
        assertEquals("Record state changed on server. Refresh queue and try again.", ex.toUiMessage("fallback"))
    }

    @Test
    fun unknown_host_maps_to_backend_unavailable_message() {
        val ex = UnknownHostException("no host")
        assertEquals(
            "Unable to reach backend. Check connection and server status.",
            ex.toUiMessage("fallback"),
        )
    }
}
