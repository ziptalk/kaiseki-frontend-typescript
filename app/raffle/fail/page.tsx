"use client";

import { useEffect, useState } from "react";
import { MainTitle } from "@/components/common/MainTitle";
import { Button } from "@/components/atoms/Button";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { useSearchParams } from "next/navigation";

export default function Raffle() {
  const searchParams = useSearchParams();

  const [width, setWidth] = useState(250);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  const buttonValue = [
    {
      value: 25,
    },
    {
      value: 50,
    },
    {
      value: 75,
    },
  ];

  return (
    <div className="p-2">
      <div className="mx-auto mt-3 w-full md:w-[1151px]">
        <PageLinkButton href={"/"} prev>
          Back Home
        </PageLinkButton>
      </div>
      <div className={"main mt-[10px] p-5 md:w-[1151px] md:px-80"}>
        <div className="main-inner px-9 py-5 md:px-16 md:py-8">
          <MainTitle title="Try your luck next time!" fail />
          <div className="main-tokenarea mt-4 flex-col">
            <div className="flex gap-[10px] text-xs">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${searchParams.get("cid")}`}
                alt="Image from IPFS"
                className="h-16 w-16 border-black md:h-[100px] md:w-[100px]"
              />
              <div
                className="flex flex-col md:px-[10px]"
                style={{ width: width < 768 ? width - 250 : 240 }}
              >
                <div className="whitespace-pre font-bold text-[#AEAEAE] md:text-[15px]">
                  {searchParams.get("name")}
                  {"\n"}
                  [ticker: {searchParams.get("symbol")}]
                </div>
                <div className="mt-[5px] flex h-[14px] items-center gap-[5px] ">
                  <h1 className="whitespace-nowrap text-[#C5F900]">
                    created by:{" "}
                  </h1>
                  <img
                    className="rounded-full"
                    src="/images/memesinoGhost.png"
                    alt=""
                    style={{ width: 12, height: 12 }}
                  />
                  <div className="w-full truncate text-[#C5F900]">
                    {/* {searchParams.get("creator").length < 20
                      ? searchParams.get("creator")
                      : `${searchParams.get("creator").slice(0, 20)}...`} */}
                    {searchParams.get("creator")}
                  </div>
                </div>
                <h1 className="text-[#FAFF00]">
                  prize: {searchParams.get("rafflePrize")}
                </h1>
                <p className="show-scrollbar mt-[5px] h-8 overflow-scroll break-words text-[10px] text-[#808080] md:h-16 md:text-[13px]">
                  {searchParams.get("description")}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#D9D9D9] underline underline-offset-4 md:mt-3 md:text-base">
                Amount of Tokens
              </h1>
              <div className="relative mt-3 flex w-full items-center md:mt-[20px]">
                <input
                  className="h-10 w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] px-2 text-xs text-white md:h-[55px] md:px-[20px] md:text-base"
                  type="number"
                  disabled
                />
                <button
                  type="button"
                  className="absolute right-0 mr-2 flex h-5 w-9 items-center justify-center gap-[5px] rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] text-[10px] text-white md:mr-[20px] md:h-[30px] md:w-[52px] md:px-[10px] md:text-[14px]"
                >
                  MAX
                </button>
              </div>
              <div className="mt-[10px] flex justify-between gap-2 md:gap-3">
                {buttonValue.map((item, index) => (
                  <Button
                    key={index}
                    className="h-8 flex-1 rounded-[5px] bg-[#303030] text-xs md:h-[50px] md:text-[14px]"
                  >
                    {item.value}%
                  </Button>
                ))}
              </div>

              <Button
                className="mt-5 bg-[#303030] text-[#AEAEAE] md:mt-[30px]"
                onClick={() => {}}
              >
                Raffle is done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
