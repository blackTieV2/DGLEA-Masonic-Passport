package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dglea.passport.network.BrotherPassportDto
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.PassportProgressDto

@Composable
fun MyPassportScreen(
    user: MeProfileDto,
    passport: BrotherPassportDto?,
    lastMutatedProgress: PassportProgressDto?,
    error: String?,
    onRefreshPassport: () -> Unit,
    onUpdateDraft: (progressId: String, note: String?) -> Unit,
    onRespondToClarification: (progressId: String, response: String) -> Unit,
    onSubmitProgress: (progressId: String) -> Unit,
    onShowProfiles: () -> Unit,
    onShowReference: () -> Unit,
    onSignOut: () -> Unit,
) {
    val draftNotes = remember { mutableStateMapOf<String, String>() }
    val clarificationResponses = remember { mutableStateMapOf<String, String>() }
    val selectedProgressId = remember { mutableStateOf("") }

    LaunchedEffect(passport?.progress) {
        val firstEditable = passport?.progress?.firstOrNull {
            it.status == "DRAFT" || it.status == "NOT_STARTED" || it.status == "CLARIFICATION_REQUESTED" || it.status == "REJECTED"
        }
        if (selectedProgressId.value.isBlank()) {
            selectedProgressId.value = firstEditable?.id.orEmpty()
        }
    }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Signed in: ${user.displayName}")
        Text(user.email)
        Text("Current stage: ${user.currentStage ?: "Unknown"}")

        Button(onClick = onRefreshPassport) { Text("Refresh Passport") }
        Button(onClick = onShowProfiles) { Text("Profile & Progress") }
        Button(onClick = onShowReference) { Text("Passport Guide") }
        Button(onClick = onSignOut) { Text("Sign Out") }

        if (passport == null) {
            Text("No passport data loaded yet.")
        } else {
            Text("Lodge: ${passport.profile.lodge.lodgeName} (${passport.profile.lodge.lodgeNumber})")
            passport.template.sections.forEach { section ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("${section.title} (${section.code})")
                        section.milestoneTemplates.forEach { milestone ->
                            val progress = passport.progress.firstOrNull { it.milestoneTemplateId == milestone.id }
                            val progressStatus = progress?.status ?: "UNKNOWN"
                            Text("${milestone.title} • $progressStatus")

                            if (progress != null) {
                                val noteState = draftNotes.getOrPut(progress.id) { progress.draftNote.orEmpty() }
                                val responseState = clarificationResponses.getOrPut(progress.id) { "" }
                                val isSelected = selectedProgressId.value == progress.id

                                OutlinedTextField(
                                    value = if (isSelected) noteState else noteState,
                                    onValueChange = { draftNotes[progress.id] = it },
                                    label = { Text("Draft note") },
                                    modifier = Modifier.fillMaxWidth(),
                                )

                                Button(onClick = { selectedProgressId.value = progress.id }) {
                                    Text(if (isSelected) "Selected" else "Select")
                                }

                                Button(onClick = { onUpdateDraft(progress.id, draftNotes[progress.id]?.takeIf { it.isNotBlank() }) }) {
                                    Text("Save Draft")
                                }

                                Button(onClick = { onSubmitProgress(progress.id) }) {
                                    Text("Submit")
                                }

                                if (progress.status == "CLARIFICATION_REQUESTED") {
                                    OutlinedTextField(
                                        value = responseState,
                                        onValueChange = { clarificationResponses[progress.id] = it },
                                        label = { Text("Clarification response") },
                                        modifier = Modifier.fillMaxWidth(),
                                    )
                                    Button(
                                        onClick = {
                                            onRespondToClarification(
                                                progress.id,
                                                clarificationResponses[progress.id].orEmpty(),
                                            )
                                        },
                                    ) {
                                        Text("Respond")
                                    }
                                }
                            } else {
                                Text("Progress item not yet started.")
                            }
                        }
                    }
                }
            }
        }

        if (lastMutatedProgress != null) {
            Text("Last updated: ${lastMutatedProgress.id} • ${lastMutatedProgress.status}")
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }
    }
}
