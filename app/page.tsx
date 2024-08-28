"use client";

import { BuySellLayout } from "@/layout/home/BuySellLayout";
import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";
import { useState } from "react";

export default function Home() {
  const [hoveredToken, setHoveredToken] = useState<string>("");
  const [clickedToken, setClickedToken] = useState<string>("");

  return (
    <>
      <main className="relative flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto pt-[20px]">
          <SlotLayout />
          <div className="mt-[32px] flex w-[1300px] justify-between">
            <TokensLayout
              {...{
                setHoveredToken,
                hoveredToken,
                clickedToken,
                setClickedToken,
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
