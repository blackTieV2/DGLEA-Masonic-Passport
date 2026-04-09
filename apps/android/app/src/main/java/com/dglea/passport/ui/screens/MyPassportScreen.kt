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
import com.dglea.passport.network.PassportRecordDto
import com.dglea.passport.network.BrotherPassportSummaryDto
import com.dglea.passport.network.UserDto

@Composable
fun MyPassportScreen(
    user: UserDto,
    summary: BrotherPassportSummaryDto?,
    lastRecord: PassportRecordDto?,
    error: String?,
    onLoadSummary: (memberProfileId: String) -> Unit,
    onCreateDraft: (memberProfileId: String, districtId: String, lodgeId: String, sectionTemplateId: String, templateItemId: String, note: String?) -> Unit,
    onSubmitDraft: () -> Unit,
    onSignOut: () -> Unit,
) {
    val memberProfileId = remember { mutableStateOf("mp_1") }
    val districtId = remember { mutableStateOf("dist_1") }
    val lodgeId = remember { mutableStateOf("lodge_1") }
    val sectionTemplateId = remember { mutableStateOf("sec_1") }
    val templateItemId = remember { mutableStateOf("ti_1") }
    val note = remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("Signed in: ${user.displayName} (${user.email})")
        Text("My Passport Summary (Brother)")
        Text("Latest record status: ${lastRecord?.status ?: "none"}")

        Button(onClick = onSignOut, modifier = Modifier.padding(top = 8.dp)) { Text("Sign Out") }

        OutlinedTextField(memberProfileId.value, { memberProfileId.value = it }, label = { Text("Member Profile Id") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(districtId.value, { districtId.value = it }, label = { Text("District Id") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(lodgeId.value, { lodgeId.value = it }, label = { Text("Lodge Id") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(sectionTemplateId.value, { sectionTemplateId.value = it }, label = { Text("Section Template Id") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(templateItemId.value, { templateItemId.value = it }, label = { Text("Template Item Id") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(note.value, { note.value = it }, label = { Text("Note") }, modifier = Modifier.fillMaxWidth())

        Button(onClick = { onLoadSummary(memberProfileId.value) }, modifier = Modifier.padding(top = 8.dp)) {
            Text("Refresh Summary")
        }

        summary?.sections?.forEach { section ->
            Text(
                text = "${section.sectionName} (${section.sectionCode}) • ${section.progressState}" +
                  (section.latestStatus?.let { " • latest: $it" } ?: "") +
                  (section.pendingAction?.let { " • action: $it" } ?: ""),
                modifier = Modifier.padding(top = 4.dp),
            )
        }

        Button(
            onClick = {
                onCreateDraft(
                    memberProfileId.value,
                    districtId.value,
                    lodgeId.value,
                    sectionTemplateId.value,
                    templateItemId.value,
                    note.value.ifBlank { null },
                )
            },
            modifier = Modifier.padding(top = 12.dp),
        ) { Text("Create Draft") }

        Button(onClick = onSubmitDraft, modifier = Modifier.padding(top = 8.dp)) { Text("Submit Draft") }

        if (!error.isNullOrBlank()) {
            Text(text = error, modifier = Modifier.padding(top = 8.dp))
        }
    }
}
