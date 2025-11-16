"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/app/components/ui/card";
import { DISHES } from "@/lib/dishes";

export default function FramePage() {
  const router = useRouter();
  const { address } = useAccount();
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  // Baca semua resep yang sudah ke-unlock untuk wallet ini dari localStorage
  useEffect(() => {
    if (!address) {
      setUnlockedIds([]);
      return;
    }

    if (typeof window === "undefined") return;

    const prefix = `onchain-dish::${address.toLowerCase()}::`;
    const ids: string[] = [];

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (!key.startsWith(prefix)) continue;

      const value = window.localStorage.getItem(key);
      if (value === "unlocked") {
        const dishId = key.slice(prefix.length);
        ids.push(dishId);
      }
    }

    setUnlockedIds(ids);
  }, [address]);

  const unlockedSet = new Set(unlockedIds);

  return (
    <main className="min-h-screen px-4 py-6">
      <header className="mb-4 space-y-1">
        <h1 className="text-xl font-semibold">Choose your next dish</h1>
        <p className="text-xs text-muted-foreground">
          Pick any Indonesian dish below. Unlock the recipe with a tiny onchain
          fee and mint it into your onchain kitchen.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DISHES.map((dish) => {
          const isUnlocked = unlockedSet.has(dish.id);

          return (
            <Card
              key={dish.id}
              onClick={() => router.push(`/frame/list/${dish.id}`)}
              className="overflow-hidden cursor-pointer hover:border-blue-500 transition bg-white text-slate-900 shadow-sm"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <CardContent className="space-y-2 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">{dish.title}</h2>
                  <span
                    className={`text-[10px] rounded-full border px-2 py-0.5 ${
                      isUnlocked
                        ? "bg-green-50 text-green-700 border-green-200"
                        : ""
                    }`}
                  >
                    {isUnlocked ? "Unlocked" : dish.rarity}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  {dish.tagline}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{dish.region}</span>
                  <span className="underline">
                    {isUnlocked ? "Open recipe →" : "View dish →"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <footer className="mt-6 text-[11px] text-muted-foreground">
        Cards marked <span className="font-semibold">Unlocked</span> are already
        minted into your onchain kitchen with this wallet.
      </footer>
    </main>
  );
}
