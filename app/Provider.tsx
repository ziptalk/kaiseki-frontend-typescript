"use client";
import { RecoilRoot } from "recoil";

import { WagmiProvider } from "wagmi";
// import {
//   mainnet,
//   polygon,
//   optimism,
//   arbitrum,
//   base,
//   seiDevnet,
//   sepolia,
// } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CreateConnector } from "../node_modules/@rainbow-me/rainbowkit/dist/wallets/Wallet";
import {
  Chain,
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
  Wallet,
  WalletDetailsParams,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { injected } from "wagmi/connectors";
import { createConnector } from "wagmi";
import { useEffect } from "react";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const { wallets } = getDefaultWallets();

const kaiaKairosTestnet = {
  rpcUrls: { default: { http: ["https://public-en-kairos.node.kaia.io"] } },
  id: 1001,
  name: "Kaia Kairos Testnet",
  nativeCurrency: {
    decimals: 9,
    name: "Kairos",
    symbol: "Kairos",
  },
  // accounts: [process.env.TEST_PRIVATE_KEY],
} as const satisfies Chain;

const config = getDefaultConfig({
  // wallets: [...wallets],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [seifWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  appName: "Kaiseki",
  projectId: "989ce3beb9f7f418fb1a2e5dbf8183dd",
  // chains: [mainnet, polygon, optimism, arbitrum, base, seiDevnet],
  chains: [kaiaKairosTestnet],
  // ssr: true,
});

const queryClient = new QueryClient();

// config와 queryClient를 Provider 바깥으로 호이스팅!!

function getExplicitInjectedProvider() {
  if (typeof window === "undefined") return;
  if (window.ethereum && window.ethereum["__seif"]) {
    return window.ethereum;
  }

  if ((window as any)["__seif"]) {
    return (window as any)["__seif"];
  }

  return undefined;
}

function createInjectedConnector(provider?: any): CreateConnector {
  return (walletDetails: WalletDetailsParams) => {
    // Create the injected configuration object conditionally based on the provider.
    const injectedConfig = provider
      ? {
          target: () => ({
            id: walletDetails.rkDetails.id,
            name: walletDetails.rkDetails.name,
            provider,
          }),
        }
      : {};

    return createConnector((config) => ({
      // Spread the injectedConfig object, which may be empty or contain the target function
      ...injected(injectedConfig)(config),
      ...walletDetails,
    }));
  };
}

function seifWallet(): Wallet {
  const injectedProvider = getExplicitInjectedProvider();
  return {
    id: "seif",
    name: "Seif",
    installed: !!injectedProvider,
    iconUrl: "https://wallet-edge.vercel.app/static/SeifIcon.svg",
    iconBackground: "#fff",
    downloadUrls: {
      chrome:
        "https://chromewebstore.google.com/detail/seif/albakdmmdafeafbehmcpoejenbeojejl",
    },
    createConnector: createInjectedConnector(injectedProvider),
    rdns: "com.passkeywallet.seif",
  };
}

export default function Provider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.addEventListener("eip6963:announceProvider", (event: any) => {
      const announcedProvider = {
        ...event.detail,
        connected: false,
        accounts: [],
      };
      // console.log(announcedProvider);
    });
  }, []);

  return (
    <RecoilRoot>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  );
}
