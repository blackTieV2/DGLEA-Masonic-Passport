@ECHO OFF
REM Lightweight wrapper for environments where committing binary wrapper JARs is disallowed.
WHERE gradle >NUL 2>NUL
IF %ERRORLEVEL% EQU 0 (
  gradle %*
  EXIT /B %ERRORLEVEL%
)
ECHO Gradle executable not found. Install Gradle or regenerate wrapper jar via: gradle wrapper
EXIT /B 1
