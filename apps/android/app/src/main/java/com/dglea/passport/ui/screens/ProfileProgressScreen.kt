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
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.DegreeProgressDto
import com.dglea.passport.network.LodgeProfileDto
import com.dglea.passport.network.MeProfileDto

@Composable
fun ProfileProgressScreen(
    user: MeProfileDto,
    loading: Boolean,
    brotherProfiles: List<BrotherProfileDto>,
    lodgeProfiles: List<LodgeProfileDto>,
    degreeProgress: List<DegreeProgressDto>,
    lastMutatedProgress: DegreeProgressDto?,
    error: String?,
    onRefresh: () -> Unit,
    onReadyForSignOff: (progressId: String) -> Unit,
    onApprove: (progressId: String, approvalNotes: String?) -> Unit,
    onReopen: (progressId: String) -> Unit,
    onNavigateBack: () -> Unit,
    onSignOut: () -> Unit,
) {
    val approvalNotes = remember { mutableStateMapOf<String, String>() }
    val selectedProgressId = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Profile & Progress Admin")
        Text("Signed in: ${user.displayName}")
        Text(user.email)

        Button(onClick = onRefresh, enabled = !loading) { Text(if (loading) "Loading..." else "Refresh") }
        Button(onClick = onNavigateBack) { Text("Back") }
        Button(onClick = onSignOut) { Text("Sign Out") }

        Text("Brother Profiles (${brotherProfiles.size})")
        brotherProfiles.forEach { profile ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Text("${profile.fullName ?: profile.id}")
                    Text("Stage: ${profile.currentStage}")
                    Text("Lodge: ${profile.lodgeId}")
                }
            }
        }

        Text("Lodge Profiles (${lodgeProfiles.size})")
        lodgeProfiles.forEach { lodge ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Text("${lodge.lodgeName} (${lodge.lodgeNumber})")
                    lodge.district?.let { Text("District: $it") }
                    lodge.secretaryContact?.let { Text("Secretary: $it") }
                }
            }
        }

        Text("Degree Progress (${degreeProgress.size})")
        degreeProgress.forEach { progress ->
            val noteState = approvalNotes.getOrPut(progress.id) { "" }
            val isSelected = selectedProgressId.value == progress.id

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(),
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text("${progress.degreeType} • ${progress.status}")
                    Text("Brother profile: ${progress.brotherProfileId}")
                    progress.mentorNotes?.let { Text("Mentor notes: $it") }
                    progress.submittedAt?.let { Text("Submitted: $it") }
                    progress.approvedAt?.let { Text("Approved: $it") }
                    progress.reopenedAt?.let { Text("Reopened: $it") }

                    Button(onClick = { selectedProgressId.value = progress.id }) {
                        Text(if (isSelected) "Selected" else "Select")
                    }

                    if (progress.status == "IN_PROGRESS") {
                        Button(onClick = { onReadyForSignOff(progress.id) }) {
                            Text("Ready for sign-off")
                        }
                    }

                    if (progress.status == "READY_FOR_SIGN_OFF" || progress.status == "SIGNED_OFF") {
                        if (progress.status == "READY_FOR_SIGN_OFF") {
                            OutlinedTextField(
                                value = noteState,
                                onValueChange = { approvalNotes[progress.id] = it },
                                label = { Text("Approval notes") },
                                modifier = Modifier.fillMaxWidth(),
                            )
                            Button(onClick = { onApprove(progress.id, approvalNotes[progress.id]?.takeIf { it.isNotBlank() }) }) {
                                Text("Approve")
                            }
                        }
                        Button(onClick = { onReopen(progress.id) }) {
                            Text("Reopen")
                        }
                    }
                }
            }
        }

        lastMutatedProgress?.let {
            Text("Last updated: ${it.degreeType} • ${it.status}")
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }
    }
}
