"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { DISHES } from "@/lib/dishes";

type KitchenLevel = {
  label: string;
  description: string;
};

function getKitchenLevel(count: number): KitchenLevel {
  if (count >= 30) {
    return {
      label: "Chef de Onchain",
      description:
        "You’re running a full onchain kitchen with dozens of collected recipes.",
    };
  }
  if (count >= 15) {
    return {
      label: "Warung Owner",
      description:
        "Your onchain kitchen feels like a busy Indonesian warung with regulars.",
    };
  }
  if (count >= 5) {
    return {
      label: "Street Food Hunter",
      description:
        "You collect recipes like late-night street food stops across Indonesia.",
    };
  }
  if (count >= 1) {
    return {
      label: "Home Cook",
      description:
        "Your onchain kitchen just got started with a few favorite dishes.",
    };
  }
  return {
    label: "Empty Pantry",
    description: "Mint your first recipe to start your onchain kitchen.",
  };
}

function getRarityClasses(rarity: string) {
  const r = rarity.toLowerCase();
  if (r.includes("legendary") || r.includes("rare dish")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  if (r.includes("rare")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (r.includes("icon") || r.includes("classic")) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function MintSuccessPage() {
  const params = useParams();
  const dishKey = (params?.dish as string) || "";
  const router = useRouter();

  const { address } = useAccount();
  const [mintedCount, setMintedCount] = useState(0);

  const dish = DISHES.find((d) => d.id === dishKey);

  // Hitung berapa recipe NFT yang sudah dimint wallet ini (dari localStorage)
  useEffect(() => {
    if (!address || typeof window === "undefined") {
      setMintedCount(0);
      return;
    }

    const prefix = `onchain-dish::${address.toLowerCase()}::`;
    let count = 0;

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (!key.startsWith(prefix)) continue;

      const value = window.localStorage.getItem(key);
      if (value === "unlocked") {
        count++;
      }
    }

    setMintedCount(count);
  }, [address]);

  if (!dish) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          This dish is not available.
        </p>
      </main>
    );
  }

  const kitchenLevel = getKitchenLevel(mintedCount);
  const displayCount = Math.max(1, mintedCount);
  const rarityClasses = getRarityClasses(dish.rarity);

    const shareOnFarcaster = () => {
  if (typeof window === "undefined") return;

  const origin = window.location.origin; // contoh: http://localhost:3000 atau https://onchaindish.app
  const appUrl = origin; // nanti otomatis ikut domain production

  const text = `I just minted the ${dish.title} recipe NFT into my onchain kitchen 🍛

Mint your own Indonesian dish and start your onchain kitchen: ${appUrl}`;

  const imageUrl = `${origin}/api/og/${dish.id}`;

  const url =
    "https://warpcast.com/~/compose?text=" +
    encodeURIComponent(text) +
    "&embeds[]=" +
    encodeURIComponent(imageUrl);

  window.open(url, "_blank");
};



  return (
    <main className="min-h-screen px-4 py-6 flex justify-center">
      <div className="max-w-md w-full space-y-6">
        {/* HEADER */}
        <header className="space-y-2 text-center">
          <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] uppercase tracking-wide bg-slate-50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Onchain kitchen · Mint successful
          </span>
          <h1 className="text-xl font-semibold">
            You just minted {dish.title} as a recipe NFT
          </h1>
          <p className="text-xs text-muted-foreground">
            This dish is now part of your onchain kitchen. Flex the NFT on
            Farcaster, open the full recipe, or mint another Indonesian dish.
          </p>
        </header>

        {/* NFT PREVIEW CARD – marketplace-ish */}
        <section className="space-y-3">
          <div className="rounded-2xl p-3 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-lg">
            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              {/* Top strip */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/70">
                <span className="text-[10px] font-medium tracking-wide text-slate-200 uppercase">
                  Onchain Dish · Recipe NFT
                </span>
                <span className="text-[10px] text-slate-400">
                  Network: Base (testnet)
                </span>
              </div>

              {/* Image */}
              <div className="h-40 w-full overflow-hidden relative">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-300 uppercase tracking-wide">
                      {dish.region}
                    </p>
                    <p className="text-sm font-semibold text-slate-50">
                      {dish.title}
                    </p>
                  </div>
                  <span
                    className={
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium " +
                      rarityClasses
                    }
                  >
                    {dish.rarity}
                  </span>
                </div>
              </div>

              {/* Metadata row */}
              <div className="px-3 py-2 border-t border-slate-700/70 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex flex-col">
                  <span className="text-slate-400">Collection</span>
                  <span>Onchain Kitchen</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-400">Recipes minted</span>
                  <span>
                    {displayCount} recipe{displayCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* KITCHEN LEVEL SUMMARY */}
          <div className="border rounded-2xl p-3 space-y-1 bg-slate-50">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">
              Your onchain kitchen
            </p>
            <p className="text-sm font-semibold">{kitchenLevel.label}</p>
            <p className="text-[11px] text-slate-600">
              {kitchenLevel.description}
            </p>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <section className="space-y-2">
          <Button
            className="w-full"
            variant="outline"
            onClick={shareOnFarcaster}
          >
            Share this NFT on Farcaster
          </Button>
          <Button
            className="w-full"
            onClick={() =>
              router.push(`/frame/list/${dishKey}/unlocked`)
            }
          >
            Open recipe & start cooking
          </Button>
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => router.push("/frame")}
          >
            Mint another recipe
          </Button>
        </section>
      </div>
    </main>
  );
}
