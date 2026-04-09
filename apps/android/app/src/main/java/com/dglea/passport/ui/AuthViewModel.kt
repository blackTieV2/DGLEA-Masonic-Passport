package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.AuthRepository
import com.dglea.passport.network.UserDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class AuthUiState(
    val loading: Boolean = false,
    val user: UserDto? = null,
    val error: String? = null,
)

class AuthViewModel(private val repository: AuthRepository) : ViewModel() {
    private val _state = MutableStateFlow(AuthUiState())
    val state: StateFlow<AuthUiState> = _state.asStateFlow()

    private var restoreAttempted = false

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            _state.value = AuthUiState(loading = true)
            runCatching { repository.signIn(email, password) }
                .onSuccess { user -> _state.value = AuthUiState(user = user) }
                .onFailure { e -> _state.value = AuthUiState(error = e.toUiMessage("Sign in failed")) }
        }
    }

    fun restoreSessionIfPresent() {
        if (restoreAttempted || !repository.hasSessionToken()) return
        restoreAttempted = true
        refreshCurrentUser()
    }

    fun refreshCurrentUser() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.currentUser() }
                .onSuccess { user -> _state.value = AuthUiState(user = user) }
                .onFailure { e -> _state.value = AuthUiState(error = e.toUiMessage("Failed")) }
        }
    }
}
