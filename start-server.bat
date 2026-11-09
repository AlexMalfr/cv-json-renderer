@echo off
cd /d "%~dp0" || exit /b 1
start "" http://127.0.0.1:8080/
python -m http.server 8080 --bind 127.0.0.1
