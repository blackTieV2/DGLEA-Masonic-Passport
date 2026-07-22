package com.dglea.passport.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import com.dglea.passport.network.MeProfileDto
import com.dglea.passport.network.ReferencePageDetailDto
import com.dglea.passport.network.ReferencePageDto
import com.dglea.passport.ui.theme.DgleaPassportComponents
import com.dglea.passport.ui.theme.DgleaPassportSpacing

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
            .padding(DgleaPassportSpacing.large)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.large),
    ) {
        DgleaPassportComponents.SectionCard(
            title = "Passport Guide",
            subtitle = "Browse reference pages for the DGLEA passport process.",
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
                Row(horizontalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Button(onClick = onNavigateBack) { Text("Back") }
                    Button(onClick = onSignOut) { Text("Sign Out") }
                }
            }
        }

        if (loading) {
            DgleaPassportComponents.SectionCard(
                title = "Loading content",
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small),
                ) {
                    CircularProgressIndicator()
                }
            }
        }

        if (selectedPage != null) {
            DgleaPassportComponents.SectionCard(
                title = selectedPage.title,
                subtitle = "Section: ${selectedPage.section}",
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.medium)) {
                    selectedPage.sourceEdition?.let {
                        Text(
                            text = "Source: $it",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Text(
                        text = selectedPage.contentMarkdown ?: "No content available.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Button(onClick = onClearSelection) { Text("Back to list") }
                }
            }
        } else if (pages.isEmpty()) {
            DgleaPassportComponents.SectionCard(
                title = "No reference pages",
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.small)) {
                    Text(
                        text = "No content is available yet. Try refreshing to load the latest guide.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Button(onClick = onLoadPages) { Text("Refresh") }
                }
            }
        } else {
            DgleaPassportComponents.SectionCard(
                title = "Reference pages",
                subtitle = "${pages.size} pages available",
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(DgleaPassportSpacing.medium)) {
                    pages.forEach { page ->
                        DgleaPassportComponents.SectionCard(
                            title = page.title,
                            subtitle = "Section: ${page.section}",
                        ) {
                            Button(onClick = { onSelectPage(page.slug) }) { Text("Read") }
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
    }
}
