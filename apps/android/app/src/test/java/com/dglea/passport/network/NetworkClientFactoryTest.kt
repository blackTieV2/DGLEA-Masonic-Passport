package com.dglea.passport.network

import kotlinx.coroutines.test.runTest
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.Assert.assertEquals
import org.junit.Test

class NetworkClientFactoryTest {
    @Test
    fun login_serializesBody_and_deserializesResponse() = runTest {
        val server = MockWebServer()
        server.enqueue(
            MockResponse().setResponseCode(200).setBody(
                """
                {
                  "accessToken":"token_123",
                  "user":{
                    "id":"u_1",
                    "email":"brother@example.com",
                    "displayName":"Brother One",
                    "status":"active"
                  }
                }
                """.trimIndent(),
            ),
        )
        server.start()

        try {
            val api = NetworkClientFactory.createBackendApi(server.url("/").toString()) { null }

            val response = api.login(
                LoginRequest(
                    email = "brother@example.com",
                    password = "secret",
                ),
            )

            val request = server.takeRequest()
            assertEquals("POST", request.method)
            assertEquals("/auth/login", request.path)
            assertEquals(
                "{\"email\":\"brother@example.com\",\"password\":\"secret\"}",
                request.body.readUtf8(),
            )

            assertEquals("token_123", response.accessToken)
            assertEquals("u_1", response.user.id)
        } finally {
            server.shutdown()
        }
    }
}
