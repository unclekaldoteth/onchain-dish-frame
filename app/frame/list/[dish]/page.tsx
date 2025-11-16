"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/app/components/ui/button";

type DishInfo = {
  title: string;
  origin: string;
  description: string;
  image: string;
};

// hanya dish yang sudah punya resep lengkap
const dishData: Record<string, DishInfo> = {
  rendang: {
    title: "Rendang Padang",
    origin: "West Sumatra",
    description:
      "Slow-cooked beef in coconut milk and spices. A ceremonial dish often called one of the world&apos;s most delicious foods.",
    image: "/images/rendang.jpg",
  },
  nasigoreng: {
    title: "Nasi Goreng Jawa",
    origin: "Java",
    description:
      "Savory fried rice with egg, garlic, shallots, and sweet soy sauce. The classic late-night comfort food.",
    image: "/images/nasigoreng.jpg",
  },
  sotoayam: {
    title: "Soto Ayam",
    origin: "Java",
    description:
      "Bright yellow chicken soup with noodles, herbs, and a squeeze of lime.",
    image: "/images/sotoayam.jpg",
  },
  rawon: {
    title: "Rawon Surabaya",
    origin: "East Java",
    description:
      "Black beef soup flavored with keluak nuts, served with rice and sprouted beans.",
    image: "/images/rawon.jpg",
  },
  cotomakassar: {
    title: "Coto Makassar",
    origin: "South Sulawesi",
    description:
      "Beef and offal soup in a rich peanut and spice broth, traditionally served with ketupat.",
    image: "/images/coto.jpg",
  },
  gudeg: {
    title: "Gudeg Jogja",
    origin: "Yogyakarta",
    description:
      "Young jackfruit stewed slowly in coconut milk and palm sugar, served with egg and spicy krecek.",
    image: "/images/gudeg.jpeg",
  },
  pempek: {
    title: "Pempek Palembang",
    origin: "South Sumatra",
    description:
      "Fried fishcakes made with tapioca, served with tangy, spicy vinegar sauce (cuko).",
    image: "/images/pempek.jpg",
  },
};

export default function DishDetailPage() {
  const params = useParams();
  const dishKey = (params?.dish as string) || "";
  const dishInfo = dishData[dishKey];
  const router = useRouter();

  const { address } = useAccount();
  const [isUnlocked, setIsUnlocked] = useState(false);

  // cek apakah resep ini sudah ke-unlock oleh wallet ini
  useEffect(() => {
    if (!address) {
      setIsUnlocked(false);
      return;
    }
    if (typeof window === "undefined") return;

    const key = `onchain-dish::${address.toLowerCase()}::${dishKey}`;
    const value = window.localStorage.getItem(key);
    setIsUnlocked(value === "unlocked");
  }, [address, dishKey]);

  if (!dishInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground text-center">
          This dish is not fully available yet.  
          <br />
          Recipe coming soon.
        </p>
      </main>
    );
  }

  const handlePrimaryClick = () => {
    if (isUnlocked) {
      router.push(`/frame/list/${dishKey}/unlocked`);
    } else {
      router.push(`/frame/list/${dishKey}/connect`);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 flex justify-center">
      <div className="max-w-md w-full space-y-5">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]">
            Indonesian dish • {dishInfo.origin}
          </span>
          <h1 className="text-2xl font-semibold">{dishInfo.title}</h1>
          <p className="text-xs text-muted-foreground">
            {dishInfo.description}
          </p>
        </div>

        <div className="h-52 w-full overflow-hidden rounded-2xl border">
          <img
            src={dishInfo.image}
            alt={dishInfo.title}
            className="h-full w-full object-cover"
          />
        </div>

        <section className="space-y-1">
          <h2 className="text-sm font-medium">What you&apos;ll mint</h2>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Full ingredient list with exact measurements.</li>
            <li>Step-by-step cooking instructions you can follow at home.</li>
            <li>A permanent entry of this dish in your onchain kitchen.</li>
          </ul>
        </section>

        <section className="space-y-1">
          <h2 className="text-sm font-medium">Ingredient preview</h2>
          <p className="text-[11px] text-muted-foreground">
            We&apos;ll show you the full ingredient list after you unlock this
            recipe. Think: spices, aromatics, and everything that makes{" "}
            {dishInfo.title} special.
          </p>
        </section>

        <div className="pt-2">
          <Button className="w-full" onClick={handlePrimaryClick}>
            {isUnlocked
              ? "Open unlocked recipe"
              : "Unlock & mint full recipe (~$0.01 on Base)"}
          </Button>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            This small onchain fee mints the recipe to your wallet — your own
            onchain kitchen.
          </p>
        </div>
      </div>
    </main>
  );
}
