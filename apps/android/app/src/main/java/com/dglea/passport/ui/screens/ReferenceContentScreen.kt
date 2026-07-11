package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.ReferencePageDetailDto
import com.dglea.passport.network.ReferencePageDto

@Composable
fun ReferenceContentScreen(
    user: MeProfileDto,
    loading: Boolean,
    pages: List<ReferencePageDto>,
    selectedPage: ReferencePageDetailDto?,
    error: String?,
    onLoadPages: () -> Unit,
    onSelectPage: (slug: String) -> Unit,
    onClearSelection: () -> Unit,
    onNavigateBack: () -> Unit,
    onSignOut: () -> Unit,
) {
    LaunchedEffect(Unit) {
        if (pages.isEmpty() && selectedPage == null) {
            onLoadPages()
        }
    }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Passport Guide")
        Text("Signed in: ${user.displayName}")

        Button(onClick = onNavigateBack) { Text("Back") }
        Button(onClick = onSignOut) { Text("Sign Out") }

        if (loading) {
            CircularProgressIndicator()
        }

        if (selectedPage != null) {
            Button(onClick = onClearSelection) { Text("Back to list") }

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Text(selectedPage.title)
                    Text("Section: ${selectedPage.section}")
                    selectedPage.sourceEdition?.let { Text("Source: $it") }
                    Text(
                        selectedPage.contentMarkdown ?: "No content available.",
                        modifier = Modifier.padding(top = 8.dp),
                    )
                }
            }
        } else if (pages.isEmpty()) {
            Text("No reference pages loaded.")
            Button(onClick = onLoadPages) { Text("Refresh") }
        } else {
            Text("Reference pages (${pages.size})")
            pages.forEach { page ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Text(page.title)
                        Text("Section: ${page.section}")
                        Button(onClick = { onSelectPage(page.slug) }) {
                            Text("Read")
                        }
                    }
                }
            }
        }

        if (!error.isNullOrBlank()) {
            Text(error)
        }
    }
}
