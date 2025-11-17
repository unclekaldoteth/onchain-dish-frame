// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  // penting supaya og:image jadi URL absolut
  metadataBase: new URL("https://onchain-dish-frame.vercel.app"),
  title: "Onchain Dish",
  description: "Discover Indonesian dishes, unlocked onchain.",
  openGraph: {
    title: "Onchain Dish · Recipe NFT",
    description: "Mint Indonesian recipes on Base.",
    url: "/",                  // halaman yang di-share
    siteName: "Onchain Dish",
    images: [
      {
        url: "/api/og/rendang", // ini nanti jadi https://onchain-dish-frame.vercel.app/api/og/rendang
        width: 1200,
        height: 630,
        alt: "Rendang Padang recipe NFT card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onchain Dish · Recipe NFT",
    description: "Mint Indonesian recipes on Base.",
    images: ["/api/og/rendang"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
