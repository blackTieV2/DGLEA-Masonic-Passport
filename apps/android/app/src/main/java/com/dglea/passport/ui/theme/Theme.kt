package com.dglea.passport.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    primary = DgleaPassportColor.primary,
    onPrimary = DgleaPassportColor.onPrimary,
    primaryContainer = DgleaPassportColor.primaryContainer,
    onPrimaryContainer = DgleaPassportColor.onPrimaryContainer,
    secondary = DgleaPassportColor.secondary,
    onSecondary = DgleaPassportColor.onSecondary,
    background = DgleaPassportColor.background,
    surface = DgleaPassportColor.surface,
    onSurface = DgleaPassportColor.onSurface,
    onSurfaceVariant = DgleaPassportColor.onSurfaceVariant,
    outline = DgleaPassportColor.outline,
    error = DgleaPassportColor.error,
)

private val DarkColorScheme = darkColorScheme(
    primary = DgleaPassportColor.primaryContainer,
    onPrimary = DgleaPassportColor.onPrimaryContainer,
    primaryContainer = DgleaPassportColor.primary,
    onPrimaryContainer = DgleaPassportColor.onPrimary,
    secondary = DgleaPassportColor.secondary,
    onSecondary = DgleaPassportColor.onSecondary,
    background = DgleaPassportColor.onSurface,
    surface = DgleaPassportColor.onSurfaceVariant,
    onSurface = DgleaPassportColor.background,
    onSurfaceVariant = DgleaPassportColor.surface,
    outline = DgleaPassportColor.outline,
    error = DgleaPassportColor.error,
)

@Composable
fun DgleaPassportTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit,
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = DgleaPassportTypography,
        content = content,
    )
}
