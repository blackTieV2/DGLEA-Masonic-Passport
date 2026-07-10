package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

private data class DemoIdentity(val label: String, val firebaseUid: String)

private val demoIdentities = listOf(
    DemoIdentity("Brother EA", "dev-brother-ea"),
    DemoIdentity("Brother FC", "dev-brother-fc"),
    DemoIdentity("Brother MM", "dev-brother-mm"),
    DemoIdentity("Personal Mentor", "dev-personal-mentor"),
    DemoIdentity("Lodge Mentor", "dev-lodge-mentor"),
    DemoIdentity("District Mentor", "dev-district-mentor"),
    DemoIdentity("District Admin", "dev-district-admin"),
)

@Composable
fun ConnectScreen(
    loading: Boolean,
    error: String?,
    onConnect: (String?, String?) -> Unit,
) {
    val bearerToken = remember { mutableStateOf("") }
    val selectedUid = remember { mutableStateOf(demoIdentities.first().firebaseUid) }

    LaunchedEffect(Unit) {
        if (selectedUid.value.isBlank()) {
            selectedUid.value = demoIdentities.first().firebaseUid
        }
    }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("DGLEA Masonic Passport")
        Text("Connect to the backend and choose a seeded demo identity for local development.")

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            demoIdentities.forEach { identity ->
                FilterChip(
                    selected = selectedUid.value == identity.firebaseUid,
                    onClick = { selectedUid.value = identity.firebaseUid },
                    label = { Text(identity.label) },
                )
            }
        }

        OutlinedTextField(
            value = selectedUid.value,
            onValueChange = { selectedUid.value = it },
            label = { Text("Dev Firebase UID") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )

        OutlinedTextField(
            value = bearerToken.value,
            onValueChange = { bearerToken.value = it },
            label = { Text("Bearer token (optional)") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true,
        )

        Button(
            onClick = {
                onConnect(
                    selectedUid.value.trim().takeIf { it.isNotBlank() },
                    bearerToken.value.trim().takeIf { it.isNotBlank() },
                )
            },
            enabled = !loading,
            modifier = Modifier.widthIn(min = 160.dp),
        ) {
            Text(if (loading) "Connecting..." else "Connect")
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }
    }
}
