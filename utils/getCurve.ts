import contracts from "@/global/contracts";
import { ethers } from "ethers";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import { ChangeMcap, FindTokenByAddress, TxlogsMintBurn } from "./apis/apis";
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  BarData,
  DeepPartial,
  ChartOptions,
} from "lightweight-charts";
import { createStep, initialPrice, stepRanges } from "@/global/createValue";
import { TokenAllInfo } from "./apis/type";

export const setCurStepsIntoState = async ({
  tokenAddress,
}: {
  tokenAddress: string;
}) => {
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  try {
    // Fetch the steps using the getSteps function from the contract
    const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
    const detail = await bondContract.getDetail(tokenAddress);
    const targetPrice = detail.info.priceForNextMint;
    const stepPrices: bigint[] = steps.map((step) => step.price);

    for (let i = 0; i < stepPrices.length; i++) {
      if (Number(stepPrices[i]) == Number(targetPrice)) {
        return {
          curve: Math.floor(((i + 1) / stepPrices.length) * 100),
          marketCap: Number(
            Number(
              ethers.formatEther(
                targetPrice *
                  BigInt(
                    Number(
                      ethers.formatEther(detail.info.currentSupply),
                    ).toFixed(0),
                  ),
              ),
            ).toFixed(5),
          ),
          tokenCreated:
            Number(ethers.formatEther(detail.info.currentSupply)) !== 0
              ? BigInt(
                  Number(ethers.formatEther(detail.info.currentSupply)).toFixed(
                    0,
                  ),
                ) / BigInt(1000)
              : 0,
        };
      }
    }

    // console.log("Extracted step prices:", stepPrices);
  } catch (error: any) {
    console.error("Error:", error);
  }
};

export const getDataFromToken = async (
  tokenAddress: string,
  threshold: number,
) => {
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  // const sp = createStep(threshold).slice(1, 101);
  // console.log("sp", sp, threshold);
  const steps: BondStep[] = await bondContract.getSteps(tokenAddress); // 서버로 마이그레이션 작업 필요
  const sp: bigint[] = steps.map((step) => step.price).slice(1, 101);
  const data = await TxlogsMintBurn(tokenAddress);
  const filteredData = filterEventsByToken(data);
  const currentSupply = getTokenCreated(filteredData);
  const chartData = getChartData(filteredData, sp);
  const marketCap = Number(
    (chartData[chartData.length - 1]?.close || 0) *
      (Number(currentSupply) + 200000) *
      1000,
  ).toFixed(5);
  await ChangeMcap({ tokenAddress, marketCap: Number(marketCap) });

  return {
    price: {
      price: chartData[chartData.length - 1]?.close || 0,
      percentage: Math.ceil(
        ((chartData[chartData.length - 1]?.close || 0) /
          (chartData[chartData.length - 1]?.open || 0)) *
          100 -
          100,
      ),
    },
    volume: await get24HVolume(filteredData),
    tokenCreated: (Number(currentSupply) + 200000).toFixed(),
    bondingCurve: getBondingCurve(Number(currentSupply)),
    chartData,
    txlogsFromServer: filteredData,
  };
};

function filterEventsByToken(data: any) {
  const filteredMintEvents = data?.mintEvents.map((event: any) => ({
    ...event,
    isMint: true,
  }));
  const filteredBurnEvents = data?.burnEvents.map((event: any) => ({
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

const getBondingCurve = (currentSupply: number) => {
  return Math.floor(Number(currentSupply * 1000) / 8000000);
};

const get24HVolume = (filteredData: any) => {
  var value = 0;
  filteredData?.map((item: any) => {
    if (
      new Date(item.blockTimestamp).getTime() >=
      new Date().getTime() - 37 * 60 * 60 * 1000
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
  });
  return value.toFixed(5);
};

const getTokenCreated = (filteredData: any) => {
  let curMintedToken = BigInt(0);
  for (const event of filteredData) {
    if (event.isMint) {
      curMintedToken += BigInt(event.amountMinted);
    } else {
      curMintedToken -= BigInt(event.amountBurned);
    }
  }
  return Number(ethers.formatEther(curMintedToken)) !== 0
    ? Math.floor(Number(ethers.formatEther(curMintedToken))) / 1000
    : 0;
};

const getChartData = (filteredData: any, sp: bigint[]) => {
  let curMintedToken = BigInt(0);
  // const sr = stepRanges;

  const newChartData: BarData[] = [];

  if (filteredData.length == 0) {
    // 거래 내역이 없을 경우 기본 데이터 추가
    newChartData.push({
      time: Math.floor(Date.now() / 1000) as UTCTimestamp,
      open: initialPrice,
      high: initialPrice,
      low: initialPrice,
      close: initialPrice,
    });
  }
  for (const event of filteredData) {
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
    if (divValue >= 0 && divValue < sp.length && divValue < 100) {
      const newDataPoint = {
        time: timestamp,
        open:
          newChartData.length > 0
            ? newChartData[newChartData.length - 1].close
            : initialPrice,
        high: Number(ethers.formatEther(sp[divValue])),
        low: Number(ethers.formatEther(sp[divValue])),
        close: Number(ethers.formatEther(sp[divValue])),
      };
      newChartData.push(newDataPoint);
      // console.log(newDataPoint);
    } else if (divValue >= 100) {
      const newDataPoint = {
        time: timestamp,
        open:
          newChartData.length > 0
            ? newChartData[newChartData.length - 1].close
            : initialPrice,
        high: Number(ethers.formatEther(sp[sp.length - 1])),
        low: Number(ethers.formatEther(sp[sp.length - 1])),
        close: Number(ethers.formatEther(sp[sp.length - 1])),
      };
      newChartData.push(newDataPoint);
    }
  }
  return newChartData;
  // setRef.current?.setData(newChartData);
};
