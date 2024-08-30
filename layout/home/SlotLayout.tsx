"use client";

import React, { useState } from "react";
import { RWATokenCard } from "@/components/home/RwaTokenCard";
import { SlotSection } from "@/components/home/SlotSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Start from "@/public/icons/create.svg";
import Arrow from "@/public/icons/leftArrowCircle.svg";
import { MainTitle } from "@/components/common/MainTitle";

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="main h-[534px]">
      <div className="main-inner h-[474px] w-[520px]">
        {/* raffle section */}
        <Link href="/raffle" className="flex flex-col items-center gap-[30px] ">
          <MainTitle title="Raffle is ready!" />
          <RWATokenCard />
          <SlotSection />
        </Link>

        {/* move to prev/next raffle */}
        <div className="flex gap-[20px]">
          <Arrow fill={"#AEAEAE"} className="cursor-pointer" />
          <h1 className="text-white">1/1</h1>
          <Arrow
            fill={"#AEAEAE"}
            className="rotate-180 transform cursor-pointer"
          />
        </div>
      </div>

      {/* create new coin */}
      <div
        className="create-default h-[293px] w-[201px] cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push("/create")}
      >
        <h1 className="create-title">create new coin</h1>
        <Start fill={isHovered ? "yellow" : "#FF2626"} />
      </div>
    </div>
  );
};
