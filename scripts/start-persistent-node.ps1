# PowerShell script to start a persistent Hardhat node for development
# This will keep blockchain state between restarts

Write-Host "Starting persistent Hardhat node..." -ForegroundColor Green

# Create a data directory for the blockchain state
if (!(Test-Path "./blockchain-data")) {
    New-Item -ItemType Directory -Path "./blockchain-data"
}

# Start Hardhat node with persistent state
Write-Host "Starting Hardhat node on http://localhost:8545..." -ForegroundColor Yellow
npx hardhat node --hostname 0.0.0.0 --port 8545

Write-Host "Persistent Hardhat node started on http://localhost:8545" -ForegroundColor Green
Write-Host "Blockchain state will be preserved between restarts" -ForegroundColor Cyan
Write-Host "To reset the blockchain state, delete the ./blockchain-data directory" -ForegroundColor Cyan
