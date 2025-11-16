// app/components/DishCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function DishCard({ name, image, slug }: { name: string; image: string; slug: string }) {
  const router = useRouter();

  const handleClick = () => {
    // step 1: wallet connection + pay $0.01
    // step 2: redirect to detail page
    // sekarang kita dummy dulu langsung redirect
    router.push(`/frame/list/${slug}`);
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-white p-4">
      <Image src={image} alt={name} width={800} height={500} className="w-full h-48 object-cover rounded-xl" />
      <h2 className="mt-4 text-lg font-bold">{name}</h2>
      <button
        onClick={handleClick}
        className="mt-2 w-full rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
      >
        Find Recipe
      </button>
    </div>
  );
}
