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
    val actionNonce: Int = 0,
    val error: String? = null,
)

class MentorViewModel(private val repository: MentorRepository) : ViewModel() {
    private val _state = MutableStateFlow(MentorUiState())
    val state: StateFlow<MentorUiState> = _state.asStateFlow()

    fun refreshQueue() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.pendingQueue() }
                .onSuccess { queue ->
                    _state.value = _state.value.copy(
                        loading = false,
                        queue = queue,
                        error = null,
                    )
                }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Queue failed")) }
        }
    }

    fun verify(recordId: String) {
        runActionIfQueueRecordIsSubmitted(recordId) {
            repository.verify(recordId)
        }
    }

    fun reject(recordId: String, reason: String) {
        runActionIfQueueRecordIsSubmitted(recordId) {
            repository.reject(recordId, reason)
        }
    }

    fun requestClarification(recordId: String, reason: String) {
        runActionIfQueueRecordIsSubmitted(recordId) {
            repository.requestClarification(recordId, reason)
        }
    }

    private fun runActionIfQueueRecordIsSubmitted(
        recordId: String,
        action: suspend () -> PassportRecordDto,
    ) {
        val queueItem = _state.value.queue.firstOrNull { it.passportRecordId == recordId }
        if (queueItem == null || queueItem.currentStatus != "SUBMITTED") {
            _state.value = _state.value.copy(
                error = "Selected record is no longer pending. Refresh queue and try again.",
            )
            return
        }

        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { action() }
                .onSuccess { decision ->
                    _state.value = _state.value.copy(
                        loading = false,
                        lastDecision = decision,
                        actionNonce = _state.value.actionNonce + 1,
                        error = null,
                    )
                    refreshQueue()
                }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Action failed")) }
        }
    }
}
