"use client";

import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";
import { useEffect, useState } from "react";

export default function Home() {
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  useEffect(() => {
    console.log(hoveredToken);
  }, [hoveredToken]);
  return (
    <>
      <main className="relative flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto pt-[20px]">
          <SlotLayout />
          <div className="mt-[32px] flex w-[1360px] justify-between">
            <TokensLayout {...{ setHoveredToken }} />
            <div className="mt-[114px] w-[471px] bg-[#252525]"></div>
          </div>
        </div>
      </main>
    </>
  );
}
