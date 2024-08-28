"use client";

import { BuySellLayout } from "@/layout/home/BuySellLayout";
import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";
import { useState } from "react";

export default function Home() {
  const [hoveredToken, setHoveredToken] = useState<string>("");

  return (
    <>
      <main className="relative flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto pt-[20px]">
          <SlotLayout />
          <div className="mt-[32px] flex w-[1360px] justify-between">
            <TokensLayout {...{ setHoveredToken, hoveredToken }} />
            <div className="mt-[114px] w-[471px] bg-[#252525] p-[10px]">
              {hoveredToken && <BuySellLayout tokenAddress={hoveredToken} />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
