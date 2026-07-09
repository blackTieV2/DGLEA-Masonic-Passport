package com.dglea.passport

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.CreationExtras
import com.dglea.passport.data.AppContainer
import com.dglea.passport.ui.AuthViewModel
import com.dglea.passport.ui.MentorViewModel
import com.dglea.passport.ui.PassportViewModel
import com.dglea.passport.ui.screens.ConnectScreen
import com.dglea.passport.ui.screens.MentorVerificationScreen
import com.dglea.passport.ui.screens.MyPassportScreen

class MainActivity : ComponentActivity() {
    private val container by lazy { AppContainer(this) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val authVm = ViewModelProvider(this, vmFactory { AuthViewModel(container.authRepository) })[AuthViewModel::class.java]
        val passportVm = ViewModelProvider(this, vmFactory { PassportViewModel(container.passportRepository) })[PassportViewModel::class.java]
        val mentorVm = ViewModelProvider(this, vmFactory { MentorViewModel(container.mentorRepository) })[MentorViewModel::class.java]

        setContent {
            MaterialTheme {
                Surface {
                    val authState by authVm.state.collectAsState()
                    val passportState by passportVm.state.collectAsState()
                    val mentorState by mentorVm.state.collectAsState()

                    LaunchedEffect(Unit) {
                        authVm.restoreSessionIfPresent()
                    }

                    LaunchedEffect(authState.user?.id) {
                        val user = authState.user ?: return@LaunchedEffect
                        if (user.roles.any { it.role == "LODGE_MENTOR" || it.role == "DISTRICT_MENTOR" || it.role == "LODGE_REVIEWER" || it.role == "LODGE_ADMIN" }) {
                            mentorVm.refreshQueue()
                        } else {
                            passportVm.refreshPassport()
                        }
                    }

                    if (authState.user == null) {
                        ConnectScreen(
                            loading = authState.loading,
                            error = authState.error,
                            onConnect = authVm::connect,
                        )
                    } else if (authState.user!!.roles.any { it.role == "LODGE_MENTOR" || it.role == "DISTRICT_MENTOR" || it.role == "LODGE_REVIEWER" || it.role == "LODGE_ADMIN" }) {
                        MentorVerificationScreen(
                            user = authState.user!!,
                            queue = mentorState.queue,
                            lastDecision = mentorState.lastDecision,
                            error = authState.error ?: mentorState.error,
                            onRefreshQueue = mentorVm::refreshQueue,
                            onVerify = mentorVm::verify,
                            onReject = mentorVm::reject,
                            onClarification = mentorVm::requestClarification,
                            onSignOut = authVm::signOut,
                        )
                    } else {
                        MyPassportScreen(
                            user = authState.user!!,
                            passport = passportState.passport,
                            lastMutatedProgress = passportState.lastMutatedProgress,
                            error = authState.error ?: passportState.error,
                            onRefreshPassport = passportVm::refreshPassport,
                            onUpdateDraft = passportVm::updateDraft,
                            onRespondToClarification = passportVm::respondToClarification,
                            onSubmitProgress = passportVm::submit,
                            onSignOut = authVm::signOut,
                        )
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
