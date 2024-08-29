"use client";

import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";

export default function Home() {
  return (
    <main className="relative mx-auto flex w-screen bg-[#0E0E0E] pt-[20px]">
      <div className="mx-auto pt-[20px]">
        <SlotLayout />
        <TokensLayout />
      </div>
    </main>
  );
}
