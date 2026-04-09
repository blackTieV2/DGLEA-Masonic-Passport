package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.MentorRepository
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.VerificationQueueItemDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MentorUiState(
    val loading: Boolean = false,
    val queue: List<VerificationQueueItemDto> = emptyList(),
    val lastDecision: PassportRecordDto? = null,
    val error: String? = null,
)

class MentorViewModel(private val repository: MentorRepository) : ViewModel() {
    private val _state = MutableStateFlow(MentorUiState())
    val state: StateFlow<MentorUiState> = _state.asStateFlow()

    fun refreshQueue() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.pendingQueue() }
                .onSuccess { queue -> _state.value = _state.value.copy(loading = false, queue = queue) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Queue failed")) }
        }
    }

    fun verify(recordId: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.verify(recordId) }
                .onSuccess { decision -> _state.value = _state.value.copy(loading = false, lastDecision = decision) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Verify failed")) }
        }
    }

    fun reject(recordId: String, reason: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.reject(recordId, reason) }
                .onSuccess { decision -> _state.value = _state.value.copy(loading = false, lastDecision = decision) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Reject failed")) }
        }
    }

    fun requestClarification(recordId: String, reason: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.requestClarification(recordId, reason) }
                .onSuccess { decision -> _state.value = _state.value.copy(loading = false, lastDecision = decision) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Clarification failed")) }
        }
    }
}
