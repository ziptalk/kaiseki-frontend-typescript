"use client";
import { useEffect, useState } from "react";
import BondingCurveCard from "@/components/detail/BondingCurveCard";
import TokenCard from "@/components/detail/TokenCard";
import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL } from "@/global/projectConfig";
import { Tradesection } from "@/components/detail/Tradesection";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import Slider from "@/components/common/Slider";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import { TradesLayout } from "@/layout/detail/TradesLayout";
import { HolderDistributionLayout } from "@/layout/detail/HolderDistrubutionLayout";
import {
  FindTokenByAddress,
  HolderDistribution,
  TxlogsMintBurn,
} from "@/utils/apis/apis";
import { TokenAllInfo, TokenInfoInit } from "@/utils/apis/type";
import { getDataFromToken } from "@/utils/getCurve";
import { BarData } from "lightweight-charts";
import Sorry from "@/public/icons/sorry.svg";

export default function Detail({ params }: { params: { id: string } }) {
  const [volume, setvolume] = useState<string>("0");
  const [tokenInfo, setTokenInfo] = useState<TokenAllInfo>(TokenInfoInit);
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [TokenCreated, setTokenCreated] = useState("0");
  const [TXLogsFromServer, setTXLogsFromServer] = useState<any[]>([]);
  const [pricePercentage, setPricePercentage] = useState({
    price: 0,
    percentage: 0,
  });
  const [Chartdata, setChartData] = useState<BarData[]>();
  const [width, setWidth] = useState(1000);
  const [distribution, setDistribution] = useState<FilteredData | undefined>(
    undefined,
  );

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    FindTokenByAddress(params.id).then((res) => {
      setTokenInfo(res);
    });
    fetchHolderDistributionFromServer();
    getDataFromToken(params.id).then((res) => {
      setPricePercentage(res.price);
      setvolume(res.volume);
      setTokenCreated(res.tokenCreated);
      setBondingCurveProgress(res.bondingCurve);
      setChartData(res.chartData);
      setTXLogsFromServer(res.txlogsFromServer);
    });

    const interval = setInterval(() => {
      fetchHolderDistributionFromServer();
      getDataFromToken(params.id).then((res) => {
        setPricePercentage(res.price);
        setvolume(res.volume);
        setTokenCreated(res.tokenCreated);
        setBondingCurveProgress(res.bondingCurve);
        setChartData(res.chartData);
        setTXLogsFromServer(res.txlogsFromServer);
      });
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [params.id]);

  const fetchHolderDistributionFromServer = async () => {
    const filterDataByOuterKey = (data: any, targetOuterKey: string) => {
      if (targetOuterKey in data) {
        return { [targetOuterKey]: data[targetOuterKey] };
      }
      return {};
    };
    try {
      const data = await HolderDistribution();
      const filteredData = filterDataByOuterKey(data, params.id);
      setDistribution(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  //MARK: - Set Distribution
  return width < 768 ? (
    <main className="flex h-[70vh] w-[100vw] flex-col items-center justify-center gap-4">
      <Sorry />
      <div className="w-[229px] text-center text-[15px] font-bold text-white">
        The detail page is not available on mobile devices.
      </div>
    </main>
  ) : (
    <main className="flex w-full justify-center gap-[30px]">
      {/* left side */}
      <div className="w-[860px]">
        <PageLinkButton href="/" prev>
          Back Home
        </PageLinkButton>
        <div className="mt-[10px] flex justify-between">
          {/* token card */}
          <TokenCard
            {...{
              name: tokenInfo.name,
              cid: tokenInfo.cid,
              ticker: tokenInfo.symbol,
              createdBy: tokenInfo.creator,
              description: tokenInfo.description,
              tokenAddress: params.id,
              rafflePrize: tokenInfo.rafflePrize,
              twitterUrl: tokenInfo.twitterUrl,
              websiteUrl: tokenInfo.websiteUrl,
              telegramUrl: tokenInfo.telegramUrl,
            }}
          />
          {/* progress bar + desc */}
          <div className="relative w-[450px] rounded-tr-[100px] bg-card  py-[13px] pl-[10px] pr-[66px]">
            <BondingCurveCard prog={bondingCurveProgress} />
          </div>
        </div>
        <div className="mt-[30px] flex h-[50px] w-full bg-card">
          <Slider
            elements={[
              <ModuleInfo
                title="Price"
                className="mr-20 bg-transparent"
                desc={pricePercentage.price + " ETH"}
                percentage={pricePercentage.percentage}
                key={"price-detail"}
              />,
              <ModuleInfo
                title="Marketcap"
                className="mr-20 bg-transparent"
                desc={tokenInfo.marketCap + " ETH"}
                key={"Marketcap-detail"}
              />,
              <ModuleInfo
                title="24H Volume"
                className="mr-20 bg-transparent"
                desc={volume + " ETH"}
                key={"24H Volume-detail"}
              />,
              <ModuleInfo
                className="mr-20 bg-transparent"
                title="Token Created"
                desc={TokenCreated + "K"}
                key={"Token Created-detail"}
              />,
            ]}
          />
        </div>

        {/* trading view chart */}
        <div className="mt-[30px] h-[372px] w-full">
          <TradingViewChart
            {...{
              tokenAddress: params.id,
            }}
          />
        </div>

        {/* past trading record */}
        <TradesLayout
          {...{
            memeTokenSymbol: tokenInfo.symbol,
            TXLogsFromServer: [...TXLogsFromServer]?.reverse().slice(0, 20),
          }}
        />
      </div>

      {/* right side */}
      <div>
        <div className="mt-[38px] h-[310px] w-[470px] bg-[#252525] p-[20px]">
          <Tradesection
            {...{
              memeTokenSymbol: tokenInfo.symbol,
              RESERVE_SYMBOL,
              tokenAddress: params.id,
              cid: tokenInfo.cid,
            }}
          />
        </div>
        <HolderDistributionLayout
          {...{ distribution, creator: tokenInfo.creator || "" }}
        />
      </div>
    </main>
  );
}
