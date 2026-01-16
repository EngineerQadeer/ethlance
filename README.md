# Ethlance

A decentralized job marketplace built on Ethereum. This platform connects freelancers with employers through blockchain technology, ensuring transparent and secure transactions.

## Features

- **Web3 Authentication** - Wallet-based login using MetaMask and RainbowKit
- **Smart Contracts** - Job postings and transactions handled on-chain via Solidity
- **Modern Interface** - Clean UI built with Shadcn UI and Tailwind CSS
- **AI Integration** - Powered by Google Genkit for intelligent features
- **Real-time Updates** - Instant job listing updates using React Query

## Tech Stack

**Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS, Shadcn UI

**Blockchain:** Wagmi v2, RainbowKit, Solidity 0.8.28, Hardhat

**Backend & Services:** Firebase, Google Genkit AI, Zod, React Hook Form

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MetaMask browser extension
- Git

### Installation

```bash
git clone https://github.com/EngineerQadeer/ethlance.git
cd ethlance
npm install
```

### Running Locally

1. **Start the local blockchain:**
   ```bash
   npm run chain
   ```
   Keep this terminal running.

2. **Deploy the smart contract:**
   ```bash
   npx hardhat --network localhost run scripts/deploy.ts
   ```
   Note the deployed contract address.

3. **Configure environment:**
   
   Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
   NEXT_PUBLIC_RPC_URL=
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:9002

5. **Configure MetaMask:**
   - Network Name: Localhost
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

   Test account private key (local development only):
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

## Usage

| Route | Description |
|-------|-------------|
| `/jobs` | Browse all available job listings |
| `/admin/jobs/new` | Create a new job posting (requires admin) |
| `/login` | Admin login with `admin` / `admin` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 9002 |
| `npm run chain` | Start local Hardhat blockchain |
| `npm run build` | Build for production |
| `npm run test` | Run test suite |
| `npm run lint` | Run code linting |

## Sepolia Testnet

To deploy on Sepolia testnet:

1. Set your environment variables:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_key
   ```

2. Set your private key:
   ```bash
   setx PRIVATE_KEY 0xYourPrivateKey
   ```

3. Deploy:
   ```bash
   npx hardhat --network sepolia run scripts/deploy.ts
   ```

## Troubleshooting

- **Port 8545 in use:** A Hardhat node is already running. Use the existing instance.
- **Port 9002 in use:** Close any running Next.js instances.
- **MetaMask network warning:** Make sure Chain ID is set to 1337.
- **Contract address changed:** Re-deploy and update your `.env.local` file.

## Project Structure

```
ethlance/
├── contracts/        # Solidity smart contracts
├── scripts/          # Deployment scripts
├── src/
│   ├── app/          # Next.js pages
│   ├── components/   # React components
│   ├── ai/           # AI integrations
│   └── lib/          # Utilities
├── typechain-types/  # Generated contract types
└── hardhat.config.ts
```

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request.

## License

MIT License

---

## Author

**Engineer Qadeer**

- GitHub: https://github.com/EngineerQadeer
- LinkedIn: https://linkedin.com/in/EngineerQadeer
- Facebook: https://facebook.com/Engineer.Qadeer
- Instagram: https://instagram.com/Engineer.Qadeer
- YouTube: https://youtube.com/@Engineer.Qadeer
