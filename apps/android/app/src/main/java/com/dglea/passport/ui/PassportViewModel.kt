package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.PassportRepository
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.PassportProgressDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class PassportUiState(
    val loading: Boolean = false,
    val passport: BrotherPassportDto? = null,
    val lastMutatedProgress: PassportProgressDto? = null,
    val error: String? = null,
)

class PassportViewModel(private val repository: PassportRepository) : ViewModel() {
    private val _state = MutableStateFlow(PassportUiState())
    val state: StateFlow<PassportUiState> = _state.asStateFlow()

    fun refreshPassport() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.loadMyPassport() }
                .onSuccess { passport -> _state.value = _state.value.copy(loading = false, passport = passport) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Passport load failed")) }
        }
    }

    fun updateDraft(progressId: String, note: String?) {
        runPassportMutation("Draft update failed") {
            repository.updateDraft(progressId, note)
        }
    }

    fun submit(progressId: String) {
        runPassportMutation("Submit failed") {
            repository.submit(progressId)
        }
    }

    fun respondToClarification(progressId: String, response: String) {
        runPassportMutation("Clarification response failed") {
            repository.respondToClarification(progressId, response)
        }
    }

    private fun runPassportMutation(
        defaultMessage: String,
        action: suspend () -> PassportProgressDto,
    ) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { action() }
                .onSuccess { progress ->
                    _state.value = _state.value.copy(
                        loading = false,
                        lastMutatedProgress = progress,
                    )
                    refreshPassport()
                }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage(defaultMessage)) }
        }
    }
}
