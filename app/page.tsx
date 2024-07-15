"use client";

import TokenCard from "@/components/common/TokenCard";
import { digital } from "@/fonts/font";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [toTheMoonInfo, setToTheMoonInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState<any[] | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    getData();
    getToTheMoonFromServer();
  }, []);

  useEffect(() => {
    getData();
  }, [pageNum]);

  function getData() {
    fetch(`${SERVER_ENDPOINT}/homeTokenInfo?page=${pageNum}`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        setTokenInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getToTheMoonFromServer = () => {
    fetch(`${SERVER_ENDPOINT}/ToTheMoon`)
      .then((response) => response.json())
      .then((data) => {
        setToTheMoonInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SlotSection: FC = () => {
    return (
      <div className="flex h-[140px] w-[390px] gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px]">
        <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
          <div className="h-[150px]">
            <Image src="/images/WIF.png" alt="" width={40} height={40} />
            <Image
              src="/images/catcat.png"
              alt=""
              width={40}
              height={40}
              className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
            />
            <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
          </div>
        </div>
        <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
          <div className="h-[150px]">
            <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
            <Image
              src="/images/catcat.png"
              alt=""
              width={40}
              height={40}
              className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
            />
            <Image src="/images/WIF.png" alt="" width={40} height={40} />
          </div>
        </div>
        <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
          <div className="h-[150px]">
            <Image src="/images/WIF.png" alt="" width={40} height={40} />
            <Image
              src="/images/catcat.png"
              alt=""
              width={40}
              height={40}
              className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
            />
            <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
          </div>
        </div>
      </div>
    );
  };

  const ToTheMoonTokenCardSection: FC = () => {
    return (
      <div className="w-[390px]">
        <Link
          href="/0x2Ed6C164217E3EC792655A866EF3493D2AAfBFb3"
          className={`"border flex justify-between gap-[10px] border border-dashed border-[#F9FF00] bg-black p-[10px]  shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] `}
        >
          <div>
            <div className="h-[80px] w-[80px] overflow-hidden border-black ">
              <Image
                src="/images/catcat.png"
                alt=""
                width={80}
                height={80}
                className=""
              />
            </div>
          </div>
          <div className=" text w-[334px] overflow-hidden px-[10px]">
            <div className="">
              <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                ToTheMoon
              </h1>
              <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                [ticker: MOON]
              </h1>
            </div>
            <div className="flex items-center gap-[5px]">
              <h1 className="neon-lime text-xs text-[#C5F900] ">Created by:</h1>
              <Image
                className="rounded-full"
                src="/images/memesinoGhost.png"
                alt=""
                width={12}
                height={12}
                style={{ width: 12, height: 12 }}
              />
              <h1 className="neon-lime text-xs text-[#C5F900] ">0x7A21</h1>
            </div>

            <div className="flex">
              <h1 className="neon-yellow text-xs text-[#FAFF00]">
                Market cap:&nbsp;
              </h1>
              <h1
                className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
              >
                999.1K
              </h1>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      <main className="relative flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto h-full pt-[20px] ">
          <div className="mx-auto flex h-[420px] w-[850px] max-w-[970px] items-center justify-evenly rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 py-[20px] shadow-[0_0px_20px_rgba(0,0,0,0.5)]  shadow-[#FAFF00]">
            <div className="flex h-full flex-col justify-between">
              <div className="flex h-full w-[500px] flex-col items-center gap-[20px] rounded-3xl border-2 border-white bg-black py-[20px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
                <Image
                  src="/images/To_the_moon.svg"
                  alt=""
                  width={250}
                  height={300}
                  className="h-auto w-auto"
                />
                <ToTheMoonTokenCardSection />
                <SlotSection />
              </div>
            </div>
            <Link href={"/create"}>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="h-[300px] w-[200px]"
              >
                <Image
                  src={
                    isHovered
                      ? "/images/create_hovered.svg"
                      : "/images/create_default.svg"
                  }
                  alt="Create"
                  width={500}
                  height={1000}
                  className="h-full w-full"
                />
              </div>
            </Link>
          </div>

          <div className="mt-10 flex w-full items-end justify-between px-10">
            <div className="h-full">
              <div className="mb-[10px] text-xl text-white underline">
                Tokens
              </div>
              <button className="mr-[20px] rounded-[10px] bg-[#363636] px-5 py-[10px] text-[#AEAEAE]">
                sort: created
              </button>
              <button className=" rounded-[10px] bg-[#363636] px-5 py-[10px] text-[#AEAEAE]">
                order: desc
              </button>
            </div>
            {/* <form className="">
              <input
                className="mr-[30px] h-[50px] w-[422px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
                placeholder="search for token"
              ></input>
              <button className="h-[50px] w-[150px] rounded-[10px] bg-[#FF00C6]">
                search
              </button>
            </form> */}
          </div>

          <div className="grid w-full min-w-[1100px] grid-cols-3 grid-rows-7 gap-[60px] px-8 py-[10px]">
            {tokenInfo ? (
              tokenInfo.map((card: any, index: any) => (
                <TokenCard
                  key={index}
                  cid={card.cid}
                  name={card.name}
                  ticker={card.ticker}
                  tokenAddress={card.tokenAddress}
                  cap={card.marketCap}
                  createdBy={card.createdBy}
                  desc={card.description}
                />
              ))
            ) : (
              <p>No token information available.</p>
            )}
          </div>
          <div className="mb-32 flex w-full justify-center">
            <div className="flex items-center gap-[20px] ">
              <Image
                className={`h-auto w-auto ${pageNum > 1 ? "cursor-pointer" : ""}`}
                src={`/icons/ic-pagePre-${pageNum > 1 ? "able" : "disable"}.svg`}
                alt=""
                style={{ width: 7, height: 11 }}
                width={7}
                height={11}
                onClick={() => {
                  if (pageNum > 1) {
                    setPageNum(pageNum - 1);
                  }
                }}
              />
              <h1 className=" text-white">{pageNum}</h1>
              <Image
                className={`h-auto w-auto ${tokenInfo && tokenInfo.length === 21 ? "cursor-pointer" : ""}`}
                src={`/icons/ic-pageNext-${tokenInfo && tokenInfo.length === 21 ? "able" : "disable"}.svg`}
                alt=""
                width={7}
                style={{ width: 7, height: 11 }}
                height={11}
                onClick={() => {
                  setPageNum(pageNum + 1);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
