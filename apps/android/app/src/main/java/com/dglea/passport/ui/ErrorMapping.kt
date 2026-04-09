package com.dglea.passport.ui

import java.net.ConnectException
import java.net.SocketTimeoutException
import java.net.UnknownHostException
import retrofit2.HttpException

fun Throwable.toUiMessage(defaultMessage: String): String {
    if (this is HttpException) {
        return when (code()) {
            400 -> "Invalid request. Please review your input."
            401 -> "Session expired or unauthorized. Please sign in again."
            403 -> "You do not have permission for this action."
            in 500..599 -> "Backend is unavailable right now. Please try again shortly."
            else -> {
                val body = response()?.errorBody()?.string()?.takeIf { it.isNotBlank() }
                body ?: "HTTP ${code()}"
            }
        }
    }

    if (this is UnknownHostException || this is ConnectException || this is SocketTimeoutException) {
        return "Unable to reach backend. Check connection and server status."
    }

    return message ?: defaultMessage
}
