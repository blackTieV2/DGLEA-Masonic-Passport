package com.dglea.passport.ui

import retrofit2.HttpException

fun Throwable.toUiMessage(defaultMessage: String): String {
    if (this is HttpException) {
        val body = response()?.errorBody()?.string()?.takeIf { it.isNotBlank() }
        return body ?: "HTTP ${code()}"
    }
    return message ?: defaultMessage
}
