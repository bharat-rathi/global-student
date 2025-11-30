@echo off
echo Checking for Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed or not in your PATH.
    echo Please download and install Git from https://git-scm.com/downloads
    echo After installing, restart your terminal or computer.
    pause
    exit /b
)

echo Git found! Updating repository...
git add .
set /p commit_msg="Enter commit message (default: Update): "
if "%commit_msg%"=="" set commit_msg=Update
git commit -m "%commit_msg%"
git push

echo.
echo Done!
pause
