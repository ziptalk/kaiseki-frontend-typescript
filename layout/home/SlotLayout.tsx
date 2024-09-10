"use client";

import React, { use, useEffect, useState } from "react";
import { RWATokenCard } from "@/components/home/RwaTokenCard";
import { SlotSection } from "@/components/home/SlotSection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Arrow from "@/public/icons/leftArrowCircle.svg";
import { MainTitle } from "@/components/common/MainTitle";
import Stick from "@/public/icons/stick.svg";
import { Raffle } from "@/utils/apis/apis";
import { RaffleResponse } from "@/utils/apis/type";

export const SlotLayout = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [raffleData, setRaffleData] = useState<RaffleResponse | null>(null);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [stickColor, setStickColor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStickColor(!stickColor);
    }, 3000);
    return () => clearInterval(interval);
  }, [stickColor]);

  const getRaffle = async () => {
    const response = await Raffle();
    setRaffleData(response);
  };
  useEffect(() => {
    if (raffleData) {
      setTotalPage(Number(raffleData.message.slice(27, 29)));
    }
  }, [raffleData]);

  useEffect(() => {
    if (totalPage) setPage(1);
  }, [totalPage]);

  useEffect(() => {
    getRaffle();
  }, []);

  return (
    <div className="main w-full flex-col p-5 pb-0 md:h-[534px] md:w-[1150px] md:flex-row md:pb-5">
      <div className="main-inner w-full px-9 md:h-[474px] md:w-[520px] md:px-14">
        {/* raffle section */}
        <Link
          href={{
            pathname: raffleData && raffleData.tokens && "/raffle",
            query: raffleData &&
              raffleData.tokens &&
              raffleData.tokens[page - 1] && {
                cid: raffleData.tokens[page - 1].cid,
                rafflePrize: raffleData.tokens[page - 1].rafflePrize,
                token: raffleData.tokens[page - 1].token,
                name: raffleData.tokens[page - 1].name,
                symbol: raffleData.tokens[page - 1].symbol,
                creator: raffleData.tokens[page - 1].creator,
                description: raffleData.tokens[page - 1].description,
                startDate: raffleData.tokens[page - 1].startDate,
              },
          }}
          className="flex w-full flex-col items-center gap-5"
        >
          <MainTitle
            title={
              raffleData && raffleData.tokens
                ? "Raffle is ready!"
                : "Loading..."
            }
          />
          {raffleData && raffleData.tokens && raffleData.tokens[page - 1] && (
            <RWATokenCard props={raffleData.tokens[page - 1]} />
          )}
          <SlotSection />
        </Link>

        {/* move to prev/next raffle */}
        <div className="flex items-center gap-3 md:gap-5">
          <Arrow
            fill={page > 1 ? "white" : "#AEAEAE"}
            className="cursor-pointer"
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          />
          <h1 className="text-sm text-white md:text-base">
            {page} / {totalPage || 0}
          </h1>
          <Arrow
            fill={page < totalPage ? "white" : "#AEAEAE"}
            className="rotate-180 transform cursor-pointer"
            onClick={() => {
              if (page < totalPage) setPage(page + 1);
            }}
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
            className={`${isHovered ? "fill-[#ffea00]" : stickColor ? `fill-[#FF2626]` : `fill-[#ffea00]`}`}
          />
        </div>
      </div>
      <div
        className="relative mt-10 flex w-full cursor-pointer flex-col items-center md:hidden"
        onClick={() => router.push("/create")}
      >
        <div className="trapezoid-icon absolute top-[10px] rounded-full" />
        <Stick
          className={`absolute top-[-75px] ${stickColor ? `fill-[#FF2626]` : `fill-[#ffea00]`}`}
        />
        <img src="images/rectangle-create.png" alt="" className="w-full" />
        <div className="gradiant-create-box h-14 w-full" />
        <div className="create-title absolute bottom-4">create new coin</div>
      </div>
    </div>
  );
};
