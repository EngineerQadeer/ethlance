# PowerShell script to start Firebase emulator for local development
# This will prevent Firebase connection errors during development

Write-Host "Starting Firebase emulator..." -ForegroundColor Green

# Check if Firebase CLI is installed
try {
    firebase --version | Out-Null
    Write-Host "Firebase CLI found" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Start Firebase emulator
Write-Host "Starting Firestore emulator on port 8080..." -ForegroundColor Yellow
firebase emulators:start --only firestore --project demo-ethlance

Write-Host "Firebase emulator started successfully!" -ForegroundColor Green
Write-Host "Firestore emulator is running on http://localhost:8080" -ForegroundColor Cyan
Write-Host "You can now run your Next.js app without Firebase connection errors" -ForegroundColor Cyan
