@echo off
cd /d "%~dp0.."
title PentDash (WSL)
echo Starting PentDash inside Windows Subsystem for Linux...
wsl bash -c "./scripts/start.sh"
pause
