"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Stick from "@/public/icons/stick.svg";
import CNC from "@/public/icons/create-new-coin.svg";
import { useAccount } from "wagmi";
import SliderComp from "@/components/home/Slider";
import Chopstick from "@/public/icons/chopstick.svg";

const RotatingImage = () => {
  return (
    <div className="absolute top-[-75px] flex items-center justify-center ">
      <div className="rotating-image-container">
        <Stick className="fill-[#FF2626]" />
      </div>
    </div>
  );
};

const RotatingPCImage = ({ hovered }: { hovered: boolean }) => {
  return (
    <div className="absolute flex items-center justify-center">
      <div className="rotating-image-container">
        <Stick />
      </div>
    </div>
  );
};

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  // useEffect(() => {
  //   if (raffleData && raffleData.result && raffleData.result.tokens) {
  //     setTotalPage(raffleData.result.tokens.length);
  //   }
  // }, [raffleData]);

  // useEffect(() => {
  //   if (
  //     page &&
  //     raffleData &&
  //     raffleData.result &&
  //     raffleData.result.tokens &&
  //     raffleData.result.tokens.length
  //   ) {
  //     setHref("/raffle");
  //     for (
  //       let i = 0;
  //       raffleData.winner.raffles && i < raffleData.winner.raffles.length;
  //       i++
  //     ) {
  //       if (
  //         raffleData.winner.raffles[i].tokenAddress ===
  //           raffleData.result.tokens[page - 1].token &&
  //         raffleData.winner.raffles[i].winnerAddress === account.address
  //       ) {
  //         setHref("/raffle/check");
  //         return;
  //       } else if (
  //         raffleData.winner.raffles[i].tokenAddress ===
  //         raffleData.result.tokens[page - 1].token
  //       ) {
  //         setHref("/raffle/fail");
  //       }
  //     }
  //   } else {
  //     setHref("/");
  //   }
  // }, [page, raffleData]);

  // useEffect(() => {
  //   if (totalPage) setPage(1);
  // }, [totalPage]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (totalPage === 0) return;
  //     if (page === totalPage) {
  //       setPage(1);
  //     } else {
  //       setPage(page + 1);
  //     }
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [page]);

  return (
    <>
      <div
        className="main w-full flex-col bg-[#ff2503] p-5 pb-0 md:h-[534px] md:w-[1150px] md:flex-row md:pb-5"
        style={{
          backgroundImage: "url('/images/Texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-y",
        }}
      >
        {/* <div className="main-inner w-full px-9 md:h-[474px] md:w-[520px] md:px-14"> */}
        {/* raffle section */}

        <SliderComp />
        {/* move to prev/next raffle */}
        {/* </div> */}
        {/* create new coin */}
        <div
          className="create-default hidden h-[293px] w-[230px] cursor-pointer md:flex "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push("/create")}
        >
          <CNC />
          <div className="flex h-36 w-20 items-center justify-center rounded-2xl border-2 border-[#A58C08] bg-[#0E0E0E]">
            <RotatingPCImage hovered={isHovered} />
          </div>
        </div>
        <div
          className="relative mt-10 flex w-full cursor-pointer flex-col items-center md:hidden"
          onClick={() => router.push("/create")}
        >
          <div className="trapezoid-icon absolute top-[10px] rounded-full" />
          {/* <Stick className={` fill-[#FF2626]`} /> */}
          <RotatingImage />
          <img src="images/rectangle-create.png" alt="" className="w-full" />
          <div className="gradiant-create-box h-14 w-full" />
          <div className="create-title absolute bottom-4">create new coin</div>
        </div>
        <Chopstick className="hidden md:flex" />
      </div>
    </>
  );
};
