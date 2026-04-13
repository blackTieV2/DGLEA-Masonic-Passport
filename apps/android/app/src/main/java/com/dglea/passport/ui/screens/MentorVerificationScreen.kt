package com.dglea.passport.ui.screens

<<<<<<< codex/review-repository-documentation-and-plan-implementation-u84y0k
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
=======
>>>>>>> main
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
<<<<<<< codex/review-repository-documentation-and-plan-implementation-u84y0k
import androidx.compose.material3.Surface
=======
>>>>>>> main
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
<<<<<<< codex/review-repository-documentation-and-plan-implementation-u84y0k
import androidx.compose.ui.graphics.Color
=======
>>>>>>> main
import androidx.compose.ui.unit.dp
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.UserDto
import com.dglea.passport.network.VerificationQueueItemDto

@Composable
fun MentorVerificationScreen(
    user: UserDto,
    queue: List<VerificationQueueItemDto>,
    lastDecision: PassportRecordDto?,
    actionNonce: Int,
    error: String?,
    onRefreshQueue: () -> Unit,
    onVerify: (recordId: String) -> Unit,
    onReject: (recordId: String, reason: String) -> Unit,
    onClarification: (recordId: String, reason: String) -> Unit,
    onSignOut: () -> Unit,
) {
    val selectedRecordId = remember { mutableStateOf("") }
    val reason = remember { mutableStateOf("") }

    LaunchedEffect(actionNonce) {
        if (actionNonce > 0) {
            selectedRecordId.value = ""
            reason.value = ""
        }
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Mentor verification: ${user.displayName} (${user.email})")
        Text("Pending queue items: ${queue.size}")
        Text("Last decision status: ${lastDecision?.status ?: "No actions yet"}")

        Button(onClick = onSignOut, modifier = Modifier.padding(top = 8.dp)) { Text("Sign Out") }

        Button(onClick = onRefreshQueue, modifier = Modifier.padding(top = 8.dp)) {
            Text("Refresh Queue")
        }

        if (queue.isEmpty()) {
            Text(
                text = "No pending verification items right now.",
                modifier = Modifier.padding(top = 8.dp),
            )
        } else {
            queue.forEach { item ->
<<<<<<< codex/review-repository-documentation-and-plan-implementation-u84y0k
                val isSelected = selectedRecordId.value == item.passportRecordId
=======
>>>>>>> main
                val details = buildString {
                    append("${item.passportRecordId} • member ${item.memberProfileId} • ${item.currentStatus}")
                    if (!item.note.isNullOrBlank()) {
                        append(" • brother note: ${item.note}")
                    }
                    if (!item.reviewReason.isNullOrBlank()) {
                        append(" • mentor reason: ${item.reviewReason}")
                    }
                }
<<<<<<< codex/review-repository-documentation-and-plan-implementation-u84y0k
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 4.dp)
                        .clickable { selectedRecordId.value = item.passportRecordId },
                ) {
                    Text(
                        text = details + if (isSelected) " • selected" else "",
                        modifier = Modifier
                            .background(if (isSelected) Color(0xFFEDE7F6) else Color.Transparent)
                            .padding(8.dp),
                    )
                }
=======
                Text(
                    text = details,
                    modifier = Modifier.padding(top = 4.dp),
                )
>>>>>>> main
            }
        }

        OutlinedTextField(
            value = selectedRecordId.value,
            onValueChange = { selectedRecordId.value = it },
            label = { Text("Record Id") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp),
        )

        OutlinedTextField(
            value = reason.value,
            onValueChange = { reason.value = it },
            label = { Text("Reason (reject/clarification)") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
        )

        Button(
            onClick = { onVerify(selectedRecordId.value) },
            modifier = Modifier.padding(top = 12.dp),
        ) {
            Text("Verify")
        }

        Button(
            onClick = { onReject(selectedRecordId.value, reason.value) },
            modifier = Modifier.padding(top = 8.dp),
        ) {
            Text("Reject")
        }

        Button(
            onClick = { onClarification(selectedRecordId.value, reason.value) },
            modifier = Modifier.padding(top = 8.dp),
        ) {
            Text("Request Clarification")
        }

        if (!error.isNullOrBlank()) {
            Text(text = error, modifier = Modifier.padding(top = 8.dp))
        }
    }
}
