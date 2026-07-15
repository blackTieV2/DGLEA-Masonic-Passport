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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.dglea.passport.BuildConfig

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
    onSignIn: (String, String) -> Unit,
    onDevConnect: (String?, String?) -> Unit,
) {
    val email = remember { mutableStateOf("") }
    val password = remember { mutableStateOf("") }
    val devExpanded = remember { mutableStateOf(false) }
    val devUid = remember { mutableStateOf(demoIdentities.first().firebaseUid) }
    val devBearerToken = remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("DGLEA Masonic Passport")
        Text("Sign in with your DGLEA account.")

        OutlinedTextField(
            value = email.value,
            onValueChange = { email.value = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )

        OutlinedTextField(
            value = password.value,
            onValueChange = { password.value = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true,
        )

        Button(
            onClick = { onSignIn(email.value.trim(), password.value) },
            enabled = !loading,
            modifier = Modifier.widthIn(min = 160.dp),
        ) {
            Text(if (loading) "Signing in..." else "Sign In")
        }

        if (BuildConfig.DEBUG) {
            Button(
                onClick = { devExpanded.value = !devExpanded.value },
                enabled = !loading,
            ) {
                Text(if (devExpanded.value) "Hide local demo account" else "Use local demo account")
            }

            if (devExpanded.value) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    demoIdentities.forEach { identity ->
                        FilterChip(
                            selected = devUid.value == identity.firebaseUid,
                            onClick = { devUid.value = identity.firebaseUid },
                            label = { Text(identity.label) },
                        )
                    }
                }

                OutlinedTextField(
                    value = devUid.value,
                    onValueChange = { devUid.value = it },
                    label = { Text("Dev Firebase UID") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                )

                OutlinedTextField(
                    value = devBearerToken.value,
                    onValueChange = { devBearerToken.value = it },
                    label = { Text("Bearer token (optional)") },
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                )

                Button(
                    onClick = {
                        onDevConnect(
                            devUid.value.trim().takeIf { it.isNotBlank() },
                            devBearerToken.value.trim().takeIf { it.isNotBlank() },
                        )
                    },
                    enabled = !loading,
                    modifier = Modifier.widthIn(min = 160.dp),
                ) {
                    Text(if (loading) "Connecting..." else "Connect")
                }
            }
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }
    }
}
