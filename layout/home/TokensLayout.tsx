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
  const [pageNum, setPageNumber] = useState<number>(1);

  const setPageNum = (num: number) => {
    setPageNumber(num);
    setClickedToken("");
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

  function getData() {
    fetch(`${SERVER_ENDPOINT}/search?page=${pageNum}`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        setTokenInfo(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="mx-auto flex w-[1300px]">
      <div className={`${clickedToken ? "w-[860px]" : "w-full"} mt-[32px]`}>
        <div className="text-xl text-white underline">Tokens</div>
        <div className="mt-[20px] flex w-full gap-[20px]">
          <Dropdown // sort dropdown
            placeholder="sort : "
            items={["created", "trending"]}
            width={165}
          />
          <Dropdown // order dropdown
            placeholder="order : "
            items={["desc", "asc"]}
            width={145}
          />
          <form className="ml-auto flex gap-[10px]">
            <input
              className="h-[50px] w-[250px] rounded-[10px] border border-background bg-black px-[20px] text-white"
              placeholder="search for token"
            ></input>
            <button className="h-[50px] w-[160px] rounded-[10px] bg-background font-bold text-white">
              search
            </button>
          </form>
        </div>
        <div
          className={`mt-[20px] grid w-full ${clickedToken ? "grid-cols-2 grid-rows-6" : "grid-cols-3 grid-rows-4"}  gap-[20px]`}
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
                <HomeTokenCard {...card} clickedToken={clickedToken} />
              </div>
            ))
          ) : (
            <p className="text-white">No token information available.</p>
          )}
        </div>
        <div className="mb-32 mt-[40px] flex w-full items-center justify-center gap-[20px] ">
          <PageFirst
            className="cursor-pointer"
            fill={`${pageNum > 1 ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (pageNum > 1) setPageNum(1);
            }}
          />
          <PagePre
            className="cursor-pointer"
            fill={`${pageNum > 1 ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (pageNum > 1) setPageNum(pageNum - 1);
            }}
          />
          <div className=" text-[16px] text-[#909090]">{pageNum}</div>
          <PagePre
            className="translate rotate-180 cursor-pointer"
            fill={`${tokenInfo && tokenInfo.length === 12 ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (tokenInfo && tokenInfo.length === 12) setPageNum(pageNum + 1);
            }}
          />
          <PageFirst
            className="translate rotate-180 cursor-pointer"
            fill={`${tokenInfo && tokenInfo.length === 12 ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (tokenInfo && tokenInfo.length === 12) setPageNum(pageNum + 1);
            }}
          />
        </div>
      </div>
      {clickedToken && <BuySellLayout tokenAddress={clickedToken} />}
    </div>
  );
};
