package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.MentorRepository
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.ReviewActionResultDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MentorUiState(
    val loading: Boolean = false,
    val queue: List<PassportProgressDto> = emptyList(),
    val lastDecision: ReviewActionResultDto? = null,
    val error: String? = null,
)

class MentorViewModel(private val repository: MentorRepository) : ViewModel() {
    private val _state = MutableStateFlow(MentorUiState())
    val state: StateFlow<MentorUiState> = _state.asStateFlow()

    fun refreshQueue(brotherProfileId: String? = null) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.reviewQueue(brotherProfileId) }
                .onSuccess { queue ->
                    _state.value = _state.value.copy(
                        loading = false,
                        queue = queue,
                        error = null,
                    )
                }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Queue load failed")) }
        }
    }

    fun verify(progressId: String) {
        runReviewActionIfPending(progressId) { repository.verify(progressId) }
    }

    fun reject(progressId: String, reason: String) {
        runReviewActionIfPending(progressId) { repository.reject(progressId, reason) }
    }

    fun requestClarification(progressId: String, reason: String) {
        runReviewActionIfPending(progressId) { repository.requestClarification(progressId, reason) }
    }

    private fun runReviewActionIfPending(
        progressId: String,
        action: suspend () -> ReviewActionResultDto,
    ) {
        val queueItem = _state.value.queue.firstOrNull { it.id == progressId }
        if (queueItem == null || queueItem.status != "SUBMITTED") {
            _state.value = _state.value.copy(
                error = "Selected record is no longer pending. Refresh queue and try again.",
            )
            return
        }

        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { action() }
                .onSuccess { result ->
                    _state.value = _state.value.copy(
                        loading = false,
                        lastDecision = result,
                        error = null,
                    )
                    refreshQueue()
                }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Review failed")) }
        }
    }
}
