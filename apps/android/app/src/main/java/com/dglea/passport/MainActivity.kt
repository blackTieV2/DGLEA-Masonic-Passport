package com.dglea.passport

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.viewmodel.CreationExtras
import com.dglea.passport.data.AppContainer
import com.dglea.passport.ui.AuthViewModel
import com.dglea.passport.ui.MentorViewModel
import com.dglea.passport.ui.PassportViewModel
import com.dglea.passport.ui.ProfileProgressViewModel
import com.dglea.passport.ui.ReferenceContentViewModel
import com.dglea.passport.ui.screens.ConnectScreen
import com.dglea.passport.ui.screens.MentorVerificationScreen
import com.dglea.passport.ui.screens.MyPassportScreen
import com.dglea.passport.ui.screens.ProfileProgressScreen
import com.dglea.passport.ui.screens.ReferenceContentScreen
import com.dglea.passport.ui.screens.SplashScreen
import com.dglea.passport.ui.theme.DgleaPassportTheme
import com.dglea.passport.ui.toUiMessage
import kotlinx.coroutines.launch

private enum class AppScreen {
    Home,
    Profiles,
    Reference,
}

class MainActivity : ComponentActivity() {
    private val container by lazy { AppContainer(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val authVm = ViewModelProvider(this, vmFactory { AuthViewModel(container.authRepository) })[AuthViewModel::class.java]
        val passportVm = ViewModelProvider(this, vmFactory { PassportViewModel(container.passportRepository) })[PassportViewModel::class.java]
        val mentorVm = ViewModelProvider(this, vmFactory { MentorViewModel(container.mentorRepository) })[MentorViewModel::class.java]
        val profileProgressVm = ViewModelProvider(this, vmFactory { ProfileProgressViewModel(container.profilesRepository) })[ProfileProgressViewModel::class.java]
        val referenceContentVm = ViewModelProvider(this, vmFactory { ReferenceContentViewModel(container.referenceContentRepository) })[ReferenceContentViewModel::class.java]

        setContent {
            DgleaPassportTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Surface(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding),
                    ) {
                        val authState by authVm.state.collectAsState()
                        val passportState by passportVm.state.collectAsState()
                        val mentorState by mentorVm.state.collectAsState()
                        val profileProgressState by profileProgressVm.state.collectAsState()
                        val referenceContentState by referenceContentVm.state.collectAsState()
                        val currentScreen = remember { mutableStateOf(AppScreen.Home) }
                        val isDownloadingPdf = remember { mutableStateOf(false) }
                        val showSplash = remember { mutableStateOf(true) }

                        LaunchedEffect(Unit) {
                            authVm.restoreSessionIfPresent()
                        }

                        LaunchedEffect(authState.loading) {
                            if (showSplash.value && !authState.loading) {
                                showSplash.value = false
                            }
                        }

                        LaunchedEffect(authState.user?.id) {
                            val user = authState.user ?: return@LaunchedEffect
                            if (user.roles.any { it.role == "LODGE_MENTOR" || it.role == "DISTRICT_MENTOR" || it.role == "LODGE_REVIEWER" || it.role == "LODGE_ADMIN" }) {
                                mentorVm.refreshQueue()
                            } else {
                                passportVm.refreshPassport()
                            }
                        }

                        val user = authState.user
                        val downloadPassportPdf: () -> Unit = {
                            user?.brotherProfileId?.let { brotherProfileId ->
                                isDownloadingPdf.value = true
                                lifecycleScope.launch {
                                    runCatching { container.profilesRepository.downloadPassportPdf(brotherProfileId) }
                                        .onSuccess { uri ->
                                            isDownloadingPdf.value = false
                                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                                type = "application/pdf"
                                                putExtra(Intent.EXTRA_STREAM, uri)
                                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                                putExtra(Intent.EXTRA_SUBJECT, "DGLEA Masonic Passport")
                                            }
                                            val chooser = Intent.createChooser(shareIntent, "Share Passport PDF").apply {
                                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                                            }
                                            startActivity(chooser)
                                        }
                                        .onFailure { error ->
                                            isDownloadingPdf.value = false
                                            Log.e("MainActivity", "PDF share failed", error)
                                            Toast.makeText(
                                                this@MainActivity,
                                                error.toUiMessage("PDF download failed"),
                                                Toast.LENGTH_LONG,
                                            ).show()
                                        }
                                }
                            }
                        }

                        when {
                            showSplash.value && user == null -> SplashScreen()
                            user == null -> ConnectScreen(
                                loading = authState.loading,
                                error = authState.error,
                                onSignIn = authVm::signIn,
                                onDevConnect = authVm::connect,
                            )
                            currentScreen.value == AppScreen.Profiles -> ProfileProgressScreen(
                                user = user,
                                loading = profileProgressState.loading,
                                brotherProfiles = profileProgressState.brotherProfiles,
                                lodgeProfiles = profileProgressState.lodgeProfiles,
                                degreeProgress = profileProgressState.degreeProgress,
                                lastMutatedProgress = profileProgressState.lastMutatedProgress,
                                error = authState.error ?: profileProgressState.error,
                                pdfDownloadEnabled = user.brotherProfileId != null && !isDownloadingPdf.value,
                                onRefresh = profileProgressVm::refresh,
                                onReadyForSignOff = profileProgressVm::readyForSignOff,
                                onApprove = profileProgressVm::approve,
                                onReopen = profileProgressVm::reopen,
                                onDownloadPassportPdf = downloadPassportPdf,
                                onNavigateBack = { currentScreen.value = AppScreen.Home },
                                onSignOut = authVm::signOut,
                            )
                            currentScreen.value == AppScreen.Reference -> ReferenceContentScreen(
                                user = user,
                                loading = referenceContentState.loading,
                                pages = referenceContentState.pages,
                                selectedPage = referenceContentState.selectedPage,
                                error = authState.error ?: referenceContentState.error,
                                onLoadPages = referenceContentVm::loadPages,
                                onSelectPage = referenceContentVm::loadPage,
                                onClearSelection = referenceContentVm::clearSelection,
                                onNavigateBack = { currentScreen.value = AppScreen.Home },
                                onSignOut = authVm::signOut,
                            )
                            user.roles.any { it.role == "LODGE_MENTOR" || it.role == "DISTRICT_MENTOR" || it.role == "LODGE_REVIEWER" || it.role == "LODGE_ADMIN" } -> MentorVerificationScreen(
                                user = user,
                                queue = mentorState.queue,
                                lastDecision = mentorState.lastDecision,
                                error = authState.error ?: mentorState.error,
                                onRefreshQueue = mentorVm::refreshQueue,
                                onVerify = mentorVm::verify,
                                onReject = mentorVm::reject,
                                onClarification = mentorVm::requestClarification,
                                onShowProfiles = { currentScreen.value = AppScreen.Profiles },
                                onShowReference = { currentScreen.value = AppScreen.Reference },
                                onSignOut = authVm::signOut,
                            )
                            else -> MyPassportScreen(
                                user = user,
                                passport = passportState.passport,
                                lastMutatedProgress = passportState.lastMutatedProgress,
                                error = authState.error ?: passportState.error,
                                pdfDownloadEnabled = user.brotherProfileId != null && !isDownloadingPdf.value,
                                onRefreshPassport = passportVm::refreshPassport,
                                onUpdateDraft = passportVm::updateDraft,
                                onRespondToClarification = passportVm::respondToClarification,
                                onSubmitProgress = passportVm::submit,
                                onShowProfiles = { currentScreen.value = AppScreen.Profiles },
                                onShowReference = { currentScreen.value = AppScreen.Reference },
                                onDownloadPassportPdf = downloadPassportPdf,
                                onSignOut = authVm::signOut,
                            )
                        }
                    }
                }
            }
        }
    }
}

private inline fun <reified T : ViewModel> ComponentActivity.vmFactory(crossinline create: () -> T): ViewModelProvider.Factory {
    return object : ViewModelProvider.Factory {
        override fun <VM : ViewModel> create(modelClass: Class<VM>, extras: CreationExtras): VM {
            return create() as VM
        }
    }
}
