import React, { useState } from "react";
import Image from "next/image";
import { RWATokenCard } from "@/components/home/RwaTokenCard";
import { SlotSection } from "@/components/home/SlotSection";
import { useRouter } from "next/navigation";

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={
        "mx-auto flex h-[500px] w-[1151px] items-center justify-center gap-[60px] rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 px-[100px] py-[30px]  shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FAFF00]"
      }
    >
      <div className="flex h-full w-[520px] flex-col items-center gap-[30px] rounded-3xl border-2 border-white bg-black py-[20px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
        <Image
          src="/images/RWA_Curves_are_ready.svg"
          alt="RWA_Curves_are_ready"
          width={366}
          height={60}
          style={{ width: 366, height: 60 }}
        />
        <RWATokenCard />
        <SlotSection />
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
