package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
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
        Text("Last decision status: ${lastDecision?.status ?: "none"}")

        Button(onClick = onRefreshQueue, modifier = Modifier.padding(top = 8.dp)) {
            Text("Refresh Queue")
        }

        queue.forEach { item ->
            Text(
                text = "${item.passportRecordId} • member ${item.memberProfileId} • ${item.currentStatus}",
                modifier = Modifier.padding(top = 4.dp),
            )
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
