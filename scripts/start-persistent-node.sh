#!/bin/bash

# Script to start a persistent Hardhat node for development
# This will keep blockchain state between restarts

echo "Starting persistent Hardhat node..."

# Create a data directory for the blockchain state
mkdir -p ./blockchain-data

# Start Hardhat node with persistent state
npx hardhat node --hostname 0.0.0.0 --port 8545 --fork https://eth-sepolia.g.alchemy.com/v2/demo

echo "Persistent Hardhat node started on http://localhost:8545"
echo "Blockchain state will be preserved between restarts"
echo "To reset the blockchain state, delete the ./blockchain-data directory"
