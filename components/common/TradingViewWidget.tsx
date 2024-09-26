import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  BarData,
  DeepPartial,
  ChartOptions,
} from "lightweight-charts";
import { ethers } from "ethers";

// import { stepRanges } from "@/global/createValue";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import { initialPrice } from "@/global/createValue";
import { getDataFromToken } from "@/utils/getCurve";

const { abi: MCV2_BondABI } = MCV2_BondArtifact;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
const bondContract = new ethers.Contract(
  contracts.MCV2_Bond,
  MCV2_BondABI,
  provider,
);

type TradingViewChartProps = {
  tokenAddress: string;
  chartData: BarData[];
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  tokenAddress,
  chartData,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // Ref for the chart
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null); // Ref for the series
  // const [chartData, setChartData] = useState<BarData[]>([]);
  // const [ready, setReady] = useState(false);
  // const [getOnce, setGetOnce] = useState(false);

  // useEffect(() => {
  //   fetchAndUpdateData();
  //   // console.log(getDataFromToken(tokenAddress));
  // }, [getOnce, tokenAddress]);

  // function filterEventsByToken(data: any, token: any) {
  //   const filteredMintEvents = data.mintEvents.map((event: any) => ({
  //     ...event,
  //     isMint: true,
  //   }));

  //   const filteredBurnEvents = data.burnEvents.map((event: any) => ({
  //     ...event,
  //     isMint: false,
  //   }));

  //   const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];

  //   combinedEvents.sort(
  //     (a, b) =>
  //       new Date(a.blockTimestamp).getTime() -
  //       new Date(b.blockTimestamp).getTime(),
  //   );

  //   return combinedEvents;
  // }

  // const fetchAndUpdateData = async () => {
  //   try {
  //     const response = await fetch(
  //       `${SERVER_ENDPOINT}/TxlogsMintBurn/${tokenAddress}`,
  //     );
  //     const data = await response.json();
  //     const filteredData = filterEventsByToken(data, tokenAddress);

  //     let curMintedToken = BigInt(0);
  //     const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
  //     const sp: bigint[] = steps.map((step) => step.price).slice(1, 101);
  //     // const sr = stepRanges;

  //     const newChartData: BarData[] = [];

  //     if (filteredData.length == 0) {
  //       // 거래 내역이 없을 경우 기본 데이터 추가
  //       newChartData.push({
  //         time: Math.floor(Date.now() / 1000) as UTCTimestamp,
  //         open: initialPrice,
  //         high: initialPrice,
  //         low: initialPrice,
  //         close: initialPrice,
  //       });
  //     }
  //     for (const event of filteredData) {
  //       const date = new Date(event.blockTimestamp);
  //       let timestamp = (Math.floor(date.getTime() / 1000) -
  //         9 * 60 * 60) as UTCTimestamp; // 한국 표준시 UTC로 변환하기 위해 마이너스

  //       // 동일한 타임스탬프를 가진 데이터 포인트가 있으면, 1초씩 증가시켜 유니크하게 만듭니다.
  //       while (newChartData.some((entry) => entry.time === timestamp)) {
  //         timestamp = (timestamp + 1) as UTCTimestamp;
  //       }
  //       if (event.isMint) {
  //         curMintedToken += BigInt(event.amountMinted);
  //       } else {
  //         curMintedToken -= BigInt(event.amountBurned);
  //       }
  //       const divValue = Math.floor(
  //         Number(curMintedToken) / Number(ethers.parseEther("8000000")),
  //       );
  //       if (divValue >= 0 && divValue < sp.length && divValue < 100) {
  //         const newDataPoint = {
  //           time: timestamp,
  //           open:
  //             newChartData.length > 0
  //               ? newChartData[newChartData.length - 1].close
  //               : initialPrice,
  //           high: Number(ethers.formatEther(sp[divValue])),
  //           low: Number(ethers.formatEther(sp[divValue])),
  //           close: Number(ethers.formatEther(sp[divValue])),
  //         };
  //         newChartData.push(newDataPoint);
  //         // console.log(newDataPoint);
  //       } else if (divValue >= 100) {
  //         const newDataPoint = {
  //           time: timestamp,
  //           open:
  //             newChartData.length > 0
  //               ? newChartData[newChartData.length - 1].close
  //               : initialPrice,
  //           high: Number(ethers.formatEther(sp[sp.length - 1])),
  //           low: Number(ethers.formatEther(sp[sp.length - 1])),
  //           close: Number(ethers.formatEther(sp[sp.length - 1])),
  //         };
  //         newChartData.push(newDataPoint);
  //       }
  //     }

  //     // 데이터가 시간 순서대로 정렬되어 있는지 확인
  //     newChartData.sort((a, b) => (a.time as number) - (b.time as number));

  //     // 시리즈 데이터 업데이트
  //     if (seriesRef.current) {
  //       seriesRef.current.setData(newChartData);
  //     }

  //     // chartData 상태 업데이트
  //     // setChartData(newChartData);

  //     if (newChartData.length >= 1) {
  //       setGetOnce(true);
  //     }

  //     setReady(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // console.log(JSON.stringify(chartData, null, 2) + "chartdata");
    if (chartData.length === 0) return;
    if (chartContainerRef.current) {
      const chartOptions: DeepPartial<ChartOptions> = {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: "#151527" },
          textColor: "#DDD",
        },

        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          tickMarkFormatter: (time: UTCTimestamp) => {
            const date = new Date(time * 1000);
            return `${date.getUTCHours().toString().padStart(2, "0")}:${date
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}:${date
              .getUTCSeconds()
              .toString()
              .padStart(2, "0")}`;
          },
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);

      const candlestickSeries = chart.addCandlestickSeries({
        autoscaleInfoProvider: (original: any) => {
          const res = original();
          if (res !== null) {
            var minValue = chartData
              .slice(-20)
              .reduce(
                (min, p) => (p.open < min ? p.open : min),
                chartData[0].open,
              );
            var maxValue = chartData
              .slice(-20)
              .reduce(
                (max, p) => (p.high > max ? p.high : max),
                chartData[0].high,
              );
            res.priceRange.minValue = minValue;
            res.priceRange.maxValue = maxValue;
            // res.priceRange.minValue -= 0.00000000001;
            // res.priceRange.maxValue += 0.00000000001;
          }
          return res;
        },
      });
      candlestickSeries.setData(chartData);
      candlestickSeries.applyOptions({
        priceFormat: {
          type: "price",
          precision: 13,
          minMove: 0.0000000000001,
        },
      });

      // Store the chart and series references
      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      // Update data every 3 seconds
      const intervalId = setInterval(() => {}, 5000);

      return () => {
        clearInterval(intervalId);
        if (chartRef.current) {
          chartRef.current.remove();
        }
        seriesRef.current = null;
        chartRef.current = null;
      };
    }
  }, [tokenAddress, chartData]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};

export default TradingViewChart;
