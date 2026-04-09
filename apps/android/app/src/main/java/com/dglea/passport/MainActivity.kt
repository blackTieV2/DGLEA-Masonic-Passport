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
import com.dglea.passport.ui.screens.MentorVerificationScreen
import com.dglea.passport.ui.screens.MyPassportScreen
import com.dglea.passport.ui.screens.SignInScreen

class MainActivity : ComponentActivity() {
    private val container by lazy { AppContainer(this, baseUrl = "http://10.0.2.2:3000/") }

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

                    if (authState.user == null) {
                        SignInScreen(
                            onSignIn = authVm::signIn,
                            error = authState.error,
                        )
                    } else if (authState.user!!.roles.any { it == "LODGE_MENTOR" }) {
                        MentorVerificationScreen(
                            user = authState.user!!,
                            queue = mentorState.queue,
                            lastDecision = mentorState.lastDecision,
                            actionNonce = mentorState.actionNonce,
                            error = mentorState.error,
                            onRefreshQueue = mentorVm::refreshQueue,
                            onVerify = mentorVm::verify,
                            onReject = mentorVm::reject,
                            onClarification = mentorVm::requestClarification,
                            onSignOut = authVm::signOut,
                        )
                    } else {
                        MyPassportScreen(
                            user = authState.user!!,
                            summary = passportState.summary,
                            lastRecord = passportState.lastRecord,
                            error = passportState.error,
                            onLoadSummary = passportVm::loadSummary,
                            onCreateDraft = passportVm::createDraft,
                            onSubmitDraft = passportVm::submitLastDraft,
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
