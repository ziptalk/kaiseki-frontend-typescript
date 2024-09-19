"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import BondingCurveCard from "@/components/detail/BondingCurveCard";
import TokenCard from "@/components/detail/TokenCard";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
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
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import { TokenAllInfo, TokenInfoInit } from "@/utils/apis/type";
import { setCurStepsIntoState } from "@/utils/getCurve";
import contracts from "@/global/contracts";
import { BarData, UTCTimestamp } from "lightweight-charts";

export default function Detail({ params }: { params: { id: string } }) {
  const [volume, setvolume] = useState<string>("0");
  const [tokenInfo, setTokenInfo] = useState<TokenAllInfo>(TokenInfoInit);
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [TokenCreated, setTokenCreated] = useState(0);
  const [TXLogsFromServer, setTXLogsFromServer] = useState<any[]>([]);
  const [pricePercentage, setPricePercentage] = useState({
    price: 0,
    percentage: 0,
  });
  const [Chartdata, setChartData] = useState<BarData>();

  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  useEffect(() => {
    setPricePercentage({
      price: Chartdata?.close || 0,
      percentage: Math.ceil(
        ((Chartdata?.close || 0) / (Chartdata?.open || 0)) * 100 - 100,
      ),
    });
  }, [Chartdata]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchHolderDistributionFromServer();
      // fetchTXLogsFromServer(tokenInfo.tokenAddress, setTXLogsFromServer);
      fetch20TXLogsFromServer();
      fetchAndUpdateData();
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getTokenInfo();
    fetchHolderDistributionFromServer();
    // fetchTXLogsFromServer(tokenInfo.tokenAddress, setTXLogsFromServer);
    fetch20TXLogsFromServer();
    fetchAndUpdateData();
    // fetchHomeTokenInfoFromServer();
  }, []);

  useEffect(() => {
    var value = 0;
    var marketCap = 0;
    // console.log(TXLogsFromServer);
    TXLogsFromServer?.map((item) => {
      if (
        new Date(item.blockTimestamp).getTime() <
        new Date().getTime() - 24 * 60 * 60 * 1000
      )
        return;
      if (item.isMint) {
        marketCap += Number(ethers.formatEther(item.amountMinted));
        value +=
          Math.ceil(Number(ethers.formatEther(item.reserveAmount)) * 10000) /
          10000;
      } else {
        marketCap -= Number(ethers.formatEther(item.amountBurned));
        value +=
          Math.ceil(Number(ethers.formatEther(item.refundAmount)) * 10000) /
          10000;
      }
      // console.log(marketCap);
    });
    setvolume(value.toFixed(5));
  }, [TXLogsFromServer]);

  const fetchBondingCurveProgress = async () => {
    await setCurStepsIntoState({ tokenAddress: params.id }).then((res) => {
      setBondingCurveProgress(res?.curve || 0);
      setMarketCap(res?.marketCap || 0);
      setTokenCreated(Number(res?.tokenCreated) || 0);
    });
  };
  useEffect(() => {
    fetchBondingCurveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
  const getTokenInfo = async () => {
    const response = setTokenInfo(await FindTokenByAddress(params.id));
    // console.log(response);
    return response;
  };
  // const [TXLogsFromServer, setTXLogsFromServer] = useState<any[] | null>(null);
  const [distribution, setDistribution] = useState<FilteredData | undefined>(
    undefined,
  );

  const fetchAndUpdateData = async () => {
    try {
      const response = await fetch(
        `${SERVER_ENDPOINT}/TxlogsMintBurn/${params.id}`,
      );
      const data = await response.json();
      const filteredData = filterEventsByToken(data);
      let curMintedToken = BigInt(0);
      const steps: BondStep[] = await bondContract.getSteps(params.id);
      const sp: bigint[] = steps.map((step) => step.price);

      const newChartData: BarData[] = [];
      for (const event of filteredData.slice(-1)) {
        if (event.isMint) {
          curMintedToken += BigInt(event.amountMinted);
        } else {
          curMintedToken -= BigInt(event.amountBurned);
        }

        const divValue = Math.floor(
          Number(curMintedToken) / Number(ethers.parseEther("8000000")),
        );
        if (divValue >= 0 && divValue < sp.length) {
          const newDataPoint = {
            time: new Date(event.blockTimestamp).getTime() as UTCTimestamp,
            open:
              newChartData.length > 0
                ? newChartData[newChartData.length - 1].close
                : 0.000000000005,
            high: Number(ethers.formatEther(sp[divValue])),
            low: Number(ethers.formatEther(sp[divValue])),
            close: Number(ethers.formatEther(sp[divValue])),
          };
          setChartData(newDataPoint);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    var value = 0;
    var marketCap = 0;
    // console.log(TXLogsFromServer);
    TXLogsFromServer?.map((item) => {
      if (
        new Date(item.blockTimestamp).getTime() <
        new Date().getTime() - 24 * 60 * 60 * 1000
      )
        return;
      if (item.isMint) {
        marketCap += Number(ethers.formatEther(item.amountMinted));
        value +=
          Math.ceil(Number(ethers.formatEther(item.reserveAmount)) * 10000) /
          10000;
      } else {
        marketCap -= Number(ethers.formatEther(item.amountBurned));
        value +=
          Math.ceil(Number(ethers.formatEther(item.refundAmount)) * 10000) /
          10000;
      }
      // console.log(marketCap);
    });
    setvolume(value.toFixed(5));
  }, [TXLogsFromServer]);

  const fetchHolderDistributionFromServer = async () => {
    try {
      const data = await HolderDistribution();
      const filteredData = filterDataByOuterKey(data, params.id);
      setDistribution(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchTXLogsFromServer = async (
  //   tokenAddress: string,
  //   setEventsFromDB: any,
  // ) => {
  //   const response = await TxlogsMintBurn(tokenAddress);
  //   setEventsFromDB(response);
  // };

  const fetch20TXLogsFromServer = async () => {
    const response = await TxlogsMintBurn(params.id);
    setTXLogsFromServer(filterEventsByToken(response));
  };

  // const checkMetaMaskInstalled = () => {
  //   if (!window.ethereum) {
  //     return false;
  //   }
  //   return true;
  // };

  // const checkAccountAddressInitialized = (address: any) => {
  //   if (!address) {
  //     return false;
  //   }
  //   return true;
  // };

  const filterEventsByToken = (data: any): any[] => {
    try {
      const filteredMintEvents = data.mintEvents.map((event: any) => ({
        ...event,
        isMint: true,
      }));

      const filteredBurnEvents = data.burnEvents.map((event: any) => ({
        ...event,
        isMint: false,
      }));

      const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
      combinedEvents.sort(
        (a, b) =>
          new Date(b.blockTimestamp).getTime() -
          new Date(a.blockTimestamp).getTime(),
      );

      return combinedEvents;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  //MARK: - Set Distribution
  const filterDataByOuterKey = (data: any, targetOuterKey: string) => {
    if (targetOuterKey in data) {
      return { [targetOuterKey]: data[targetOuterKey] };
    }
    return {};
  };
  return (
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
                className="mr-10 bg-transparent"
                desc={pricePercentage.price + " ETH"}
                percentage={pricePercentage.percentage + " %"}
                key={"price"}
              />,
              <ModuleInfo
                title="Marketcap"
                className="mr-20 bg-transparent"
                desc={marketCap + " ETH"}
                key={"Marketcap"}
              />,
              <ModuleInfo
                title="24H Volume"
                className="mr-20 bg-transparent"
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
            TXLogsFromServer: TXLogsFromServer?.slice(0, 20),
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
