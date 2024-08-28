"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RWATokenCard } from "@/components/home/RwaTokenCard";
import { SlotSection } from "@/components/home/SlotSection";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={
        "mx-auto flex h-[534px] w-[1151px] items-center justify-center gap-[60px] rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 px-[100px] py-[30px]  shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FAFF00]"
      }
    >
      <div className="flex h-[474px] w-[520px] flex-col items-center gap-[20px] rounded-3xl border-2 border-white bg-black py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
        <Link href="/raffle" className="flex flex-col items-center gap-[30px] ">
          <Image
            src="/images/raffle_is_ready.svg"
            alt="RWA_Curves_are_ready"
            width={390}
            height={60}
            style={{ width: 390, height: 60 }}
          />
          <RWATokenCard />
          <SlotSection />
        </Link>
        <div className="flex gap-[20px]">
          <Image
            className="cursor-pointer"
            src="/icons/arrow-left-contained-unactive.svg"
            alt=""
            width={24}
            height={24}
          />
          <h1 className="text-white">1/1</h1>
          <Image
            className="cursor-pointer"
            src="/icons/arrow-right-contained-unactive.svg"
            alt=""
            width={24}
            height={24}
          />
        </div>
      </div>
      <Image
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => router.push("/create")}
        src={
          isHovered
            ? "/images/create_hovered.svg"
            : "/images/create_default.svg"
        }
        alt="Create"
        width={201}
        height={293}
        priority
        className="cursor-pointer"
      />
    </div>
  );
};
