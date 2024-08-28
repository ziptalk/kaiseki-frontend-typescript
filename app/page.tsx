"use client";

import { BuySellLayout } from "@/layout/home/BuySellLayout";
import { SlotLayout } from "@/layout/home/SlotLayout";
import { TokensLayout } from "@/layout/home/TokensLayout";
import { useEffect, useState } from "react";

export default function Home() {
  const [hoveredToken, setHoveredToken] = useState<string>("");
  const [clickedToken, setClickedToken] = useState<string>("");

  // useEffect(() => {
  //   console.log({ hoveredToken });
  //   console.log({ clickedToken });
  // }, [hoveredToken, clickedToken]);
  
  return (
    <>
      <main className="relative flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto pt-[20px]">
          <SlotLayout />
          <div className="mt-[32px] flex w-[1360px] justify-between">
            <TokensLayout
              {...{
                setHoveredToken,
                hoveredToken,
                clickedToken,
                setClickedToken,
              }}
            />
            {(hoveredToken || clickedToken) && (
              <div className="ml-[29px] mt-[118px] h-[950px] w-[471px] bg-[#252525] p-[20px] pt-[10px]">
                <BuySellLayout tokenAddress={hoveredToken || clickedToken} />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
