package com.dglea.passport.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dglea.passport.data.PassportRepository
import com.dglea.passport.network.BrotherPassportSummaryDto
import com.dglea.passport.network.PassportRecordDto
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class PassportUiState(
    val loading: Boolean = false,
    val lastRecord: PassportRecordDto? = null,
    val summary: BrotherPassportSummaryDto? = null,
    val error: String? = null,
)

class PassportViewModel(private val repository: PassportRepository) : ViewModel() {
    private val _state = MutableStateFlow(PassportUiState())
    val state: StateFlow<PassportUiState> = _state.asStateFlow()

    fun createDraft(
        memberProfileId: String,
        districtId: String,
        lodgeId: String,
        sectionTemplateId: String,
        templateItemId: String,
        note: String?,
    ) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching {
                repository.createDraft(memberProfileId, districtId, lodgeId, sectionTemplateId, templateItemId, note)
            }
                .onSuccess { record -> _state.value = PassportUiState(lastRecord = record) }
                .onFailure { e -> _state.value = PassportUiState(error = e.toUiMessage("Create draft failed")) }
        }
    }

    fun updateClarificationResponse(recordId: String, note: String?) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.updateClarificationResponse(recordId, note) }
                .onSuccess { updated -> _state.value = _state.value.copy(loading = false, lastRecord = updated) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Update response failed")) }
        }
    }

    fun submitDraft(recordId: String? = null) {
        val targetRecordId = recordId?.takeIf { it.isNotBlank() } ?: _state.value.lastRecord?.id ?: return
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.submit(targetRecordId) }
                .onSuccess { submitted -> _state.value = PassportUiState(lastRecord = submitted) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Submit failed")) }
        }
    }

    fun loadSummary(memberProfileId: String) {
        viewModelScope.launch {
            _state.value = _state.value.copy(loading = true, error = null)
            runCatching { repository.summary(memberProfileId) }
                .onSuccess { summary -> _state.value = _state.value.copy(loading = false, summary = summary) }
                .onFailure { e -> _state.value = _state.value.copy(loading = false, error = e.toUiMessage("Summary failed")) }
        }
    }
}
