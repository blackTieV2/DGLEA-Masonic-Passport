package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.ReviewActionResultDto
import com.dglea.passport.ui.theme.DgleaPassportComponents
import com.dglea.passport.ui.theme.DgleaPassportSpacing
import java.util.Locale

@Composable
fun MentorVerificationScreen(
    user: MeProfileDto,
    queue: List<PassportProgressDto>,
    lastDecision: ReviewActionResultDto?,
    error: String?,
    onRefreshQueue: () -> Unit,
    onVerify: (progressId: String) -> Unit,
    onReject: (progressId: String, reason: String) -> Unit,
    onClarification: (progressId: String, reason: String) -> Unit,
    onShowProfiles: () -> Unit,
    onShowReference: () -> Unit,
    onSignOut: () -> Unit,
) {
    val reasonByProgress = remember { mutableStateMapOf<String, String>() }
    val selectedProgressId = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(DgleaPassportSpacing.large)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.large),
    ) {
        DgleaPassportComponents.SectionCard(
            title = "Mentor review",
            subtitle = "Review passport progress items and take action.",
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
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
                Text(
                    text = "Queue size: ${queue.size}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Button(onClick = onRefreshQueue) { Text("Refresh") }
                    Button(onClick = onShowProfiles) { Text("Profile") }
                    Button(onClick = onShowReference) { Text("Reference") }
                }
                Button(onClick = onSignOut) { Text("Sign Out") }
            }
        }

        if (queue.isEmpty()) {
            DgleaPassportComponents.SectionCard(
                title = "No items in queue",
            ) {
                Text(
                    text = "There are no review items available at this time. Check again after the next refresh.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            queue.forEach { item ->
                val milestone = item.milestoneTemplate?.title ?: item.id
                val brotherName = item.brotherProfile?.lodge?.lodgeName ?: item.brotherProfileId
                val reasonState = reasonByProgress.getOrPut(item.id) { item.draftNote.orEmpty() }

                DgleaPassportComponents.SectionCard(
                    title = "${brotherName.uppercase(Locale.ROOT)} • $milestone",
                    subtitle = "Status: ${item.status}",
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                        item.brotherProfile?.currentStage?.let {
                            Text(
                                text = "Current stage: $it",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        item.draftNote?.takeIf { it.isNotBlank() }?.let {
                            Text(
                                text = "Draft note: $it",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        item.reviews.firstOrNull()?.reason?.let {
                            Text(
                                text = "Latest review reason: $it",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }

                        OutlinedTextField(
                            value = reasonState,
                            onValueChange = { reasonByProgress[item.id] = it },
                            label = { Text("Reason / note") },
                            modifier = Modifier.fillMaxWidth(),
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                            Button(onClick = { selectedProgressId.value = item.id }) {
                                Text(if (selectedProgressId.value == item.id) "Selected" else "Select")
                            }
                            Button(onClick = { onVerify(item.id) }) { Text("Verify") }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                            Button(onClick = { onReject(item.id, reasonByProgress[item.id].orEmpty()) }) {
                                Text("Reject")
                            }
                            Button(onClick = { onClarification(item.id, reasonByProgress[item.id].orEmpty()) }) {
                                Text("Clarification")
                            }
                        }
                    }
                }
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

        lastDecision?.let {
            DgleaPassportComponents.SectionCard(
                title = "Recent decision",
            ) {
                Text(
                    text = "Last decision: ${it.review.decision} for ${it.progress.id}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
