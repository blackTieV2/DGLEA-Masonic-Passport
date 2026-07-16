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
    val loading: Boolean = true,
    val user: MeProfileDto? = null,
    val error: String? = null,
)

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {
    private val _state = MutableStateFlow(AuthUiState())
    val state: StateFlow<AuthUiState> = _state.asStateFlow()

    private var restoreAttempted = false

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.signIn(email, password) }
                .onSuccess { result ->
                    result
                        .onSuccess { refreshCurrentUser() }
                        .onFailure { e -> _state.value = AuthUiState(loading = false, error = e.toUiMessage("Sign in failed")) }
                }
                .onFailure { e -> _state.value = AuthUiState(loading = false, error = e.toUiMessage("Sign in failed")) }
        }
    }

    fun connect(devFirebaseUid: String?, bearerToken: String?) {
        repository.connect(devFirebaseUid, bearerToken)
        refreshCurrentUser()
    }

    fun restoreSessionIfPresent() {
        if (restoreAttempted) return
        restoreAttempted = true
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            // Always attempt to refresh the Firebase ID token into SessionStore.
            runCatching { repository.restoreFirebaseSession() }
            if (repository.hasSession()) {
                refreshCurrentUser()
            } else {
                _state.value = AuthUiState(loading = false)
            }
        }
    }

    fun signOut() {
        repository.signOut()
        restoreAttempted = false
        _state.value = AuthUiState(loading = false)
    }

    fun refreshCurrentUser() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.currentUser() }
                .onSuccess { user -> _state.value = AuthUiState(user = user, loading = false) }
                .onFailure { e -> _state.value = AuthUiState(loading = false, error = e.toUiMessage("Failed to load current user")) }
        }
    }

}
