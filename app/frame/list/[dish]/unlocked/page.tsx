"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { DISHES } from "@/lib/dishes";
import { Button } from "@/app/components/ui/button";

export default function UnlockedRecipePage() {
  const params = useParams();
  const dishKey = (params?.dish as string) || "";
  const router = useRouter();

  const { address } = useAccount();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const dish = DISHES.find((d) => d.id === dishKey);

  const unlockKey = useMemo(() => {
    if (!address) return null;
    return `onchain-dish::${address.toLowerCase()}::${dishKey}`;
  }, [address, dishKey]);

  // cek status unlocked dari localStorage
  useEffect(() => {
    if (!unlockKey || typeof window === "undefined") {
      setIsChecking(false);
      return;
    }

    const value = window.localStorage.getItem(unlockKey);
    if (value === "unlocked") {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, [unlockKey]);

  if (!dish) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          This dish is not available.
        </p>
      </main>
    );
  }

  if (!address || (!isUnlocked && !isChecking)) {
    return (
      <main className="min-h-screen px-4 py-6 flex justify-center">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-xl font-semibold">Recipe locked</h1>
          <p className="text-xs text-muted-foreground">
            Connect your wallet and mint this recipe to unlock the full
            step-by-step instructions for {dish.title}.
          </p>
          <Button onClick={() => router.push(`/frame/list/${dishKey}/connect`)}>
            Connect wallet & mint recipe
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* HERO RECIPE CARD */}
        <section className="rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 bg-white">
          <div className="sm:w-1/2 overflow-hidden rounded-xl">
            <img
              src={dish.image}
              alt={dish.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="sm:w-1/2 space-y-2">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
              Indonesian dish · Unlocked
            </span>
            <h1 className="text-xl font-semibold">{dish.title}</h1>
            <p className="text-xs text-slate-600">{dish.description}</p>
            <p className="text-[11px] text-slate-500">{dish.region}</p>
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Ingredients</h2>
          <p className="text-[11px] text-muted-foreground">
            Prep these ingredients before you start cooking. Quantities are
            designed for 2–3 portions; adjust up or down as needed.
          </p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            {dish.ingredients?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            )) || <li>Ingredients coming soon.</li>}
          </ul>
        </section>

        {/* STEPS */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Steps</h2>
          <p className="text-[11px] text-muted-foreground">
            Follow these steps from prep to plating. Take your time — Indonesian
            dishes are meant to be cooked with patience.
          </p>
          <ol className="text-xs space-y-2 list-decimal list-inside">
            {dish.steps?.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            )) || <li>Steps coming soon.</li>}
          </ol>
        </section>

        {/* ONCHAIN TIP */}
        <section className="space-y-2 border rounded-2xl p-3 bg-slate-50">
          <h2 className="text-sm font-semibold">Onchain tip</h2>
          <p className="text-[11px] text-slate-600">
            This recipe lives in your wallet as an onchain recipe NFT. The more
            dishes you mint, the bigger your onchain kitchen becomes — from home
            cook to full-on warung owner.
          </p>
        </section>
      </div>
    </main>
  );
}
