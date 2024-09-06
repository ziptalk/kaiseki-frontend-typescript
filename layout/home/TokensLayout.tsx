import { Dropdown } from "@/components/common/Dropdown";
import React, { useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { HomeTokenCard } from "@/components/home/HomeTokenCard";
import { BuySellLayout } from "./BuySellLayout";
import PagePre from "@/public/icons/pagePre.svg";
import PageFirst from "@/public/icons/pageFirst.svg";
import BottomSheet from "@/components/home/BottomSheet/BottomSheet";
import { Search } from "@/utils/apis/apis";
export const initialTokenInfo: TokenInfo = {
  cid: "",
  createdBy: "",
  description: "",
  marketCap: "",
  name: "",
  ticker: "",
  tokenAddress: "",
};

export const TokensLayout = () => {
  const [tokenInfo, setTokenInfo] = useState<any[] | null>(null);
  const [pageNum, setPageNumber] = useState<number>(1);
  const [value, setValue] = useState<string>("");
  const [info, setInfo] = useState<TokenInfo>(initialTokenInfo);

  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  const setPageNum = (num: number) => {
    setPageNumber(num);
    setInfo(initialTokenInfo);
  };
  useEffect(() => {
    setHomeTokens();
  }, [pageNum]);

  const setHomeTokens = async () => {
    const response = await Search({ page: pageNum, keyword: value });
    setTokenInfo(response);
  };

  const setInfotoInitial = () => {
    setInfo(initialTokenInfo);
  };

  return (
    <div className="mx-auto md:flex md:w-[1300px]">
      <div
        className={`${info.tokenAddress ? "md:w-[860px]" : "w-full"} mt-[32px]`}
      >
        <div className="text-xl text-white underline">Tokens</div>
        <div className="mt-4 flex w-full flex-col gap-2.5 md:mt-5 md:flex-row">
          <div className="flex gap-5 md:w-[329px]">
            <Dropdown // sort dropdown
              placeholder="sort : "
              items={["created", "trending"]}
            />
            <Dropdown // order dropdown
              placeholder="order : "
              items={["desc", "asc"]}
            />
          </div>
          <form
            className="flex h-10 gap-[10px] md:ml-auto md:h-[50px] md:w-[420px]"
            onSubmit={(e) => {
              e.preventDefault();
              setHomeTokens();
            }}
          >
            <input
              className="flex-[2] rounded-[10px] border border-background bg-black px-[20px] text-white"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="search for token"
            />
            <button
              className="flex-1 rounded-[10px] bg-background font-bold text-white"
              type="submit"
            >
              search
            </button>
          </form>
        </div>
        <div
          className={`mt-4 flex w-full flex-col gap-2.5 md:mt-5 md:grid ${info.tokenAddress ? "grid-cols-2 grid-rows-6" : "grid-cols-3 grid-rows-4"}  md:gap-5`}
        >
          {tokenInfo ? (
            tokenInfo.map((card: any, index: any) => (
              <div
                key={index}
                onMouseDown={() => {
                  info.tokenAddress && info.tokenAddress === card.tokenAddress
                    ? setInfotoInitial()
                    : setInfo({ ...card });
                }}
                className="w-full md:w-[420px]"
              >
                <HomeTokenCard {...card} clickedToken={info.tokenAddress} />
              </div>
            ))
          ) : (
            <p className="text-white">No token information available.</p>
          )}
        </div>
        <div className="mt-[40px] flex w-full items-center justify-center gap-[20px] ">
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
      {info.tokenAddress &&
        (width < 768 ? (
          <BottomSheet
            {...{
              setUnVisible: setInfotoInitial,
              visible: info.tokenAddress !== "",
            }}
          >
            <BuySellLayout {...info} setInfo={setInfotoInitial} />
          </BottomSheet>
        ) : (
          <BuySellLayout {...info} />
        ))}
    </div>
  );
};
