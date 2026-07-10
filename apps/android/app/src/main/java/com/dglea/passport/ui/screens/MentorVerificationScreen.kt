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
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.PassportProgressDto
import com.dglea.passport.network.ReviewActionResultDto
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
    onSignOut: () -> Unit,
) {
    val reasonByProgress = remember { mutableStateMapOf<String, String>() }
    val selectedProgressId = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Mentor: ${user.displayName}")
        Text(user.email)
        Text("Queue size: ${queue.size}")

        Button(onClick = onRefreshQueue) { Text("Refresh Queue") }
        Button(onClick = onShowProfiles) { Text("Profile & Progress") }
        Button(onClick = onSignOut) { Text("Sign Out") }

        queue.forEach { item ->
            val milestone = item.milestoneTemplate?.title ?: item.id
            val brotherName = item.brotherProfile?.lodge?.lodgeName ?: item.brotherProfileId
            val reasonState = reasonByProgress.getOrPut(item.id) { item.draftNote.orEmpty() }

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(),
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text("${brotherName.uppercase(Locale.ROOT)} • $milestone")
                    Text("Status: ${item.status}")
                    item.brotherProfile?.currentStage?.let { Text("Current stage: $it") }
                    item.draftNote?.let { Text("Draft note: $it") }
                    item.reviews.firstOrNull()?.reason?.let { Text("Latest review reason: $it") }

                    OutlinedTextField(
                        value = reasonState,
                        onValueChange = { reasonByProgress[item.id] = it },
                        label = { Text("Reason / note") },
                        modifier = Modifier.fillMaxWidth(),
                    )

                    Button(onClick = { selectedProgressId.value = item.id }) {
                        Text(if (selectedProgressId.value == item.id) "Selected" else "Select")
                    }

                    Button(onClick = { onVerify(item.id) }) { Text("Verify") }
                    Button(onClick = { onReject(item.id, reasonByProgress[item.id].orEmpty()) }) { Text("Reject") }
                    Button(onClick = { onClarification(item.id, reasonByProgress[item.id].orEmpty()) }) { Text("Request clarification") }
                }
            }
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }

        if (lastDecision != null) {
            Text("Last decision: ${lastDecision.review.decision} for ${lastDecision.progress.id}")
        }
    }
}
