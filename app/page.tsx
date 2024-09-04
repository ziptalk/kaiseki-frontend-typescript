"use client";

import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";

export default function Home() {
  return (
    <main className="p-2 py-4 md:p-[30px]">
      {/* main page top slot layout - raffle, token creation */}
      <SlotLayout />

      {/* main page bottom token layout - token list + quick buy/sell */}
      <TokensLayout />
    </main>
  );
}
