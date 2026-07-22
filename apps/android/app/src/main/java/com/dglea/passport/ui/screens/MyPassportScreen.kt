package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
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
import com.dglea.passport.ui.theme.DgleaPassportComponents
import com.dglea.passport.ui.theme.DgleaPassportSpacing

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
    pdfDownloadEnabled: Boolean,
    onDownloadPassportPdf: () -> Unit,
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
            .padding(DgleaPassportSpacing.large)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.large),
    ) {
        DgleaPassportComponents.SectionCard(
            title = "My Passport",
            subtitle = "Track lodge progress, sign drafts, and share your passport.",
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.medium)) {
                Text(
                    text = "Signed in as ${user.displayName}",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(
                    text = user.email,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Button(onClick = onRefreshPassport, enabled = !pdfDownloadEnabled) {
                        Text("Refresh")
                    }
                    Button(onClick = onShowProfiles) {
                        Text("Profiles")
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Button(onClick = onShowReference) {
                        Text("Reference")
                    }
                    Button(
                        onClick = onDownloadPassportPdf,
                        enabled = pdfDownloadEnabled,
                    ) {
                        Text("Share PDF")
                    }
                }
                Button(onClick = onSignOut) {
                    Text("Sign Out")
                }
            }
        }

        if (passport == null) {
            DgleaPassportComponents.SectionCard(
                title = "Passport status",
                subtitle = "Your passport data is not available yet.",
            ) {
                Text(
                    text = "Please refresh the screen or sign in again if this continues.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            DgleaPassportComponents.SectionCard(
                title = "Lodge summary",
                subtitle = "${passport.profile.lodge.lodgeName} • ${passport.profile.lodge.lodgeNumber}",
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Text(
                        text = "Current stage: ${user.currentStage ?: "Unknown"}",
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = "Progress items: ${passport.progress.size}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            passport.template.sections.forEach { section ->
                DgleaPassportComponents.SectionCard(
                    title = section.title,
                    subtitle = "${section.code} • ${section.milestoneTemplates.size} milestone(s)",
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                        section.milestoneTemplates.forEach { milestone ->
                            val progress = passport.progress.firstOrNull { it.milestoneTemplateId == milestone.id }
                            val progressStatus = progress?.status ?: "Not started"

                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                                ),
                                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                            ) {
                                Column(
                                    modifier = Modifier.padding(DgleaPassportSpacing.medium),
                                    verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small),
                                ) {
                                    Text(
                                        text = milestone.title,
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                    )
                                    Text(
                                        text = progressStatus,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.secondary,
                                    )

                                    if (progress != null) {
                                        OutlinedTextField(
                                            value = draftNotes.getOrPut(progress.id) { progress.draftNote.orEmpty() },
                                            onValueChange = { draftNotes[progress.id] = it },
                                            label = { Text("Draft note") },
                                            modifier = Modifier.fillMaxWidth(),
                                        )
                                        Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                                            Button(onClick = { selectedProgressId.value = progress.id }) {
                                                Text(if (selectedProgressId.value == progress.id) "Selected" else "Select")
                                            }
                                            Button(onClick = { onUpdateDraft(progress.id, draftNotes[progress.id]?.takeIf { it.isNotBlank() }) }) {
                                                Text("Save")
                                            }
                                            Button(onClick = { onSubmitProgress(progress.id) }) {
                                                Text("Submit")
                                            }
                                        }

                                        if (progress.status == "CLARIFICATION_REQUESTED") {
                                            OutlinedTextField(
                                                value = clarificationResponses.getOrPut(progress.id) { "" },
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
                                        Text(
                                            text = "Start this milestone to add notes and submit progress.",
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (lastMutatedProgress != null) {
            DgleaPassportComponents.SectionCard(
                title = "Recent activity",
            ) {
                Text(
                    text = "Last updated: ${lastMutatedProgress.id} • ${lastMutatedProgress.status}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }

        if (!error.isNullOrBlank()) {
            DgleaPassportComponents.SectionCard(
                title = "Problem",
            ) {
                Text(
                    text = error,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.error,
                )
            }
        }
    }
}
