import { useEffect, useState } from "react";
import XButton from "@/public/icons/XButton.svg";
import TradingViewChart from "@/components/common/TradingViewWidget";
import { TokenDesc } from "@/components/common/TokenDesc";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import Slider from "@/components/common/Slider";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { Tradesection } from "@/components/detail/Tradesection";
import HomeBondingCurveCard from "@/components/home/HomeBondingCurveCard";
import { getDataFromToken, setCurStepsIntoState } from "@/utils/getCurve";
import { ethers } from "ethers";
import { FindTokenByAddress, TxlogsMintBurn } from "@/utils/apis/apis";
import { BarData, UTCTimestamp } from "lightweight-charts";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { TokenAllInfo, TokenInfoInit } from "@/utils/apis/type";

export const BuySellLayout = ({
  tokenAddress,
  setInfo,
}: {
  tokenAddress: string;
  setInfo: () => void;
}) => {
  const isMobile = typeof window !== undefined && window.innerWidth < 768;
  const [volume, setvolume] = useState<string>("0");
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [TokenCreated, setTokenCreated] = useState("0");
  const [Chartdata, setChartData] = useState<BarData[]>();
  const [pricePercentage, setPricePercentage] = useState({
    price: 0,
    percentage: 0,
  });
  const [tokenInfo, setTokenInfo] = useState<TokenAllInfo>(TokenInfoInit);

  useEffect(() => {
    FindTokenByAddress(tokenAddress).then((res) => {
      setTokenInfo(res);
    });

    getDataFromToken(tokenAddress, tokenInfo.threshold)
      .then((res) => {
        setPricePercentage(res.price);
        setvolume(res.volume);
        setTokenCreated(res.tokenCreated);
        setBondingCurveProgress(res.bondingCurve);
        setChartData(res.chartData);
      })
      .catch((e) => {
        console.error(e);
      });

    const interval = setInterval(() => {
      getDataFromToken(tokenAddress, tokenInfo.threshold)
        .then((res) => {
          setPricePercentage(res.price);
          setvolume(res.volume);
          setTokenCreated(res.tokenCreated);
          setBondingCurveProgress(res.bondingCurve);
          setChartData(res.chartData);
        })
        .catch((e) => {
          console.error(e);
        });
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [tokenAddress]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="md:ml-[20px]"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="top-[80px] p-5 md:p-0 md:pb-[60px]">
        <PageLinkButton
          href={tokenAddress}
          className="mt-[112px] hidden md:flex"
        >
          View details
        </PageLinkButton>
        <XButton className="ml-auto md:hidden" onClick={setInfo} />
        <div className="relative flex flex-col gap-3 bg-[#252525] pt-[10px] md:mt-[13px] md:h-[950px] md:w-[420px] md:gap-[20px] md:p-[20px]">
          <div className="flex gap-3 md:gap-[20px]">
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${tokenInfo.cid}`}
              alt="Image from IPFS"
              className="h-[120px] w-[120px] border-black"
            />
            <TokenDesc
              {...{
                cid: tokenInfo.cid,
                createdBy: tokenInfo.creator,
                rafflePrize: tokenInfo.rafflePrize,
                description: tokenInfo.description,
                name: tokenInfo.name,
                ticker: tokenInfo.symbol,
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
                  desc={pricePercentage.price + " ETH"}
                  percentage={pricePercentage.percentage}
                  key={"price"}
                />,
                <ModuleInfo
                  title="Marketcap"
                  className="mr-10 bg-transparent"
                  desc={tokenInfo.marketCap + " ETH"}
                  key={"Marketcap"}
                />,
                <ModuleInfo
                  title="24H Volume"
                  className="mr-10 bg-transparent"
                  desc={volume + " ETH"}
                  key={"24H Volume"}
                />,
                <ModuleInfo
                  className="mr-10 bg-transparent"
                  title="Token Created"
                  desc={TokenCreated + "K"}
                  key={"Token Created"}
                />,
              ]}
            />
          </div>
          <div className="hidden h-[250px] w-full bg-[#151527] p-[13px] md:block">
            <div className="flex items-center gap-[7.15px]">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${tokenInfo.cid}`}
                alt="Image from IPFS"
                className="h-[28.5px] w-[28.5px] border-black "
              />
              <p className="inline-block text-[14.3px] text-white">
                {tokenInfo.name.length > 20
                  ? tokenInfo.name.slice(0, 17) + "..."
                  : tokenInfo.name}{" "}
                ($ {tokenInfo.symbol}) / ETH
              </p>
            </div>
            <div className="h-[210px] border-black ">
              <TradingViewChart
                {...{
                  tokenAddress,
                  chartData: Chartdata || [],
                }}
              />
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
              memeTokenSymbol: tokenInfo.symbol,
              tokenAddress,
              cid: tokenInfo.cid,
            }}
          />
          {/* <SellPercentageButton /> */}
          {isMobile || <HomeBondingCurveCard prog={bondingCurveProgress} />}
          {/* <div className="absolute bottom-3 right-5 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#AEAEAE] text-black md:flex">
            ?
          </div> */}
        </div>
      </div>
    </div>
  );
};
