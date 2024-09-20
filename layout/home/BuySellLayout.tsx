import { useEffect, useState } from "react";
import XButton from "@/public/icons/XButton.svg";
import TradingViewChart from "@/components/common/TradingViewWidget";
import { TokenDesc } from "@/components/common/TokenDesc";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import Slider from "@/components/common/Slider";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { Tradesection } from "@/components/detail/Tradesection";
import HomeBondingCurveCard from "@/components/home/HomeBondingCurveCard";
import { setCurStepsIntoState } from "@/utils/getCurve";
import { ethers } from "ethers";
import { TxlogsMintBurn } from "@/utils/apis/apis";
import { BarData, UTCTimestamp } from "lightweight-charts";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import { SERVER_ENDPOINT } from "@/global/projectConfig";

export const BuySellLayout = ({
  cid,
  createdBy,
  description,
  rafflePrize,
  // marketCap,
  name,
  ticker,
  tokenAddress,
  setInfo,
}: TokenInfo) => {
  const isMobile = typeof window !== undefined && window.innerWidth < 768;
  const [volume, setvolume] = useState<string>("0");
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [TokenCreated, setTokenCreated] = useState(0);
  const [TXLogsFromServer, setTXLogsFromServer] = useState<any[]>([]);
  const [Chartdata, setChartData] = useState<BarData[]>();
  const [pricePercentage, setPricePercentage] = useState({
    price: 0,
    percentage: 0,
  });
  const [getOnce, setGetOnce] = useState(false);
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  useEffect(() => {
    if (Chartdata) {
      setPricePercentage({
        price: Chartdata[Chartdata.length - 1]?.close || 0,
        percentage: Math.ceil(
          ((Chartdata[Chartdata.length - 1]?.close || 0) /
            (Chartdata[Chartdata.length - 1]?.open || 0)) *
            100 -
            100,
        ),
      });
    }
  }, [Chartdata]);

  useEffect(() => {
    const interval = setInterval(() => {
      // fetchTXLogsFromServer(tokenInfo.tokenAddress, setTXLogsFromServer);
      fetch20TXLogsFromServer();
      fetchAndUpdateData();
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, [tokenAddress]);

  useEffect(() => {
    // fetchTXLogsFromServer(tokenInfo.tokenAddress, setTXLogsFromServer);
    fetch20TXLogsFromServer();
    fetchAndUpdateData();
    // fetchHomeTokenInfoFromServer();
  }, [getOnce, tokenAddress]);

  const fetch20TXLogsFromServer = async () => {
    const response = await TxlogsMintBurn(tokenAddress);
    setTXLogsFromServer(filterEventsByToken(response, tokenAddress));
  };
  function filterEventsByToken(data: any, token: any) {
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
        new Date(a.blockTimestamp).getTime() -
        new Date(b.blockTimestamp).getTime(),
    );

    return combinedEvents;
  }

  useEffect(() => {
    var value = 0;
    TXLogsFromServer?.map((item) => {
      if (
        new Date(item.blockTimestamp).getTime() >=
        new Date().getTime() - 24 * 60 * 60 * 1000
      ) {
        if (item.isMint) {
          value +=
            Math.ceil(Number(ethers.formatEther(item.reserveAmount)) * 10000) /
            10000;
        } else {
          value +=
            Math.ceil(Number(ethers.formatEther(item.refundAmount)) * 10000) /
            10000;
        }
      }
      // console.log(marketCap);
    });
    setvolume(value.toFixed(5));
  }, [TXLogsFromServer]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBondingCurveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress]);

  const fetchBondingCurveProgress = async () => {
    await setCurStepsIntoState({ tokenAddress }).then((res) => {
      setBondingCurveProgress(res?.curve || 0);
      setMarketCap(res?.marketCap || 0);
      setTokenCreated(Number(res?.tokenCreated) || 0);
    });
  };

  const fetchAndUpdateData = async () => {
    try {
      const response = await fetch(
        `${SERVER_ENDPOINT}/TxlogsMintBurn/${tokenAddress}`,
      );
      const data = await response.json();
      const filteredData = filterEventsByToken(data, tokenAddress);

      let curMintedToken = BigInt(0);
      const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
      const sp: bigint[] = steps.map((step) => step.price);
      // const sr = stepRanges;

      const newChartData: BarData[] = [];

      if (filteredData.length == 0) {
        // 거래 내역이 없을 경우 기본 데이터 추가
        newChartData.push({
          time: Math.floor(Date.now() / 1000) as UTCTimestamp,
          open: 0.000000000005,
          high: 0.000000000005,
          low: 0.000000000005,
          close: 0.000000000005,
        });
      }
      for (const event of filteredData) {
        // console.log(event);
        const date = new Date(event.blockTimestamp);
        let timestamp = (Math.floor(date.getTime() / 1000) -
          9 * 60 * 60) as UTCTimestamp; // 한국 표준시 UTC로 변환하기 위해 마이너스

        // 동일한 타임스탬프를 가진 데이터 포인트가 있으면, 1초씩 증가시켜 유니크하게 만듭니다.
        while (newChartData.some((entry) => entry.time === timestamp)) {
          timestamp = (timestamp + 1) as UTCTimestamp;
        }
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
            time: timestamp,
            open:
              newChartData.length > 0
                ? newChartData[newChartData.length - 1].close
                : 0.000000000005,
            high: Number(ethers.formatEther(sp[divValue])),
            low: Number(ethers.formatEther(sp[divValue])),
            close: Number(ethers.formatEther(sp[divValue])),
          };
          newChartData.push(newDataPoint);
        }
      }

      // 데이터가 시간 순서대로 정렬되어 있는지 확인
      newChartData.sort((a, b) => (a.time as number) - (b.time as number));

      // 시리즈 데이터 업데이트
      // if (seriesRef.current) {
      //   seriesRef.current.setData(newChartData);
      // }

      // // chartData 상태 업데이트
      setChartData(newChartData);

      if (newChartData.length >= 1) {
        setGetOnce(true);
      }
    } catch (error) {
      console.log(error);
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
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt="Image from IPFS"
              className="h-[120px] w-[120px] border-black"
            />
            <TokenDesc
              {...{
                cid,
                createdBy,
                rafflePrize,
                description,
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
                  desc={pricePercentage.price + " ETH"}
                  percentage={pricePercentage.percentage}
                  key={"price"}
                />,
                <ModuleInfo
                  title="Marketcap"
                  className="mr-10 bg-transparent"
                  desc={marketCap + " ETH"}
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
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="Image from IPFS"
                className="h-[28.5px] w-[28.5px] border-black "
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
              tokenAddress,
              cid,
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
