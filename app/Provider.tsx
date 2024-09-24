"use client";
import { RecoilRoot } from "recoil";

import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  seiDevnet,
  sepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { CreateConnector } from "../node_modules/@rainbow-me/rainbowkit/dist/wallets/Wallet";
import {
  connectorsForWallets,
  getDefaultConfig,
  getDefaultWallets,
  RainbowKitProvider,
  Wallet,
  WalletDetailsParams,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { createConnector, createConfig, http } from "wagmi";
import { useEffect, useState } from "react";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

// const { wallets } = getDefaultWallets();
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [seifWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    projectId: "RWE",
    appName: "My RainbowKit App",
  },
);

const config = getDefaultConfig({
  // wallets: [...wallets],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [seifWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  // chains: [mainnet, polygon, optimism, arbitrum, base, seiDevnet],
  chains: [base],
  ssr: true,
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
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    );
  }, []);

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator && navigator.userAgent,
    );
  }

  const wagmiWallets = [
    walletConnect({
      projectId: "RWE",
      metadata: {
        name: "xxxx",
        description: "xxxx",
        url: "https://xxxx.ai/",
        icons: [""],
      },
    }),
    metaMask(),
  ];

  const wagmiConfig = createConfig({
    connectors: wagmiWallets,
    chains: [base],
    transports: {
      [base.id]: http(""),
    },
  });

  return (
    <RecoilRoot>
      <WagmiProvider config={isMobile ? wagmiConfig : config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </RecoilRoot>
  );
}
