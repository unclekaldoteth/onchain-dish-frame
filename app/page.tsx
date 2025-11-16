"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { DISHES } from "@/lib/dishes";
import { Button } from "./components/ui/button";

const FEATURED_IDS = [
  "rendang",
  "nasigoreng",
  "sotoayam",
  "rawon",
  "cotomakassar",
  "pempek",
];

export default function HomePage() {
  const { address } = useAccount();
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});

  const featuredDishes = useMemo(
    () => DISHES.filter((d) => FEATURED_IDS.includes(d.id)),
    []
  );

  // baca status unlocked dari localStorage untuk wallet ini
  useEffect(() => {
    if (!address || typeof window === "undefined") {
      setUnlockedMap({});
      return;
    }

    const prefix = `onchain-dish::${address.toLowerCase()}::`;
    const map: Record<string, boolean> = {};

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (!key.startsWith(prefix)) continue;

      const value = window.localStorage.getItem(key);
      if (value === "unlocked") {
        const dishId = key.slice(prefix.length);
        map[dishId] = true;
      }
    }

    setUnlockedMap(map);
  }, [address]);

  return (
    <main className="min-h-screen px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-10">
        {/* HERO */}
        <section className="text-center space-y-4">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-wide">
            Mini app · Built on Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
            Discover Indonesian dishes, <br />
            unlocked onchain.
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Browse Indonesia&apos;s most iconic recipes — from rendang to
            pempek. Unlock full recipes with a tiny onchain tip and support
            local cooks on Base.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
           <Link href="/frame">
            <Button className="px-6">Browse Indonesian dishes</Button>
           </Link>
            <p className="text-xs text-muted-foreground">
              No sign-up. Just food + onchain.
            </p>
          </div>

        </section>

        {/* FEATURED DISHES */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium text-left">
            A few dishes you can unlock
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDishes.map((dish) => {
              const isUnlocked = !!unlockedMap[dish.id];

              return (
                <Link
                  key={dish.id}
                  href={`/frame/list/${dish.id}`}
                  className="group rounded-2xl border bg-white hover:border-blue-500/70 transition overflow-hidden flex flex-col"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                    {isUnlocked && (
                      <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <div className="flex-1 p-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      Indonesian dish
                    </p>
                    <p className="text-sm font-semibold">{dish.title}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {dish.description}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {dish.region}
                    </p>
                    <span className="inline-flex items-center text-[11px] text-blue-600 mt-2">
                      View details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
