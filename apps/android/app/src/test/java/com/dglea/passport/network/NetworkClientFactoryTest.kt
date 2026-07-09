package com.dglea.passport.network

import com.dglea.passport.data.InMemorySessionStore
import kotlinx.coroutines.test.runTest
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.Assert.assertEquals
import org.junit.Test

class NetworkClientFactoryTest {
    @Test
    fun me_serializesSessionHeaders_and_deserializesResponse() = runTest {
        val server = MockWebServer()
        server.enqueue(
            MockResponse().setResponseCode(200).setBody(
                """
                {
                  "id":"usr_1",
                  "email":"brother@example.local",
                  "displayName":"Brother One",
                  "roles":[
                    {"role":"BROTHER","scopeType":"GLOBAL","scopeId":null}
                  ],
                  "brotherProfileId":"bp_1",
                  "lodgeId":"lodge_1",
                  "currentStage":"ENTERED_APPRENTICE"
                }
                """.trimIndent(),
            ),
        )
        server.start()

        try {
            val sessionStore = InMemorySessionStore().apply {
                bearerToken = "token_123"
                devFirebaseUid = "dev-brother-ea"
            }
            val api = NetworkClientFactory.createBackendApi(server.url("/").toString(), sessionStore)

            val response = api.me()

            val request = server.takeRequest()
            assertEquals("GET", request.method)
            assertEquals("/me", request.path)
            assertEquals("Bearer token_123", request.getHeader("Authorization"))
            assertEquals("dev-brother-ea", request.getHeader("X-Dev-Auth-Firebase-Uid"))
            assertEquals("usr_1", response.id)
            assertEquals("ENTERED_APPRENTICE", response.currentStage)
        } finally {
            server.shutdown()
        }
    }
}
