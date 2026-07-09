package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.AuthRepository
import com.dglea.passport.network.MeProfileDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class AuthUiState(
    val loading: Boolean = false,
    val user: MeProfileDto? = null,
    val error: String? = null,
)

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {
    private val _state = MutableStateFlow(AuthUiState())
    val state: StateFlow<AuthUiState> = _state.asStateFlow()

    private var restoreAttempted = false

    fun connect(devFirebaseUid: String?, bearerToken: String?) {
        repository.connect(devFirebaseUid, bearerToken)
        refreshCurrentUser()
    }

    fun restoreSessionIfPresent() {
        if (restoreAttempted || !repository.hasSession()) return
        restoreAttempted = true
        refreshCurrentUser()
    }

    fun signOut() {
        repository.signOut()
        restoreAttempted = false
        _state.value = AuthUiState()
    }

    fun refreshCurrentUser() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.currentUser() }
                .onSuccess { user -> _state.value = AuthUiState(user = user) }
                .onFailure { e -> _state.value = AuthUiState(error = e.toUiMessage("Failed to load current user")) }
        }
    }
}
