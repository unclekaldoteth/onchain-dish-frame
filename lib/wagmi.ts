// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

// Untuk prototyping sekarang kita pakai Base Sepolia (testnet).
// Nanti kalau mau ke mainnet, ganti saja baseSepolia -> base di sini.

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    // 1. Farcaster Mini App Wallet (Warpcast / Base App)
    farcasterMiniApp(),
    // 2. Fallback untuk dev di browser biasa (MetaMask, OKX, dsb)
    injected(),
  ],
  // Biar ga bentrok multi injected provider
  multiInjectedProviderDiscovery: false,
});
