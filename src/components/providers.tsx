
'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ApplicationsProvider } from '@/contexts/ApplicationsContext';
import { JobsProvider } from '@/contexts/JobsContext';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';



const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    // Define a localhost chain that matches the running Hardhat node (chainId 1337)
    const localhost1337 = defineChain({
      id: 1337,
      name: 'Localhost',
      network: 'localhost',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
        public: { http: ['http://127.0.0.1:8545'] },
      },
    });

    const hasWcProjectId = Boolean(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);
    const [config] = React.useState(() => {
      if (hasWcProjectId) {
        return getDefaultConfig({
          appName: 'Ethlance',
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          chains: [sepolia, mainnet, localhost1337],
          ssr: true,
          transports: {
            [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
            [mainnet.id]: http(),
            [localhost1337.id]: http('http://127.0.0.1:8545'),
          },
        });
      }
      return createConfig({
        chains: [localhost1337, sepolia, mainnet],
        connectors: [injected()],
        ssr: true,
        transports: {
          [localhost1337.id]: http('http://127.0.0.1:8545'),
          [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
          [mainnet.id]: http(),
        },
      });
    });

  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <AuthProvider>
              <JobsProvider>
                <ApplicationsProvider>
                  {children}
                </ApplicationsProvider>
              </JobsProvider>
            </AuthProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
