"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { type Chain } from "viem";

export const seiv2test = {
  id: 713715,
  name: "Sei EVM Devnet",
  nativeCurrency: { name: "SEI", symbol: " SEI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evm-rpc-arctic-1.sei-apis.com"] },
  },
  blockExplorers: {
    default: { name: "Seistream", url: "https://seistream.app/" },
  },
  contracts: {},
} as const satisfies Chain;

export default function Provider({ children }: { children: React.ReactNode }) {
  const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains: [mainnet, polygon, optimism, arbitrum, base, seiv2test],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children} </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
