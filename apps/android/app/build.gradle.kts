plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// google-services.json is environment-specific and intentionally not committed.
// The plugin is applied only when the file is present locally (see README.md).
val googleServicesJson = file("google-services.json")
if (googleServicesJson.exists()) {
    apply(plugin = "com.google.gms.google-services")
}

android {
    namespace = "com.dglea.passport"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.dglea.passport"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "0.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        register("release") {
            // Release signing credentials are supplied at build time via environment variables
            // or Gradle project properties. They are never committed to the repository.
            val keystorePath = providers.environmentVariable("DGLEA_ANDROID_KEYSTORE_PATH").orNull
                ?: findProperty("dglea.android.keystorePath") as? String
            val keystorePassword = providers.environmentVariable("DGLEA_ANDROID_KEYSTORE_PASSWORD").orNull
                ?: findProperty("dglea.android.keystorePassword") as? String
            val keyAliasValue = providers.environmentVariable("DGLEA_ANDROID_KEY_ALIAS").orNull
                ?: findProperty("dglea.android.keyAlias") as? String
            val keyPasswordValue = providers.environmentVariable("DGLEA_ANDROID_KEY_PASSWORD").orNull
                ?: findProperty("dglea.android.keyPassword") as? String

            if (!keystorePath.isNullOrBlank() &&
                !keystorePassword.isNullOrBlank() &&
                !keyAliasValue.isNullOrBlank() &&
                !keyPasswordValue.isNullOrBlank()
            ) {
                storeFile = file(keystorePath)
                storePassword = keystorePassword
                keyAlias = keyAliasValue
                keyPassword = keyPasswordValue
            }
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            // Local backend reachable from the Android emulator.
            buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:3000/api/v1/\"")
            buildConfigField("String", "ENVIRONMENT_NAME", "\"debug\"")
            buildConfigField("boolean", "ALLOW_DEV_AUTH", "true")
        }
        register("staging") {
            isDebuggable = true
            // Placeholder until a real staging backend URL is provisioned.
            // Replace the host before distributing a staging build.
            buildConfigField("String", "API_BASE_URL", "\"https://REPLACE-WITH-STAGING-BACKEND.invalid/api/v1/\"")
            buildConfigField("String", "ENVIRONMENT_NAME", "\"staging\"")
            buildConfigField("boolean", "ALLOW_DEV_AUTH", "false")
            matchingFallbacks += listOf("release")
        }
        release {
            isMinifyEnabled = false
            isDebuggable = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Placeholder until the production backend URL is approved and provisioned.
            // Release builds must never point to localhost or emulator hosts.
            buildConfigField("String", "API_BASE_URL", "\"https://REPLACE-WITH-PRODUCTION-BACKEND.invalid/api/v1/\"")
            buildConfigField("String", "ENVIRONMENT_NAME", "\"release\"")
            buildConfigField("boolean", "ALLOW_DEV_AUTH", "false")
            // Apply release signing only when credentials are supplied. Without them,
            // assembleRelease produces an unsigned APK safely instead of failing.
            signingConfig = signingConfigs.findByName("release")?.takeIf { it.storeFile != null }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")
    implementation("androidx.activity:activity-compose:1.9.1")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.4")

    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-moshi:2.11.0")
    implementation("com.squareup.moshi:moshi-kotlin:1.15.1")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.8.1")

    // Firebase SDK scaffolding. Sign-in behaviour is added in slice 16B.
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth")

    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
}
