import { Dropdown } from "@/components/common/Dropdown";
import React, { useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { HomeTokenCard } from "@/components/home/HomeTokenCard";
import Image from "next/image";
import { BuySellLayout } from "./BuySellLayout";

interface TokensLayoutProps {
  setHoveredToken: (value: string) => void;
}

export const TokensLayout = ({ setHoveredToken }: TokensLayoutProps) => {
  const [tokenInfo, setTokenInfo] = useState<any[] | null>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

  function getData() {
    fetch(`${SERVER_ENDPOINT}/search?page=${pageNum}`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        setTokenInfo(data);
        // console.log({ homeData: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <div className="w-[860px]">
        <div className="text-xl text-white underline">Tokens</div>
        <div className="mt-[20px] flex w-full gap-[20px]">
          <Dropdown
            placeholder="sort : "
            items={["created", "trending"]}
            width={165}
          />

          <Dropdown
            placeholder="order : "
            items={["desc", "asc"]}
            width={145}
          />
          <form className="ml-auto flex gap-[10px]">
            <input
              className="h-[50px] w-[170px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
              placeholder="search for token"
            ></input>
            <button className="h-[50px] w-[160px] rounded-[10px] bg-[#FF00C6]">
              search
            </button>
          </form>
        </div>
        <div className="mt-[20px] grid grid-cols-2 grid-rows-4 gap-[30px]">
          {tokenInfo ? (
            tokenInfo.map((card: any, index: any) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredToken(card.tokenAddress)}
                // onMouseLeave={() => setHoveredToken(null)}
              >
                <HomeTokenCard
                  cid={card.cid}
                  name={card.name}
                  ticker={card.ticker}
                  tokenAddress={card.tokenAddress}
                  cap={card.marketCap}
                  createdBy={card.createdBy}
                  desc={card.description}
                />
              </div>
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
    </>
  );
};
