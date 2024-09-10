"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import BondingCurveCard from "@/components/detail/BondingCurveCard";
import TokenCard from "@/components/detail/TokenCard";

import { BILLION } from "@/global/constants";
import contracts from "@/global/contracts";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import axios from "axios";
import { Tradesection } from "@/components/detail/Tradesection";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import Slider from "@/components/common/Slider";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import { TradesLayout } from "@/layout/detail/TradesLayout";
import { HolderDistributionLayout } from "@/layout/detail/HolderDistrubutionLayout";
import { ChangeMcap, TxlogsMintBurn } from "@/utils/apis/apis";
import { useSearchParams } from "next/navigation";

export default function Detail() {
  const searchParams = useSearchParams();
  const account = useAccount();

  // MARK: - init ethers.js
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);

  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  const [tokenInfo] = useState<TokenInfo>({
    cid: searchParams.get("cid") || "",
    createdBy: searchParams.get("createdBy") || "",
    description: searchParams.get("description") || "",
    name: searchParams.get("name") || "",
    ticker: searchParams.get("ticker") || "",
    tokenAddress: searchParams.get("tokenAddress") || "",
  });
  // const [TXLogsFromServer, setTXLogsFromServer] = useState<any[] | null>(null);
  const [distribution, setDistribution] = useState<FilteredData | undefined>(
    undefined,
  );
  const [TXLogs20FromServer, setTXLogs20FromServer] = useState<any[] | null>(
    null,
  );
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchHolderDistributionFromServer();
      // fetchTXLogsFromServer(tokenInfo.tokenAddress, setTXLogsFromServer);
      fetch20TXLogsFromServer(tokenInfo.tokenAddress, setTXLogs20FromServer);
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTokenDetailFromContract();
    // fetchHomeTokenInfoFromServer();
  }, []);

  // listen event later
  useEffect(() => {
    try {
      if (
        checkMetaMaskInstalled() &&
        checkAccountAddressInitialized(account.address)
      ) {
        setCurStepsIntoState();
      }
    } catch {}
  }, [account?.address]);

  const fetchHolderDistributionFromServer = async () => {
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/HolderDistribution`);
      const data = await response.json();
      const filteredData = filterDataByOuterKey(data, tokenInfo.tokenAddress);
      setDistribution(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokenDetailFromContract = async () => {
    try {
      const detail = await bondContract.getDetail(tokenInfo.tokenAddress);
      const price = detail.info.priceForNextMint;
      console.log("currentSupply :" + detail.info.currentSupply);
      const mcap = (
        Number(ethers.formatEther(price.toString())) * BILLION
      ).toFixed(2);
      console.log({ price });
      console.log("this is mcap" + mcap);
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
      );
      console.log(response.data.price, mcap);
      const marketCapInUSD = (response.data.price * Number(mcap)).toFixed(0);
      await ChangeMcap({
        tokenAddress: tokenInfo.tokenAddress,
        marketCap: Number(marketCapInUSD),
      });
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

  const fetch20TXLogsFromServer = async (
    tokenAddress: any,
    setEventsFromDB: any,
  ) => {
    const response = await TxlogsMintBurn(tokenAddress, { itemCount: 20 });
    console.log("response", response);
    setEventsFromDB(filterEventsByToken(response));
  };

  const checkMetaMaskInstalled = () => {
    if (!window.ethereum) {
      return false;
    }
    return true;
  };

  const checkAccountAddressInitialized = (address: any) => {
    if (!address) {
      return false;
    }
    return true;
  };

  const setCurStepsIntoState = async () => {
    try {
      // Fetch the steps using the getSteps function from the contract
      const steps: BondStep[] = await bondContract.getSteps(
        tokenInfo.tokenAddress,
      );
      // console.log("Fetched steps:", steps);
      const targetPrice = await bondContract.priceForNextMint(
        tokenInfo.tokenAddress,
      );

      // Extract the step prices into a new array
      const stepPrices: bigint[] = steps.map((step) => step.price);

      for (let i = 0; i < stepPrices.length; i++) {
        // console.log("stepPrices[i]:" + stepPrices[i]);
        // console.log("stepPrices.length:" + stepPrices.length);

        if (Number(stepPrices[i]) == Number(targetPrice)) {
          setBondingCurveProgress(((i + 1) / stepPrices.length) * 100);
        }
      }

      // console.log("Extracted step prices:", stepPrices);
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const filterEventsByToken = (data: any): Event[] => {
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
          <TokenCard {...tokenInfo} />
          {/* progress bar + desc */}
          <div className="relative w-[450px] rounded-tr-[100px] bg-card  py-[13px] pl-[10px] pr-[66px]">
            <BondingCurveCard prog={Math.floor(bondingCurveProgress)} />
          </div>
        </div>
        <div className="mt-[30px] flex h-[50px] w-full bg-card">
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
                desc={tokenInfo.marketCap + " ETH"}
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

        {/* trading view chart */}
        <div className="mt-[30px] h-[372px] w-full">
          <TradingViewChart tokenAddress={tokenInfo.tokenAddress} />
        </div>

        {/* past trading record */}
        <TradesLayout
          {...{
            memeTokenSymbol: tokenInfo.ticker,
            TXLogs20FromServer,
          }}
        />
      </div>

      {/* right side */}
      <div>
        <div className="mt-[38px] h-[310px] w-[470px] bg-[#252525] p-[20px]">
          <Tradesection
            {...{
              memeTokenSymbol: tokenInfo.ticker,
              RESERVE_SYMBOL,
              tokenAddress: tokenInfo.tokenAddress,
            }}
          />
        </div>
        <HolderDistributionLayout
          {...{ distribution, creator: tokenInfo.createdBy || "" }}
        />
      </div>
    </main>
  );
}
