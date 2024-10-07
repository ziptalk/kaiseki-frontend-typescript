import { Dropdown } from "@/components/common/Dropdown";
import React, { useEffect, useState } from "react";
import { HomeTokenCard } from "@/components/home/HomeTokenCard";
import { BuySellLayout } from "./BuySellLayout";
import PagePre from "@/public/icons/pagePre.svg";
import PageFirst from "@/public/icons/pageFirst.svg";
import BottomSheet from "@/components/home/BottomSheet/BottomSheet";
import { Search } from "@/utils/apis/apis";

export const TokensLayout = () => {
  const [tokenInfo, setTokenInfo] = useState<any[] | null>(null);
  const [pageNum, setPageNumber] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [pagePer, setPagePer] = useState<number>(10);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [sort, setSort] = useState<"created" | "marketCap" | undefined>(
    undefined,
  );
  const [state, setState] = useState<"all" | "available" | "dex" | undefined>(
    undefined,
  );

  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (tokenAddress && width < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [tokenAddress, width]);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    width < 768 ? setPagePer(5) : setPagePer(10);
  }, [width]);

  const setPageNum = (num: number) => {
    setPageNumber(num);
    window.scrollTo(0, width < 768 ? 300 : 575);
  };

  useEffect(() => {
    setHomeTokens();
  }, [pageNum, sort, state]);

  const setHomeTokens = async () => {
    const response = await Search({
      page: pageNum,
      keyword: value,
      sort,
      state,
    });
    setTokenInfo(response.tokens);
    setMaxPage(response.maxPage);
  };

  const setInfotoInitial = () => {
    setTokenAddress("");
  };

  return (
    <div
      className="mx-auto md:flex md:w-[1300px]"
      onMouseDown={() => {
        setInfotoInitial();
      }}
    >
      <div
        className={`${tokenAddress ? "md:w-[860px]" : "w-full"} mt-[32px]`}
        id="tokens"
      >
        <div className="text-xl text-white underline">Tokens</div>
        <div className="mt-4 flex w-full flex-col gap-2.5 md:mt-5 md:flex-row">
          <div className="flex gap-5 md:w-[420px]" id="dropdown">
            <Dropdown // sort dropdown
              placeholder="sort : "
              items={[
                { item: "created", value: "createdAt" },
                { item: "market cap", value: "marketCap" },
              ]}
              setItem={(value) => {
                setSort(value);
              }}
            />
            <Dropdown // order dropdown
              placeholder="order : "
              items={[
                { item: "all", value: "all" },
                { item: "available", value: "available" },
                { item: "listed on dex", value: "dex" },
              ]}
              setItem={(value) => {
                setState(value);
              }}
            />
          </div>
          <form
            className="flex h-10 gap-[10px] md:ml-auto md:h-[50px] md:w-[420px]"
            onSubmit={(e) => {
              e.preventDefault();
              setHomeTokens();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            <input
              className="flex-[2] rounded-[10px] border border-background bg-black px-[20px] text-white placeholder:text-[#808080] md:text-[15px]"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="search for token"
            />
            <button
              className="flex-1 rounded-[10px] bg-[#FF20F6] font-bold text-white hover:bg-[#DA00D1]"
              type="submit"
            >
              search
            </button>
          </form>
        </div>
        <div
          className={`mt-4 flex w-full flex-col gap-2.5 md:mt-5 md:grid ${tokenAddress ? "grid-cols-2 grid-rows-6" : "grid-cols-3 grid-rows-4"}  md:gap-5`}
        >
          {tokenInfo !== null ? (
            tokenInfo.map((card: any, index: any) => (
              <div
                key={index}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  tokenAddress && tokenAddress === card.tokenAddress
                    ? setInfotoInitial()
                    : setTokenAddress(card.tokenAddress);
                }}
                className="w-full md:h-[215px] md:w-[420px]"
              >
                <HomeTokenCard {...card} clickedToken={tokenAddress} />
              </div>
            ))
          ) : (
            <p className="text-white">No token information available.</p>
          )}
        </div>
        <div
          className="mt-[40px] flex w-full select-none items-center justify-center gap-[20px]"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        >
          <PageFirst
            className="cursor-pointer"
            fill={`${pageNum > pagePer ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (pageNum > pagePer)
                setPageNum(
                  Math.floor((pageNum - pagePer) / pagePer) * pagePer + 1,
                );
            }}
          />
          <PagePre
            className="mr-8 cursor-pointer"
            fill={`${pageNum > 1 ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (pageNum > 1) setPageNum(pageNum - 1);
            }}
          />
          {Array.from({ length: pagePer }, (_, i) => {
            if (pageNum < pagePer) {
              return i + 1;
            } else {
              return i + 1 + Math.floor((pageNum - 1) / pagePer) * pagePer;
            }
          }).map(
            (page) =>
              page <= maxPage && (
                <div
                  key={page}
                  className={`cursor-pointer ${
                    page === pageNum ? "text-[#909090]" : "text-[#3F3F3F]"
                  }`}
                  onClick={() => setPageNum(page)}
                >
                  {page}
                </div>
              ),
          )}
          <PagePre
            className="translate ml-8 rotate-180 cursor-pointer"
            fill={`${tokenInfo && pageNum < maxPage ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (tokenInfo && pageNum < maxPage) setPageNum(pageNum + 1);
            }}
          />
          <PageFirst
            className="translate rotate-180 cursor-pointer"
            fill={`${tokenInfo && pageNum <= Math.floor(maxPage / pagePer) * pagePer ? "#909090" : "#3F3F3F"}`}
            onClick={() => {
              if (
                tokenInfo &&
                pageNum <= Math.floor(maxPage / pagePer) * pagePer
              )
                setPageNum(
                  Math.floor((pageNum + pagePer) / pagePer) * pagePer + 1,
                );
            }}
          />
        </div>
      </div>
      {tokenAddress &&
        (width < 768 ? (
          <BottomSheet
            {...{
              setUnVisible: setInfotoInitial,
              visible: tokenAddress !== "",
            }}
          >
            <BuySellLayout
              {...{
                tokenAddress,
                setInfo: setInfotoInitial,
              }}
            />
          </BottomSheet>
        ) : (
          <BuySellLayout
            {...{
              tokenAddress,
              setInfo: setInfotoInitial,
            }}
          />
        ))}
    </div>
  );
};
