import { Dropdown } from "@/components/common/Dropdown";
import React, { useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { HomeTokenCard } from "@/components/home/HomeTokenCard";
import { BuySellLayout } from "./BuySellLayout";
import PagePre from "@/public/icons/pagePre.svg";
import PageFirst from "@/public/icons/pageFirst.svg";

export const TokensLayout = () => {
  const [clickedToken, setClickedToken] = useState<string>("");
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
        // console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="flex w-[1300px]">
      <div className={`${clickedToken && "w-[860px]"} mt-[32px]`}>
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
              className="h-[50px] w-[250px] rounded-[10px] border border-[#FF00C6] bg-black px-[20px] text-white"
              placeholder="search for token"
            ></input>
            <button className="h-[50px] w-[160px] rounded-[10px] bg-[#FF00C6] font-bold text-white">
              search
            </button>
          </form>
        </div>
        <div className="mt-[20px] flex w-full">
          <div
            className={`grid ${clickedToken ? "grid-cols-2" : "grid-cols-3"} grid-rows-4 gap-[20px]`}
          >
            {tokenInfo ? (
              tokenInfo.map((card: any, index: any) => (
                <div
                  key={index}
                  onMouseDown={() => {
                    clickedToken && clickedToken === card.tokenAddress
                      ? setClickedToken("")
                      : setClickedToken(card.tokenAddress);
                  }}
                >
                  <HomeTokenCard
                    cid={card.cid}
                    name={card.name}
                    ticker={card.ticker}
                    tokenAddress={card.tokenAddress}
                    cap={card.marketCap}
                    createdBy={card.createdBy}
                    desc={card.description}
                    hoveredToken={clickedToken}
                  />
                </div>
              ))
            ) : (
              <p>No token information available.</p>
            )}
          </div>
        </div>
        <div className="mb-32 mt-[40px] flex w-full justify-center">
          <div className="flex items-center gap-[20px] ">
            <PageFirst
              className="cursor-pointer"
              fill={`${pageNum > 1 ? "#909090" : "#3F3F3F"}`}
              onClick={() => {
                if (pageNum > 1) {
                  setPageNum(1);
                }
              }}
            />
            <PagePre
              className="cursor-pointer"
              fill={`${pageNum > 1 ? "#909090" : "#3F3F3F"}`}
              onClick={() => {
                if (pageNum > 1) {
                  setPageNum(pageNum - 1);
                }
              }}
            />
            <h1 className=" text-[16px] text-[#909090]">{pageNum}</h1>
            <PagePre
              className="translate rotate-180 cursor-pointer"
              fill={`${tokenInfo && tokenInfo.length === 21 ? "#909090" : "#3F3F3F"}`}
              onClick={() => {
                setPageNum(pageNum + 1);
              }}
            />
            <PageFirst
              className="translate rotate-180 cursor-pointer"
              fill={`${tokenInfo && tokenInfo.length === 21 ? "#909090" : "#3F3F3F"}`}
              onClick={() => {
                setPageNum(pageNum + 1);
              }}
            />
          </div>
        </div>
      </div>
      {clickedToken && (
        <div className="ml-[20px]">
          <BuySellLayout tokenAddress={clickedToken} />
        </div>
      )}
    </div>
  );
};
