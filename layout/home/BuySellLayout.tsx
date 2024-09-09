import React from "react";

import { useEffect, useState } from "react";

import XButton from "@/public/icons/XButton.svg";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL } from "@/global/projectConfig";
import { TokenDesc } from "@/components/common/TokenDesc";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import Slider from "@/components/common/Slider";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { Tradesection } from "@/components/detail/Tradesection";
import HomeBondingCurveCard from "@/components/home/HomeBondingCurveCard";
import { setCurStepsIntoState } from "@/utils/getCurve";

export const BuySellLayout = ({
  cid,
  createdBy,
  description,
  marketCap,
  name,
  ticker,
  tokenAddress,
  setInfo,
}: TokenInfo) => {
  const isMobile = typeof window !== undefined && window.innerWidth < 768;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  };
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);

  const fetchBondingCurveProgress = async () => {
    setBondingCurveProgress(
      (await setCurStepsIntoState({ tokenAddress })) || 0,
    );
  };

  useEffect(() => {
    fetchBondingCurveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress]);

  return (
    <div className="md:ml-[20px]">
      <div className="top-[80px] p-5 md:sticky md:p-0 md:pb-[60px]">
        <PageLinkButton
          href={{
            pathname: "/detail",
            query: {
              cid,
              tokenAddress,
              name,
              ticker,
              createdBy,
              description,
            },
          }}
          className="mt-[112px] hidden md:flex"
        >
          View details
        </PageLinkButton>
        <XButton className="ml-auto md:hidden" onClick={setInfo} />
        <div className="relative flex flex-col gap-3 bg-[#252525] pt-[10px] md:mt-[13px] md:h-[950px] md:w-[420px] md:gap-[20px] md:p-[20px]">
          <div className="flex gap-3 md:gap-[20px]">
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt="Image from IPFS"
              className="h-[120px] w-[120px] border-black"
            />
            <TokenDesc
              {...{
                cid,
                createdBy,
                description,
                marketCap,
                name,
                ticker,
                tokenAddress,
              }}
            />
          </div>
          <div className="flex h-[50px] w-full bg-card">
            <Slider
              elements={[
                <ModuleInfo
                  title="Price"
                  className="mr-10 bg-transparent"
                  desc={12345.12 + " ETH"}
                  percentage="+7.31%"
                  key={"price"}
                />,
                <ModuleInfo
                  title="Marketcap"
                  className="mr-10 bg-transparent"
                  desc={marketCap + " ETH"}
                  key={"Marketcap"}
                />,
                <ModuleInfo
                  title="Virtual Liquidity"
                  className="mr-10 bg-transparent"
                  desc={"$112.77k"}
                  key={"Virtual Liquidity"}
                />,
                <ModuleInfo
                  title="24H Volume"
                  className="mr-10 bg-transparent"
                  desc={12345.12 + " ETH"}
                  key={"24H Volume"}
                />,
                <ModuleInfo
                  className="mr-10 bg-transparent"
                  title="Token Created"
                  desc={"47M"}
                  key={"Token Created"}
                />,
              ]}
            />
          </div>
          <div className="hidden h-[250px] w-full bg-[#151527] p-[13px] md:block">
            <div className="flex items-center gap-[7.15px]">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="Image from IPFS"
                className="h-[20.5px] w-[28.5px] border-black "
              />
              <p className="inline-block text-[14.3px] text-white">
                {name.length > 20 ? name.slice(0, 17) + "..." : name} (${" "}
                {ticker}) / ETH
              </p>
            </div>
            <div className="h-[210px] border-black ">
              <TradingViewChart tokenAddress={tokenAddress} />
            </div>
          </div>
          {isMobile && (
            <div className="flex items-center justify-between gap-2 bg-[#1c1c1c] p-1">
              <div className=" overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-[#aeaeae]">
                Contract Address: {tokenAddress}
              </div>
              <button
                onClick={() => copyToClipboard(tokenAddress)}
                className="rounded-md border border-[#8f8f8f] bg-[#0e0e0e] px-2 py-1 text-xs font-bold text-white"
              >
                Copy
              </button>
            </div>
          )}
          <Tradesection
            {...{
              memeTokenSymbol: ticker,
              RESERVE_SYMBOL,
              tokenAddress,
            }}
          />
          {/* <SellPercentageButton /> */}
          {isMobile || (
            <HomeBondingCurveCard prog={Math.floor(bondingCurveProgress)} />
          )}
          <div className="absolute bottom-3 right-5 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#AEAEAE] text-black md:flex">
            ?
          </div>
        </div>
      </div>
    </div>
  );
};
