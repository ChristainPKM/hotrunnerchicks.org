@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
if errorlevel 1 goto :error
where git.exe >nul 2>nul
if errorlevel 1 (
  echo Git wurde nicht gefunden. Bitte Git fuer Windows installieren oder zum PATH hinzufuegen.
  goto :failed
)
if not exist "pokemon.html" (
  echo Falscher Projektordner: pokemon.html fehlt.
  goto :failed
)
if not exist "js\liga-daten.js" (
  echo Falscher Projektordner: js\liga-daten.js fehlt.
  goto :failed
)
git rev-parse --show-toplevel >nul 2>nul
if errorlevel 1 (
  echo Dieser Ordner ist kein Git-Repository.
  goto :failed
)
set "REPO_PREFIX="
for /f "delims=" %%R in ('git rev-parse --show-prefix') do set "REPO_PREFIX=%%R"
if defined REPO_PREFIX (
  echo Falsches Repository: Die Startdatei muss im Hauptordner des Projekts liegen.
  goto :failed
)
git status
if errorlevel 1 goto :error
set "HAS_CHANGES="
for /f "delims=" %%L in ('git status --porcelain --untracked-files^=all') do set "HAS_CHANGES=1"
if not defined HAS_CHANGES (
  echo Keine Änderungen zum Veröffentlichen vorhanden.
  goto :done
)
echo.
echo Folgende Änderungen stehen zur Veröffentlichung an:
git status --short
if errorlevel 1 goto :error
choice /C JN /N /M "Änderungen auf GitHub veröffentlichen? [J/N] "
if errorlevel 2 (
  echo Abgebrochen. Keine Änderungen vorgenommen.
  goto :done
)
if errorlevel 1 goto :stage
goto :failed
:stage
git add .
if errorlevel 1 goto :error
echo.
echo Tatsächlich für den Commit vorgemerkte Dateien:
git diff --cached --name-status
if errorlevel 1 goto :error
rem Auch versehentlich bereits versionierte lokale Dateien muessen blockiert werden.
git diff --cached --quiet -- ":(icase)liga-verwaltung.html" ":(icase)js/liga-verwaltung.js" ":(icase)js/liga-zuordnung.js" ":(icase)js/archive/"
if errorlevel 2 goto :error
if errorlevel 1 (
  echo WARNUNG: Lokale Verwaltungs-, Zuordnungs- oder Archivdateien sind vorgemerkt!
  echo Abbruch vor dem Commit. Bitte die vorgemerkten Dateien und .gitignore pruefen.
  goto :failed
)
git diff --cached --quiet
if errorlevel 2 goto :error
if not errorlevel 1 (
  echo Keine Änderungen zum Veröffentlichen vorhanden.
  goto :done
)
git commit -m "Pokemon Liga aktualisiert"
if errorlevel 1 goto :error
git push
if errorlevel 1 (
  echo Push fehlgeschlagen. Der lokale Commit bleibt erhalten.
  echo Bitte Git-Verbindung und Authentifizierung pruefen. Kein automatischer neuer Commit.
  goto :failed
)
echo Website erfolgreich auf GitHub veröffentlicht.
echo Die Aktualisierung von GitHub Pages kann einen Moment dauern.
goto :done
:error
echo Git-Fehler: Vorgang abgebrochen. Bitte die Fehlermeldung oben pruefen.
:failed
pause
exit /b 1
:done
pause
exit /b 0