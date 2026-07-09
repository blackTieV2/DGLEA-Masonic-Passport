package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.ProfilesRepository
import com.dglea.passport.network.ApproveDegreeProgressRequest
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.DegreeProgressDto
import com.dglea.passport.network.LodgeProfileDto
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ProfileProgressUiState(
    val loading: Boolean = false,
    val brotherProfiles: List<BrotherProfileDto> = emptyList(),
    val lodgeProfiles: List<LodgeProfileDto> = emptyList(),
    val degreeProgress: List<DegreeProgressDto> = emptyList(),
    val lastMutatedProgress: DegreeProgressDto? = null,
    val error: String? = null,
)

/**
 * ViewModel for the profile/progress admin screen.
 *
 * NOTE: Role checks and actor identity live on the backend. This ViewModel only
 * triggers repository actions; it never sends hard-coded actor IDs or roles.
 */
class ProfileProgressViewModel(private val repository: ProfilesRepository) : ViewModel() {
    private val _state = MutableStateFlow(ProfileProgressUiState())
    val state: StateFlow<ProfileProgressUiState> = _state.asStateFlow()

    fun refresh() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching {
                val brothers = async { repository.listBrotherProfiles() }
                val lodges = async { repository.listLodgeProfiles() }
                val degrees = async { repository.listDegreeProgress() }
                Triple(brothers.await(), lodges.await(), degrees.await())
            }
                .onSuccess { (brothers, lodges, degrees) ->
                    _state.value = _state.value.copy(
                        loading = false,
                        brotherProfiles = brothers,
                        lodgeProfiles = lodges,
                        degreeProgress = degrees,
                    )
                }
                .onFailure { e ->
                    _state.value = _state.value.copy(
                        loading = false,
                        error = e.toUiMessage("Profile/progress load failed"),
                    )
                }
        }
    }

    fun readyForSignOff(progressId: String) {
        runProgressMutation("Ready-for-sign-off failed") {
            repository.markDegreeProgressReadyForSignOff(progressId)
        }
    }

    fun approve(progressId: String, approvalNotes: String?) {
        runProgressMutation("Approve failed") {
            repository.approveDegreeProgress(
                progressId,
                ApproveDegreeProgressRequest(approvalNotes),
            )
        }
    }

    fun reopen(progressId: String) {
        runProgressMutation("Reopen failed") {
            repository.reopenDegreeProgress(progressId)
        }
    }

    private fun runProgressMutation(
        defaultMessage: String,
        action: suspend () -> DegreeProgressDto,
    ) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { action() }
                .onSuccess { progress ->
                    _state.value = _state.value.copy(
                        loading = false,
                        lastMutatedProgress = progress,
                    )
                    refresh()
                }
                .onFailure { e ->
                    _state.value = _state.value.copy(
                        loading = false,
                        error = e.toUiMessage(defaultMessage),
                    )
                }
        }
    }
}
