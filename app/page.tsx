"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { type UseReadContractReturnType } from "wagmi";
import Link from "next/link";
import TokenCard from "@/components/TokenCard";

export default function Home() {
  return (
    <>
      <main className="flex w-screen bg-black">
        <div className="mx-auto h-full w-[70vw]  pt-10 ">
          <div className="mx-auto flex h-[465px] w-[55vw] items-center justify-evenly rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)]  shadow-[#FAFF00]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex h-full w-[500px] flex-col items-center gap-[30px] rounded-3xl border-2 border-white bg-black py-[30px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
                <div className="flex h-[50px] w-[340px] items-center justify-center border bg-gradient-to-b from-zinc-900 to-rose-950">
                  <h1 className="text-borderline  text-3xl font-black text-white ">
                    King of the hill
                  </h1>
                </div>
                <TokenCard
                  name="Name"
                  ticker="ticker"
                  cap="1:24"
                  desc="desc"
                  createdBy="Me"
                />
                <div className="flex h-[140px] w-[390px] gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px]">
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                  <div className="h-full w-[120px] rounded-xl bg-white"></div>
                </div>
              </div>
            </div>
            <Link href="/create" className="z-10">
              <div className="flex h-[300px] w-[200px] flex-col items-center justify-center gap-[30px] rounded-[20px] border-4 border-[#E5180E] ">
                <h1 className="text-xl font-black text-white">
                  Create new coin
                </h1>
                <div className="h-[140px] w-[80px] rounded-2xl border-4 border-[#A58C07] bg-black"></div>
              </div>
            </Link>
          </div>

          <div className="mt-10 flex h-[50px] w-full justify-between  px-10">
            <div className="h-full">
              <button className="mr-[20px] h-[50px] w-[160px] rounded-[10px] bg-[#353535]">
                sort: newest
              </button>
              <button className="h-[50px] w-[160px] rounded-[10px] bg-[#353535]">
                sort: newest
              </button>
            </div>
            <form className="">
              <input
                className="mr-[30px] h-[50px] w-[422px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
                placeholder="search for token"
              ></input>
              <button className="h-[50px] w-[150px] rounded-[10px] bg-[#FF00C6]">
                search
              </button>
            </form>
          </div>

          <div className="mt-10 grid h-[800px] w-full grid-cols-3 grid-rows-4  p-8">
            <TokenCard
              name="Name"
              ticker="ticker"
              cap="1:24"
              desc="desc"
              createdBy="Me"
            />
          </div>
          <></>
        </div>
      </main>
    </>
  );
}
