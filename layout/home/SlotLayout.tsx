"use client";

import React, { useState } from "react";
import { RWATokenCard } from "@/components/home/RwaTokenCard";
import { SlotSection } from "@/components/home/SlotSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Arrow from "@/public/icons/leftArrowCircle.svg";
import { MainTitle } from "@/components/common/MainTitle";
import Stick from "@/public/icons/stick.svg";

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="main w-full flex-col p-5 pb-0 md:h-[534px] md:w-[1150px] md:flex-row md:pb-5">
      <div className="main-inner w-full px-9 md:h-[474px] md:w-[520px]">
        {/* raffle section */}
        <Link
          href="/raffle"
          className="flex w-full flex-col items-center gap-5"
        >
          <MainTitle title="Raffle is ready!" />
          <RWATokenCard />
          <SlotSection />
        </Link>

        {/* move to prev/next raffle */}
        <div className="flex items-center gap-3 md:gap-5">
          <Arrow fill={"#AEAEAE"} className="cursor-pointer" />
          <h1 className="text-sm text-white md:text-base">1/1</h1>
          <Arrow
            fill={"#AEAEAE"}
            className="rotate-180 transform cursor-pointer"
          />
        </div>
      </div>

      {/* create new coin */}
      <div
        className="create-default hidden h-[293px] w-[201px] cursor-pointer md:flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push("/create")}
      >
        <h1 className="create-title">create new coin</h1>
        <div className="flex h-36 w-20 items-center justify-center rounded-2xl border-2 border-[#A58C08] bg-[#0E0E0E]">
          <Stick
            className={`${isHovered ? "fill-[#ffea00]" : "fill-[#FF2626]"}`}
          />
        </div>
      </div>
      <div
        className="relative mt-10 flex w-full cursor-pointer flex-col items-center md:hidden"
        onClick={() => router.push("/create")}
      >
        <div className="trapezoid-icon absolute top-[10px] rounded-full" />
        <Stick className="absolute top-[-75px] fill-[#FF2626]" />
        <img src="images/rectangle-create.png" alt="" className="w-full" />
        <div className="gradiant-create-box h-14 w-full" />
        <div className="create-title absolute bottom-4">create new coin</div>
      </div>
    </div>
  );
};
