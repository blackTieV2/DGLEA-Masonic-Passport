package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SignInScreen(onSignIn: (String, String) -> Unit, error: String?) {
    val email = remember { mutableStateOf("brother@example.org") }
    val password = remember { mutableStateOf("pass") }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = email.value,
            onValueChange = { email.value = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = password.value,
            onValueChange = { password.value = it },
            label = { Text("Password") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
        )
        Button(onClick = { onSignIn(email.value, password.value) }, modifier = Modifier.padding(top = 12.dp)) {
            Text("Sign In")
        }
        if (!error.isNullOrBlank()) {
            Text(text = error, modifier = Modifier.padding(top = 8.dp))
        }
    }
}
