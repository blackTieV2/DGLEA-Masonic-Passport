package com.dglea.passport.data

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.core.content.FileProvider
import java.io.File
import java.io.IOException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import com.dglea.passport.network.BackendApi
import com.dglea.passport.network.BrotherProfileDto
import com.dglea.passport.network.CreateBrotherProfileRequest
import com.dglea.passport.network.CreateDegreeProgressRequest
import com.dglea.passport.network.CreateLodgeProfileRequest
import com.dglea.passport.network.DegreeProgressDto
import com.dglea.passport.network.LodgeProfileDto
import com.dglea.passport.network.UpdateBrotherProfileRequest
import com.dglea.passport.network.UpdateDegreeProgressRequest
import com.dglea.passport.network.UpdateLodgeProfileRequest
import com.dglea.passport.network.ReadyForSignOffDegreeProgressRequest
import com.dglea.passport.network.ApproveDegreeProgressRequest
import com.dglea.passport.network.ReopenDegreeProgressRequest

/**
 * Gateway to profile and degree-progress endpoints.
 *
 * NOTE: The authenticated actor identity is determined by the backend session
 * (Firebase token / dev header). The Android client does not send actor IDs or
 * role fields; it relies on the backend guard for permission enforcement.
 */
class ProfilesRepository(
    private val api: BackendApi,
    private val context: Context,
) {
    companion object {
        private const val TAG = "ProfilesRepository"
    }

    // Brother profiles
    suspend fun listBrotherProfiles(): List<BrotherProfileDto> = api.listBrotherProfiles()

    suspend fun createBrotherProfile(request: CreateBrotherProfileRequest): BrotherProfileDto =
        api.createBrotherProfile(request)

    suspend fun getBrotherProfile(id: String): BrotherProfileDto = api.getBrotherProfile(id)

    suspend fun updateBrotherProfile(
        id: String,
        request: UpdateBrotherProfileRequest,
    ): BrotherProfileDto = api.updateBrotherProfile(id, request)

    suspend fun deleteBrotherProfile(id: String) = api.deleteBrotherProfile(id)

    // Lodge profiles
    suspend fun listLodgeProfiles(): List<LodgeProfileDto> = api.listLodgeProfiles()

    suspend fun createLodgeProfile(request: CreateLodgeProfileRequest): LodgeProfileDto =
        api.createLodgeProfile(request)

    suspend fun getLodgeProfile(id: String): LodgeProfileDto = api.getLodgeProfile(id)

    suspend fun updateLodgeProfile(
        id: String,
        request: UpdateLodgeProfileRequest,
    ): LodgeProfileDto = api.updateLodgeProfile(id, request)

    suspend fun deleteLodgeProfile(id: String) = api.deleteLodgeProfile(id)

    // Degree progress
    suspend fun listDegreeProgress(): List<DegreeProgressDto> = api.listDegreeProgress()

    suspend fun createDegreeProgress(request: CreateDegreeProgressRequest): DegreeProgressDto =
        api.createDegreeProgress(request)

    suspend fun getDegreeProgress(id: String): DegreeProgressDto = api.getDegreeProgress(id)

    suspend fun updateDegreeProgress(
        id: String,
        request: UpdateDegreeProgressRequest,
    ): DegreeProgressDto = api.updateDegreeProgress(id, request)

    suspend fun deleteDegreeProgress(id: String) = api.deleteDegreeProgress(id)

    suspend fun markDegreeProgressReadyForSignOff(
        id: String,
        request: ReadyForSignOffDegreeProgressRequest = ReadyForSignOffDegreeProgressRequest(),
    ): DegreeProgressDto = api.readyForSignOffDegreeProgress(id, request)

    suspend fun approveDegreeProgress(
        id: String,
        request: ApproveDegreeProgressRequest = ApproveDegreeProgressRequest(),
    ): DegreeProgressDto = api.approveDegreeProgress(id, request)

    suspend fun reopenDegreeProgress(
        id: String,
        request: ReopenDegreeProgressRequest = ReopenDegreeProgressRequest(),
    ): DegreeProgressDto = api.reopenDegreeProgress(id, request)

    /**
     * Downloads the Passport PDF for the given Brother profile and returns a
     * FileProvider content URI suitable for sharing. The file is written to the
     * app's private cache directory; no storage runtime permission is required.
     *
     * All network and file I/O is performed on [Dispatchers.IO] to avoid
     * [NetworkOnMainThreadException] and jank on the UI thread.
     */
    suspend fun downloadPassportPdf(brotherProfileId: String): Uri = withContext(Dispatchers.IO) {
        val response = api.downloadPassportPdf(brotherProfileId)
        if (!response.isSuccessful) {
            val code = response.code()
            Log.w(TAG, "PDF download returned HTTP $code for brotherProfileId=$brotherProfileId")
            throw IOException("PDF download failed with HTTP $code")
        }
        val body = response.body()
            ?: run {
                Log.w(TAG, "PDF response body was null for brotherProfileId=$brotherProfileId")
                throw IOException("PDF response body was empty")
            }

        val dir = File(context.cacheDir, "passports").apply { mkdirs() }
        val file = File(dir, "passport-$brotherProfileId.pdf")
        if (file.exists() && !file.delete()) {
            Log.w(TAG, "Could not delete existing PDF file, will overwrite: $file")
        }

        body.byteStream().use { input ->
            file.outputStream().use { output ->
                input.copyTo(output)
            }
        }

        val bytesWritten = file.length()
        Log.i(TAG, "Wrote PDF file: $file, size=$bytesWritten bytes")

        FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            file,
        )
    }
}
