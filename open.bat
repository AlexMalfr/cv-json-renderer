@REM This script is used to open the index.html file in Microsoft Edge with specific flags to allow local file access.
@REM Use start-server.bat to start a local server instead for better security.
@SET scriptDir=%~dp0
@SET indexPath=%scriptDir%index.html
@SET userDataDir=%TEMP%\tempUserData
start msedge.exe \
--disable-web-security \
--user-data-dir="%userDataDir%" \
--allow-file-access-from-files \
--disable-extensions \
"%indexPath%"
