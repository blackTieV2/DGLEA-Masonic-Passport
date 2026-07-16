package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.dglea.passport.BuildConfig
import com.dglea.passport.R

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

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .safeDrawingPadding()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp, Alignment.CenterVertically),
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(
                text = stringResource(R.string.app_full_name),
                style = MaterialTheme.typography.headlineMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.primary,
            )
            Text(
                text = stringResource(R.string.app_tagline),
                style = MaterialTheme.typography.titleMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.secondary,
            )
        }

        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(
                text = stringResource(R.string.sign_in_prompt),
                style = MaterialTheme.typography.bodyLarge,
            )
            Text(
                text = stringResource(R.string.sign_in_subtitle),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            OutlinedTextField(
                value = email.value,
                onValueChange = { email.value = it },
                label = { Text(stringResource(R.string.email_label)) },
                leadingIcon = { Icon(Icons.Outlined.Email, contentDescription = stringResource(R.string.email_label)) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                enabled = !loading,
            )

            OutlinedTextField(
                value = password.value,
                onValueChange = { password.value = it },
                label = { Text(stringResource(R.string.password_label)) },
                leadingIcon = { Icon(Icons.Outlined.Lock, contentDescription = stringResource(R.string.password_label)) },
                modifier = Modifier.fillMaxWidth(),
                visualTransformation = PasswordVisualTransformation(),
                singleLine = true,
                enabled = !loading,
            )

            Button(
                onClick = { onSignIn(email.value.trim(), password.value) },
                enabled = !loading,
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 48.dp),
            ) {
                Text(if (loading) stringResource(R.string.signing_in_button) else stringResource(R.string.sign_in_button))
            }
        }

        if (BuildConfig.DEBUG) {
            Spacer(Modifier.height(8.dp))
            DebugDemoPanel(
                loading = loading,
                onDevConnect = onDevConnect,
            )
        }

        if (!error.isNullOrBlank()) {
            Text(
                text = error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun DebugDemoPanel(
    loading: Boolean,
    onDevConnect: (String?, String?) -> Unit,
) {
    val expanded = remember { mutableStateOf(false) }
    val devUid = remember { mutableStateOf(demoIdentities.first().firebaseUid) }
    val devBearerToken = remember { mutableStateOf("") }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
        ),
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text(
                text = stringResource(R.string.debug_demo_accounts_title),
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            OutlinedButton(
                onClick = { expanded.value = !expanded.value },
                enabled = !loading,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(
                    if (expanded.value) {
                        stringResource(R.string.hide_debug_demo_accounts)
                    } else {
                        stringResource(R.string.show_debug_demo_accounts)
                    },
                )
            }

            if (expanded.value) {
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
                    label = { Text(stringResource(R.string.demo_firebase_uid_label)) },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    enabled = !loading,
                )

                OutlinedTextField(
                    value = devBearerToken.value,
                    onValueChange = { devBearerToken.value = it },
                    label = { Text(stringResource(R.string.bearer_token_label)) },
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    enabled = !loading,
                )

                OutlinedButton(
                    onClick = {
                        onDevConnect(
                            devUid.value.trim().takeIf { it.isNotBlank() },
                            devBearerToken.value.trim().takeIf { it.isNotBlank() },
                        )
                    },
                    enabled = !loading,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text(if (loading) stringResource(R.string.connecting_demo_account_button) else stringResource(R.string.connect_demo_account_button))
                }
            }
        }
    }
}
