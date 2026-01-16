import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

// Validate PRIVATE_KEY to avoid HH8 when it's present but malformed
const rawPrivateKey = process.env.PRIVATE_KEY || "";
const sanitizedPrivateKey = (() => {
  const key = rawPrivateKey.trim();
  if (!key) return "";
  const without0x = key.startsWith("0x") ? key.slice(2) : key;
  // Expect 32 bytes (64 hex chars)
  const isValidHex = /^[0-9a-fA-F]+$/.test(without0x);
  if (isValidHex && without0x.length === 64) {
    return key.startsWith("0x") ? key : `0x${key}`;
  }
  // If invalid, ignore it to prevent config failure
  return "";
})();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // This is the default network used by `npx hardhat node`
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    // Configuration for the Sepolia testnet
    sepolia: {
      url: process.env.NEXT_PUBLIC_RPC_URL || "",
      accounts: sanitizedPrivateKey ? [sanitizedPrivateKey] : [],
    }
  },
};

export default config;
