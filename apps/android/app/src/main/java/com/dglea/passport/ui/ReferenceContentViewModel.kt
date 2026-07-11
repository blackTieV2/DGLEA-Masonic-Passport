package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.ReferenceContentRepository
import com.dglea.passport.network.ReferencePageDetailDto
import com.dglea.passport.network.ReferencePageDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ReferenceContentUiState(
    val loading: Boolean = false,
    val pages: List<ReferencePageDto> = emptyList(),
    val selectedPage: ReferencePageDetailDto? = null,
    val error: String? = null,
)

class ReferenceContentViewModel(private val repository: ReferenceContentRepository) : ViewModel() {

    private val _state = MutableStateFlow(ReferenceContentUiState())
    val state: StateFlow<ReferenceContentUiState> = _state.asStateFlow()

    fun loadPages() {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.listReferencePages() }
                .onSuccess { pages ->
                    _state.value = _state.value.copy(loading = false, pages = pages)
                }
                .onFailure { e ->
                    _state.value = _state.value.copy(
                        loading = false,
                        error = e.toUiMessage("Reference content load failed"),
                    )
                }
        }
    }

    fun loadPage(slug: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.getReferencePage(slug) }
                .onSuccess { page ->
                    _state.value = _state.value.copy(loading = false, selectedPage = page)
                }
                .onFailure { e ->
                    _state.value = _state.value.copy(
                        loading = false,
                        error = e.toUiMessage("Reference page load failed"),
                    )
                }
        }
    }

    fun clearSelection() {
        _state.value = _state.value.copy(selectedPage = null, error = null)
    }
}
