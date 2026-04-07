package com.dglea.passport

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewmodel.CreationExtras
import com.dglea.passport.data.AppContainer
import com.dglea.passport.ui.AuthViewModel
import com.dglea.passport.ui.PassportViewModel
import com.dglea.passport.ui.screens.MyPassportScreen
import com.dglea.passport.ui.screens.SignInScreen

class MainActivity : ComponentActivity() {
    private val container by lazy { AppContainer(this, baseUrl = "http://10.0.2.2:3000/") }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val authVm = ViewModelProvider(this, vmFactory { AuthViewModel(container.authRepository) })[AuthViewModel::class.java]
        val passportVm = ViewModelProvider(this, vmFactory { PassportViewModel(container.passportRepository) })[PassportViewModel::class.java]

        setContent {
            MaterialTheme {
                Surface {
                    val authState by authVm.state.collectAsState()
                    val passportState by passportVm.state.collectAsState()

                    if (authState.user == null) {
                        SignInScreen(
                            onSignIn = authVm::signIn,
                            error = authState.error,
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
